/** Seller Hub — the seller side of the Campus Connect prototype, signed in as Maya Chen. */
const SELLER_ID = "maya-chen";
const SELLER_DAYS = ["Today", "Tomorrow", "Sat", "Sun", "Mon", "Tue", "Wed"];
const ACCENTS = ["coral", "lilac", "butter", "sky", "mint"];
const SERVICE_CATEGORIES = ["Learn", "Create", "Beauty", "Tech", "Lifestyle", "Help", "Events"];
const PRODUCT_CATEGORIES = ["Create", "Student-made", "Clothing", "Furniture", "Textbooks", "Tech", "Beauty", "Dorm", "Other"];
const LISTING_STATUS_LABELS = { active: "Active", paused: "Paused", draft: "Draft", soldout: "Sold out" };

/* ---------- Seed data ---------- */

(function seedSellerListings() {
  getListing("maya-mini").status = "paused";
  const sundress = getListing("maya-sundress");
  sundress.status = "soldout";
  sundress.quantityAvailable = 0;
  getListing("maya-prints").quantityAvailable = 3;
  const base = { seller: "Maya Chen", initials: "MC", sellerId: SELLER_ID, rating: "New", reviews: 0, completed: 0, campus: "SDSU", verified: true, response: "Usually replies in under an hour", status: "draft" };
  state.userListings.push(
    { ...base, id: "maya-senior-package", kind: "service", category: "Create", storeId: "maya-makes-photo", title: "Senior photo package", price: 150, unit: "90 min", accent: "mint", emoji: "🎓", availability: "Sat · 9:00 AM", description: "Three locations, two outfit changes and 40 edited photos. Built for grads who want the full story of their time at State.", meeting: "Hepner Hall, Aztec Green and one spot of your choice", slots: ["Sat · 9:00 AM", "Sun · 9:00 AM"] },
    { ...base, id: "maya-postcards", kind: "product", merchandiseType: "new", category: "Create", storeId: "maya-makes-photo", title: "Campus postcard set (6)", price: 9, unit: "set of 6", accent: "butter", emoji: "✉️", condition: "New", availability: "Pickup near Love Library", quantityAvailable: 15, description: "Six matte postcards of SDSU landmarks at golden hour. Send one home or pin them over your desk.", meeting: "Love Library steps" }
  );
})();

const listingStats = {
  "maya-portraits": { views: 1284, saves: 142, messages: 38, orders: 28 },
  "maya-events": { views: 612, saves: 71, messages: 19, orders: 9 },
  "maya-mini": { views: 455, saves: 60, messages: 11, orders: 8 },
  "maya-presets": { views: 903, saves: 88, messages: 6, orders: 22 },
  "maya-prints": { views: 377, saves: 41, messages: 4, orders: 11 },
  "maya-jeans": { views: 214, saves: 29, messages: 7, orders: 5 },
  "maya-sundress": { views: 188, saves: 34, messages: 5, orders: 5 },
  "maya-tote": { views: 97, saves: 9, messages: 2, orders: 4 }
};
const statsFor = (id) => listingStats[id] || (listingStats[id] = { views: 0, saves: 0, messages: 0, orders: 0 });

const sellerOrders = [
  { id: "so-1011", listingId: "maya-prints", kind: "product", buyer: "Tom Huang", initials: "TH", accent: "sky", status: "requested", qty: 1, amount: 15, when: "Pickup once you accept", placed: "12 min ago", note: "Could I get the Hepner Hall one? Happy to pick up any afternoon.", conversationId: null },
  { id: "so-1002", listingId: "maya-events", kind: "service", buyer: "Ava Robinson", initials: "AR", accent: "butter", status: "requested", day: 2, time: "6:00 PM", qty: 1, amount: 120, placed: "40 min ago", note: "Delta Gamma spring formal at the Prado. About 80 guests, mostly candids plus one big group photo.", conversationId: "sc-ava" },
  { id: "so-1003", listingId: "maya-mini", kind: "service", buyer: "Priya Shah", initials: "PS", accent: "coral", status: "requested", day: 1, time: "4:00 PM", qty: 1, amount: 40, placed: "2h ago", note: "Three of us in matching sweaters. Aztec Green if the light is good!", conversationId: "sc-priya" },
  { id: "so-1001", listingId: "maya-portraits", kind: "service", buyer: "Katarina Cedolin", initials: "KC", accent: "lilac", status: "confirmed", day: 0, time: "4:00 PM", qty: 1, amount: 65, placed: "Today · 1:58 PM", note: "Something natural around campus for graduation announcements.", conversationId: "sc-katarina" },
  { id: "so-1007", listingId: "maya-portraits", kind: "service", buyer: "Hannah Reyes", initials: "HR", accent: "mint", status: "confirmed", day: 3, time: "11:00 AM", qty: 1, amount: 65, placed: "Yesterday", note: "Cap and gown, plus one casual outfit.", conversationId: null },
  { id: "so-1013", listingId: "maya-events", kind: "service", buyer: "SDSU Film Club", initials: "FC", accent: "sky", status: "confirmed", day: 5, time: "7:00 PM", qty: 1, amount: 120, placed: "Mon", note: "Screening night at the Don Powell Theatre. Red-carpet style photos at the entrance.", conversationId: null },
  { id: "so-1005", listingId: "maya-prints", kind: "product", buyer: "Jess Lin", initials: "JL", accent: "mint", status: "confirmed", qty: 2, amount: 30, when: "Pickup tomorrow · Love Library steps", placed: "Yesterday", note: "One Hepner Hall and one Campanile, please.", conversationId: "sc-jess" },
  { id: "so-1006", listingId: "maya-jeans", kind: "product", buyer: "Omar Khan", initials: "OK", accent: "sky", status: "ready", qty: 1, amount: 26, when: "Pickup today by 5:00 PM · Art North", placed: "Tue", note: "", conversationId: "sc-omar" },
  { id: "so-1004", listingId: "maya-presets", kind: "product", buyer: "Marcus Tran", initials: "MT", accent: "butter", status: "completed", qty: 1, amount: 12, when: "Delivered in the app · Yesterday", placed: "Yesterday", note: "", conversationId: null },
  { id: "so-1008", listingId: "maya-sundress", kind: "product", buyer: "Jess Lin", initials: "JL", accent: "mint", status: "completed", qty: 1, amount: 22, when: "Picked up · Sep 19", placed: "Sep 17", note: "", conversationId: "sc-jess" },
  { id: "so-1009", listingId: "maya-events", kind: "service", buyer: "Alpha Phi", initials: "AΦ", accent: "coral", status: "completed", qty: 1, amount: 120, when: "Session held · Sep 18", placed: "Sep 9", note: "Sisterhood retreat group photos.", conversationId: null },
  { id: "so-1012", listingId: "maya-portraits", kind: "service", buyer: "Dev Arora", initials: "DA", accent: "sky", status: "completed", qty: 1, amount: 65, when: "Session held · Sep 17", placed: "Sep 12", note: "", conversationId: null },
  { id: "so-1010", listingId: "maya-tote", kind: "product", buyer: "Nina Park", initials: "NP", accent: "lilac", status: "cancelled", qty: 1, amount: 10, when: "Cancelled · Sep 16", placed: "Sep 15", note: "", cancelReason: "Buyer cancelled before pickup.", conversationId: null }
];

const sellerConversations = [
  { id: "sc-ava", name: "Ava Robinson", initials: "AR", accent: "butter", orderId: "so-1002", context: "Event coverage · Sat 6:00 PM", time: "38m", preview: "Do you also do one big group shot with the whole chapter?", unread: true },
  { id: "sc-omar", name: "Omar Khan", initials: "OK", accent: "sky", orderId: "so-1006", context: "Vintage straight-leg jeans · Ready for pickup", time: "1h", preview: "On my way to Art North now!", unread: true },
  { id: "sc-leah", name: "Leah Morgan", initials: "LM", accent: "mint", listingId: "maya-presets", context: "Question about Lightroom preset pack", time: "3h", preview: "Do the presets work on the free Lightroom mobile app?", unread: true },
  { id: "sc-katarina", buyerThreadId: "maya", name: "Katarina Cedolin", initials: "KC", accent: "lilac", orderId: "so-1001", context: "Grad portraits · Today 4:00 PM", time: "12m", preview: "You: 4:00 PM works perfectly!", unread: false },
  { id: "sc-priya", name: "Priya Shah", initials: "PS", accent: "coral", orderId: "so-1003", context: "Friends mini session · Tomorrow 4:00 PM", time: "2h", preview: "Sent the request! Hope tomorrow works.", unread: false },
  { id: "sc-jess", name: "Jess Lin", initials: "JL", accent: "mint", orderId: "so-1005", context: "Campus photo print (8×10) × 2", time: "Yesterday", preview: "You: Perfect, see you at the library steps.", unread: false }
];

const SELLER_QUICK_REPLIES = [
  "Thanks! I'll confirm in just a bit.",
  "Meet me at the Love Library steps.",
  "Your order is ready for pickup.",
  "Running five minutes late, see you soon!",
  "Bring two outfits if you want variety."
];

const sellerNotifications = [
  { id: "sn-order-tom", unread: true, category: "orders", title: "New order", body: "Tom Huang bought a Campus photo print (8×10).", time: "12m ago", emoji: "🌅", accent: "sky", action: "order", orderId: "so-1011" },
  { id: "sn-request-ava", unread: true, category: "orders", title: "New booking request", body: "Ava Robinson · Event & org photo coverage · Sat 6:00 PM", time: "40m ago", emoji: "🎉", accent: "butter", action: "order", orderId: "so-1002" },
  { id: "sn-msg-omar", unread: true, category: "messages", title: "Omar Khan sent a message", body: "“On my way to Art North now!”", time: "1h ago", emoji: "💬", accent: "sky", action: "inbox", conversationId: "sc-omar" },
  { id: "sn-low-stock", unread: false, category: "store", title: "Running low", body: "Campus photo print (8×10) has 3 left in stock.", time: "3h ago", emoji: "📦", accent: "coral", action: "listing", listingId: "maya-prints" },
  { id: "sn-review-marcus", unread: false, category: "reviews", title: "New 4★ review", body: "Marcus T. reviewed the Lightroom preset pack.", time: "Yesterday", emoji: "⭐", accent: "butter", action: "reviews" },
  { id: "sn-payout", unread: false, category: "payouts", title: "Payout sent", body: "$186.00 is on its way to checking ••4821.", time: "Mon", emoji: "💸", accent: "mint", action: "payouts" },
  { id: "sn-followers", unread: false, category: "store", title: "12 new followers", body: "Maya Makes Photo had its best week this semester.", time: "Sun", emoji: "📸", accent: "coral", action: "store", storeId: "maya-makes-photo" }
];

const sellerReviews = [
  ...storesForSeller(SELLER_ID).flatMap((store) => store.reviewsSample.map((review, index) => ({ ...review, id: `rv-${store.id}-${index}`, storeId: store.id, date: ["2 days ago", "1 week ago", "Yesterday"][index] || "2 weeks ago", reply: "" }))),
  { id: "rv-extra-hannah", author: "Hannah R.", rating: 5, text: "Maya found the best light on campus and kept me laughing the whole time.", listingId: "maya-portraits", storeId: "maya-makes-photo", date: "2 weeks ago", reply: "Thank you Hannah! You made it easy. Congrats, grad!" },
  { id: "rv-extra-leo", author: "Leo T.", rating: 3, text: "Photos were great, but delivery took eight days instead of five.", listingId: "maya-portraits", storeId: "maya-makes-photo", date: "3 weeks ago", reply: "" }
];
sellerReviews[0].reply = "Thank you Priya! It was such a fun session.";

const RATING_BREAKDOWN = { 5: 44, 4: 6, 3: 2, 2: 0, 1: 0 };

const sellerPayouts = {
  available: 248.5,
  method: "Checking ••4821",
  schedule: "Weekly, every Monday",
  history: [
    { id: "po-0921", date: "Mon, Sep 21", amount: 186, status: "Paid" },
    { id: "po-0914", date: "Mon, Sep 14", amount: 242, status: "Paid" },
    { id: "po-0907", date: "Mon, Sep 7", amount: 131.5, status: "Paid" },
    { id: "po-0831", date: "Mon, Aug 31", amount: 208, status: "Paid" }
  ]
};

const ANALYTICS_DAYS = 180;
const analyticsSeries = Array.from({ length: ANALYTICS_DAYS }, (_, index) => {
  const growth = 0.72 + (index / ANALYTICS_DAYS) * 0.55;
  const weekly = 1 + 0.3 * Math.sin((index / 7) * Math.PI * 2);
  const noise = 1 + 0.18 * Math.sin(index * 2.7) * Math.cos(index * 1.3);
  const views = Math.round(34 * growth * weekly * noise);
  const orders = Math.max(0, Math.round(views / 21 + 0.6 * Math.sin(index * 1.9)));
  const earnings = orders * (24 + ((index * 17) % 31));
  return { views, orders, earnings };
});
const STORE_SHARE = { all: 1, "maya-makes-photo": 0.84, "mayas-closet": 0.16 };
const TRAFFIC_SOURCES = [
  { label: "Home shelves", share: 38, color: "var(--cobalt)" },
  { label: "Search", share: 27, color: "var(--lilac)" },
  { label: "Store page", share: 21, color: "var(--coral)" },
  { label: "Shared links", share: 14, color: "var(--butter)" }
];

state.seller = {
  ordersTab: "requested",
  ordersLayout: "list",
  selectedOrderId: null,
  listingsTab: "all",
  listingsStore: "all",
  listingsKind: "all",
  listingsQuery: "",
  editListingId: null,
  editStoreId: null,
  draft: null,
  previewReturn: "seller-dashboard",
  analyticsRange: 30,
  analyticsStore: "all",
  inboxFilter: "all",
  selectedConversationId: "sc-ava",
  notificationsFilter: "all",
  profileSection: "public",
  reviewsFilter: "all",
  scanResult: null,
  messages: {
    "sc-ava": [
      { who: "them", text: "Hi Maya! I just sent a booking request for our spring formal.", time: "1:21 PM" },
      { who: "them", text: "Do you also do one big group shot with the whole chapter?", time: "1:22 PM" }
    ],
    "sc-omar": [
      { who: "me", text: "The jeans are ready! I'm at Art North until 5.", time: "12:10 PM" },
      { who: "them", text: "On my way to Art North now!", time: "12:48 PM" }
    ],
    "sc-leah": [{ who: "them", text: "Do the presets work on the free Lightroom mobile app?", time: "10:02 AM" }],
    "sc-priya": [
      { who: "them", text: "Hi! Is the friends mini session okay for three people?", time: "11:30 AM" },
      { who: "me", text: "Totally, up to four. Tomorrow at 4 has great light on Aztec Green.", time: "11:41 AM" },
      { who: "them", text: "Sent the request! Hope tomorrow works.", time: "11:52 AM" }
    ],
    "sc-jess": [
      { who: "them", text: "Can I grab the prints tomorrow after my 2 PM class?", time: "Yesterday" },
      { who: "me", text: "Perfect, see you at the library steps.", time: "Yesterday" }
    ]
  },
  settings: {
    notifyRequests: true,
    notifyMessages: true,
    notifyReviews: true,
    notifyPayouts: true,
    notifyDigest: false,
    awayMode: false,
    instantBook: false
  }
};

/* ---------- Helpers ---------- */

const fmt = (value) => Math.round(value).toLocaleString("en-US");
const plural = (count, one, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;
const myStores = () => storesForSeller(SELLER_ID);
const myListings = () => everyListing().filter((listing) => listing.sellerId === SELLER_ID);
const listingStatus = (listing) => listing?.status || "active";
const getSellerOrder = (id) => sellerOrders.find((order) => order.id === id);
const ordersByStatus = (status) => sellerOrders.filter((order) => order.status === status);
const ORDER_CLOCK = new Date(2026, 8, 25, 15, 0, 0);
const RECENCY_MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

function recencyMinutes(text) {
  if (!text) return null;
  const value = String(text).trim().toLowerCase();
  if (value === "now" || value.includes("just now")) return 0;
  const relative = value.match(/(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours)\b/);
  if (relative) return Number(relative[1]) * (relative[2].startsWith("h") ? 60 : 1);
  const month = value.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})\b/);
  const clock = value.match(/(\d{1,2}):(\d{2})\s*(am|pm)/);
  const weekday = value.match(/\b(sun|mon|tue|wed|thu|fri|sat)[a-z]*\b/);
  let at = null;
  if (month) at = new Date(ORDER_CLOCK.getFullYear(), RECENCY_MONTHS[month[1].slice(0, 3)], Number(month[2]), 12, 0, 0);
  else if (value.includes("yesterday")) at = new Date(ORDER_CLOCK.getFullYear(), ORDER_CLOCK.getMonth(), ORDER_CLOCK.getDate() - 1, 12, 0, 0);
  else if (value.includes("today") || clock) at = new Date(ORDER_CLOCK.getFullYear(), ORDER_CLOCK.getMonth(), ORDER_CLOCK.getDate());
  else if (weekday) {
    const names = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const delta = (ORDER_CLOCK.getDay() - names.indexOf(weekday[1].slice(0, 3)) + 7) % 7 || 7;
    at = new Date(ORDER_CLOCK.getFullYear(), ORDER_CLOCK.getMonth(), ORDER_CLOCK.getDate() - delta, 12, 0, 0);
  }
  if (!at) return null;
  if (clock) {
    let hours = Number(clock[1]) % 12;
    if (clock[3] === "pm") hours += 12;
    at.setHours(hours, Number(clock[2]), 0, 0);
  }
  return Math.max(0, Math.round((ORDER_CLOCK - at) / 60000));
}

