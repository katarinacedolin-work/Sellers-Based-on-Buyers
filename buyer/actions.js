/** Buyer actions: what every button (ACTIONS) and form (FORMS) on the buyer pages does. */

/* ---------- Helpers ---------- */

/** Makes an action that copies values into `state` and redraws: `update((target) => ({ storeTab: target.dataset.tab }))`. */
const update = (changes) => (target) => {
  Object.assign(state, changes(target));
  render();
};

const STORE_PAGE_DEFAULTS = { storeTab: "shop", storeCollection: "All", storeQuery: "", storeKind: "all" };
const ACCOUNT_SETTING_LABELS = { notifyMessages: "Message notifications", notifyOrders: "Order notifications", notifyDeals: "Housing & subleases", profileVisible: "Profile visibility", showCampus: "Campus on your profile" };

/** Opens a listing page. A service also needs its open times, which are fetched first. */
async function openListing(id, detailReturn = null) {
  closeModal();
  const booking = getListing(id)?.kind === "service" ? await loadBooking(id) : null;
  setView("listing", { selectedListingId: id, detailReturn, booking, quantity: 1 });
}

function openStore(id, storeReturn = null) {
  closeModal();
  setView("store", { selectedStoreId: id, storeReturn, ...STORE_PAGE_DEFAULTS });
}

/** Opens the Chore Board, or one chore on it, remembering which page to go back to. */
function openChoreBoard(choreId = null) {
  const boardReturn = ["stores", "book", "you", "home"].includes(state.view) ? state.view : state.boardReturn || "book";
  setView("chore-board", { boardReturn, selectedChoreId: choreId, choreFormOpen: false });
}

/** Finds or starts a conversation (see api.openConversation) and shows it in the Inbox. */
async function openConversation(about) {
  const conversation = await api.openConversation(about);
  await load("conversations");
  setView("inbox", { selectedConversationId: conversation.id });
}

/* ---------- Actions ---------- */

