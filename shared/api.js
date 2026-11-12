/**
 * The data layer. This is the only file that knows where data comes from.
 *
 * Every function on `api` is async and takes and returns plain JSON, so each one maps onto one request.
 * Today they run against an in-memory mock database (mock-data.js). To connect a real service, replace
 * the function bodies with requests and keep the names, arguments and return shapes.
 *
 * What the rest of the app relies on:
 *  - Results are copies. Nothing the app holds changes until it asks again.
 *  - A failure is a thrown Error whose message can be shown to the user as it is.
 *  - Anything a server would decide is decided here: ids, timestamps, stock, order status, who is notified.
 *  - "Me" is whoever is signed in. In the mock that is the buyer account on index.html and the seller
 *    account on seller.html.
 */
const api = (() => {
  const HANDOFF_KEY = "campus-connect-mock-db";
  const asSeller = document.body.dataset.mode === "seller";
  const db = restoreHandoff() || createMockDb();

  /* ---------- Mock plumbing ---------- */

  let sequence = 0;
  const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${sequence++}`;
  const now = () => new Date().toISOString();
  const fail = (message) => { throw new Error(message); };
  const find = (list, id, what) => list.find((item) => item.id === id) || fail(`That ${what} is no longer here.`);
  const pick = (source, keys) => Object.fromEntries(keys.filter((key) => key in source).map((key) => [key, source[key]]));
  const requireAll = (fields, keys, message) => keys.every((key) => String(fields[key] ?? "").trim()) || fail(message);

  const me = () => (asSeller ? db.seller : db.buyer);
  const mySellerProfile = () => find(db.sellers, me().id, "profile");
  const myName = () => (asSeller ? mySellerProfile().name : db.buyer.account.displayName);
  const listingOf = (order) => db.listings.find((listing) => listing.id === order.listingId);
  const myListing = (id) => {
    const listing = find(db.listings, id, "listing");
    return listing.sellerId === me().id ? listing : fail("Only the seller can change that listing.");
  };
  const statsFor = (listingId) => (db.seller.listingStats[listingId] ||= { views: 0, saves: 0, messages: 0, orders: 0 });

  function restoreHandoff() {
    const saved = sessionStorage.getItem(HANDOFF_KEY);
    sessionStorage.removeItem(HANDOFF_KEY);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  const listeners = new Set();
  const emit = (event) => listeners.forEach((listener) => listener(event));

  /** Adds a notification, unless that person turned the category off in their settings. */
  function notify(account, settingKey, notification) {
    const settings = account.settings || account.account;
    if (settings[settingKey]) account.notifications.unshift({ id: newId("note"), unread: true, at: now(), ...notification });
  }

  function startConversation(account, conversation) {
    account.conversations.unshift({ unread: false, messages: [], ...conversation });
    return account.conversations[0];
  }

  /** The demo buyer and the demo seller share one thread. A message sent on one page shows up on the other. */
  function mirrorOf(conversation) {
    return asSeller
      ? db.buyer.conversations.find((entry) => entry.id === conversation.buyerThreadId)
      : db.seller.conversations.find((entry) => entry.buyerThreadId === conversation.id);
  }

  /** Keeps the seller's name on their profile and on every listing card that shows it. */
  function renameSeller(sellerId, name) {
    const seller = find(db.sellers, sellerId, "profile");
    Object.assign(seller, { name, initials: initialsOf(name) });
    db.listings.filter((listing) => listing.sellerId === sellerId).forEach((listing) => Object.assign(listing, { seller: name, initials: seller.initials }));
  }

  /* ---------- Availability ---------- */

  const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const BOOKING_WINDOW_DAYS = 60;
  const SLOT_STEP_MINUTES = 30;
  const OPEN_STATUSES = ["requested", "confirmed"];

  /** The demo seller's services are booked from her weekly hours. Every other seller lists fixed openings. */
  const usesWeeklyHours = (listing) => listing.kind === "service" && listing.sellerId === db.seller.id;

  /** When the seller is already taken on a day: open bookings, plus calendar events once a calendar is connected. */
  function busyBlocks(date) {
    const bookings = db.seller.orders
      .filter((order) => order.kind === "service" && order.date === date && OPEN_STATUSES.includes(order.status))
      .map((order) => ({ start: clockMinutes(order.time), length: durationMinutes(listingOf(order)) }));
    const events = db.seller.calendar.connected
      ? db.seller.calendar.events.filter((event) => event.date === date).map((event) => ({ start: clockMinutes(event.time), length: 60 }))
      : [];
    return [...bookings, ...events];
  }

  function weeklySlots(listing) {
    const duration = durationMinutes(listing);
    const clock = new Date();
    const minutesNow = clock.getHours() * 60 + clock.getMinutes();
    const slots = [];
    for (let offset = 0; offset < BOOKING_WINDOW_DAYS; offset += 1) {
      const date = addDays(todayKey(), offset);
      const busy = busyBlocks(date);
      db.seller.schedule.days[WEEKDAYS[parseDateKey(date).getDay()]].forEach((range) => {
        for (let start = range.start; start + duration <= range.end; start += SLOT_STEP_MINUTES) {
          const past = offset === 0 && start <= minutesNow;
          const taken = busy.some((block) => start < block.start + block.length && start + duration > block.start);
          if (!past && !taken) slots.push({ date, time: clockLabel(start) });
        }
      });
    }
    return slots;
  }

  /** Seed listings describe openings as labels such as "Sat · 2:00 PM". Each becomes the next date that matches. */
  function dateForLabel(day) {
    const today = todayKey();
    if (day === "Today") return today;
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
    if (day === "Tomorrow" || weekday >= 0) {
      for (let offset = 1; offset <= 7; offset += 1) {
        const date = addDays(today, offset);
        if (day === "Tomorrow" || parseDateKey(date).getDay() === weekday) return date;
      }
    }
    const dated = new Date(`${day}, ${new Date().getFullYear()}`);
    if (Number.isNaN(dated.getTime())) return null;
    if (dateKey(dated) < today) dated.setFullYear(dated.getFullYear() + 1);
    return dateKey(dated);
  }

  function fixedSlots(listing) {
    return (listing.slots || [])
      .map((label) => {
        const [day, time = ""] = label.split(" · ");
        return { date: dateForLabel(day), time };
      })
      .filter((slot) => slot.date)
      .sort((a, b) => a.date.localeCompare(b.date) || (clockMinutes(a.time) ?? 0) - (clockMinutes(b.time) ?? 0));
  }

  /* ---------- Orders ---------- */

  function makeTicketCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return `CC${Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")}`;
  }

  /** An order the demo buyer placed with the demo seller shows up in her Seller Hub. */
  function deliverToSeller(order, listing) {
    const buyerName = db.buyer.account.displayName;
    const pickupNote = { product: "Pickup once you accept", ticket: [listing.availability, listing.meeting].filter(Boolean).join(" · ") }[order.kind];
    const sellerOrder = {
      id: newId("so"), listingId: listing.id, kind: order.kind, buyer: buyerName, initials: initialsOf(buyerName), accent: "lilac",
      status: order.status, date: order.date, time: order.time, qty: order.quantity, amount: order.total, when: pickupNote,
      placedAt: order.placedAt, updatedAt: order.placedAt, note: "", ticketCode: order.ticketCode, buyerOrderId: order.id,
      conversationId: db.seller.conversations.find((conversation) => conversation.buyerThreadId)?.id || null
    };
    order.sellerOrderId = sellerOrder.id;
    db.seller.orders.unshift(sellerOrder);
    const title = order.kind === "ticket" ? "Ticket sold" : order.kind === "product" ? "New order" : order.status === "confirmed" ? "New booking" : "New booking request";
    notify(db.seller, "notifyRequests", { category: "orders", title, body: `${buyerName} · ${listing.title}`, emoji: listing.emoji, accent: listing.accent, action: "order", orderId: sellerOrder.id });
  }

  /** Copies a change the seller made onto the buyer's side of the same order, and tells the buyer. */
  function syncBuyerOrder(sellerOrder, title) {
    const order = db.buyer.orders.find((entry) => entry.id === sellerOrder.buyerOrderId);
    if (!order) return;
    Object.assign(order, pick(sellerOrder, ["status", "date", "time", "cancelReason"]));
    const listing = listingOf(order);
    const when = order.date && OPEN_STATUSES.includes(order.status) ? ` · ${slotLabel(order)}` : "";
    notify(db.buyer, "notifyOrders", { title, body: `${listing?.title || "Your order"}${when}`, emoji: listing?.emoji || "✦", accent: listing?.accent || "lilac", action: "order", orderId: order.id });
  }

  function completeSellerOrder(order) {
    Object.assign(order, { status: "completed", updatedAt: now() });
    db.seller.payouts.available += order.amount;
    statsFor(order.listingId).orders += 1;
  }

  const NEXT_STATUSES = { requested: ["confirmed", "cancelled"], confirmed: ["ready", "completed", "cancelled"], ready: ["completed", "cancelled"] };

  /* ---------- Chores ---------- */

  const CHORE_APPROVAL_DELAY = 1600;

  function recordChorePayment(chore) {
    chore.status = "paid";
    const order = {
      id: newId("order"), kind: "chore", choreId: chore.id, title: chore.title, emoji: chore.emoji, accent: chore.accent, status: "paid",
      note: chore.meta, total: amountValue(chore.amount), payer: chore.poster, payee: chore.offerName, placedAt: now()
    };
    db.buyer.orders.unshift(order);
    return order;
  }

  /** Nobody is on the other end of a seed chore, so the poster "approves and pays" a moment after an offer. */
  function scheduleChoreApproval(chore) {
    window.setTimeout(() => {
      if (chore.status !== "requested") return;
      const order = recordChorePayment(chore);
      const thread = db.buyer.conversations.find((conversation) => conversation.id === `chore-${chore.id}`);
      thread?.messages.push({ from: "them", text: `Approved. I paid ${chore.amount} through Campus Connect.`, at: now() });
      emit({ type: "chore-paid", choreId: chore.id, orderId: order.id, poster: chore.poster });
    }, CHORE_APPROVAL_DELAY);
  }

  db.chores.filter((chore) => chore.offeredByMe && chore.status === "requested").forEach(scheduleChoreApproval);

  /** A post on the job, housing or chore board, built from the short form the poster fills in. */
  function boardPost(prefix, fields, { emoji, accent, kicker, facts }) {
    const [first, second, price] = facts.map(([, key]) => fields[key]);
    return {
      id: newId(prefix), title: fields.title, kicker, meta: `${first} · ${second}`, price, accent, emoji, summary: fields.summary,
      poster: myName(), initials: initialsOf(myName()), mine: true, facts: facts.map(([label, key]) => [label, fields[key]])
    };
  }

  /* ---------- Listings ---------- */

  const CERTIFICATION_BY_CATEGORY = { Learn: "tutor", Create: "creator", Beauty: "nail tech", Tech: "editor", Help: "campus helper", Events: "event photographer" };
  const LISTING_FIELDS = ["title", "category", "price", "unit", "description", "meeting", "emoji", "accent", "status", "quantityAvailable", "condition", "availability"];

  function cardBrand(digits) {
    if (/^3[47]/.test(digits)) return "Amex";
    return { 4: "Visa", 5: "Mastercard", 6: "Discover" }[digits[0]] || "Card";
  }

  /* ---------- Endpoints ---------- */

  const endpoints = {
    /* Session */

    getSession: () => ({ userId: me().id }),
    signOut: () => sessionStorage.removeItem(HANDOFF_KEY),

    /* Catalog */

    getCategories: () => db.categories,
    getSchoolServices: () => db.schoolServices,
    getAgents: () => db.agents,
    getSellers: () => db.sellers,
    getStores: () => db.stores,
    /** Services booked from weekly hours also carry `nextOpening` ({ date, time } or null). */
    getListings: () => db.listings.map((listing) => (usesWeeklyHours(listing) ? { ...listing, nextOpening: weeklySlots(listing)[0] || null } : listing)),
    /** Open times for a service. `duration` is set when times come from weekly hours, so the picker shows a full calendar. */
    getAvailability: (listingId) => {
      const listing = find(db.listings, listingId, "listing");
      return usesWeeklyHours(listing) ? { duration: durationMinutes(listing), slots: weeklySlots(listing) } : { duration: null, slots: fixedSlots(listing) };
    },

    createListing: (fields) => {
      requireAll(fields, ["title", "description"], "Add a title and a description.");
      if (!(Number(fields.price) > 0)) fail("Add a price.");
      const seller = mySellerProfile();
      const service = fields.kind === "service";
      const made = fields.merchandiseType === "new";
      const digital = fields.condition === "Digital download";
      const listing = {
        id: newId("listing"), kind: service ? "service" : "product", category: fields.category, title: fields.title, description: fields.description, price: Number(fields.price),
        seller: seller.name, initials: seller.initials, sellerId: seller.id, storeId: db.stores.find((store) => store.sellerId === seller.id)?.id,
        rating: "New", reviews: 0, completed: 0, campus: "SDSU", verified: true, status: fields.draft ? "draft" : "active",
        accent: service ? "lilac" : made ? "mint" : "butter", emoji: service ? "✨" : made ? "✦" : "📦",
        ...(service
          ? { unit: fields.duration || "hour", meeting: "Choose a campus meeting spot", certification: seller.certification || CERTIFICATION_BY_CATEGORY[fields.category] || "provider" }
          : {
              merchandiseType: made ? "new" : "resale", unit: "each", condition: fields.condition || (made ? "New" : "Good condition"),
              quantityAvailable: Math.max(1, Math.floor(Number(fields.quantity)) || 1),
              availability: digital ? "Instant digital delivery" : "Local pickup", meeting: digital ? "Digital delivery in the app" : "Choose a campus pickup spot"
            })
      };
      db.listings.push(listing);
      return listing;
    },

    /** `changes` may hold any editable listing field, plus `collection` (the name of the store collection it belongs in). */
    updateListing: (id, changes) => {
      const listing = myListing(id);
      const fields = pick(changes, LISTING_FIELDS);
      if ("title" in fields && !String(fields.title).trim()) fail("Give the listing a title.");
      if ("price" in fields && !(Number(fields.price) > 0)) fail("Add a price.");
      if ("price" in fields) fields.price = Number(fields.price);
      if ("quantityAvailable" in fields) fields.quantityAvailable = Math.max(0, Math.floor(Number(fields.quantityAvailable)) || 0);
      if ("status" in fields) delete listing.awayPaused;
      Object.assign(listing, fields);
      if (listing.kind === "product") {
        if (listing.quantityAvailable === 0 && listing.status === "active") listing.status = "soldout";
        else if (listing.quantityAvailable > 0 && listing.status === "soldout") listing.status = "active";
      }
      const store = db.stores.find((entry) => entry.id === listing.storeId);
      if (store && "collection" in changes) {
        store.collections.forEach((collection) => { collection.listingIds = collection.listingIds.filter((entry) => entry !== id); });
        store.collections.find((collection) => collection.name === changes.collection)?.listingIds.push(id);
      }
      return listing;
    },

    duplicateListing: (id) => {
      const { tag, awayPaused, ...original } = myListing(id);
      const copy = { ...structuredClone(original), id: newId("listing"), title: `${original.title} (copy)`, status: "draft", rating: "New", reviews: 0, completed: 0 };
      db.listings.push(copy);
      return copy;
    },

    deleteListing: (id) => {
      myListing(id);
      db.listings = db.listings.filter((listing) => listing.id !== id);
      db.stores.forEach((store) => store.collections.forEach((collection) => { collection.listingIds = collection.listingIds.filter((entry) => entry !== id); }));
    },

    /* Boards */

    getJobs: () => db.jobs,
    getHousing: () => db.housing,
    getChores: () => db.chores,
    getTicketPosts: () => db.ticketPosts,

    postJob: (fields) => {
      requireAll(fields, ["title", "where", "schedule", "pay", "summary"], "Fill in the title, where, schedule, pay, and description.");
      db.jobs.unshift(boardPost("job", fields, { emoji: "📌", accent: "coral", kicker: "Posted by you", facts: [["Schedule", "schedule"], ["Where", "where"], ["Pay", "pay"]] }));
      return db.jobs[0];
    },

    postHousing: (fields) => {
      requireAll(fields, ["title", "place", "dates", "rent", "summary"], "Fill in the place, neighborhood, dates, rent, and details.");
      db.housing.unshift(boardPost("home", fields, { emoji: "🏠", accent: "butter", kicker: "Posted by you", facts: [["Dates", "dates"], ["Place", "place"], ["Rent", "rent"]] }));
      return db.housing[0];
    },

    postChore: (fields) => {
      requireAll(fields, ["title", "when", "where", "pay", "summary"], "Fill in the chore, when, where, pay, and details.");
      const amount = fields.pay.match(/\$\d+(?:\.\d+)?/)?.[0] || fields.pay;
      db.chores.unshift({ ...boardPost("chore", fields, { emoji: "📌", accent: "coral", facts: [["When", "when"], ["Where", "where"], ["Pay", "pay"]] }), amount, status: "open" });
      return db.chores[0];
    },

    /** Tells the poster you can take their chore. They approve and pay later, which arrives through `subscribe`. */
    offerOnChore: (id) => {
      const chore = find(db.chores, id, "chore");
      if (chore.mine || chore.status !== "open") fail("That chore is not open any more.");
      Object.assign(chore, { status: "requested", offeredByMe: true, offerName: myName() });
      const threadId = `chore-${chore.id}`;
      const thread = db.buyer.conversations.find((conversation) => conversation.id === threadId)
        || startConversation(db.buyer, { id: threadId, name: chore.poster, initials: chore.initials, accent: chore.accent, context: chore.title });
      thread.messages.push({ from: "me", text: "I can take this chore.", at: now() });
      scheduleChoreApproval(chore);
      return chore;
    },

    approveChore: (id) => {
      const chore = find(db.chores, id, "chore");
      if (!chore.mine || !["requested", "approved"].includes(chore.status)) fail("There is no offer to approve on that chore.");
      chore.status = "approved";
      return chore;
    },

    /** Pays the student you approved. Returns the order that records the payment. */
    payForChore: (id) => {
      const chore = find(db.chores, id, "chore");
      if (!chore.mine || chore.status !== "approved") fail("Approve a student before you pay.");
      return recordChorePayment(chore);
    },

    postTicket: ({ kind, event, price }) => {
      const resell = kind === "resell";
      const amount = Number(String(price ?? "").replace(/[^0-9.]/g, ""));
      if (!event || (resell && !(amount > 0))) fail(resell ? "Add the event and a price." : "Add the event.");
      const post = { id: newId("tpost"), kind: resell ? "resell" : "request", event, name: myName(), initials: initialsOf(myName()), accent: "sky", mine: true, messages: [] };
      if (resell) post.price = String(Math.round(amount * 100) / 100);
      db.ticketPosts.push(post);
      return post;
    },

    sendTicketMessage: (postId, text) => {
      const post = find(db.ticketPosts, postId, "post");
      if (!text) fail("Write a message first.");
      post.messages.push({ from: "me", text, at: now() });
      return post;
    },

    /* Account */

    getAccount: () => db.buyer.account,

    updateAccount: (changes) => {
      const fields = pick(changes, ["displayName", "notifyMessages", "notifyOrders", "notifyHousing", "profileVisible", "showCampus"]);
      if ("displayName" in fields && !String(fields.displayName).trim()) fail("Add a display name.");
      Object.assign(db.buyer.account, fields);
      if ("displayName" in fields) renameSeller(db.buyer.id, fields.displayName);
      return db.buyer.account;
    },

    getPaymentMethods: () => db.buyer.paymentMethods,

    /** Takes the card form as typed. Only the brand, last four digits and expiry are kept. */
    addPaymentMethod: ({ name, number, exp }) => {
      const digits = String(number ?? "").replace(/\D/g, "");
      const expiry = String(exp ?? "").match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/);
      if (!name || digits.length < 13 || digits.length > 19 || !expiry) fail("Check the name, card number, and expiration.");
      const today = new Date();
      if (new Date(2000 + Number(expiry[2]), Number(expiry[1]), 1) <= today) fail("That card is expired.");
      const methods = db.buyer.paymentMethods;
      methods.push({ id: newId("card"), brand: cardBrand(digits), last4: digits.slice(-4), exp: `${expiry[1]}/${expiry[2]}`, name, isDefault: methods.length === 0 });
      return methods.at(-1);
    },

    removePaymentMethod: (id) => {
      const removed = find(db.buyer.paymentMethods, id, "card");
      db.buyer.paymentMethods = db.buyer.paymentMethods.filter((method) => method.id !== id);
      if (removed.isDefault && db.buyer.paymentMethods[0]) db.buyer.paymentMethods[0].isDefault = true;
    },

    setDefaultPaymentMethod: (id) => {
      find(db.buyer.paymentMethods, id, "card");
      db.buyer.paymentMethods.forEach((method) => { method.isDefault = method.id === id; });
    },

    /* Buying */

    getOrders: () => db.buyer.orders,

    /** Books a service (`date` and `time` from getAvailability), or buys a product or ticket (`quantity`). */
    placeOrder: ({ listingId, date, time, quantity }) => {
      const listing = find(db.listings, listingId, "listing");
      const { kind } = listing;
      const count = kind === "product" ? Math.max(1, Math.floor(Number(quantity)) || 1) : 1;
      if (listing.status && listing.status !== "active") fail("That listing is not available right now.");
      if (kind === "service" && !(date && time)) fail("Pick a time first.");
      if (kind !== "service" && listing.quantityAvailable < count) fail(listing.quantityAvailable ? `Only ${listing.quantityAvailable} left.` : kind === "ticket" ? "That ticket is sold out." : "That one just sold out.");

      /* Only the demo seller answers requests. Bookings with anyone else are confirmed straight away. */
      const toDemoSeller = listing.sellerId === db.seller.id;
      const confirmed = kind === "ticket" || (kind === "service" && (!toDemoSeller || db.seller.settings.instantBook));
      const order = { id: newId("order"), listingId, kind, status: confirmed ? "confirmed" : "requested", quantity: count, total: listing.price * count, placedAt: now() };
      if (kind === "service") Object.assign(order, { date, time });
      if (kind === "product") order.note = "Pickup details come after the seller accepts";
      if (kind === "ticket") Object.assign(order, { note: listing.availability, ticketCode: makeTicketCode(), ticketStatus: "valid" });
      if (kind !== "service") {
        listing.quantityAvailable -= count;
        if (kind === "product" && listing.quantityAvailable === 0) listing.status = "soldout";
      }
      db.buyer.orders.unshift(order);
      if (toDemoSeller) deliverToSeller(order, listing);
      return order;
    },

    /* Messages and notifications, for whoever is signed in */

    getConversations: () => me().conversations,

    /** Finds or starts the buyer's thread about a seller ({ sellerId, listingId }), an agent, a job or a housing post. */
    openConversation: ({ sellerId, listingId, agentId, jobId, housingId }) => {
      const threads = db.buyer.conversations;
      const greet = (text) => [{ from: "them", text, at: now() }];
      if (agentId) {
        const agent = find(db.agents, agentId, "agent");
        return threads.find((thread) => thread.id === `agent-${agentId}`)
          || startConversation(db.buyer, { id: `agent-${agentId}`, name: agent.name, initials: agent.initials, accent: agent.accent, context: agent.brokerage, messages: greet(`Hey — I can help with places around ${agent.focus}. What are you looking for?`) });
      }
      if (jobId || housingId) {
        const post = jobId ? find(db.jobs, jobId, "job") : find(db.housing, housingId, "place");
        const greeting = jobId ? `Hey — happy to answer questions about the ${post.title} role.` : `Hey — happy to answer questions about ${post.title}.`;
        return threads.find((thread) => thread.id === `board-${post.id}`)
          || startConversation(db.buyer, { id: `board-${post.id}`, name: post.poster, initials: post.initials, accent: post.accent, context: post.title, messages: greet(greeting) });
      }
      const seller = find(db.sellers, sellerId, "seller");
      const context = db.listings.find((listing) => listing.id === listingId)?.title || db.stores.find((store) => store.sellerId === sellerId)?.name || "Campus Connect";
      return threads.find((thread) => thread.sellerId === sellerId)
        || startConversation(db.buyer, { id: `seller-${sellerId}`, sellerId, name: seller.name, initials: seller.initials, accent: seller.accent, context });
    },

    sendMessage: (conversationId, text) => {
      const conversation = find(me().conversations, conversationId, "conversation");
      if (!text) fail("Write a message first.");
      const at = now();
      conversation.messages.push({ from: "me", text, at });
      const mirror = mirrorOf(conversation);
      if (mirror) {
        mirror.messages.push({ from: "them", text, at });
        mirror.unread = true;
      }
      return conversation;
    },

    markConversationRead: (id) => { find(me().conversations, id, "conversation").unread = false; },

    getNotifications: () => me().notifications,
    markNotificationRead: (id) => { find(me().notifications, id, "notification").unread = false; },
    markAllNotificationsRead: () => me().notifications.forEach((notification) => { notification.unread = false; }),

    /* Support */

    createSupportCase: ({ topic, message }) => {
      if (!message) fail("Tell us a little about what happened.");
      db.supportCases.push({ id: newId("case"), topic, message, from: me().id, at: now() });
    },

    submitReport: ({ reason, message }) => {
      if (!message) fail("Describe what happened.");
      db.reports.push({ id: newId("report"), reason, message, from: me().id, at: now() });
    },

    /* Selling: orders */

    /** Newest activity first. */
    getSellerOrders: () => [...db.seller.orders].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),

    /** Moves an order to "confirmed", "ready", "completed" or "cancelled". Cancelling takes a `reason`. */
    updateOrderStatus: (id, status, { reason } = {}) => {
      const order = find(db.seller.orders, id, "order");
      if (!NEXT_STATUSES[order.status]?.includes(status)) fail("That order can't move to that step.");
      const declined = order.status === "requested" && status === "cancelled";
      const listing = listingOf(order);
      if (status === "completed") completeSellerOrder(order);
      else Object.assign(order, { status, updatedAt: now() });
      if (status === "confirmed" && order.kind === "product") order.when = "Accepted · prep for pickup";
      if (status === "ready") order.when = `Pickup ready · ${listing?.meeting || "Campus"}`;
      if (status === "cancelled") {
        order.cancelReason = `${declined ? "Declined" : "Cancelled and refunded"}: ${reason || "No reason given"}.`;
        if (order.kind === "product" && listing) {
          listing.quantityAvailable += order.qty;
          if (listing.status === "soldout") listing.status = "active";
        }
      }
      const service = order.kind === "service";
      syncBuyerOrder(order, {
        confirmed: service ? "Booking confirmed" : "Order accepted",
        ready: "Ready for pickup",
        completed: service ? "Session completed" : "Order completed",
        cancelled: declined ? "Request declined" : "Order cancelled"
      }[status]);
      return order;
    },

    rescheduleOrder: (id, { date, time }) => {
      const order = find(db.seller.orders, id, "order");
      if (!(date && time)) fail("Pick a new time.");
      Object.assign(order, { date, time, updatedAt: now() });
      syncBuyerOrder(order, "Booking rescheduled");
      return order;
    },

    requestReview: (id) => {
      const order = find(db.seller.orders, id, "order");
      if (order.status !== "completed") fail("Ask for a review once the order is completed.");
      order.reviewRequested = true;
      syncBuyerOrder(order, "Leave a review");
      return order;
    },

    /** Checks a ticket code at the door. Returns { ok, title, message } and marks a valid ticket used. */
    scanTicket: (code) => {
      const value = String(code ?? "").trim().toUpperCase();
      const ticket = db.buyer.orders.find((order) => order.kind === "ticket" && order.ticketCode === value);
      if (!ticket) return { ok: false, title: "No ticket found", message: "That code is not a Campus Connect ticket." };
      const listing = listingOf(ticket);
      if (listing?.sellerId !== db.seller.id) return { ok: false, title: "Different event", message: `This ticket is for ${listing?.host || listing?.seller || "another event"}.` };
      if (ticket.ticketStatus === "used") return { ok: false, title: "Already used", message: `${listing.title} was scanned ${timeAgo(ticket.usedAt)}.` };
      Object.assign(ticket, { ticketStatus: "used", status: "completed", usedAt: now() });
      const sold = db.seller.orders.find((order) => order.ticketCode === value);
      if (sold) completeSellerOrder(sold);
      return { ok: true, title: "Marked used", message: `${listing.title} · ${value}` };
    },

    /* Selling: messages */

    setConversationDone: (id, done) => { find(db.seller.conversations, id, "conversation").done = Boolean(done); },

    /** Finds or starts the seller's thread with the buyer of an order. */
    openOrderConversation: (orderId) => {
      const order = find(db.seller.orders, orderId, "order");
      const conversation = db.seller.conversations.find((entry) => entry.id === order.conversationId)
        || startConversation(db.seller, { id: newId("sc"), name: order.buyer, initials: order.initials, accent: order.accent, orderId: order.id, context: listingOf(order)?.title || "Order" });
      order.conversationId = conversation.id;
      conversation.unread = false;
      return conversation;
    },

    /* Selling: performance */

    /** { [listingId]: { views, saves, messages, orders } } */
    getListingStats: () => db.seller.listingStats,
    /** { days: [{ views, orders, earnings }] oldest first and ending today, sources: [{ label, share }], ratings: { 5: n, … } } */
    getAnalytics: () => db.seller.analytics,
    getReviews: () => db.seller.reviews,

    replyToReview: (id, reply) => {
      const review = find(db.seller.reviews, id, "review");
      if (!reply) fail("Write a reply first.");
      review.reply = reply;
      return review;
    },

    /* Selling: settings, hours and calendar */

    getSellerSettings: () => db.seller.settings,

    /** Turning `awayMode` on pauses every active listing. Turning it off brings those same listings back. */
    updateSellerSettings: (changes) => {
      const settings = db.seller.settings;
      const wasAway = settings.awayMode;
      Object.assign(settings, pick(changes, Object.keys(settings)));
      if (settings.awayMode !== wasAway) {
        db.listings.filter((listing) => listing.sellerId === db.seller.id).forEach((listing) => {
          if (settings.awayMode && (listing.status || "active") === "active") Object.assign(listing, { status: "paused", awayPaused: true });
          else if (!settings.awayMode && listing.awayPaused) Object.assign(listing, { status: "active", awayPaused: undefined });
        });
      }
      return settings;
    },

    /** { timezone, days: { sun: [{ start, end }], … } } with times as minutes after midnight. */
    getSchedule: () => db.seller.schedule,

    updateSchedule: (days) => {
      WEEKDAYS.forEach((day) => {
        const ranges = (days[day] || []).map((range) => ({ start: Number(range.start), end: Number(range.end) }));
        if (ranges.some((range) => !(range.end > range.start))) fail("The end time has to be after the start.");
        db.seller.schedule.days[day] = ranges.sort((a, b) => a.start - b.start);
      });
      return db.seller.schedule;
    },

    /** { connected, email, events: [{ date, time, title }] }. Events are empty until a calendar is connected. */
    getCalendar: () => (db.seller.calendar.connected ? db.seller.calendar : { connected: false, email: "", events: [] }),
    connectCalendar: () => { db.seller.calendar.connected = true; },
    disconnectCalendar: () => { db.seller.calendar.connected = false; },

    updateSellerProfile: ({ name, handle, campus, bio, response }) => {
      if (!name || !handle) fail("Add a name and a handle.");
      Object.assign(mySellerProfile(), { handle: handle.replace(/^@?/, "@"), campus, bio, response });
      renameSeller(me().id, name);
      return mySellerProfile();
    },

    /** `changes`: name, handle, tagline, emoji, accent, announcement, about, policies, collections. */
    updateStore: (id, changes) => {
      const store = find(db.stores, id, "store");
      if (store.sellerId !== me().id) fail("Only the owner can change that store.");
      const fields = pick(changes, ["name", "handle", "tagline", "emoji", "accent", "announcement", "about", "policies", "collections"]);
      if ("name" in fields && !String(fields.name).trim()) fail("Give the store a name.");
      if (fields.handle) fields.handle = fields.handle.replace(/^@?/, "@");
      if (fields.collections) fields.collections = fields.collections.filter((collection) => collection.name.trim()).map((collection) => ({ name: collection.name.trim(), listingIds: collection.listingIds }));
      return Object.assign(store, fields);
    },

    /* Selling: payouts */

    /** { available, pending, method, schedule, history: [{ id, at, amount, status }] } */
    getPayouts: () => ({
      ...db.seller.payouts,
      pending: db.seller.orders.filter((order) => ["confirmed", "ready"].includes(order.status)).reduce((sum, order) => sum + order.amount, 0)
    }),

    withdraw: (amount) => {
      const payouts = db.seller.payouts;
      const value = Math.round(Number(amount) * 100) / 100;
      if (!(value > 0)) fail("Enter an amount to withdraw.");
      if (value > payouts.available) fail(`Only ${dollars(payouts.available)} is available.`);
      payouts.available = Math.round((payouts.available - value) * 100) / 100;
      payouts.history.unshift({ id: newId("po"), at: now(), amount: value, status: "Processing" });
      return payouts.history[0];
    },

    updatePayoutMethod: ({ type, last4 }) => {
      if (!/^\d{4}$/.test(String(last4 ?? ""))) fail("Enter the last four digits of the account.");
      db.seller.payouts.method = `${type === "Savings" ? "Savings" : "Checking"} ••${last4}`;
    }
  };

  /* Every endpoint is async and copies what goes in and what comes out, the way a request would. */
  const copy = (value) => (value === undefined ? undefined : structuredClone(value));
  const remote = Object.fromEntries(Object.entries(endpoints).map(([name, endpoint]) => [name, async (...args) => copy(endpoint(...copy(args)))]));

  return {
    ...remote,

    /**
     * Calls `listener(event)` when something changes without the user doing it. A real service would push these.
     * Events: { type: "chore-paid", choreId, orderId, poster }.
     */
    subscribe: (listener) => { listeners.add(listener); },

    /** Mock only. Carries the demo data to the other page, so switching between buying and selling keeps what you did. */
    keepDemoData: () => sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(db))
  };
})();