function orderRecency(order) {
  const texts = [order.placed, order.activity];
  if (order.when && /delivered|picked up|session held|cancelled/i.test(order.when)) texts.push(order.when);
  sellerNotifications.forEach((notification) => {
    const aboutOrder = notification.action === "order" && notification.orderId === order.id;
    const aboutThread = notification.action === "inbox" && notification.conversationId && notification.conversationId === order.conversationId;
    if (aboutOrder || aboutThread) texts.push(notification.time);
  });
  const scores = texts.map(recencyMinutes).filter((score) => score != null);
  return scores.length ? Math.min(...scores) : Number.POSITIVE_INFINITY;
}

function ordersForTab(tab) {
  const orders = tab === "all" ? [...sellerOrders] : ordersByStatus(tab);
  if (tab !== "all") return orders;
  return orders
    .map((order, index) => ({ order, index, recency: orderRecency(order) }))
    .sort((a, b) => a.recency - b.recency || a.index - b.index)
    .map((entry) => entry.order);
}
const isOpenOrder = (order) => ["requested", "confirmed", "ready"].includes(order.status);
const getSellerConversation = (id) => sellerConversations.find((conversation) => conversation.id === id);
const pendingPayout = () => sellerOrders.filter((order) => ["confirmed", "ready"].includes(order.status)).reduce((sum, order) => sum + order.amount, 0);
const lowStockListings = () => myListings().filter((listing) => listing.kind === "product" && listingStatus(listing) === "active" && listing.quantityAvailable > 0 && listing.quantityAvailable <= 3);
const closeModal = () => { document.querySelector("#modal-root").innerHTML = ""; };

function initialsFor(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "?";
}

function orderListingTitle(order) {
  return getListing(order.listingId)?.title || "Removed listing";
}

function orderWhen(order) {
  if (order.kind === "service" && order.day != null && ["requested", "confirmed"].includes(order.status)) return `${SELLER_DAYS[order.day] || "Upcoming"} · ${order.time}`;
  return order.when || "";
}

function orderStatusLabel(order) {
  if (order.status === "requested") return order.kind === "service" ? "Booking request" : "New order";
  if (order.status === "confirmed") return order.kind === "service" ? "Upcoming" : "Accepted";
  if (order.status === "ready") return "Ready for pickup";
  if (order.status === "completed") return "Completed";
  return "Cancelled";
}

function statusPill(status, label) {
  return `<span class="status-pill s-${status}">${escapeHtml(label)}</span>`;
}

function buyerAvatar(person) {
  return `<span class="mini-avatar buyer-avatar ${person.accent || "lilac"}">${escapeHtml(person.initials)}</span>`;
}

function listingThumb(listing) {
  return `<span class="activity-thumb ${listing?.accent || "lilac"}">${listing?.emoji || "✦"}</span>`;
}

function deltaHtml(delta) {
  if (delta == null) return "";
  const up = delta >= 0;
  return `<span class="kpi-delta ${up ? "up" : "down"}">${icon(up ? "trend-up" : "trend-down", 14)} ${up ? "+" : ""}${delta}%</span>`;
}

function kpiCard({ label, value, delta = null, hint = "", iconName = "chart" }) {
  return `<div class="kpi-card"><div class="kpi-top"><span class="kpi-label">${label}</span><span class="trust-icon">${icon(iconName)}</span></div><div class="kpi-value">${value}</div><div class="kpi-foot">${deltaHtml(delta)}${hint ? `<span class="muted small">${hint}</span>` : delta != null ? `<span class="muted small">vs. previous period</span>` : ""}</div></div>`;
}

function tabBar(tabs, active, action, toned = false) {
  return `<div class="tab-bar${toned ? " tab-bar-toned" : ""}" role="tablist">${tabs.map((tab) => `<button type="button" role="tab" class="tab-bar-item ${toned ? `tab-tone-${tab.id}` : ""} ${tab.id === active ? "active" : ""}" aria-selected="${tab.id === active}" data-action="${action}" data-tab="${tab.id}">${escapeHtml(tab.label)}${tab.count != null ? `<span class="tab-count">${tab.count}</span>` : ""}</button>`).join("")}</div>`;
}

function sellerHeader({ eyebrow, title, sub = "", actions = "", back = null }) {
  const backButton = back ? `<button class="back-button seller-back" ${back.view ? `data-view="${back.view}"` : `data-action="${back.action}"`}>${icon("chevron-left")} ${back.label}</button>` : "";
  return `${backButton}<div class="page-top-row seller-page-header"><div>${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}<h1 class="seller-title">${title}</h1>${sub ? `<p class="muted seller-sub-copy">${sub}</p>` : ""}</div>${actions ? `<div class="button-row">${actions}</div>` : ""}</div>`;
}

function sellerSwitch(key, label) {
  const on = Boolean(state.seller.settings[key]);
  return `<button type="button" class="settings-switch ${on ? "on" : ""}" role="switch" aria-checked="${on}" aria-label="${escapeHtml(label)}" data-action="seller-toggle-setting" data-key="${key}"><span class="settings-switch-knob"></span></button>`;
}

function sellerSettingsRow(key, title, body) {
  return `<div class="settings-row"><div class="settings-row-copy"><strong>${title}</strong><p class="muted small">${body}</p></div>${sellerSwitch(key, title)}</div>`;
}

function parseSlot(slot) {
  const [dayLabel, time = ""] = String(slot).split(" · ");
  const day = SELLER_DAYS.indexOf(dayLabel);
  return { day: day === -1 ? 2 : day, time: time || dayLabel };
}