Object.assign(ACTIONS, {
  /* Browsing */

  "choose-category": update((target) => ({ category: target.dataset.category })),
  "set-shop-type": update((target) => ({ shopType: target.dataset.shopType })),
  "clear-filters": update(() => ({ query: "", category: "All", shopType: "all", trust: "any" })),
  "open-sort": () => openSortModal(),
  "open-filters": () => openFiltersModal(),
  "set-sort": (target) => {
    closeModal();
    state.sort = target.dataset.sort;
    render();
  },
  "open-school-service": (target) => setView("school-service", { selectedSchoolServiceId: target.dataset.id, schoolServiceReturn: state.view === "school-service" ? state.schoolServiceReturn : state.view }),
  "back-from-school-service": () => setView(["search", "home"].includes(state.schoolServiceReturn) ? state.schoolServiceReturn : "book", { selectedSchoolServiceId: null }),
  "flip-deal": (target) => {
    const card = target.closest(".deal-flip-card");
    if (!card) return;
    const open = card.classList.toggle("is-flipped");
    target.setAttribute("aria-pressed", open);
  },
  "copy-deal-code": async (target) => {
    const code = target.dataset.code || "";
    try {
      await navigator.clipboard.writeText(code);
      showToast(`Copied ${code}.`);
    } catch {
      showToast(code);
    }
  },

  /* Listings, booking and checkout */

  "open-listing": (target) => openListing(target.dataset.id, state.view === "store" ? state.selectedStoreId : state.view === "chore-board" ? "chore-board" : state.view === "listing" ? state.detailReturn : null),
  "back-from-detail": () => {
    const listing = getListing(state.selectedListingId);
    if (state.detailReturn === "chore-board" || (listing && isChoreListing(listing))) return setView("chore-board", { detailReturn: null });
    if (getStore(state.detailReturn)) return setView("store", { selectedStoreId: state.detailReturn, detailReturn: null });
    return setView(listing?.kind === "ticket" ? "tickets" : listing?.kind === "product" ? "shop" : "book");
  },
  "select-booking-date": (target) => {
    pickBookingDate(state.booking, target.dataset.date);
    render();
  },
  "shift-booking-month": (target) => {
    shiftBookingMonth(state.booking, target.dataset.delta);
    render();
  },
  "select-booking-time": (target) => {
    state.booking.time = target.dataset.time;
    render();
  },
  "toggle-more-times": () => {
    state.booking.expanded = !state.booking.expanded;
    render();
  },
  "increase-quantity": update(() => ({ quantity: Math.max(1, Math.min(getListing(state.selectedListingId).quantityAvailable, state.quantity + 1)) })),
  "decrease-quantity": update(() => ({ quantity: Math.max(1, state.quantity - 1) })),
  "start-checkout": (target) => setView("checkout", { selectedListingId: target.dataset.id }),
  "back-from-checkout": () => setView("listing"),
  "confirm-order": async (target) => {
    const { date, time } = state.booking || {};
    const order = await api.placeOrder({ listingId: target.dataset.id, date, time, quantity: state.quantity });
    await load("orders", "listings");
    setView("order", { selectedOrderId: order.id });
  },
  "open-order": (target) => setView("order", { selectedOrderId: target.dataset.id }),

  /* Sellers and stores */

  "open-seller": (target) => setView("seller", { selectedSellerId: target.dataset.id }),
  "open-seller-reviews": (target) => openSellerReviewsModal(getSeller(target.dataset.id)),
  "open-store": (target) => openStore(target.dataset.id, state.view === "housing" ? "housing" : state.view === "store" ? state.storeReturn : null),
  "back-from-store": () => setView(state.storeReturn === "housing" ? "housing" : "stores", { storeReturn: null }),
  "set-store-tab": update((target) => ({ storeTab: target.dataset.tab })),
  "set-store-collection": update((target) => ({ storeCollection: target.dataset.collection })),
  "set-store-kind": update((target) => ({ storeKind: target.dataset.kind })),
  "clear-store-filters": update(() => ({ storeCollection: "All", storeQuery: "", storeKind: "all" })),
  "set-stores-filter": update((target) => ({ storesFilter: target.dataset.filter })),
  "clear-stores-filters": update(() => ({ storesFilter: "All", storesQuery: "" })),
  "search-stores": (target) => setView("stores", { storesFilter: "All", storesQuery: target.dataset.query }),
  "open-following": () => setView("stores", { storesFilter: "Following", storesQuery: "" }),
  "toggle-follow-store": async (target) => {
    const store = getStore(target.dataset.id);
    const following = !isFollowing(store.id);
    await api.setStoreFollowed(store.id, following);
    await refresh("followedStoreIds", "stores");
    showToast(following ? `Following ${store.name}. You will find it under Stores → Following.` : `Unfollowed ${store.name}.`);
  },

  /* Messages */

  "message-seller": (target) => openConversation({ sellerId: target.dataset.seller, listingId: target.dataset.listing }),
  "message-store": (target) => openConversation({ sellerId: getStore(target.dataset.id).sellerId }),
  "message-agent": (target) => openConversation({ agentId: target.dataset.id }),
  "message-board-item": (target) => openConversation(target.dataset.kind === "job" ? { jobId: target.dataset.id } : { housingId: target.dataset.id }),
  "select-conversation": update((target) => ({ selectedConversationId: target.dataset.id })),

  /* Lists */

  "toggle-save": (target) => openSaveToListModal(target.dataset.id),
  "open-create-list": () => openCreateListModal(),
  "open-add-to-list": () => openAddToListModal(),
  "select-list": update((target) => ({ selectedListId: target.dataset.id })),
  "toggle-listing-in-list": async (target) => {
    const { listId, id } = target.dataset;
    const list = getList(listId);
    const saved = list.listingIds.includes(id);
    await (saved ? api.removeFromList(listId, id) : api.addToList(listId, id));
    await refresh("lists");
    openSaveToListModal(id);
    showToast(`${saved ? "Removed from" : "Added to"} ${list.name}.`);
  },
  "add-listing-to-list": async (target) => {
    const { listId, id } = target.dataset;
    await api.addToList(listId, id);
    await refresh("lists");
    openAddToListModal();
    showToast(`Added ${getListing(id).title} to ${getList(listId).name}.`);
  },
  "remove-from-list": async (target) => {
    const { listId, id } = target.dataset;
    await api.removeFromList(listId, id);
    await refresh("lists");
    showToast(`Removed ${getListing(id).title} from ${getList(listId).name}.`);
  },
  "delete-list": async (target) => {
    const list = getList(target.dataset.id);
    await api.deleteList(list.id);
    state.selectedListId = null;
    await refresh("lists");
    showToast(`${list.name} deleted.`);
  },

  /* Job Board and Housing */

  "toggle-job-form": update(() => ({ jobFormOpen: !state.jobFormOpen })),
  "toggle-housing-form": update(() => ({ housingFormOpen: !state.housingFormOpen })),
  "open-job": (target) => setView("jobs", { selectedJobId: target.dataset.id, jobFormOpen: false }),
  "open-housing": (target) => setView("housing", { selectedHousingId: target.dataset.id, selectedAgentId: null, housingFormOpen: false }),
  "open-agent": (target) => setView("housing", { selectedAgentId: target.dataset.id, selectedHousingId: null, housingFormOpen: false }),
  "close-board-item": update(() => ({ selectedJobId: null, selectedHousingId: null, selectedAgentId: null })),

  /* Tickets */

  "open-ticket-post": update((target) => ({ ticketDmPostId: null, ticketPostKind: state.ticketPostKind === target.dataset.kind ? null : target.dataset.kind })),
  "close-ticket-post": update(() => ({ ticketPostKind: null })),
  "open-ticket-dm": update((target) => ({ ticketPostKind: null, ticketDmPostId: target.dataset.id })),
  "close-ticket-dm": update(() => ({ ticketDmPostId: null })),

  /* Chore Board */

  "open-chore-board": () => openChoreBoard(),
  "open-chore": (target) => openChoreBoard(target.dataset.id),
  "close-chore": update(() => ({ selectedChoreId: null })),
  "toggle-chore-form": update(() => ({ choreFormOpen: !state.choreFormOpen })),
  "offer-chore": async (target) => {
    const chore = await api.offerOnChore(target.dataset.id);
    await refresh("chores", "conversations");
    showToast(`Offer sent to ${firstName(chore.poster)}. They approve before anyone is paid.`);
  },
  "approve-chore": async (target) => {
    await api.approveChore(target.dataset.id);
    await load("chores");
    setView("chore-pay", { selectedChoreId: target.dataset.id });
  },
  "open-chore-pay": (target) => setView("chore-pay", { selectedChoreId: target.dataset.id }),
  "back-from-chore-pay": () => setView("chore-board"),
  "confirm-chore-pay": async (target) => {
    const order = await api.payForChore(target.dataset.id);
    await load("chores", "orders");
    setView("order", { selectedOrderId: order.id });
    showToast(`You paid ${firstName(order.payee)} through Campus Connect.`);
  },

  /* Settings */

  "set-settings-section": update((target) => ({ settingsSection: target.dataset.section })),
  "toggle-setting": async (target) => {
    const { key } = target.dataset;
    const account = await api.updateAccount({ [key]: !data.account[key] });
    await refresh("account");
    showToast(`${ACCOUNT_SETTING_LABELS[key]} ${account[key] ? "on" : "off"}.`);
  },
  "set-default-payment": async (target) => {
    await api.setDefaultPaymentMethod(target.dataset.id);
    await refresh("paymentMethods");
    showToast("Default card updated.");
  },
  "remove-payment": async (target) => {
    await api.removePaymentMethod(target.dataset.id);
    await refresh("paymentMethods");
    showToast("Card removed.");
  },

  /* Selling */

  "choose-sell-kind": update((target) => ({ sellKind: target.dataset.kind, sellMerchandiseType: target.dataset.kind === "product" ? state.sellMerchandiseType : null })),
  "choose-merchandise-type": update((target) => ({ sellMerchandiseType: target.dataset.merchandiseType })),
  "cancel-sell": update(() => ({ sellKind: null, sellMerchandiseType: null }))
});

