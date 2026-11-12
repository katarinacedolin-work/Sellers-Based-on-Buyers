/**
 * What the app knows.
 *
 * `data` is a cache of what the API last returned. Views read it and never change it. To change something,
 * call the API and then `load()` the keys it affects.
 *
 * `state` is the UI: the current view, what is selected, filters, open forms and unsaved drafts.
 */

const IS_SELLER = document.body.dataset.mode === "seller";
const HOME_VIEW = IS_SELLER ? "seller-dashboard" : "home";

const data = {
  session: { userId: "" },
  categories: [],
  schoolServices: [],
  agents: [],
  listings: [],
  sellers: [],
  stores: [],
  jobs: [],
  housing: [],
  chores: [],
  ticketPosts: [],
  deals: { deals: [], fundraisers: [], popups: [] },
  conversations: [],
  notifications: [],

  /* The buyer's account. */
  account: { displayName: "" },
  paymentMethods: [],
  lists: [],
  followedStoreIds: [],
  orders: [],

  /* The seller's account. */
  sellerOrders: [],
  listingStats: {},
  analytics: { days: [], sources: [], ratings: {} },
  reviews: [],
  sellerSettings: {},
  schedule: { timezone: "", days: {} },
  calendar: { connected: false, email: "", events: [] },
  payouts: { available: 0, pending: 0, method: "", schedule: "", history: [] }
};

const LOADERS = {
  session: api.getSession,
  categories: api.getCategories,
  schoolServices: api.getSchoolServices,
  agents: api.getAgents,
  listings: api.getListings,
  sellers: api.getSellers,
  stores: api.getStores,
  jobs: api.getJobs,
  housing: api.getHousing,
  chores: api.getChores,
  ticketPosts: api.getTicketPosts,
  deals: api.getDeals,
  conversations: api.getConversations,
  notifications: api.getNotifications,
  account: api.getAccount,
  paymentMethods: api.getPaymentMethods,
  lists: api.getLists,
  followedStoreIds: api.getFollowedStoreIds,
  orders: api.getOrders,
  sellerOrders: api.getSellerOrders,
  listingStats: api.getListingStats,
  analytics: api.getAnalytics,
  reviews: api.getReviews,
  sellerSettings: api.getSellerSettings,
  schedule: api.getSchedule,
  calendar: api.getCalendar,
  payouts: api.getPayouts
};

/** What each page fetches when it opens. */
const SHARED_DATA = ["session", "categories", "listings", "sellers", "stores", "conversations", "notifications"];
const BUYER_DATA = [...SHARED_DATA, "schoolServices", "agents", "jobs", "housing", "chores", "ticketPosts", "deals", "account", "paymentMethods", "lists", "followedStoreIds", "orders"];
const SELLER_DATA = [...SHARED_DATA, "sellerOrders", "listingStats", "analytics", "reviews", "sellerSettings", "schedule", "calendar", "payouts"];

/** Fetches the named parts of `data` again: `await load("listings", "stores")`. */
async function load(...keys) {
  await Promise.all(keys.map(async (key) => { data[key] = await LOADERS[key](); }));
}

/** Filters and selections that start over whenever someone uses the navigation. */
const NAVIGATION_DEFAULTS = {
  query: "",
  category: "All",
  sort: "recommended",
  trust: "any",
  shopType: "all",
  storesFilter: "All",
  storesQuery: "",
  jobQuery: "",
  ticketQuery: "",
  selectedJobId: null,
  selectedHousingId: null,
  selectedAgentId: null,
  sellKind: null,
  sellMerchandiseType: null
};

const state = {
  view: HOME_VIEW,
  notificationsOpen: false,
  ...NAVIGATION_DEFAULTS,

  /* Buyer: what is open. The `…Return` keys remember which page a Back button goes to. */
  selectedListingId: null,
  detailReturn: null,
  selectedSellerId: null,
  selectedStoreId: null,
  storeReturn: null,
  selectedSchoolServiceId: null,
  schoolServiceReturn: null,
  selectedChoreId: null,
  boardReturn: null,
  selectedOrderId: null,
  selectedConversationId: null,
  selectedListId: null,

  /* Buyer: one store page. */
  storeTab: "shop",
  storeCollection: "All",
  storeQuery: "",
  storeKind: "all",

  /* Buyer: booking and buying. `booking` holds the open times for the service on screen (see loadBooking in ui.js). */
  booking: null,
  quantity: 1,

  /* Buyer: boards and settings. */
  jobFormOpen: false,
  housingFormOpen: false,
  choreFormOpen: false,
  ticketPostKind: null,
  ticketDmPostId: null,
  settingsSection: "account",

  /* Seller Hub. */
  listingsQuery: "",
  seller: {
    ordersTab: "requested",
    ordersLayout: "list",
    selectedOrderId: null,
    listingsTab: "all",
    listingsKind: "all",
    editListingId: null,
    editStoreId: null,
    draft: null,
    previewReturn: "seller-dashboard",
    analyticsRange: 30,
    inboxFilter: "all",
    notificationsFilter: "all",
    profileSection: "public",
    reviewsFilter: "all",
    scanResult: null,
    hoursPreview: null,
    scheduleCopy: null
  }
};

/* ---------- Selectors: read-only questions about `data` ---------- */

const myId = () => data.session.userId;
const listingStatus = (listing) => listing?.status || "active";

/** Every listing, including the signed-in seller's drafts and paused ones. */
const everyListing = () => data.listings;
/** Only what buyers can see. */
const allListings = () => data.listings.filter((listing) => listingStatus(listing) === "active");
const getListing = (id) => data.listings.find((listing) => listing.id === id);
const getSeller = (id) => data.sellers.find((seller) => seller.id === id);
const getStore = (id) => data.stores.find((store) => store.id === id);
const storesForSeller = (sellerId) => data.stores.filter((store) => store.sellerId === sellerId);
const storeListings = (store) => allListings().filter((listing) => listing.storeId === store.id);
const storeKinds = (store) => new Set(storeListings(store).map((listing) => listing.kind));
const storeCategories = (store) => [...new Set(storeListings(store).map((listing) => listing.category))];
const isFollowing = (storeId) => data.followedStoreIds.includes(storeId);

const getList = (id) => data.lists.find((list) => list.id === id);
const selectedList = () => getList(state.selectedListId) || data.lists[0];
const isListingSaved = (listingId) => data.lists.some((list) => list.listingIds.includes(listingId));
const savedListingCount = () => new Set(data.lists.flatMap((list) => list.listingIds)).size;

const selectedConversation = () => data.conversations.find((conversation) => conversation.id === state.selectedConversationId) || data.conversations[0];
const unreadCount = (items) => items.filter((item) => item.unread).length;

/** Chores are services in the Help category. They are booked from the Chore Board instead of the Book page. */
const isChoreListing = (listing) => listing.kind === "service" && listing.category === "Help";

/** True when the search text appears in any of the given fields. An empty search matches everything. */
const matchesSearch = (query, ...fields) => fields.join(" ").toLowerCase().includes(query.trim().toLowerCase());