function formatTime(value) {
  const [hours, minutes] = String(value || "16:00").split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes || 0).padStart(2, "0")} ${suffix}`;
}

function dateOffsetLabel(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/* ---------- Analytics math ---------- */

function analyticsWindow(days, storeId = "all", offset = 0) {
  const share = STORE_SHARE[storeId] ?? 0.1;
  const end = ANALYTICS_DAYS - offset;
  return analyticsSeries.slice(Math.max(0, end - days), end).map((day) => ({ views: day.views * share, orders: day.orders * share, earnings: day.earnings * share }));
}

function sumWindow(days) {
  return days.reduce((sum, day) => ({ views: sum.views + day.views, orders: sum.orders + day.orders, earnings: sum.earnings + day.earnings }), { views: 0, orders: 0, earnings: 0 });
}

function pctChange(current, previous) {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

function chartBuckets(days, storeId, key) {
  const window = analyticsWindow(days, storeId);
  if (days <= 30) return { values: window.map((day) => day[key]), labels: window.map((_, index) => dateOffsetLabel(window.length - 1 - index)) };
  const values = [];
  const labels = [];
  for (let end = window.length; end > 0; end -= 7) {
    const chunk = window.slice(Math.max(0, end - 7), end);
    values.unshift(chunk.reduce((sum, day) => sum + day[key], 0));
    labels.unshift(`wk ${dateOffsetLabel(window.length - end + chunk.length - 1)}`);
  }
  return { values, labels };
}

function svgBarChart(values, labels, { height = 190, format = (value) => fmt(value), label = "Chart" } = {}) {
  const width = 640;
  const pad = { top: 14, right: 6, bottom: 26, left: 6 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(...values, 1);
  const step = innerW / values.length;
  const barW = Math.max(3, step * 0.62);
  const labelEvery = Math.ceil(values.length / 8);
  const grid = [0, 0.5, 1].map((fraction) => { const y = pad.top + innerH - fraction * innerH; return `<line x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}" class="chart-grid" />`; }).join("");
  const bars = values.map((value, index) => {
    const barH = Math.max(2, (value / max) * innerH);
    const x = pad.left + index * step + (step - barW) / 2;
    const y = pad.top + innerH - barH;
    const showLabel = (values.length - 1 - index) % labelEvery === 0;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="${Math.min(6, barW / 2).toFixed(1)}" class="chart-bar ${index === values.length - 1 ? "current" : ""}"><title>${escapeHtml(labels[index])}: ${escapeHtml(format(value))}</title></rect>${showLabel ? `<text x="${(x + barW / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="chart-label">${escapeHtml(labels[index])}</text>` : ""}`;
  }).join("");
  return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}">${grid}${bars}</svg>`;
}

function svgLineChart(values, labels, { height = 190, label = "Chart" } = {}) {
  const width = 640;
  const pad = { top: 16, right: 12, bottom: 26, left: 12 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(...values, 1) * 1.08;
  const step = values.length > 1 ? innerW / (values.length - 1) : innerW;
  const points = values.map((value, index) => [pad.left + index * step, pad.top + innerH - (value / max) * innerH]);
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `M${pad.left},${pad.top + innerH} L${line.replace(/ /g, " L")} L${pad.left + (values.length - 1) * step},${pad.top + innerH} Z`;
  const labelEvery = Math.ceil(values.length / 8);
  const axis = labels.map((text, index) => ((values.length - 1 - index) % labelEvery === 0 ? `<text x="${points[index][0].toFixed(1)}" y="${height - 8}" text-anchor="middle" class="chart-label">${escapeHtml(text)}</text>` : "")).join("");
  const grid = [0, 0.5, 1].map((fraction) => { const y = pad.top + innerH - fraction * innerH; return `<line x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}" class="chart-grid" />`; }).join("");
  const [lastX, lastY] = points[points.length - 1];
  return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}">${grid}<path d="${area}" class="chart-area" /><polyline points="${line}" class="chart-line" /><circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="5" class="chart-dot" />${axis}</svg>`;
}

/* ---------- Chrome, routing and cross-mode hooks ---------- */

const SELLER_NAV_PARENTS = {
  "seller-order": "seller-orders",
  "seller-listing-edit": "seller-listings",
  "seller-new": "seller-listings",
  "seller-store-edit": "seller-stores",
  "seller-reviews": "seller-profile",
  "seller-payouts": "seller-profile",
  listing: "seller-listings",
  checkout: "seller-listings",
  store: "seller-stores",
  seller: "seller-profile"
};

function sellerNavView(view) {
  return SELLER_NAV_PARENTS[view] || view;
}

function updateSellerChrome() {
  const requests = ordersByStatus("requested").length;
  document.querySelectorAll(".seller-orders-badge").forEach((badge) => {
    badge.textContent = requests > 9 ? "9+" : String(requests);
    badge.hidden = requests === 0;
  });
}

function sellerPreviewBanner() {
  return `<div class="seller-preview-banner"><span>${icon("eye")} You're previewing what buyers see. Buyer actions are disabled here.</span><button type="button" class="text-button" data-action="seller-exit-preview">${icon("chevron-left")} Back to Seller Hub</button></div>`;
}

function sellerReceiveBuyerMessage(buyerConversationId, text) {
  const conversation = sellerConversations.find((entry) => entry.buyerThreadId === buyerConversationId);
  if (!conversation) return;
  conversation.preview = text;
  conversation.time = "now";
  conversation.unread = true;
}

function sellerReceiveBuyerOrder(order, listing) {
  if (listing?.sellerId !== SELLER_ID) return;
  const slot = listing.kind === "service" ? parseSlot(order.date) : null;
  const ticket = listing.kind === "ticket";
  const id = `so-${Date.now()}`;
  sellerOrders.unshift({ id, listingId: listing.id, kind: listing.kind, buyer: "Katarina Cedolin", initials: "KC", accent: "lilac", status: ticket ? "confirmed" : "requested", day: slot?.day, time: slot?.time, qty: listing.kind === "product" ? state.quantity : 1, amount: listing.price * (listing.kind === "product" ? state.quantity : 1), when: ticket ? `${listing.availability} · ${listing.meeting}` : listing.kind === "product" ? "Pickup once you accept" : undefined, placed: "Just now", note: "", conversationId: "sc-katarina", ticketCode: order.ticketCode || "" });
  sellerNotifications.unshift({ id: `sn-${id}`, unread: true, category: "orders", title: ticket ? "Ticket sold" : listing.kind === "service" ? "New booking request" : "New order", body: `Katarina Cedolin · ${listing.title}`, time: "now", emoji: listing.emoji, accent: listing.accent, action: "order", orderId: id });
}

function conversationMessages(conversation) {
  if (conversation.buyerThreadId) return (state.messages[conversation.buyerThreadId] || []).map((message) => ({ ...message, who: message.who === "me" ? "them" : "me" }));
  return state.seller.messages[conversation.id] || [];
}

function sendSellerMessage(conversation, text) {
  if (conversation.buyerThreadId) {
    state.messages[conversation.buyerThreadId] = state.messages[conversation.buyerThreadId] || [];
    state.messages[conversation.buyerThreadId].push({ who: "them", text, time: "now" });
    const buyerConversation = conversations.find((entry) => entry.id === conversation.buyerThreadId);
    if (buyerConversation) Object.assign(buyerConversation, { preview: text, time: "now", unread: true });
  } else {
    state.seller.messages[conversation.id] = state.seller.messages[conversation.id] || [];
    state.seller.messages[conversation.id].push({ who: "me", text, time: "now" });
  }
  conversation.preview = `You: ${text}`;
  conversation.time = "now";
}

function openOrderConversation(order) {
  let conversation = getSellerConversation(order.conversationId);
  if (!conversation) {
    conversation = { id: `sc-${order.id}`, name: order.buyer, initials: order.initials, accent: order.accent, orderId: order.id, context: `${orderListingTitle(order)} · ${orderWhen(order)}`, time: "now", preview: "Start the conversation", unread: false };
    sellerConversations.unshift(conversation);
    state.seller.messages[conversation.id] = [];
    order.conversationId = conversation.id;
  }
  conversation.unread = false;
  state.seller.selectedConversationId = conversation.id;
  state.seller.inboxFilter = "all";
  setView("seller-inbox");
}

/* ---------- Dashboard ---------- */

function attentionItems() {
  const items = [];
  const unread = sellerConversations.filter((conversation) => conversation.unread).length;
  if (unread) items.push({ iconName: "chat", tone: "sky", title: `${plural(unread, "unread message")}`, sub: "Buyers usually hear back from you in under an hour.", attrs: `data-view="seller-inbox"`, cta: "Reply" });
  ordersByStatus("requested").forEach((order) => items.push({ iconName: "package", tone: "butter", title: `${order.buyer} ${order.kind === "service" ? "wants to book" : "ordered"} ${orderListingTitle(order)}`, sub: `${orderWhen(order)} · ${money(order.amount)}`, attrs: `data-action="seller-open-order" data-id="${order.id}"`, cta: "Review" }));
  lowStockListings().forEach((listing) => items.push({ iconName: "alert", tone: "coral", title: `${listing.title} is running low`, sub: `${listing.quantityAvailable} left in stock`, attrs: `data-action="seller-edit-listing" data-id="${listing.id}"`, cta: "Restock" }));
  const unreplied = sellerReviews.filter((review) => !review.reply).length;
  if (unreplied) items.push({ iconName: "star", tone: "lilac", title: `${plural(unreplied, "review")} without a reply`, sub: "A short thank-you builds trust with future buyers.", attrs: `data-view="seller-reviews"`, cta: "Reply" });
  const drafts = myListings().filter((listing) => listingStatus(listing) === "draft").length;
  if (drafts) items.push({ iconName: "edit", tone: "mint", title: `${plural(drafts, "draft listing")} to finish`, sub: "Publish them when you're ready for buyers.", attrs: `data-action="seller-set-listings-tab" data-tab="draft"`, cta: "Finish" });
  return items;
}

function attentionList() {
  const items = attentionItems();
  if (!items.length) return `<div class="empty-state seller-empty"><div class="empty-shape">✓</div><h3>You're all caught up.</h3><p class="muted">New requests, messages and reviews will show up here.</p></div>`;
  return `<div class="attention-list">${items.map((item) => `<button type="button" class="attention-row" ${item.attrs}><span class="attention-icon ${item.tone}">${icon(item.iconName)}</span><span class="attention-copy"><strong>${escapeHtml(item.title)}</strong><span class="muted small">${escapeHtml(item.sub)}</span></span><span class="attention-cta">${item.cta} ${icon("chevron-right", 14)}</span></button>`).join("")}</div>`;
}

function scheduleToday() {
  const rows = sellerOrders
    .filter((order) => (order.kind === "service" && order.day === 0 && ["requested", "confirmed"].includes(order.status)) || (order.kind === "product" && order.status === "ready"))
    .map((order) => {
      const listing = getListing(order.listingId);
      return `<button type="button" class="schedule-row" data-action="seller-open-order" data-id="${order.id}"><span class="schedule-time">${escapeHtml(order.kind === "service" ? order.time : "Pickup")}</span><span class="schedule-copy"><strong>${escapeHtml(orderListingTitle(order))}</strong><span class="muted small">${escapeHtml(order.buyer)} · ${escapeHtml(listing?.meeting || "Campus")}</span></span>${statusPill(order.status, orderStatusLabel(order))}</button>`;
    });
  return rows.length ? `<div class="schedule-list">${rows.join("")}</div>` : `<p class="muted small">Nothing on the calendar today. Enjoy the free time.</p>`;
}

function orderActivityRow(order) {
  const listing = getListing(order.listingId);
  return `<button class="activity-row" data-action="seller-open-order" data-id="${order.id}"><span class="activity-main">${listingThumb(listing)}<span><span class="activity-title">${escapeHtml(orderListingTitle(order))}</span><span class="activity-sub">${escapeHtml(order.buyer)} · ${escapeHtml(orderWhen(order))}</span></span></span><span class="activity-end"><strong>${money(order.amount)}</strong>${statusPill(order.status, orderStatusLabel(order))}</span></button>`;
}

function storePerformanceCard(store) {
  const active = everyListing().filter((listing) => listing.storeId === store.id && listingStatus(listing) === "active").length;
  return `<div class="store-perf"><div class="store-logo-small ${store.accent}" aria-hidden="true">${store.emoji}</div><div class="store-perf-copy"><strong>${escapeHtml(store.name)}</strong><span class="muted small">${fmt(store.followers)} followers · ${store.sales} sales · ${store.rating} ★</span><span class="muted small">${plural(active, "active listing")}</span></div><button type="button" class="icon-button" data-action="seller-edit-store" data-id="${store.id}" aria-label="Edit ${escapeHtml(store.name)}">${icon("edit")}</button></div>`;
}

function snapshotCard({ tone, label, value, hint }) {
  return `<div class="snapshot-card ${tone}"><span class="snapshot-label">${label}</span><div class="snapshot-value">${value}</div><span class="snapshot-hint">${hint}</span></div>`;
}

function dashboardAttention() {
  const items = attentionItems().slice(0, 3);
  if (!items.length) return `<div class="empty-state seller-empty"><div class="empty-shape">✓</div><h3>You're all caught up.</h3><p class="muted">New requests, messages and reviews will show up here.</p></div>`;
  return `<div class="attention-list">${items.map((item) => `<button type="button" class="attention-row dash-attention" ${item.attrs}><span class="attention-icon ${item.tone}">${icon(item.iconName)}</span><span class="attention-copy"><strong>${escapeHtml(item.title)}</strong></span>${icon("chevron-down", 16)}</button>`).join("")}</div>`;
}

function storefrontPreview(seller) {
  const listings = myListings().filter((listing) => listingStatus(listing) === "active").slice(0, 2);
  const rows = listings.map((listing) => `<button type="button" class="storefront-listing" data-action="seller-preview-listing" data-id="${listing.id}">${listingThumb(listing)}<span class="attention-copy"><strong>${escapeHtml(listing.title)}</strong><span class="muted small">${money(listing.price)} · ${listing.kind === "service" ? "Book" : "Shop"}</span></span></button>`).join("");
  return `<button type="button" class="storefront-seller" data-action="seller-preview-profile"><span class="seller-avatar dash-avatar">${escapeHtml(seller.initials)}</span><span class="attention-copy"><strong>${escapeHtml(seller.name)}</strong><span class="storefront-handle"><span class="muted small">${escapeHtml(seller.handle)}</span>${studentVerifiedPill()}</span><span class="storefront-bio">${escapeHtml(seller.bio)}</span></span><span class="storefront-rating">${seller.rating} ★</span></button>${rows}`;
}

function recentOrderRow(order) {
  const action = order.status === "requested"
    ? "Confirm time"
    : order.status === "ready"
      ? "Share pickup details"
      : order.status === "completed"
        ? "View review"
        : "Open order";
  const label = order.status === "requested" ? "Needs response" : order.status === "ready" ? "Pickup pending" : orderStatusLabel(order);
  return `<button type="button" class="recent-order" data-action="seller-open-order" data-id="${order.id}"><span class="recent-order-main">${buyerAvatar(order)}<span><strong>${escapeHtml(order.buyer)}</strong><span class="muted small">${escapeHtml(orderListingTitle(order))} · ${escapeHtml(orderWhen(order))}</span></span></span><span class="recent-order-end">${statusPill(order.status, label)}<strong>${money(order.amount)}</strong><span class="recent-order-action">${action}</span></span></button>`;
}

function sellerDashboardView() {
  const seller = getSeller(SELLER_ID);
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const month = sumWindow(analyticsWindow(30));
  const previous = sumWindow(analyticsWindow(30, "all", 30));
  const change = pctChange(month.earnings, previous.earnings);
  const active = myListings().filter((listing) => listingStatus(listing) === "active");
  const kinds = [...new Set(active.map((listing) => listing.kind === "service" ? "Book" : listing.kind === "ticket" ? "Tickets" : "Shop"))];
  return `${sellerHeader({ title: `${greeting}, ${escapeHtml(seller.name.split(" ")[0])}.`, sub: "Your storefront is live. Here is what needs your attention today.", actions: `<button class="primary-button" data-view="seller-scan">${icon("ticket")} Scan at the door</button>` })}
    <div class="snapshot-grid">
      ${snapshotCard({ tone: "coral", label: "This month", value: `$${fmt(month.earnings)}`, hint: `${change >= 0 ? "↑" : "↓"} ${Math.abs(change)}% from last month` })}
      ${snapshotCard({ tone: "lilac", label: "Active listings", value: String(active.length), hint: `${plural(kinds.length, "type", "types")}: ${escapeHtml(kinds.join(" + "))}` })}
      ${snapshotCard({ tone: "butter", label: "Completed", value: String(seller.completed), hint: "All-time transactions" })}
      ${snapshotCard({ tone: "mint", label: "Response time", value: "Under 1h", hint: `Usually replies in ${escapeHtml(seller.response)}` })}
    </div>
    <div class="seller-dash-grid">
      <section class="seller-card"><div class="seller-card-header seller-card-header-stack"><div><div class="eyebrow">Needs attention</div><h2>Keep momentum.</h2></div><button class="text-button" data-view="seller-orders">View orders ${icon("arrow")}</button></div>${dashboardAttention()}</section>
      <section class="seller-card"><div class="seller-card-header seller-card-header-stack"><div><div class="eyebrow">Your storefront</div><h2>What buyers see.</h2></div><button class="text-button" data-view="seller-profile">Edit profile ${icon("arrow")}</button></div><div class="storefront-preview">${storefrontPreview(seller)}</div></section>
    </div>
    <section class="seller-card recent-activity"><div class="seller-card-header"><div><div class="eyebrow">Recent activity</div><h2>Orders moving through your shop.</h2></div><button class="text-button" data-view="seller-analytics">See earnings ${icon("arrow")}</button></div><div class="recent-order-list">${sellerOrders.slice(0, 4).map(recentOrderRow).join("")}</div></section>
    <section class="sell-hero seller-premium"><div class="eyebrow">Premium</div><h2>Make your profile the one buyers open first.</h2><p>A premium subscription puts your photo, bio and best work ahead of other sellers, with a badge buyers can see before they message you.</p><button class="primary-button" data-action="seller-premium">Upgrade your profile ${icon("arrow")}</button></section>`;
}

/* ---------- Listings ---------- */

function listingOpenSlots(listing) {
  return (listing.slots || []).filter((slot) => slot !== "Choose a time");
}

function listingTone(listing) {
  const status = listingStatus(listing);
  if (status === "soldout") return "soldout";
  if (status === "draft") return "draft";
  if (status === "paused") return "paused";
  const qty = listing.quantityAvailable ?? 0;
  if (listing.kind === "product" && status === "active" && qty > 0 && qty <= 3) return "low";
  if (listing.kind === "service" && status === "active" && listingOpenSlots(listing).length === 0) return "low";
  return "live";
}

function listingNeedsAttention(listing) {
  const status = listingStatus(listing);
  if (status === "draft" || status === "soldout") return true;
  if (status !== "active") return false;
  if (listing.kind === "service") return listingOpenSlots(listing).length === 0;
  const qty = listing.quantityAvailable ?? 0;
  return qty > 0 && qty <= 3;
}

function listingNote(listing) {
  const status = listingStatus(listing);
  if (status === "draft") return "Not published. Buyers can't see it.";
  if (status === "paused") return "Paused. Hidden from your store.";
  if (status === "soldout") return "Sold out. Restock to sell it again.";
  if (listing.kind === "service" && listingOpenSlots(listing).length === 0) return "No open times, so buyers can't book.";
  const qty = listing.quantityAvailable ?? 0;
  if (listing.kind === "product" && status === "active" && qty > 0 && qty <= 3) return `Only ${qty} left.`;
  return "";
}

function listingAvailabilityFact(listing) {
  if (listing.kind === "service") {
    const slots = listingOpenSlots(listing);
    return { label: "Next opening", value: slots.length ? slots[0] : "None", hint: slots.length ? plural(slots.length, "open time") : "Add a time to take bookings" };
  }
  const qty = listing.quantityAvailable ?? 0;
  return { label: "In stock", value: String(qty), hint: qty === 0 ? "Nothing left to sell" : qty <= 3 ? "Running low" : "Ready to sell" };
}

function listingManageActions(listing) {
  const status = listingStatus(listing);
  const id = listing.id;
  const edit = `<button type="button" class="ghost-button compact" data-action="seller-edit-listing" data-id="${id}">${icon("edit")} Edit</button>`;
  const statusAction = status === "draft"
    ? `<button type="button" class="primary-button compact" data-action="seller-toggle-listing-status" data-id="${id}">${icon("check")} Publish</button>`
    : status === "paused"
      ? `<button type="button" class="primary-button compact" data-action="seller-toggle-listing-status" data-id="${id}">${icon("play")} Turn on</button>`
      : status === "soldout"
        ? `<button type="button" class="primary-button compact" data-action="seller-edit-listing" data-id="${id}">${icon("plus")} Restock</button>`
        : `<button type="button" class="ghost-button compact" data-action="seller-toggle-listing-status" data-id="${id}">${icon("pause")} Pause</button>`;
  const more = `<details class="listing-more"><summary>More</summary><div class="listing-more-menu"><button type="button" data-action="seller-preview-listing" data-id="${id}">${icon("eye")} View as buyer</button><button type="button" data-action="seller-duplicate-listing" data-id="${id}">${icon("copy")} Duplicate</button><button type="button" class="is-danger" data-action="seller-delete-listing" data-id="${id}">${icon("trash")} Delete</button></div></details>`;
  const buttons = status === "soldout" ? `${statusAction}${more}` : status === "active" ? `${edit}${statusAction}${more}` : `${statusAction}${edit}${more}`;
  return `<div class="listing-manage-actions">${buttons}</div>`;
}

function priceUnitDetail(listing) {
  const unit = (listing.unit || "").trim();
  if (!unit) return "";
  const time = /\b(\d+\s*)?(min|mins|minute|minutes|hr|hrs|hour|hours)\b/i.test(unit);
  const pack = /\b(set|pack|bundle)\s+of\s+\d+\b/i.test(unit);
  if (listing.kind === "service") return time ? `/ ${unit}` : "";
  return pack ? unit : "";
}

function listingManageCard(listing) {
  const store = getStore(listing.storeId);
  const status = listingStatus(listing);
  const stats = statsFor(listing.id);
  const fact = listingAvailabilityFact(listing);
  const note = listingNote(listing);
  const kindLabel = listing.kind === "service" ? "Service" : "Product";
  return `<article class="listing-manage tone-${listingTone(listing)}">
    <div class="listing-manage-identity">
      ${listingThumb(listing)}
      <div class="listing-manage-copy">
        <div class="listing-manage-title-row"><h3>${escapeHtml(listing.title)}</h3>${statusPill(status, LISTING_STATUS_LABELS[status])}${listingTone(listing) === "low" && listing.kind === "product" ? statusPill("low", "Running low") : ""}</div>
        <p class="listing-manage-meta">${escapeHtml(store?.name || "No store")} · ${kindLabel} · ${escapeHtml(listing.category)}</p>
        ${note ? `<p class="listing-manage-note">${escapeHtml(note)}</p>` : ""}
      </div>
    </div>
    <dl class="listing-manage-facts">
      <div><dt>Price</dt><dd>${money(listing.price)}${priceUnitDetail(listing) ? ` <span>${escapeHtml(priceUnitDetail(listing))}</span>` : ""}</dd></div>
      <div><dt>${escapeHtml(fact.label)}</dt><dd class="${fact.hint === "Running low" || fact.value === "None" || fact.value === "0" ? "is-warning" : ""}">${escapeHtml(fact.value)} <span>${escapeHtml(fact.hint)}</span></dd></div>
      <div><dt>Orders</dt><dd>${fmt(stats.orders)} <span>${fmt(stats.views)} views</span></dd></div>
    </dl>
    ${listingManageActions(listing)}
  </article>`;
}

function sellerListingsView() {
  const all = myListings();
  const ui = state.seller;
  const runningLow = (listing) => listingTone(listing) === "low" && listing.kind === "product";
  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "low", label: "Running low" },
    { id: "soldout", label: "Sold out" },
    { id: "draft", label: "Drafts" },
    { id: "paused", label: "Paused" }
  ].map((tab) => ({ ...tab, count: tab.id === "all" ? all.length : tab.id === "low" ? all.filter(runningLow).length : all.filter((listing) => listingStatus(listing) === tab.id).length }));
  const search = ui.listingsQuery.trim().toLowerCase();
  const matches = all.filter((listing) => (ui.listingsStore === "all" || listing.storeId === ui.listingsStore)
    && (ui.listingsKind === "all" || listing.kind === ui.listingsKind)
    && (!search || [listing.title, listing.category, listing.description, getStore(listing.storeId)?.name].join(" ").toLowerCase().includes(search)));
  const filtered = matches.filter((listing) => ui.listingsTab === "all" || (ui.listingsTab === "low" ? runningLow(listing) : listingStatus(listing) === ui.listingsTab));
  const storeOptions = [{ id: "all", name: "All stores" }, ...myStores()].map((store) => `<option value="${store.id}" ${ui.listingsStore === store.id ? "selected" : ""}>${escapeHtml(store.name)}</option>`).join("");
  const narrowed = ui.listingsStore !== "all" || ui.listingsKind !== "all" || search;
  const groups = ui.listingsTab === "all"
    ? [
        { title: "Needs a look", hint: "", items: filtered.filter(listingNeedsAttention) },
        { title: "Live", hint: "", items: filtered.filter((listing) => listingStatus(listing) === "active" && !listingNeedsAttention(listing)) },
        { title: "Paused", hint: "", items: filtered.filter((listing) => listingStatus(listing) === "paused") }
      ].filter((group) => group.items.length)
    : [{ title: "", hint: "", items: filtered }];
  const columnHead = (items) => {
    const labels = [...new Set(items.map((listing) => listingAvailabilityFact(listing).label))];
    const middle = labels.length === 1 ? labels[0] : "Availability";
    return `<div class="listing-column-head" aria-hidden="true"><span></span><span class="listing-column-labels"><span>Price</span><span>${escapeHtml(middle)}</span><span>Orders</span></span><span></span></div>`;
  };
  const list = filtered.length
    ? groups.map((group) => `<section class="listing-group">${group.title ? `<div class="listing-group-head"><h2>${group.title}</h2>${group.hint ? `<p>${group.hint}</p>` : ""}</div>` : ""}<div class="listing-manage-list">${columnHead(group.items)}${group.items.map(listingManageCard).join("")}</div></section>`).join("")
    : "";
  const empty = all.length
    ? `<div class="empty-state"><div class="empty-shape">⌁</div><h3>Nothing matches.</h3><p class="muted">Try another status, or clear the store, type, and search filters.</p><button class="ghost-button" data-action="seller-clear-listing-filters">Clear filters</button></div>`
    : `<div class="empty-state"><div class="empty-shape">＋</div><h3>No listings yet.</h3><p class="muted">Add a service or product. You can publish it now or keep it as a draft.</p><button class="primary-button" data-action="seller-new-listing">${icon("plus")} New listing</button></div>`;
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Listings", sub: "What you offer, and whether buyers can see it.", actions: `<button class="primary-button" data-action="seller-new-listing">${icon("plus")} New listing</button>` })}
    ${tabBar(tabs, ui.listingsTab, "seller-set-listings-tab", true)}
    <div class="listings-toolbar">
      <form class="global-search listings-search" data-form="seller-listings-search">${icon("search")}<input id="seller-listings-search-input" name="query" type="search" value="${escapeHtml(ui.listingsQuery)}" placeholder="Search by name or category" aria-label="Search your listings" autocomplete="off" /></form>
      <label class="listings-filter">Store<select id="listings-store-filter" aria-label="Filter by store">${storeOptions}</select></label>
      <div class="listings-filter listings-filter-type"><span>Type</span><div class="segmented" role="group" aria-label="Listing type"><button type="button" class="segment ${ui.listingsKind === "all" ? "active" : ""}" data-action="seller-set-listings-kind" data-kind="all">All</button><button type="button" class="segment ${ui.listingsKind === "service" ? "active" : ""}" data-action="seller-set-listings-kind" data-kind="service">Services</button><button type="button" class="segment ${ui.listingsKind === "product" ? "active" : ""}" data-action="seller-set-listings-kind" data-kind="product">Products</button></div></div>
    </div>
    <div class="section-header seller-result-row"><span class="result-count">${narrowed || ui.listingsTab !== "all" ? `${filtered.length} of ${all.length}` : plural(filtered.length, "listing")}</span>${narrowed || ui.listingsTab !== "all" ? `<button class="text-button" data-action="seller-clear-listing-filters">Show everything</button>` : ""}</div>
    ${list || empty}`;
}

function openListingEditor(id) {
  const listing = getListing(id);
  if (!listing) return;
  const store = getStore(listing.storeId);
  state.seller.editListingId = id;
  state.seller.draft = {
    title: listing.title,
    category: listing.category,
    price: String(listing.price),
    unit: listing.unit || "",
    description: listing.description || "",
    storeId: listing.storeId || myStores()[0]?.id,
    collection: store?.collections.find((collection) => collection.listingIds.includes(id))?.name || "",
    meeting: listing.meeting || "",
    availability: listing.availability || "",
    slots: (listing.slots || []).filter((slot) => slot !== "Choose a time"),
    quantityAvailable: String(listing.quantityAvailable ?? 1),
    condition: listing.condition || "New",
    status: listingStatus(listing) === "soldout" ? "active" : listingStatus(listing),
    emoji: listing.emoji,
    accent: listing.accent
  };
  setView("seller-listing-edit");
}

function draftListing() {
  const listing = getListing(state.seller.editListingId);
  const draft = state.seller.draft;
  if (!listing || !draft) return listing;
  return { ...listing, title: draft.title || "Untitled listing", category: draft.category, price: Number(draft.price) || 0, unit: draft.unit, description: draft.description, storeId: draft.storeId, emoji: draft.emoji || listing.emoji, accent: draft.accent, condition: draft.condition, availability: listing.kind === "service" ? draft.slots[0] || "Set availability" : draft.availability };
}

function selectOptions(options, selected) {
  const list = options.includes(selected) || !selected ? options : [selected, ...options];
  return list.map((option) => `<option ${option === selected ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
}