/* ---------- Forms ---------- */

Object.assign(FORMS, {
  "global-search": ({ query }) => setView("search", { query, category: "All" }),
  filters: ({ category, trust }) => {
    closeModal();
    Object.assign(state, { category, trust });
    render();
  },

  "send-message": async ({ message }) => {
    await api.sendMessage(selectedConversation().id, message);
    await refresh("conversations");
  },
  "send-ticket-dm": async ({ message }) => {
    await api.sendTicketMessage(state.ticketDmPostId, message);
    await refresh("ticketPosts");
  },

  "post-job": async (fields) => {
    await api.postJob(fields);
    state.jobFormOpen = false;
    await refresh("jobs");
    showToast("Your job is on the board.");
  },
  "post-housing": async (fields) => {
    await api.postHousing(fields);
    state.housingFormOpen = false;
    await refresh("housing");
    showToast("Your place is on the board.");
  },
  "post-chore": async (fields) => {
    await api.postChore(fields);
    state.choreFormOpen = false;
    await refresh("chores");
    showToast("Your chore is on the board.");
  },
  "post-ticket": async (fields, form) => {
    await api.postTicket({ ...fields, kind: form.dataset.kind });
    state.ticketPostKind = null;
    await refresh("ticketPosts");
    showToast("Posted in the ticket chat.");
  },

  "create-list": async ({ name }) => {
    const list = await api.createList(name);
    await load("lists");
    closeModal();
    setView("lists", { selectedListId: list.id });
    showToast(`Created “${list.name}”.`);
  },

  "save-account": async ({ displayName }) => {
    await api.updateAccount({ displayName });
    await refresh("account", "sellers", "listings");
    showToast("Account saved for this demo session.");
  },
  "save-payment": async (fields) => {
    const method = await api.addPaymentMethod(fields);
    await refresh("paymentMethods");
    showToast(`${method.brand} ending in ${method.last4} saved for this session.`);
  },

  "publish-listing": async (fields) => {
    const listing = await api.createListing({ ...fields, kind: state.sellKind, merchandiseType: state.sellMerchandiseType });
    await load("listings");
    Object.assign(state, { sellKind: null, sellMerchandiseType: null });
    await openListing(listing.id);
    showToast("Your demo listing is live in this session.");
  }
});