function sellerListingEditView() {
  const listing = getListing(state.seller.editListingId);
  const draft = state.seller.draft;
  if (!listing || !draft) return sellerListingsView();
  const service = listing.kind === "service";
  const stats = statsFor(listing.id);
  const store = getStore(draft.storeId);
  const collectionOptions = `<option value="">No collection</option>${(store?.collections || []).map((collection) => `<option ${collection.name === draft.collection ? "selected" : ""}>${escapeHtml(collection.name)}</option>`).join("")}`;
  const statusChoice = ["active", "paused", "draft"].map((status) => `<button type="button" class="segment ${draft.status === status ? "active" : ""}" data-action="seller-set-draft-status" data-status="${status}">${LISTING_STATUS_LABELS[status]}</button>`).join("");
  const swatches = ACCENTS.map((accent) => `<button type="button" class="swatch ${accent} ${draft.accent === accent ? "active" : ""}" data-action="seller-set-draft-accent" data-accent="${accent}" aria-label="${accent} cover"></button>`).join("");
  const slotEditor = `<div class="field full"><label>Availability</label><div class="slot-editor">${draft.slots.length ? draft.slots.map((slot, index) => `<span class="slot-chip">${icon("clock", 14)} ${escapeHtml(slot)}<button type="button" data-action="seller-remove-slot" data-index="${index}" aria-label="Remove ${escapeHtml(slot)}">${icon("close", 14)}</button></span>`).join("") : `<span class="muted small">No open slots. Buyers can't book until you add one.</span>`}</div>
    <div class="slot-add"><select id="seller-slot-day" aria-label="Day">${SELLER_DAYS.map((day) => `<option>${day}</option>`).join("")}</select><input id="seller-slot-time" type="time" value="16:00" aria-label="Time" /><button type="button" class="ghost-button" data-action="seller-add-slot">${icon("plus")} Add slot</button></div></div>`;
  const productFields = `<div class="field"><label for="edit-qty">Quantity in stock</label><input id="edit-qty" type="number" min="0" data-draft="quantityAvailable" value="${escapeHtml(draft.quantityAvailable)}" /><span class="field-note">Set to 0 to mark it sold out.</span></div>
    <div class="field"><label for="edit-condition">Condition</label><select id="edit-condition" data-draft="condition">${selectOptions(listing.merchandiseType === "new" ? ["New", "Made to order", "Digital download"] : ["Like new", "Good condition", "Fair condition"], draft.condition)}</select></div>
    <div class="field full"><label for="edit-availability">Pickup or delivery line</label><input id="edit-availability" data-draft="availability" value="${escapeHtml(draft.availability)}" /></div>`;
  return `${sellerHeader({ eyebrow: `Edit ${service ? "service" : "product"}`, title: escapeHtml(listing.title), sub: `${escapeHtml(store?.name || "")} · last saved in this demo session`, back: { view: "seller-listings", label: "Back to listings" }, actions: `<button class="ghost-button" data-action="seller-preview-listing" data-id="${listing.id}">${icon("eye")} View as buyer</button>` })}
    <div class="editor-layout">
      <form class="form-card editor-form" data-form="seller-save-listing">
        <div class="editor-status"><span class="small muted">Visibility</span><div class="segmented">${statusChoice}</div></div>
        <div class="form-grid">
          <div class="field full"><label for="edit-title">Title</label><input id="edit-title" required maxlength="70" data-draft="title" value="${escapeHtml(draft.title)}" /></div>
          <div class="field"><label for="edit-category">Category</label><select id="edit-category" data-draft="category">${selectOptions(service ? SERVICE_CATEGORIES : PRODUCT_CATEGORIES, draft.category)}</select></div>
          <div class="field"><label for="edit-price">Price ($)</label><input id="edit-price" type="number" min="1" step="0.5" required data-draft="price" value="${escapeHtml(draft.price)}" /></div>
          <div class="field"><label for="edit-unit">${service ? "Duration or unit" : "Unit or size"}</label><input id="edit-unit" data-draft="unit" value="${escapeHtml(draft.unit)}" /></div>
          <div class="field"><label for="edit-emoji">Cover emoji</label><input id="edit-emoji" maxlength="4" data-draft="emoji" value="${escapeHtml(draft.emoji)}" /></div>
          <div class="field full"><label>Cover color</label><div class="swatch-row">${swatches}</div></div>
          <div class="field"><label for="edit-store">Store</label><select id="edit-store" data-draft="storeId" data-rerender>${myStores().map((entry) => `<option value="${entry.id}" ${entry.id === draft.storeId ? "selected" : ""}>${escapeHtml(entry.name)}</option>`).join("")}</select></div>
          <div class="field"><label for="edit-collection">Collection</label><select id="edit-collection" data-draft="collection">${collectionOptions}</select></div>
          <div class="field full"><label for="edit-description">Description</label><textarea id="edit-description" required data-draft="description">${escapeHtml(draft.description)}</textarea></div>
          <div class="field full"><label for="edit-meeting">${service ? "Where it happens" : "Handoff location"}</label><input id="edit-meeting" data-draft="meeting" value="${escapeHtml(draft.meeting)}" /></div>
          ${service ? slotEditor : productFields}
        </div>
        <div class="button-row" style="margin-top: 18px"><button class="primary-button" type="submit">Save changes ${icon("check")}</button><button class="ghost-button" type="button" data-view="seller-listings">Cancel</button><button class="danger-button" type="button" data-action="seller-delete-listing" data-id="${listing.id}">${icon("trash")} Delete</button></div>
      </form>
      <aside class="editor-side">
        <div class="eyebrow">Live preview</div>
        <div id="seller-listing-preview" class="editor-preview">${listingCard(draftListing())}</div>
        <div class="seller-card editor-stats"><h3>Performance</h3><div class="mini-stats"><span><strong>${fmt(stats.views)}</strong> views</span><span><strong>${fmt(stats.saves)}</strong> saves</span><span><strong>${fmt(stats.messages)}</strong> messages</span><span><strong>${fmt(stats.orders)}</strong> orders</span></div><p class="muted small" style="margin:10px 0 0">${stats.views ? `${((stats.orders / stats.views) * 100).toFixed(1)}% of viewers ordered.` : "Stats appear once buyers find this listing."}</p></div>
      </aside>
    </div>`;
}

function saveListingDraft() {
  const listing = getListing(state.seller.editListingId);
  const draft = state.seller.draft;
  if (!listing || !draft) return;
  Object.assign(listing, { title: draft.title.trim() || listing.title, category: draft.category, price: Number(draft.price) || listing.price, unit: draft.unit, description: draft.description, storeId: draft.storeId, meeting: draft.meeting, emoji: draft.emoji.trim() || listing.emoji, accent: draft.accent });
  let status = draft.status;
  if (listing.kind === "service") {
    listing.slots = draft.slots.length ? [...draft.slots] : ["Choose a time"];
    listing.availability = draft.slots[0] || "Set availability next";
  } else {
    listing.quantityAvailable = Math.max(0, Math.floor(Number(draft.quantityAvailable) || 0));
    listing.condition = draft.condition;
    listing.availability = draft.availability;
    if (listing.quantityAvailable === 0 && status === "active") status = "soldout";
  }
  listing.status = status;
  myStores().forEach((store) => store.collections.forEach((collection) => { collection.listingIds = collection.listingIds.filter((id) => id !== listing.id); }));
  const target = getStore(draft.storeId)?.collections.find((collection) => collection.name === draft.collection);
  if (target) target.listingIds.push(listing.id);
}

function refreshSellerPreview() {
  if (state.view === "seller-listing-edit") {
    const node = document.querySelector("#seller-listing-preview");
    if (node) node.innerHTML = listingCard(draftListing());
  }
  if (state.view === "seller-store-edit") {
    const node = document.querySelector("#seller-store-preview");
    if (node) node.innerHTML = storeCard(draftStore());
  }
}

function removeListingEverywhere(id) {
  [services, products, state.userListings].forEach((list) => { const index = list.findIndex((listing) => listing.id === id); if (index >= 0) list.splice(index, 1); });
  stores.forEach((store) => store.collections.forEach((collection) => { collection.listingIds = collection.listingIds.filter((entry) => entry !== id); }));
  state.lists.forEach((list) => { list.listingIds = list.listingIds.filter((entry) => entry !== id); });
}

function sellerNewListingView() {
  return `${sellerHeader({ eyebrow: "New listing", title: "Add to your stores", sub: "Publish now or save a draft. Drafts stay hidden from buyers.", back: { view: "seller-listings", label: "Back to listings" } })}${sellView()}`;
}

/* ---------- Orders ---------- */

const ORDER_TABS = [
  { id: "all", label: "All" },
  { id: "requested", label: "Requests" },
  { id: "confirmed", label: "Upcoming" },
  { id: "ready", label: "Ready for pickup" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" }
];

function orderRow(order) {
  const listing = getListing(order.listingId);
  return `<button type="button" class="seller-row seller-row-button tone-${order.status}" data-action="seller-open-order" data-id="${order.id}">
    <span class="cell cell-main"><span class="row-title">${listingThumb(listing)}<span><span class="activity-title">${escapeHtml(orderListingTitle(order))}</span><span class="activity-sub">${order.kind === "service" ? "Booking" : `Order × ${order.qty}`} · CC-${order.id.slice(-4).toUpperCase()}</span></span></span></span>
    <span class="cell" data-label="Buyer"><span class="buyer-cell">${buyerAvatar(order)} ${escapeHtml(order.buyer)}</span></span>
    <span class="cell" data-label="When"><strong>${escapeHtml(orderWhen(order))}</strong><span class="muted small">Placed ${escapeHtml(order.placed)}</span></span>
    <span class="cell" data-label="Amount"><strong>${money(order.amount)}</strong></span>
    <span class="cell" data-label="Status">${statusPill(order.status, orderStatusLabel(order))}</span>
    <span class="cell cell-chevron">${icon("chevron-right")}</span>
  </button>`;
}

function ordersWeekView() {
  const bookings = sellerOrders.filter((order) => order.kind === "service" && order.day != null && ["requested", "confirmed"].includes(order.status));
  return `<div class="week-grid">${SELLER_DAYS.map((day, index) => {
    const items = bookings.filter((order) => order.day === index);
    return `<div class="week-col ${index === 0 ? "today" : ""}"><div class="week-day">${day}</div>${items.length ? items.map((order) => `<button type="button" class="week-event s-${order.status}" data-action="seller-open-order" data-id="${order.id}"><strong>${escapeHtml(order.time)}</strong><span>${escapeHtml(orderListingTitle(order))}</span><span class="muted">${escapeHtml(order.buyer)}</span></button>`).join("") : `<span class="week-empty">Free</span>`}</div>`;
  }).join("")}</div><p class="muted small" style="margin-top:12px">Showing bookings for the next 7 days. Product pickups live under Ready for pickup.</p>`;
}

function sellerOrdersView() {
  const ui = state.seller;
  const tabs = ORDER_TABS.map((tab) => ({ ...tab, count: tab.id === "all" ? sellerOrders.length : ordersByStatus(tab.id).length }));
  const orders = ordersForTab(ui.ordersTab);
  const emptyCopy = { all: "No orders yet.", requested: "No new requests right now.", confirmed: "Nothing upcoming yet.", ready: "No pickups waiting.", completed: "Completed orders will collect here.", cancelled: "No cancellations. Nice." };
  const layoutToggle = `<div class="segmented"><button class="segment ${ui.ordersLayout === "list" ? "active" : ""}" data-action="seller-set-orders-layout" data-layout="list">List</button><button class="segment ${ui.ordersLayout === "week" ? "active" : ""}" data-action="seller-set-orders-layout" data-layout="week">Week</button></div>`;
  const body = ui.ordersLayout === "week"
    ? ordersWeekView()
    : `${tabBar(tabs, ui.ordersTab, "seller-set-orders-tab", true)}${orders.length ? `<div class="seller-table orders-table"><div class="seller-table-head"><span>Item</span><span>Buyer</span><span>When</span><span>Amount</span><span>Status</span><span></span></div>${orders.map(orderRow).join("")}</div>` : `<div class="empty-state"><div class="empty-shape">✓</div><h3>${emptyCopy[ui.ordersTab]}</h3><p class="muted">New activity shows up here and in your notifications.</p></div>`}`;
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Orders", sub: "Accept requests, prep pickups and keep every booking on schedule.", actions: layoutToggle })}${body}`;
}

function orderTimeline(order) {
  if (order.status === "cancelled") return `<div class="order-cancelled">${icon("close")} <div><strong>Cancelled</strong><span class="muted small">${escapeHtml(order.cancelReason || "This order was cancelled.")}</span></div></div>`;
  const steps = order.kind === "ticket" ? ["Sold", "Valid", "Used at the door"] : order.kind === "service" ? ["Requested", "Confirmed", "Completed"] : ["Ordered", "Accepted", "Ready for pickup", "Picked up"];
  const progress = order.kind === "ticket"
    ? { confirmed: 1, completed: 2 }[order.status]
    : order.kind === "service"
    ? { requested: 0, confirmed: 1, completed: 2 }[order.status]
    : { requested: 0, confirmed: 1, ready: 2, completed: 3 }[order.status];
  return `<ol class="order-timeline">${steps.map((step, index) => `<li class="${index < progress || order.status === "completed" ? "done" : index === progress ? "current" : ""}"><span class="timeline-dot">${index < progress || order.status === "completed" ? icon("check", 12) : ""}</span><span>${step}</span></li>`).join("")}</ol>`;
}

function orderActions(order) {
  const id = order.id;
  if (order.kind === "ticket" && order.status !== "completed") return `<button class="primary-button" data-view="seller-scan">${icon("ticket")} Scan at the door</button>`;
  if (order.kind === "ticket") return `<p class="muted small">Scanned. This ticket cannot be used again.</p>`;
  if (order.status === "requested") return `<button class="primary-button" data-action="seller-order-accept" data-id="${id}">${icon("check")} Accept ${order.kind === "service" ? "booking" : "order"}</button><button class="ghost-button" data-action="seller-order-decline" data-id="${id}">Decline</button>`;
  if (order.status === "confirmed" && order.kind === "service") return `<button class="primary-button" data-action="seller-order-complete" data-id="${id}">${icon("check")} Mark session completed</button><button class="ghost-button" data-action="seller-order-reschedule" data-id="${id}">${icon("calendar")} Reschedule</button><button class="danger-button" data-action="seller-order-cancel" data-id="${id}">Cancel & refund</button>`;
  if (order.status === "confirmed") return `<button class="primary-button" data-action="seller-order-ready" data-id="${id}">${icon("package")} Mark ready for pickup</button><button class="danger-button" data-action="seller-order-cancel" data-id="${id}">Cancel & refund</button>`;
  if (order.status === "ready") return `<button class="primary-button" data-action="seller-order-complete" data-id="${id}">${icon("check")} Mark picked up</button><button class="danger-button" data-action="seller-order-cancel" data-id="${id}">Cancel & refund</button>`;
  if (order.status === "completed") return `<button class="ghost-button" data-action="seller-order-thanks" data-id="${id}">${icon("star")} Ask for a review</button>`;
  return "";
}

function sellerOrderView() {
  const order = getSellerOrder(state.seller.selectedOrderId);
  if (!order) return sellerOrdersView();
  const listing = getListing(order.listingId);
  const unitPrice = order.amount / (order.qty || 1);
  const payoutLine = order.status === "completed" ? "Added to your balance" : order.status === "cancelled" ? "No payout · refunded" : "Released after completion";
  return `${sellerHeader({ eyebrow: `${order.kind === "service" ? "Booking" : "Order"} · CC-${order.id.slice(-4).toUpperCase()}`, title: escapeHtml(orderListingTitle(order)), sub: `${escapeHtml(order.buyer)} · placed ${escapeHtml(order.placed)}`, back: { action: "seller-back-to-orders", label: "Back to orders" }, actions: `<button class="ghost-button" data-action="seller-message-buyer" data-id="${order.id}">${icon("chat")} Message buyer</button>` })}
    <div class="order-layout">
      <section class="order-panel">
        <div class="order-main-top"><div class="summary-visual" style="border:0;padding:0">${listing ? `<div class="summary-thumb ${listing.accent}">${listing.emoji}</div>` : ""}<div><strong>${escapeHtml(orderListingTitle(order))}</strong><div class="small muted">${escapeHtml(getStore(listing?.storeId)?.name || "")}</div></div></div>${statusPill(order.status, orderStatusLabel(order))}</div>
        ${orderTimeline(order)}
        <div class="order-detail-card seller-order-details">
          <div class="order-detail-row"><span>${order.kind === "service" ? "When" : "Pickup"}</span><strong>${escapeHtml(orderWhen(order))}</strong></div>
          <div class="order-detail-row"><span>${order.kind === "service" ? "Where" : "Handoff spot"}</span><strong>${escapeHtml(listing?.meeting || "Campus")}</strong></div>
          <div class="order-detail-row"><span>${order.kind === "service" ? "Length" : "Quantity"}</span><strong>${order.kind === "service" ? escapeHtml(listing?.unit || "") : order.qty}</strong></div>
          <div class="order-detail-row"><span>Buyer</span><strong>${escapeHtml(order.buyer)} · Student verified</strong></div>
          ${order.ticketCode ? `<div class="order-detail-row"><span>Ticket code</span><strong>${escapeHtml(order.ticketCode)}</strong></div>` : ""}
        </div>
        ${order.note ? `<div class="buyer-note"><span class="small muted">Note from ${escapeHtml(order.buyer.split(" ")[0])}</span><p>“${escapeHtml(order.note)}”</p></div>` : ""}
        <div class="button-row order-actions">${orderActions(order)}</div>
      </section>
      <aside class="summary-card order-side">
        <div class="eyebrow">Earnings</div>
        <div class="summary-line"><span>${order.kind === "service" ? "Service" : `${money(unitPrice)} × ${order.qty}`}</span><strong>${money(order.amount)}</strong></div>
        <div class="summary-line"><span>Platform fee</span><strong>$0.00</strong></div>
        <div class="summary-line total"><span>Your payout</span><strong>${order.status === "cancelled" ? "$0.00" : money(order.amount)}</strong></div>
        <p class="checkout-disclaimer">${payoutLine}. Payments stay on Campus Connect, so never accept payment in chat.</p>
        <div class="seller-card buyer-card"><div class="seller-card-main">${buyerAvatar(order)}<div><div class="seller-name">${escapeHtml(order.buyer)}</div><div class="seller-sub">SDSU · Student verified</div></div></div><button class="text-button" data-action="seller-message-buyer" data-id="${order.id}">Message ${icon("arrow")}</button></div>
        <button class="ghost-button full-width" data-action="open-help" style="margin-top:12px">${icon("help")} Get help with this order</button>
      </aside>
    </div>`;
}

function setOrderStatus(order, status, message) {
  order.status = status;
  order.activity = "Just now";
  if (status === "completed") {
    sellerPayouts.available += order.amount;
    statsFor(order.listingId).orders += 1;
    order.when = order.kind === "service" ? "Session held · Today" : "Picked up · Today";
  }
  if (status === "ready") order.when = `Pickup ready · ${getListing(order.listingId)?.meeting || "Campus"}`;
  if (status === "confirmed" && order.kind === "product") order.when = "Accepted · prep for pickup";
  showToast(message);
  render();
}

/* ---------- Analytics ---------- */

function sellerAnalyticsView() {
  const { analyticsRange: range, analyticsStore: storeId } = state.seller;
  const current = sumWindow(analyticsWindow(range, storeId));
  const previous = sumWindow(analyticsWindow(range, storeId, range));
  const conversion = current.views ? (current.orders / current.views) * 100 : 0;
  const previousConversion = previous.views ? (previous.orders / previous.views) * 100 : 0;
  const earnings = chartBuckets(range, storeId, "earnings");
  const views = chartBuckets(range, storeId, "views");
  const saves = Math.round(current.views * 0.11);
  const messages = Math.round(current.views * 0.045);
  const funnel = [
    { label: "Listing views", value: current.views },
    { label: "Saves", value: saves },
    { label: "Messages", value: messages },
    { label: "Orders", value: current.orders }
  ];
  const listings = myListings().filter((listing) => storeId === "all" || listing.storeId === storeId).sort((a, b) => statsFor(b.id).orders - statsFor(a.id).orders).slice(0, 6);
  const storeChips = [{ id: "all", name: "All stores", emoji: "" }, ...myStores()].map((store) => `<button type="button" class="filter-button ${storeId === store.id ? "active" : ""}" data-action="seller-set-analytics-store" data-id="${store.id}">${store.emoji ? `${store.emoji} ` : ""}${escapeHtml(store.name)}</button>`).join("");
  const rangeToggle = `<div class="segmented">${[7, 30, 90].map((days) => `<button class="segment ${range === days ? "active" : ""}" data-action="seller-set-range" data-range="${days}">${days} days</button>`).join("")}</div>`;
  const ratingTotal = Object.values(RATING_BREAKDOWN).reduce((sum, count) => sum + count, 0);
  const storeTotals = myStores().map((store) => ({ store, totals: sumWindow(analyticsWindow(range, store.id)) }));
  const maxStoreEarnings = Math.max(...storeTotals.map((entry) => entry.totals.earnings), 1);
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Analytics", sub: `How buyers find and buy from you over the last ${range} days. Demo data.`, actions: rangeToggle })}
    <div class="seller-chip-row analytics-stores">${storeChips}</div>
    <div class="kpi-grid">
      ${kpiCard({ label: "Earnings", value: `$${fmt(current.earnings)}`, delta: pctChange(current.earnings, previous.earnings), iconName: "wallet" })}
      ${kpiCard({ label: "Orders", value: fmt(current.orders), delta: pctChange(current.orders, previous.orders), iconName: "package" })}
      ${kpiCard({ label: "Listing views", value: fmt(current.views), delta: pctChange(current.views, previous.views), iconName: "eye" })}
      ${kpiCard({ label: "Conversion", value: `${conversion.toFixed(1)}%`, delta: pctChange(conversion, previousConversion), iconName: "trend-up" })}
    </div>
    <div class="analytics-grid">
      <section class="seller-card chart-card"><div class="seller-card-header"><div><h2>Earnings</h2><p class="muted small">${range > 30 ? "Weekly totals" : "Daily totals"}</p></div><strong class="chart-total">$${fmt(current.earnings)}</strong></div>${svgBarChart(earnings.values, earnings.labels, { format: (value) => `$${fmt(value)}`, label: "Earnings over time" })}</section>
      <section class="seller-card chart-card"><div class="seller-card-header"><div><h2>Listing views</h2><p class="muted small">${range > 30 ? "Weekly totals" : "Daily totals"}</p></div><strong class="chart-total">${fmt(current.views)}</strong></div>${svgLineChart(views.values, views.labels, { label: "Listing views over time" })}</section>
      <section class="seller-card"><div class="seller-card-header"><div><h2>From view to order</h2><p class="muted small">Where buyers drop off</p></div></div><div class="funnel">${funnel.map((step, index) => `<div class="funnel-row"><div class="funnel-copy"><strong>${step.label}</strong><span class="muted small">${fmt(step.value)}${index ? ` · ${((step.value / Math.max(funnel[0].value, 1)) * 100).toFixed(1)}%` : ""}</span></div><div class="funnel-track"><span class="funnel-bar" style="width:${Math.max(3, (step.value / Math.max(funnel[0].value, 1)) * 100)}%"></span></div></div>`).join("")}</div></section>
      <section class="seller-card"><div class="seller-card-header"><div><h2>Where buyers come from</h2><p class="muted small">Share of listing views</p></div></div><div class="source-list">${TRAFFIC_SOURCES.map((source) => `<div class="source-row"><span class="source-label"><span class="source-dot" style="background:${source.color}"></span>${source.label}</span><span class="source-track"><span style="width:${source.share}%;background:${source.color}"></span></span><strong>${source.share}%</strong></div>`).join("")}</div></section>
    </div>
    <section class="sell-hero seller-premium"><div class="eyebrow">Premium</div><h2>Turn a good profile into a full storefront.</h2><p>Premium adds featured placement, extra profile sections and a clearer view of who is looking at your listings.</p><button class="primary-button" data-action="seller-premium">See what Premium includes ${icon("arrow")}</button></section>
    <section class="seller-card analytics-wide"><div class="seller-card-header"><div><h2>Top listings</h2><p class="muted small">All-time performance</p><button class="text-button" data-view="seller-listings">Manage listings ${icon("arrow")}</button></div></div>
      <div class="seller-table top-table"><div class="seller-table-head"><span>Listing</span><span>Views</span><span>Saves</span><span>Orders</span><span>Conversion</span></div>${listings.map((listing) => { const stats = statsFor(listing.id); return `<div class="seller-row"><div class="cell cell-main"><button type="button" class="row-title" data-action="seller-edit-listing" data-id="${listing.id}">${listingThumb(listing)}<span><span class="activity-title">${escapeHtml(listing.title)}</span><span class="activity-sub">${money(listing.price)} · ${LISTING_STATUS_LABELS[listingStatus(listing)]}</span></span></button></div><div class="cell" data-label="Views"><strong>${fmt(stats.views)}</strong></div><div class="cell" data-label="Saves"><strong>${fmt(stats.saves)}</strong></div><div class="cell" data-label="Orders"><strong>${fmt(stats.orders)}</strong></div><div class="cell" data-label="Conversion"><strong>${stats.views ? ((stats.orders / stats.views) * 100).toFixed(1) : "0.0"}%</strong></div></div>`; }).join("")}</div>
    </section>
    <div class="analytics-grid">
      <section class="seller-card"><div class="seller-card-header"><div><h2>Store comparison</h2><p class="muted small">Last ${range} days</p></div></div><div class="store-compare">${storeTotals.map(({ store, totals }) => `<div class="store-compare-row"><div class="store-logo-small ${store.accent}" aria-hidden="true">${store.emoji}</div><div class="store-compare-copy"><strong>${escapeHtml(store.name)}</strong><span class="muted small">${fmt(totals.orders)} orders · ${fmt(totals.views)} views · ${fmt(store.followers)} followers</span><span class="source-track"><span style="width:${(totals.earnings / maxStoreEarnings) * 100}%;background:var(--${store.accent})"></span></span></div><strong>$${fmt(totals.earnings)}</strong></div>`).join("")}</div></section>
      <section class="seller-card"><div class="seller-card-header"><div><h2>Ratings</h2><p class="muted small">${ratingTotal} reviews across your stores</p><button class="text-button" data-view="seller-reviews">Reviews ${icon("arrow")}</button></div></div><div class="rating-breakdown">${[5, 4, 3, 2, 1].map((stars) => `<div class="rating-row"><span>${stars} ★</span><span class="source-track"><span style="width:${(RATING_BREAKDOWN[stars] / ratingTotal) * 100}%;background:#e7a900"></span></span><span class="muted small">${RATING_BREAKDOWN[stars]}</span></div>`).join("")}</div></section>
    </div>`;
}

/* ---------- Messages ---------- */

function sellerInboxView() {
  const ui = state.seller;
  const list = sellerConversations.filter((conversation) => ui.inboxFilter === "all" || conversation.unread);
  const active = getSellerConversation(ui.selectedConversationId) || sellerConversations[0];
  const messages = conversationMessages(active);
  const contextOrder = getSellerOrder(active.orderId);
  const rows = list.length
    ? list.map((conversation) => `<button class="conversation-row ${conversation.id === active.id ? "active" : ""}" data-action="seller-select-conversation" data-id="${conversation.id}"><span class="mini-avatar buyer-avatar ${conversation.accent}">${conversation.initials}</span><span class="conversation-content"><span class="conversation-top"><span class="conversation-name">${escapeHtml(conversation.name)}</span><span class="conversation-time">${escapeHtml(conversation.time)}</span></span><span class="conversation-preview">${escapeHtml(conversation.preview)}</span>${conversation.done ? `<span class="conversation-done">${icon("check", 12)} Done</span>` : ""}</span>${conversation.unread ? `<span class="unread-dot" aria-label="Unread"></span>` : ""}</button>`).join("")
    : `<p class="muted small" style="padding: 18px">No unread messages. Nice work.</p>`;
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Messages", sub: "Every conversation stays linked to the order or listing it's about." })}
    <div class="inbox-layout seller-inbox">
      <aside class="conversation-list"><div class="conversation-header seller-conversation-header"><h2>Buyers</h2><div class="segmented"><button class="segment ${ui.inboxFilter === "all" ? "active" : ""}" data-action="seller-set-inbox-filter" data-filter="all">All</button><button class="segment ${ui.inboxFilter === "unread" ? "active" : ""}" data-action="seller-set-inbox-filter" data-filter="unread">Unread</button></div></div>${rows}</aside>
      <section class="chat-panel">
        <div class="chat-header"><div class="chat-person"><span class="mini-avatar buyer-avatar ${active.accent}">${active.initials}</span><div><strong>${escapeHtml(active.name)}</strong><button type="button" class="context-chip" data-action="seller-open-context" data-id="${active.id}">${icon(contextOrder ? "package" : "eye", 12)} ${escapeHtml(active.context)}${contextOrder ? ` · ${escapeHtml(orderStatusLabel(contextOrder))}` : ""}</button></div></div>
          <div class="button-row"><button class="ghost-button compact ${active.done ? "is-done" : ""}" data-action="seller-toggle-done" data-id="${active.id}">${icon("check")} ${active.done ? "Done" : "Mark as done"}</button><button class="icon-button" data-action="open-report" aria-label="Report conversation">${icon("shield")}</button></div></div>
        <div class="chat-messages"><div class="chat-date">Recent</div>${messages.map((message) => `<div class="message ${message.who}">${escapeHtml(message.text)}<div class="message-meta">${escapeHtml(message.time)}</div></div>`).join("")}</div>
        <div class="quick-reply-chips" aria-label="Saved replies">${SELLER_QUICK_REPLIES.map((reply) => `<button type="button" class="quick-reply" data-action="seller-quick-reply" data-text="${escapeHtml(reply)}">${escapeHtml(reply)}</button>`).join("")}</div>
        <form class="chat-composer" data-form="seller-send-message"><textarea name="message" placeholder="Reply to ${escapeHtml(active.name.split(" ")[0])}…" aria-label="Write a reply" rows="1"></textarea><button class="primary-button" type="submit" aria-label="Send message">${icon("arrow")}</button></form>
      </section>
    </div>`;
}