/* ---------- Notifications ---------- */

Object.assign(NOTIFICATION_TARGETS, {
  order: (notification) => setView("order", { selectedOrderId: notification.orderId }),
  inbox: (notification) => setView("inbox", { selectedConversationId: notification.conversationId }),
  store: (notification) => openStore(notification.storeId),
  listing: (notification) => openListing(notification.listingId)
});

/* ---------- Buyer page only. The Seller Hub loads this file too, to preview listings and stores as a buyer. ---------- */

/** Links copied with Share look like index.html#/listing/<id>. */
const DEEP_LINKS = {
  listing: (id) => openListing(id),
  store: (id) => openStore(id),
  seller: (id) => setView("seller", { selectedSellerId: id }),
  job: (id) => setView("jobs", { selectedJobId: id }),
  housing: (id) => setView("housing", { selectedHousingId: id }),
  agent: (id) => setView("housing", { selectedAgentId: id }),
  chore: (id) => openChoreBoard(id),
  "school-service": (id) => setView("school-service", { selectedSchoolServiceId: id })
};

function openDeepLink() {
  const [, kind, id] = location.hash.match(/^#\/([\w-]+)\/([\w-]+)$/) || [];
  if (!DEEP_LINKS[kind]) return;
  history.replaceState(null, "", location.pathname);
  run(DEEP_LINKS[kind], id);
}

if (!IS_SELLER) {
  document.addEventListener("app:ready", openDeepLink);
  window.addEventListener("hashchange", openDeepLink);

  /* Whichever conversation is open in the Inbox counts as read. */
  document.addEventListener("app:render", () => run(async () => {
    const open = state.view === "inbox" && selectedConversation();
    if (!open?.unread) return;
    await api.markConversationRead(open.id);
    await refresh("conversations");
  }));

  /* The poster of a chore you offered to take approves and pays on their own time. */
  api.subscribe((event) => run(async () => {
    if (event.type !== "chore-paid") return;
    await load("chores", "orders", "conversations");
    showToast(`${firstName(event.poster)} approved you and paid through Campus Connect.`);
    if (state.view === "chore-board" && state.selectedChoreId === event.choreId) setView("order", { selectedOrderId: event.orderId });
    else render();
  }));

  /* Ctrl or ⌘ K jumps to search. */
  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
    event.preventDefault();
    if (!document.querySelector("#browse-search-input")) navigate("search");
    document.querySelector("#browse-search-input").focus();
  });
}