/* ---------- Notifications ---------- */

const NOTIFICATION_FILTERS = [
  { id: "all", label: "All" },
  { id: "orders", label: "Orders" },
  { id: "messages", label: "Messages" },
  { id: "reviews", label: "Reviews" },
  { id: "store", label: "Store" },
  { id: "payouts", label: "Payouts" }
];

function openSellerNotification(notification) {
  notification.unread = false;
  state.notificationsOpen = false;
  if (notification.action === "order") return openSellerOrder(notification.orderId);
  if (notification.action === "inbox") { const conversation = getSellerConversation(notification.conversationId); if (conversation) conversation.unread = false; state.seller.selectedConversationId = notification.conversationId; return setView("seller-inbox"); }
  if (notification.action === "listing") return openListingEditor(notification.listingId);
  if (notification.action === "reviews") return setView("seller-reviews");
  if (notification.action === "payouts") return setView("seller-payouts");
  if (notification.action === "store") return openStoreEditor(notification.storeId);
  return render();
}

function sellerNotificationsView() {
  const filter = state.seller.notificationsFilter;
  const list = sellerNotifications.filter((notification) => filter === "all" || notification.category === filter);
  const chips = NOTIFICATION_FILTERS.map((entry) => { const count = sellerNotifications.filter((notification) => entry.id === "all" || notification.category === entry.id).length; return `<button type="button" class="filter-button ${filter === entry.id ? "active" : ""}" data-action="seller-set-notifications-filter" data-filter="${entry.id}">${entry.label} · ${count}</button>`; }).join("");
  const unread = sellerNotifications.filter((notification) => notification.unread).length;
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Notifications", sub: unread ? `${unread} unread. Tap one to jump straight to it.` : "You're all caught up.", actions: `<button class="ghost-button" data-action="seller-open-notification-settings">${icon("settings")} Settings</button><button class="primary-button" data-action="mark-all-notifications-read">${icon("check")} Mark all read</button>` })}
    <div class="seller-chip-row" style="margin-bottom:16px">${chips}</div>
    ${list.length ? `<div class="seller-notification-list">${list.map((notification) => `<button type="button" class="seller-notification ${notification.unread ? "unread" : ""}" data-action="open-notification" data-id="${notification.id}"><span class="activity-thumb ${notification.accent}">${notification.emoji}</span><span class="seller-notification-copy"><span class="notification-popover-top"><strong>${escapeHtml(notification.title)}</strong><span class="muted small">${escapeHtml(notification.time)}</span></span><span class="muted small">${escapeHtml(notification.body)}</span></span>${notification.unread ? `<span class="unread-dot" aria-label="Unread"></span>` : ""}${icon("chevron-right")}</button>`).join("")}</div>`
      : `<div class="empty-state"><div class="empty-shape">🔔</div><h3>Nothing here yet.</h3><p class="muted">Try another filter.</p></div>`}`;
}

/* ---------- Profile ---------- */

function sellerProfileSections() {
  const unreplied = sellerReviews.filter((review) => !review.reply).length;
  return [
    { id: "public", label: "Public profile", hint: "What buyers see", icon: "user" },
    { id: "verification", label: "Verification", hint: "Badges and trust", icon: "shield" },
    { id: "availability", label: "Availability", hint: state.seller.settings.awayMode ? "Away mode is on" : "Away mode and booking", icon: "calendar" },
    { id: "notifications", label: "Notifications", hint: "Orders, messages, reviews", icon: "bell" },
    { id: "reviews", label: "Reviews", hint: unreplied ? `${unreplied} need a reply` : "All replied", icon: "star", view: "seller-reviews" },
    { id: "payouts", label: "Payouts", hint: `${money(sellerPayouts.available)} available`, icon: "wallet", view: "seller-payouts" },
    { id: "account", label: "Account", hint: "Switch or sign out", icon: "settings" }
  ];
}

function sellerProfilePublic(seller) {
  const responses = ["under an hour", "a few hours", "same day", "a day"];
  return `<form class="settings-form" data-form="seller-save-profile">
    <div class="seller-hero seller-hero-preview"><div class="seller-hero-main"><div class="seller-avatar">${escapeHtml(seller.initials)}</div><div>${studentVerifiedPill()}<h2>${escapeHtml(seller.name)}</h2><p class="muted" style="margin:0">${escapeHtml(seller.campus)} · ${escapeHtml(seller.handle)}</p><div class="seller-stats"><span><strong>${seller.rating}</strong> ★</span><span><strong>${seller.reviews}</strong> reviews</span><span><strong>${seller.completed}</strong> completed</span><span>Replies in <strong>${escapeHtml(seller.response)}</strong></span></div></div></div></div>
    <div class="form-grid">
      <div class="field"><label for="profile-name">Display name</label><input id="profile-name" name="name" required maxlength="48" value="${escapeHtml(seller.name)}" /></div>
      <div class="field"><label for="profile-handle">Handle</label><input id="profile-handle" name="handle" required maxlength="24" value="${escapeHtml(seller.handle)}" /></div>
      <div class="field full"><label for="profile-campus">Campus line</label><input id="profile-campus" name="campus" maxlength="60" value="${escapeHtml(seller.campus)}" /><span class="field-note">Year and major help buyers feel like they know you.</span></div>
      <div class="field full"><label for="profile-bio">Bio</label><textarea id="profile-bio" name="bio" maxlength="240">${escapeHtml(seller.bio)}</textarea></div>
      <div class="field"><label for="profile-response">Response-time goal</label><select id="profile-response" name="response">${responses.map((option) => `<option ${option === seller.response ? "selected" : ""}>${option}</option>`).join("")}</select></div>
    </div>
    <div class="button-row" style="margin-top: 16px"><button class="primary-button" type="submit">Save profile ${icon("check")}</button><button class="ghost-button" type="button" data-action="seller-preview-profile">${icon("eye")} View public profile</button></div>
  </form>`;
}

function sellerProfileVerification() {
  const rows = [
    { done: true, title: "Student verified", body: "Confirmed with an @sdsu.edu email. Shown on every listing." },
    { done: true, title: "Certified photographer", body: "Shown as a caption on your photography services." },
    { done: true, title: "Payout account", body: `${sellerPayouts.method} confirmed for payouts.` },
    { done: false, title: "Backup phone number", body: "Adds a recovery option and faster support." }
  ];
  return `<div class="settings-group"><h2>Verification</h2><p class="muted small">Badges show what was checked. They don't guarantee quality or university endorsement.</p>
    <div class="verify-list">${rows.map((row) => `<div class="settings-row"><div class="verify-row"><span class="trust-icon ${row.done ? "" : "pending"}">${icon(row.done ? "verified" : "clock")}</span><div class="settings-row-copy"><strong>${row.title}</strong><p class="muted small">${row.body}</p></div></div>${row.done ? statusPill("active", "Verified") : `<button class="ghost-button compact" data-action="seller-add-phone">Add</button>`}</div>`).join("")}</div>
    <div class="trust-note" style="margin-top:16px">In the real app, the verification method and support path would be explained in plain language.</div></div>`;
}

function sellerProfileSection() {
  const seller = getSeller(SELLER_ID);
  const section = state.seller.profileSection;
  if (section === "verification") return sellerProfileVerification();
  if (section === "availability") return `<div class="settings-group"><h2>Availability</h2><p class="muted small">Control when buyers can book and buy.</p>
    ${sellerSettingsRow("awayMode", "Away mode", "Pause every active listing at once, for finals or a trip. Turning it off restores them.")}
    ${sellerSettingsRow("instantBook", "Instant booking", "Let buyers book open slots without waiting for you to accept.")}
    <div class="settings-row"><div class="settings-row-copy"><strong>Open booking slots</strong><p class="muted small">Add or remove times on each service.</p></div><button class="ghost-button compact" data-action="seller-add-availability">${icon("calendar")} Manage</button></div></div>`;
  if (section === "notifications") return `<div class="settings-group"><h2>What should reach you</h2><p class="muted small">These stay in the app for this prototype. Nothing is emailed.</p>
    ${sellerSettingsRow("notifyRequests", "New orders and requests", "Bookings, purchases and cancellations.")}
    ${sellerSettingsRow("notifyMessages", "Buyer messages", "When a buyer asks a question or replies.")}
    ${sellerSettingsRow("notifyReviews", "Reviews", "When a buyer leaves a review you can reply to.")}
    ${sellerSettingsRow("notifyPayouts", "Payouts", "When money is sent to your account.")}
    ${sellerSettingsRow("notifyDigest", "Weekly summary", "A Monday recap of views, orders and earnings.")}</div>`;
  if (section === "account") return `<div class="settings-group"><h2>Account</h2><p class="muted small">You're signed in to the Seller Hub demo as ${escapeHtml(seller.name)}.</p>
    <div class="settings-row"><div class="settings-row-copy"><strong>Switch to buying</strong><p class="muted small">Browse Campus Connect as Katarina, the buyer demo account.</p></div><button class="ghost-button" data-action="switch-mode">${icon("repeat")} Switch</button></div>
    <div class="settings-safety"><h3>Support and safety</h3><div class="button-row"><button type="button" class="ghost-button" data-action="open-help">${icon("help")} Get help</button><button type="button" class="ghost-button" data-action="open-report">${icon("shield")} Report a buyer</button></div></div>
    <div class="settings-signout"><div><strong>Sign out</strong><p class="muted small">This demo stays signed in.</p></div><button type="button" class="danger-button" data-action="sign-out">${icon("logout")} Sign out</button></div></div>`;
  return sellerProfilePublic(seller);
}

function sellerProfileView() {
  const nav = sellerProfileSections().map((item) => `<button type="button" class="settings-nav-item ${item.id === state.seller.profileSection ? "active" : ""}" ${item.view ? `data-view="${item.view}"` : `data-action="seller-set-profile-section" data-section="${item.id}"`}><span class="trust-icon">${icon(item.icon)}</span><span class="settings-nav-copy"><span class="settings-nav-label">${item.label}</span><span class="muted small">${escapeHtml(item.hint)}</span></span></button>`).join("");
  return `<div class="settings-page">${sellerHeader({ eyebrow: "Seller Hub", title: "Profile", sub: "How you show up to buyers, plus your seller settings.", actions: `<button class="ghost-button" data-action="seller-preview-profile">${icon("eye")} View public profile</button>` })}
    <div class="settings-layout"><aside class="settings-nav" aria-label="Profile sections">${nav}</aside><section class="settings-panel">${sellerProfileSection()}</section></div></div>`;
}

/* ---------- Stores ---------- */

function storeManageCard(store) {
  const listings = everyListing().filter((listing) => listing.storeId === store.id);
  const active = listings.filter((listing) => listingStatus(listing) === "active").length;
  return `<article class="store-manage-card">
    <div class="store-card-banner ${store.accent}"><span class="store-card-previews" aria-hidden="true">${listings.slice(0, 3).map((listing) => `<span>${listing.emoji}</span>`).join("")}</span></div>
    <span class="store-card-logo" aria-hidden="true">${escapeHtml(getSeller(store.sellerId).initials)}</span>
    <div class="store-card-body">
      <span class="store-card-name">${escapeHtml(store.name)}</span>
      <span class="store-card-owner">${escapeHtml(store.handle)}</span>
      <span class="store-card-tagline">${escapeHtml(store.tagline)}</span>
      <div class="store-manage-stats"><span><strong>${fmt(store.followers)}</strong> followers</span><span><strong>${store.sales}</strong> sales</span><span><strong>${store.rating}</strong> ★</span><span><strong>${active}/${listings.length}</strong> live</span></div>
      ${store.announcement ? `<div class="store-announcement compact"><span class="trust-icon">${icon("megaphone")}</span><span>${escapeHtml(store.announcement)}</span></div>` : ""}
      <div class="button-row"><button class="primary-button" data-action="seller-edit-store" data-id="${store.id}">${icon("edit")} Edit store</button><button class="ghost-button" data-action="seller-preview-store" data-id="${store.id}">${icon("eye")} Preview</button><button class="icon-button" data-action="seller-share-store" aria-label="Share ${escapeHtml(store.name)}">${icon("share")}</button></div>
    </div>
  </article>`;
}

function sellerStoresView() {
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Your stores", sub: "Each store has its own look, collections and policies. Buyers can follow the ones they love.", actions: `<button class="primary-button" data-action="seller-new-store">${icon("plus")} Open a new store</button>` })}
    <div class="store-manage-grid">${myStores().map(storeManageCard).join("")}<button type="button" class="store-new-card" data-action="seller-new-store"><span class="empty-shape">＋</span><strong>Open another store</strong><span class="muted small">Great for a separate closet, a new service line or a collab.</span></button></div>`;
}

function openStoreEditor(id) {
  const store = getStore(id);
  if (!store) return;
  state.seller.editStoreId = id;
  state.seller.draft = { name: store.name, handle: store.handle, tagline: store.tagline, emoji: store.emoji, accent: store.accent, announcement: store.announcement || "", about: store.about || "", cancellation: store.policies.cancellation, pickup: store.policies.pickup, hours: store.policies.hours, collections: store.collections.map((collection) => ({ name: collection.name, listingIds: [...collection.listingIds] })) };
  setView("seller-store-edit");
}

function draftStore() {
  const store = getStore(state.seller.editStoreId);
  const draft = state.seller.draft;
  if (!store || !draft) return store;
  return { ...store, name: draft.name || "Untitled store", tagline: draft.tagline, emoji: draft.emoji || store.emoji, accent: draft.accent };
}

function sellerStoreEditView() {
  const store = getStore(state.seller.editStoreId);
  const draft = state.seller.draft;
  if (!store || !draft) return sellerStoresView();
  const storeItems = everyListing().filter((listing) => listing.storeId === store.id);
  const swatches = ACCENTS.map((accent) => `<button type="button" class="swatch ${accent} ${draft.accent === accent ? "active" : ""}" data-action="seller-set-draft-accent" data-accent="${accent}" aria-label="${accent} theme"></button>`).join("");
  const collections = draft.collections.map((collection, index) => `<div class="collection-block"><div class="collection-head"><input aria-label="Collection name" data-collection-name="${index}" value="${escapeHtml(collection.name)}" /><button type="button" class="icon-button danger" data-action="seller-remove-collection" data-index="${index}" aria-label="Remove ${escapeHtml(collection.name)}">${icon("trash")}</button></div><div class="collection-items">${storeItems.map((listing) => `<label class="collection-item"><input type="checkbox" data-collection-index="${index}" value="${listing.id}" ${collection.listingIds.includes(listing.id) ? "checked" : ""} /> <span>${listing.emoji} ${escapeHtml(listing.title)}</span></label>`).join("") || `<span class="muted small">Add listings to this store first.</span>`}</div></div>`).join("");
  return `${sellerHeader({ eyebrow: "Edit store", title: escapeHtml(store.name), sub: `${plural(storeItems.length, "listing")} · ${fmt(store.followers)} followers`, back: { view: "seller-stores", label: "Back to stores" }, actions: `<button class="ghost-button" data-action="seller-preview-store" data-id="${store.id}">${icon("eye")} Preview store</button>` })}
    <div class="editor-layout">
      <form class="form-card editor-form" data-form="seller-save-store">
        <h3>Look and feel</h3>
        <div class="form-grid">
          <div class="field"><label for="store-name">Store name</label><input id="store-name" required maxlength="40" data-draft="name" value="${escapeHtml(draft.name)}" /></div>
          <div class="field"><label for="store-handle">Handle</label><input id="store-handle" required maxlength="24" data-draft="handle" value="${escapeHtml(draft.handle)}" /></div>
          <div class="field full"><label for="store-tagline">Tagline</label><input id="store-tagline" maxlength="80" data-draft="tagline" value="${escapeHtml(draft.tagline)}" /></div>
          <div class="field"><label for="store-emoji">Logo emoji</label><input id="store-emoji" maxlength="4" data-draft="emoji" value="${escapeHtml(draft.emoji)}" /></div>
          <div class="field"><label>Theme color</label><div class="swatch-row">${swatches}</div></div>
          <div class="field full"><label for="store-announcement">Announcement</label><input id="store-announcement" maxlength="100" data-draft="announcement" value="${escapeHtml(draft.announcement)}" placeholder="e.g. New drop every Sunday" /><span class="field-note">Shows at the top of your store page. Leave empty to hide it.</span></div>
          <div class="field full"><label for="store-about">About</label><textarea id="store-about" data-draft="about">${escapeHtml(draft.about)}</textarea></div>
        </div>
        <h3 class="editor-section-title">Policies</h3>
        <div class="form-grid">
          <div class="field full"><label for="store-cancel">Cancellations & returns</label><input id="store-cancel" data-draft="cancellation" value="${escapeHtml(draft.cancellation)}" /></div>
          <div class="field full"><label for="store-pickup">Pickup & delivery</label><input id="store-pickup" data-draft="pickup" value="${escapeHtml(draft.pickup)}" /></div>
          <div class="field full"><label for="store-hours">Hours</label><input id="store-hours" data-draft="hours" value="${escapeHtml(draft.hours)}" /></div>
        </div>
        <h3 class="editor-section-title">Collections</h3>
        <p class="muted small">Collections are the chips buyers use to browse your store.</p>
        <div class="collection-editor">${collections || `<p class="muted small">No collections yet.</p>`}</div>
        <div class="slot-add"><input id="seller-new-collection" maxlength="30" placeholder="New collection name" aria-label="New collection name" /><button type="button" class="ghost-button" data-action="seller-add-collection">${icon("plus")} Add collection</button></div>
        <div class="button-row" style="margin-top: 22px"><button class="primary-button" type="submit">Save store ${icon("check")}</button><button class="ghost-button" type="button" data-view="seller-stores">Cancel</button></div>
      </form>
      <aside class="editor-side"><div class="eyebrow">Card preview</div><div id="seller-store-preview" class="editor-preview">${storeCard(draftStore())}</div><div class="trust-note" style="margin-top:14px">Policies are shown to buyers again before checkout.</div></aside>
    </div>`;
}

/* ---------- Reviews ---------- */

function sellerReviewsView() {
  const filter = state.seller.reviewsFilter;
  const list = sellerReviews.filter((review) => filter === "all" || (filter === "reply" ? !review.reply : filter === "3" ? review.rating <= 3 : review.rating === Number(filter)));
  const average = (sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length).toFixed(1);
  const chips = [{ id: "all", label: "All" }, { id: "reply", label: "Needs reply" }, { id: "5", label: "5 ★" }, { id: "4", label: "4 ★" }, { id: "3", label: "3 ★ and below" }]
    .map((chip) => `<button type="button" class="filter-button ${filter === chip.id ? "active" : ""}" data-action="seller-set-reviews-filter" data-filter="${chip.id}">${chip.label}</button>`).join("");
  const rows = list.map((review) => {
    const listing = getListing(review.listingId);
    const store = getStore(review.storeId);
    return `<article class="store-review"><div class="store-review-top"><div><strong>${escapeHtml(review.author)}</strong> <span class="muted small">· ${escapeHtml(review.date)} · ${escapeHtml(store?.name || "")}</span></div><span class="store-review-stars" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span></div><p>“${escapeHtml(review.text)}”</p>${listing ? `<span class="store-review-listing">${listing.emoji} ${escapeHtml(listing.title)}</span>` : ""}
      ${review.reply ? `<div class="review-reply"><span class="small"><strong>Your reply</strong></span><p>${escapeHtml(review.reply)}</p></div>` : `<form class="review-reply-form" data-form="seller-review-reply" data-id="${review.id}"><textarea name="reply" rows="2" required placeholder="Thank ${escapeHtml(review.author.split(" ")[0])} or add context…" aria-label="Reply to ${escapeHtml(review.author)}"></textarea><button class="primary-button" type="submit">Reply</button></form>`}</article>`;
  }).join("");
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Reviews", sub: "Every review comes from a completed booking or pickup. Replies are public.", back: { view: "seller-profile", label: "Back to profile" } })}
    <div class="store-reviews"><div class="store-review-summary"><div class="store-review-score">${average}</div><div><div class="store-review-stars large">★★★★★</div><p class="muted small" style="margin:4px 0 0">${plural(sellerReviews.length, "recent review")} · ${sellerReviews.filter((review) => !review.reply).length} without a reply</p></div></div>
      <div><div class="seller-chip-row" style="margin-bottom:14px">${chips}</div><div class="store-review-list">${rows || `<div class="empty-state seller-empty"><div class="empty-shape">★</div><h3>Nothing here.</h3><p class="muted">Try another filter.</p></div>`}</div></div></div>`;
}

/* ---------- Payouts ---------- */

function sellerPayoutsView() {
  const pending = pendingPayout();
  const paidThisMonth = sellerPayouts.history.filter((payout) => payout.date.includes("Sep") && payout.status === "Paid").reduce((sum, payout) => sum + payout.amount, 0);
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Payouts", sub: "Money from completed orders lands in your balance. Campus Connect charges no seller fees in this demo.", back: { view: "seller-profile", label: "Back to profile" }, actions: `<button class="primary-button" data-action="seller-withdraw" ${sellerPayouts.available > 0 ? "" : "disabled"}>${icon("wallet")} Withdraw</button>` })}
    <div class="kpi-grid">
      ${kpiCard({ label: "Available now", value: money(sellerPayouts.available), hint: "Ready to withdraw", iconName: "wallet" })}
      ${kpiCard({ label: "Pending", value: money(pending), hint: "From accepted, not yet completed orders", iconName: "clock" })}
      ${kpiCard({ label: "Paid out in September", value: money(paidThisMonth), hint: plural(sellerPayouts.history.filter((payout) => payout.date.includes("Sep")).length, "payout"), iconName: "check" })}
      ${kpiCard({ label: "Next automatic payout", value: "Mon", hint: sellerPayouts.schedule, iconName: "calendar" })}
    </div>
    <div class="analytics-grid">
      <section class="seller-card"><div class="seller-card-header"><div><h2>History</h2></div></div><div class="seller-table payouts-table"><div class="seller-table-head"><span>Date</span><span>Destination</span><span>Amount</span><span>Status</span></div>${sellerPayouts.history.map((payout) => `<div class="seller-row"><div class="cell" data-label="Date"><strong>${escapeHtml(payout.date)}</strong></div><div class="cell" data-label="To"><span class="muted small">${escapeHtml(sellerPayouts.method)}</span></div><div class="cell" data-label="Amount"><strong>${money(payout.amount)}</strong></div><div class="cell" data-label="Status">${statusPill(payout.status === "Paid" ? "completed" : "requested", payout.status)}</div></div>`).join("")}</div></section>
      <section class="seller-card"><div class="seller-card-header"><div><h2>Payout method</h2></div></div><div class="payout-method"><span class="trust-icon">${icon("wallet")}</span><div><strong>${escapeHtml(sellerPayouts.method)}</strong><span class="muted small">${escapeHtml(sellerPayouts.schedule)} · usually arrives in 1–2 business days</span></div><button class="ghost-button compact" data-action="seller-change-method">Change</button></div><div class="trust-note" style="margin-top:14px">Keep every payment on Campus Connect. Buyers are protected and you're covered if something goes wrong.</div></section>
    </div>`;
}

/* ---------- Modals ---------- */

function openAnnouncementModal() {
  renderModal(`<div class="eyebrow">Store announcement</div><h2>Tell your followers something.</h2><p class="muted">It shows at the top of the store page until you change it.</p><form data-form="seller-announcement"><div class="field"><label for="announce-store">Store</label><select id="announce-store" name="storeId">${myStores().map((store) => `<option value="${store.id}">${escapeHtml(store.name)}</option>`).join("")}</select></div><div class="field" style="margin-top:13px"><label for="announce-text">Announcement</label><input id="announce-text" name="text" required maxlength="100" placeholder="e.g. Grad season weekends are filling up fast." /></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Post ${icon("megaphone")}</button></div></form>`);
}

function openAvailabilityModal() {
  const serviceListings = myListings().filter((listing) => listing.kind === "service");
  renderModal(`<div class="eyebrow">Availability</div><h2>Which service?</h2><p class="muted">Open the editor to add or remove booking slots.</p><div class="notification-list">${serviceListings.map((listing) => `<button type="button" class="activity-row" data-action="seller-edit-listing" data-id="${listing.id}"><span class="activity-main">${listingThumb(listing)}<span><span class="activity-title">${escapeHtml(listing.title)}</span><span class="activity-sub">${plural((listing.slots || []).filter((slot) => slot !== "Choose a time").length, "open slot")} · ${LISTING_STATUS_LABELS[listingStatus(listing)]}</span></span></span>${icon("chevron-right")}</button>`).join("")}</div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Done</button></div>`);
}

function openOrderReasonModal(order, kind) {
  const decline = kind === "decline";
  const reasons = decline ? ["That time doesn't work for me", "I'm fully booked", "The request is outside what I offer", "Other"] : ["I can no longer make it", "Item is no longer available", "Buyer asked to cancel", "Other"];
  renderModal(`<div class="eyebrow">${decline ? "Decline request" : "Cancel & refund"}</div><h2>${decline ? `Decline ${escapeHtml(order.buyer.split(" ")[0])}'s request?` : "Cancel this order?"}</h2><p class="muted">${decline ? "The buyer isn't charged. We'll let them know kindly." : `${escapeHtml(order.buyer)} gets a full refund of ${money(order.amount)}.`}</p><form data-form="seller-order-reason" data-id="${order.id}" data-kind="${kind}"><div class="field"><label for="order-reason">Reason</label><select id="order-reason" name="reason">${reasons.map((reason) => `<option>${reason}</option>`).join("")}</select></div><div class="field" style="margin-top:13px"><label for="order-message">Message to buyer (optional)</label><textarea id="order-message" name="message" placeholder="Suggest another time or say thanks."></textarea></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Keep it</button><button class="danger-button" type="submit">${decline ? "Decline request" : "Cancel & refund"}</button></div></form>`);
}

function openRescheduleModal(order) {
  const listing = getListing(order.listingId);
  const slots = (listing?.slots || []).filter((slot) => slot !== "Choose a time" && slot !== `${SELLER_DAYS[order.day]} · ${order.time}`);
  renderModal(`<div class="eyebrow">Reschedule</div><h2>Suggest a new time.</h2><p class="muted">Currently ${escapeHtml(orderWhen(order))}. ${escapeHtml(order.buyer.split(" ")[0])} gets a notification to confirm.</p><form data-form="seller-reschedule" data-id="${order.id}"><div class="field"><label for="reschedule-slot">New time</label><select id="reschedule-slot" name="slot">${slots.map((slot) => `<option>${escapeHtml(slot)}</option>`).join("") || `<option>Sun · 12:00 PM</option>`}</select><span class="field-note">Only your open slots are shown. Add more from the listing editor.</span></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Send new time ${icon("arrow")}</button></div></form>`);
}

function openNewStoreModal() {
  renderModal(`<div class="eyebrow">New store</div><h2>Open another store.</h2><p class="muted">You can fill in policies and collections after it's created.</p><form data-form="seller-create-store"><div class="form-grid"><div class="field full"><label for="new-store-name">Store name</label><input id="new-store-name" name="name" required maxlength="40" placeholder="e.g. Maya's Film Lab" /></div><div class="field full"><label for="new-store-tagline">Tagline</label><input id="new-store-tagline" name="tagline" maxlength="80" placeholder="One line about what you sell" /></div><div class="field"><label for="new-store-emoji">Logo emoji</label><input id="new-store-emoji" name="emoji" maxlength="4" value="✨" /></div><div class="field"><label for="new-store-accent">Theme</label><select id="new-store-accent" name="accent">${ACCENTS.map((accent) => `<option>${accent}</option>`).join("")}</select></div></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Create store ${icon("arrow")}</button></div></form>`);
}

function openWithdrawModal() {
  renderModal(`<div class="eyebrow">Withdraw</div><h2>Send money to ${escapeHtml(sellerPayouts.method)}.</h2><p class="muted">${money(sellerPayouts.available)} is available. Demo only, so no money moves.</p><form data-form="seller-withdraw"><div class="field"><label for="withdraw-amount">Amount ($)</label><input id="withdraw-amount" name="amount" type="number" min="1" step="0.01" max="${sellerPayouts.available.toFixed(2)}" value="${sellerPayouts.available.toFixed(2)}" required /></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Withdraw ${icon("arrow")}</button></div></form>`);
}

let ticketScanStream = null;

function stopTicketScan() {
  ticketScanStream?.getTracks().forEach((track) => track.stop());
  ticketScanStream = null;
}

function applyTicketScan(code) {
  const result = markTicketUsed(code);
  state.seller.scanResult = result;
  stopTicketScan();
  showToast(result.ok ? "Ticket marked used." : result.title, result.ok ? undefined : "error");
  render();
}

async function startTicketCamera() {
  const video = document.querySelector("#ticket-scan-video");
  const note = document.querySelector("#ticket-scan-note");
  if (!video || !navigator.mediaDevices?.getUserMedia) {
    if (note) note.textContent = "This browser cannot open the camera. Enter the code under the QR instead.";
    return;
  }
  try {
    stopTicketScan();
    ticketScanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = ticketScanStream;
    video.hidden = false;
    await video.play();
    if (!("BarcodeDetector" in window)) {
      if (note) note.textContent = "Camera is on, but this browser cannot read QR codes. Enter the code under the buyer's QR.";
      return;
    }
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const watch = async () => {
      if (!ticketScanStream || state.view !== "seller-scan") return;
      try {
        const codes = await detector.detect(video);
        const value = codes[0]?.rawValue;
        if (value) return applyTicketScan(value);
      } catch { /* keep watching */ }
      requestAnimationFrame(watch);
    };
    watch();
    if (note) note.textContent = "Point the camera at the buyer's QR code.";
  } catch {
    if (note) note.textContent = "Camera permission was blocked. Enter the code under the QR instead.";
  }
}

function sellerScanView() {
  const result = state.seller.scanResult;
  const banner = result ? `<div class="scan-result ${result.ok ? "is-valid" : "is-used"}"><strong>${escapeHtml(result.title)}</strong><p>${escapeHtml(result.message)}</p></div>` : "";
  return `${sellerHeader({ eyebrow: "At the door", title: "Scan a ticket", sub: "A valid code is marked used. A second scan will not let them in.", back: { view: "seller-orders", label: "Back to orders" } })}
    <div class="scan-layout">
      <section class="scan-stage">
        <video id="ticket-scan-video" class="scan-video" hidden playsinline muted></video>
        <div class="scan-frame" aria-hidden="true"></div>
        <p id="ticket-scan-note" class="muted small">Start the camera, or type the code printed under the QR.</p>
        <button class="primary-button" type="button" data-action="seller-start-scan">${icon("ticket")} Start camera</button>
      </section>
      <form class="form-card" data-form="seller-scan-code">
        <div class="field"><label for="ticket-code">Ticket code</label><input id="ticket-code" name="code" required maxlength="12" placeholder="e.g. CC7K3M9Q" autocomplete="off" /></div>
        <button class="primary-button" type="submit">Mark used ${icon("check")}</button>
        ${banner}
      </form>
    </div>`;
}

/* ---------- Routing ---------- */

const SELLER_VIEWS = {
  "seller-dashboard": sellerDashboardView,
  "seller-listings": sellerListingsView,
  "seller-listing-edit": sellerListingEditView,
  "seller-new": sellerNewListingView,
  "seller-orders": sellerOrdersView,
  "seller-order": sellerOrderView,
  "seller-scan": sellerScanView,
  "seller-analytics": sellerAnalyticsView,
  "seller-inbox": sellerInboxView,
  "seller-notifications": sellerNotificationsView,
  "seller-profile": sellerProfileView,
  "seller-stores": sellerStoresView,
  "seller-store-edit": sellerStoreEditView,
  "seller-reviews": sellerReviewsView,
  "seller-payouts": sellerPayoutsView
};

function renderSellerView() {
  const view = SELLER_VIEWS[state.view] || sellerDashboardView;
  return `<div class="seller-page">${view()}</div>`;
}

function openSellerOrder(id) {
  state.seller.selectedOrderId = id;
  setView("seller-order");
}

function previewAsBuyer(view, extra) {
  state.seller.previewReturn = state.view.startsWith("seller-") ? state.view : state.seller.previewReturn;
  closeModal();
  setView(view, extra);
}

function handleSellerAction(action, target) {
  const id = target.dataset.id;
  const ui = state.seller;
  const handlers = {
    "go-home": () => setView("seller-dashboard"),
    "open-notification": () => { const notification = getNotification(id); if (notification) openSellerNotification(notification); },
    "mark-all-notifications-read": () => { sellerNotifications.forEach((notification) => { notification.unread = false; }); showToast("All notifications marked as read."); render(); },
    "seller-open-notification-settings": () => { ui.profileSection = "notifications"; setView("seller-profile"); },
    "seller-open-trust": () => { ui.profileSection = "verification"; setView("seller-profile"); },
    "seller-premium": () => showToast("Premium is a demo. Profile upgrades would start here."),
    "seller-exit-preview": () => setView(ui.previewReturn || "seller-dashboard"),
    "back-from-detail": () => setView(ui.previewReturn || "seller-listings"),
    "back-from-store": () => setView(ui.previewReturn || "seller-stores"),
    "message-seller": () => showToast("Buyers message you from here. You're previewing your own listing."),
    "message-store": () => showToast("Buyers message your store from here."),
    "primary-listing-action": () => showToast("Buyers book or buy from here. Checkout is off while previewing."),
    "toggle-save": () => showToast("Buyers can save this listing to their lists."),
    "toggle-follow-store": () => showToast("Buyers follow your store from here."),
    "confirm-order": () => showToast("Checkout is off while previewing."),

    "seller-new-listing": () => { state.sellKind = null; state.sellMerchandiseType = null; setView("seller-new"); },
    "seller-edit-listing": () => { closeModal(); openListingEditor(id); },
    "seller-preview-listing": () => previewAsBuyer("listing", { selectedListingId: id, detailReturn: null, selectedDate: "Today", quantity: 1 }),
    "seller-toggle-listing-status": () => {
      const listing = getListing(id);
      if (!listing) return;
      const next = listingStatus(listing) === "active" ? "paused" : "active";
      listing.status = next;
      showToast(next === "active" ? `${listing.title} is live for buyers.` : `${listing.title} is paused and hidden from buyers.`);
      render();
    },
    "seller-duplicate-listing": () => {
      const listing = getListing(id);
      if (!listing) return;
      const copy = { ...listing, id: `${listing.id}-copy-${Date.now()}`, title: `${listing.title} (copy)`, status: "draft", slots: listing.slots ? [...listing.slots] : undefined, rating: "New", reviews: 0, completed: 0, tag: undefined };
      state.userListings.push(copy);
      showToast("Duplicated as a draft.");
      openListingEditor(copy.id);
    },
    "seller-delete-listing": () => {
      const listing = getListing(id);
      if (!listing) return;
      renderModal(`<div class="eyebrow">Delete listing</div><h2>Delete “${escapeHtml(listing.title)}”?</h2><p class="muted">It disappears from your stores and buyers' lists. Past orders stay in your history. Consider pausing it instead.</p><div class="modal-actions"><button class="ghost-button" data-action="close-modal">Keep it</button><button class="ghost-button" data-action="seller-toggle-listing-status" data-id="${listing.id}">${icon("pause")} Pause instead</button><button class="danger-button" data-action="seller-confirm-delete-listing" data-id="${listing.id}">${icon("trash")} Delete</button></div>`);
    },
    "seller-confirm-delete-listing": () => { const listing = getListing(id); removeListingEverywhere(id); closeModal(); showToast(`${listing?.title || "Listing"} deleted.`); setView("seller-listings"); },
    "seller-set-listings-tab": () => { ui.listingsTab = target.dataset.tab; state.view === "seller-listings" ? render() : setView("seller-listings"); },
    "seller-set-listings-store": () => { ui.listingsStore = id; render(); },
    "seller-set-listings-kind": () => { ui.listingsKind = target.dataset.kind; render(); },
    "seller-clear-listing-filters": () => { Object.assign(ui, { listingsTab: "all", listingsStore: "all", listingsKind: "all", listingsQuery: "" }); render(); },
    "seller-add-slot": () => {
      const day = document.querySelector("#seller-slot-day")?.value || "Today";
      const time = formatTime(document.querySelector("#seller-slot-time")?.value);
      const slot = `${day} · ${time}`;
      if (ui.draft.slots.includes(slot)) return showToast("That slot is already open.", "error");
      ui.draft.slots.push(slot);
      ui.draft.slots.sort((a, b) => parseSlot(a).day - parseSlot(b).day);
      render();
    },
    "seller-remove-slot": () => { ui.draft.slots.splice(Number(target.dataset.index), 1); render(); },
    "seller-set-draft-status": () => { ui.draft.status = target.dataset.status; render(); },
    "seller-set-draft-accent": () => { ui.draft.accent = target.dataset.accent; render(); },

    "seller-open-order": () => { closeModal(); openSellerOrder(id); },
    "seller-back-to-orders": () => { const order = getSellerOrder(ui.selectedOrderId); if (order) ui.ordersTab = order.status; ui.ordersLayout = "list"; setView("seller-orders"); },
    "seller-set-orders-tab": () => { ui.ordersTab = target.dataset.tab; render(); },
    "seller-set-orders-layout": () => { ui.ordersLayout = target.dataset.layout; state.view === "seller-orders" ? render() : setView("seller-orders"); },
    "seller-order-accept": () => { const order = getSellerOrder(id); setOrderStatus(order, "confirmed", `Accepted. ${order.buyer.split(" ")[0]} has been notified.`); },
    "seller-order-ready": () => setOrderStatus(getSellerOrder(id), "ready", "Marked ready. The buyer knows where to meet you."),
    "seller-order-complete": () => { const order = getSellerOrder(id); setOrderStatus(order, "completed", `Completed. ${money(order.amount)} added to your balance.`); },
    "seller-order-decline": () => openOrderReasonModal(getSellerOrder(id), "decline"),
    "seller-order-cancel": () => openOrderReasonModal(getSellerOrder(id), "cancel"),
    "seller-order-reschedule": () => openRescheduleModal(getSellerOrder(id)),
    "seller-order-thanks": () => showToast("Review request sent to the buyer (demo)."),
    "seller-message-buyer": () => openOrderConversation(getSellerOrder(id)),
    "seller-start-scan": () => startTicketCamera(),

    "seller-set-range": () => { ui.analyticsRange = Number(target.dataset.range); render(); },
    "seller-set-analytics-store": () => { ui.analyticsStore = id; render(); },

    "seller-select-conversation": () => { ui.selectedConversationId = id; const conversation = getSellerConversation(id); if (conversation) conversation.unread = false; render(); },
    "seller-set-inbox-filter": () => { ui.inboxFilter = target.dataset.filter; render(); },
    "seller-toggle-done": () => { const conversation = getSellerConversation(id); conversation.done = !conversation.done; showToast(conversation.done ? "Marked as done." : "Moved back to active."); render(); },
    "seller-quick-reply": () => { const input = document.querySelector(".chat-composer textarea"); if (!input) return; input.value = input.value ? `${input.value} ${target.dataset.text}` : target.dataset.text; input.focus(); },
    "seller-open-context": () => { const conversation = getSellerConversation(id); if (conversation?.orderId && getSellerOrder(conversation.orderId)) return openSellerOrder(conversation.orderId); if (conversation?.listingId) openListingEditor(conversation.listingId); },

    "seller-set-notifications-filter": () => { ui.notificationsFilter = target.dataset.filter; render(); },

    "seller-set-profile-section": () => { ui.profileSection = target.dataset.section; render(); },
    "seller-preview-profile": () => previewAsBuyer("seller", { selectedSellerId: SELLER_ID }),
    "seller-toggle-setting": () => {
      const key = target.dataset.key;
      ui.settings[key] = !ui.settings[key];
      if (key === "awayMode") {
        const listings = myListings();
        if (ui.settings.awayMode) listings.filter((listing) => listingStatus(listing) === "active").forEach((listing) => { listing.status = "paused"; listing.awayPaused = true; });
        else listings.filter((listing) => listing.awayPaused).forEach((listing) => { listing.status = "active"; delete listing.awayPaused; });
        showToast(ui.settings.awayMode ? "Away mode on. All active listings are paused." : "Welcome back. Your listings are live again.");
      } else {
        showToast(`${target.getAttribute("aria-label")} ${ui.settings[key] ? "on" : "off"}.`);
      }
      render();
    },
    "seller-add-phone": () => showToast("Phone verification would start here (demo)."),
    "sign-out": () => showToast("This prototype stays signed in to the Seller Hub demo."),

    "seller-edit-store": () => openStoreEditor(id),
    "seller-preview-store": () => previewAsBuyer("store", { selectedStoreId: id, storeTab: "shop", storeCollection: "All", storeQuery: "", storeKind: "all" }),
    "seller-share-store": () => showToast("Store link copied — demo only."),
    "seller-new-store": () => openNewStoreModal(),
    "seller-add-collection": () => {
      const input = document.querySelector("#seller-new-collection");
      const name = input?.value.trim();
      if (!name) return showToast("Give the collection a name first.", "error");
      ui.draft.collections.push({ name, listingIds: [] });
      render();
    },
    "seller-remove-collection": () => { ui.draft.collections.splice(Number(target.dataset.index), 1); render(); },

    "seller-set-reviews-filter": () => { ui.reviewsFilter = target.dataset.filter; render(); },
    "seller-withdraw": () => openWithdrawModal(),
    "seller-change-method": () => showToast("Payout method changes would happen here (demo)."),
    "seller-post-announcement": () => openAnnouncementModal(),
    "seller-add-availability": () => openAvailabilityModal()
  };
  const handler = handlers[action];
  if (!handler) return false;
  handler();
  return true;
}

function handleSellerSubmit(form, event) {
  const data = new FormData(form);
  const name = form.dataset.form;
  if (name === "seller-listings-search") { state.seller.listingsQuery = data.get("query")?.toString() || ""; render(); return true; }
  if (name === "publish-listing") {
    const kind = state.sellKind || "service";
    const merchandiseType = kind === "product" ? state.sellMerchandiseType || "resale" : undefined;
    const category = data.get("category")?.toString() || "Create";
    const condition = kind === "product" ? data.get("condition")?.toString() || "New" : undefined;
    const draft = event.submitter?.value === "draft";
    const storeId = data.get("storeId")?.toString() || myStores()[0]?.id;
    const seller = getSeller(SELLER_ID);
    const listing = { id: `maya-listing-${Date.now()}`, kind, merchandiseType, category, storeId, title: data.get("title")?.toString() || "New listing", seller: seller.name, initials: seller.initials, sellerId: SELLER_ID, rating: "New", reviews: 0, completed: 0, price: Number(data.get("price")) || 25, unit: kind === "service" ? data.get("duration")?.toString() || "hour" : "each", accent: kind === "service" ? "lilac" : merchandiseType === "new" ? "mint" : "butter", emoji: kind === "service" ? "✨" : merchandiseType === "new" ? "✦" : "📦", condition, availability: kind === "service" ? "Set availability next" : condition === "Digital download" ? "Instant digital delivery" : "Local pickup", campus: "SDSU", verified: true, quantityAvailable: Number(data.get("quantity")) || 1, description: data.get("description")?.toString() || "", meeting: kind === "service" ? "Choose a campus meeting spot" : "Choose a campus pickup spot", response: `Usually replies in ${seller.response}`, slots: kind === "service" ? [] : undefined, status: draft ? "draft" : "active" };
    state.userListings.push(listing);
    statsFor(listing.id);
    state.sellKind = null;
    state.sellMerchandiseType = null;
    showToast(draft ? "Saved as a draft. Only you can see it." : `${listing.title} is live in ${getStore(storeId)?.name || "your store"}.`);
    if (kind === "service" && !draft) { openListingEditor(listing.id); showToast("Add a few booking slots so buyers can book."); return true; }
    state.seller.listingsTab = draft ? "draft" : "all";
    setView("seller-listings");
    return true;
  }
  if (name === "seller-save-listing") { saveListingDraft(); showToast("Listing saved."); state.seller.draft = null; setView("seller-listings"); return true; }
  if (name === "seller-send-message") {
    const input = form.querySelector("textarea[name=message]");
    const text = input.value.trim();
    if (!text) return true;
    const conversation = getSellerConversation(state.seller.selectedConversationId) || sellerConversations[0];
    sendSellerMessage(conversation, text);
    render();
    showToast("Reply sent in the demo.");
    return true;
  }
  if (name === "seller-order-reason") {
    const order = getSellerOrder(form.dataset.id);
    const decline = form.dataset.kind === "decline";
    order.cancelReason = `${decline ? "Declined" : "Cancelled and refunded"}: ${data.get("reason")}.`;
    order.when = `${decline ? "Declined" : "Cancelled"} · Today`;
    closeModal();
    setOrderStatus(order, "cancelled", decline ? "Request declined. The buyer wasn't charged." : `Refunded ${money(order.amount)} to ${order.buyer}.`);
    return true;
  }
  if (name === "seller-reschedule") {
    const order = getSellerOrder(form.dataset.id);
    Object.assign(order, parseSlot(data.get("slot")?.toString()));
    closeModal();
    showToast(`New time sent to ${order.buyer.split(" ")[0]}: ${orderWhen(order)}.`);
    render();
    return true;
  }
  if (name === "seller-save-profile") {
    const seller = getSeller(SELLER_ID);
    const handle = data.get("handle").toString().trim().replace(/^@?/, "@");
    Object.assign(seller, { name: data.get("name").toString().trim() || seller.name, handle, campus: data.get("campus").toString().trim(), bio: data.get("bio").toString().trim(), response: data.get("response").toString() });
    seller.initials = initialsFor(seller.name);
    myListings().forEach((listing) => { listing.seller = seller.name; listing.initials = seller.initials; });
    syncModeChrome();
    showToast("Profile saved for this demo session.");
    render();
    return true;
  }
  if (name === "seller-save-store") {
    const store = getStore(state.seller.editStoreId);
    const draft = state.seller.draft;
    Object.assign(store, { name: draft.name.trim() || store.name, handle: draft.handle.trim().replace(/^@?/, "@"), tagline: draft.tagline, emoji: draft.emoji.trim() || store.emoji, accent: draft.accent, announcement: draft.announcement.trim(), about: draft.about, collections: draft.collections.filter((collection) => collection.name.trim()).map((collection) => ({ name: collection.name.trim(), listingIds: collection.listingIds })) });
    store.policies = { cancellation: draft.cancellation, pickup: draft.pickup, hours: draft.hours };
    state.seller.draft = null;
    showToast(`${store.name} saved.`);
    setView("seller-stores");
    return true;
  }
  if (name === "seller-create-store") {
    const storeName = data.get("name").toString().trim();
    const store = { id: `store-${Date.now()}`, sellerId: SELLER_ID, name: storeName, handle: `@${storeName.toLowerCase().replace(/[^a-z0-9]+/g, "")}`.slice(0, 24), emoji: data.get("emoji").toString().trim() || "✨", accent: data.get("accent").toString(), tagline: data.get("tagline").toString().trim() || "A new store on campus", about: "", announcement: "", rating: "New", reviews: 0, sales: 0, followers: 0, policies: { cancellation: "Cancel any time before pickup.", pickup: "Pickup on campus.", hours: "Afternoons" }, collections: [], reviewsSample: [] };
    stores.push(store);
    getSeller(SELLER_ID).storeIds.push(store.id);
    closeModal();
    showToast(`${store.name} is open. Add listings to fill it up.`);
    openStoreEditor(store.id);
    return true;
  }
  if (name === "seller-review-reply") {
    const review = sellerReviews.find((entry) => entry.id === form.dataset.id);
    review.reply = data.get("reply").toString().trim();
    showToast("Reply posted publicly.");
    render();
    return true;
  }
  if (name === "seller-scan-code") {
    applyTicketScan(data.get("code"));
    return true;
  }
  if (name === "seller-withdraw") {
    const amount = Math.min(sellerPayouts.available, Number(data.get("amount")) || 0);
    if (amount <= 0) return true;
    sellerPayouts.available = Math.round((sellerPayouts.available - amount) * 100) / 100;
    sellerPayouts.history.unshift({ id: `po-${Date.now()}`, date: "Today", amount, status: "Processing" });
    closeModal();
    showToast(`${money(amount)} is on its way to ${sellerPayouts.method}.`);
    render();
    return true;
  }
  if (name === "seller-announcement") {
    const store = getStore(data.get("storeId").toString());
    store.announcement = data.get("text").toString().trim();
    closeModal();
    showToast(`Posted to ${store.name}.`);
    render();
    return true;
  }
  return false;
}

document.addEventListener("change", (event) => {
  if (state.mode !== "seller" || event.target.id !== "listings-store-filter") return;
  state.seller.listingsStore = event.target.value;
  render();
});

document.addEventListener("input", (event) => {
  if (state.mode !== "seller") return;
  const field = event.target;
  if (field.id === "seller-listings-search-input") {
    searchCaret = { id: field.id, position: field.selectionStart };
    state.seller.listingsQuery = field.value;
    render();
    return;
  }
  const draft = state.seller.draft;
  if (!draft) return;
  if (field.dataset.draft) {
    draft[field.dataset.draft] = field.value;
    if (field.dataset.draft === "storeId") draft.collection = "";
    if (field.hasAttribute("data-rerender")) render(); else refreshSellerPreview();
    return;
  }
  if (field.dataset.collectionName !== undefined) {
    draft.collections[Number(field.dataset.collectionName)].name = field.value;
    return;
  }
  if (field.dataset.collectionIndex !== undefined) {
    const collection = draft.collections[Number(field.dataset.collectionIndex)];
    collection.listingIds = field.checked ? [...new Set([...collection.listingIds, field.value])] : collection.listingIds.filter((listingId) => listingId !== field.value);
  }
});

if (location.hash === "#seller") setMode("seller");
else {
  syncModeChrome();
  render();
}
