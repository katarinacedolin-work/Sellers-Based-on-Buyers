/**
 * Seller Hub views, for the seller page (seller.html). Each function returns markup built from `data` and `state`.
 * The buyer views are loaded first, so a seller can preview a listing, a store or their profile the way buyers see it.
 */

/* ---------- Shared pieces ---------- */

const ACCENTS = ["coral", "lilac", "butter", "sky", "mint"];

const SERVICE_CATEGORIES = ["Learn", "Create", "Beauty", "Tech", "Lifestyle", "Help", "Events"];

const PRODUCT_CATEGORIES = ["Create", "Student-made", "Clothing", "Furniture", "Textbooks", "Tech", "Beauty", "Dorm", "Other"];

const LISTING_STATUS_LABELS = { active: "Active", paused: "Paused", draft: "Draft", soldout: "Sold out" };

/** The response-time goals a seller can pick, and the short form shown on the dashboard. */
const RESPONSE_GOALS = { "under an hour": "Under 1h", "a few hours": "Few hours", "same day": "Same day", "a day": "1 day" };

const SOURCE_COLORS = ["var(--cobalt)", "var(--lilac)", "var(--coral)", "var(--butter)"];
const NO_STATS = { views: 0, saves: 0, messages: 0, orders: 0 };

const mySeller = () => getSeller(myId());
const myStore = () => storesForSeller(myId())[0] || null;
const myListings = () => everyListing().filter((listing) => listing.sellerId === myId());
const statsFor = (listingId) => data.listingStats[listingId] || NO_STATS;
const getSellerOrder = (id) => data.sellerOrders.find((order) => order.id === id);
const ordersByStatus = (status) => data.sellerOrders.filter((order) => order.status === status);
const orderListingTitle = (order) => getListing(order.listingId)?.title || "Removed listing";

const isRunningLow = (listing) => listing.kind === "product" && listingStatus(listing) === "active" && listing.quantityAvailable > 0 && listing.quantityAvailable <= 3;
const hasNoOpenings = (listing) => listing.kind === "service" && listingStatus(listing) === "active" && !listing.nextOpening;
const lowStockListings = () => myListings().filter(isRunningLow);

/** When an order happens or happened: "Tomorrow · 4:00 PM", "Picked up · Yesterday", or its pickup note. */
function orderWhen(order) {
  const day = dayLabel(dateKey(new Date(order.updatedAt)));
  if (order.status === "cancelled") return `Cancelled · ${day}`;
  if (order.status === "completed") return `${order.kind === "service" ? "Session held" : order.kind === "ticket" ? "Scanned at the door" : "Picked up"} · ${day}`;
  return order.date ? slotLabel(order) : order.when || "";
}

const sellerSettingsRow = (key, title, body) => settingsRow(data.sellerSettings[key], title, body, "seller-toggle-setting", key);

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

function selectOptions(options, selected) {
  const list = options.includes(selected) || !selected ? options : [selected, ...options];
  return list.map((option) => `<option ${option === selected ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
}

function sellerPreviewBanner() {
  return `<div class="seller-preview-banner"><span>${icon("eye")} You're previewing what buyers see. Buyer actions are disabled here.</span><button type="button" class="text-button" data-action="seller-exit-preview">${icon("chevron-left")} Back to Seller Hub</button></div>`;
}

function premiumBanner(title, body, cta) {
  if (data.sellerSettings.premium) return `<section class="sell-hero seller-premium"><div class="eyebrow">Premium</div><h2>Premium is on.</h2><p>${body}</p><button class="primary-button" data-action="seller-premium">Manage Premium ${icon("arrow")}</button></section>`;
  return `<section class="sell-hero seller-premium"><div class="eyebrow">Premium</div><h2>${title}</h2><p>${body}</p><button class="primary-button" data-action="seller-premium">${cta} ${icon("arrow")}</button></section>`;
}

function openPremiumModal() {
  const on = data.sellerSettings.premium;
  renderModal(`<div class="eyebrow">Premium</div><h2>${on ? "Premium is on." : "Turn a good profile into a full storefront."}</h2><p class="muted">Premium adds featured placement, extra profile sections, a badge buyers can see before they message you and a clearer view of who is looking at your listings.</p><div class="trust-note">Premium is a demo. Nothing is charged.</div><div class="modal-actions"><button class="ghost-button" data-action="close-modal">${on ? "Close" : "Not now"}</button><button class="${on ? "danger-button" : "primary-button"}" data-action="seller-toggle-premium">${on ? "Turn off Premium" : "Turn on Premium"}</button></div>`);
}

/* ---------- Dashboard ---------- */

function attentionItems() {
  const items = [];
  const unread = data.conversations.filter((conversation) => conversation.unread).length;
  if (unread) items.push({ iconName: "chat", tone: "sky", title: `${plural(unread, "unread message")}`, sub: "Buyers usually hear back from you in under an hour.", attrs: `data-view="seller-inbox"`, cta: "Reply" });
  ordersByStatus("requested").forEach((order) => items.push({ iconName: "package", tone: "butter", title: `${order.buyer} ${order.kind === "service" ? "wants to book" : "ordered"} ${orderListingTitle(order)}`, sub: `${orderWhen(order)} · ${money(order.amount)}`, attrs: `data-action="seller-open-order" data-id="${order.id}"`, cta: "Review" }));
  lowStockListings().forEach((listing) => items.push({ iconName: "alert", tone: "coral", title: `${listing.title} is running low`, sub: `${listing.quantityAvailable} left in stock`, attrs: `data-action="seller-edit-listing" data-id="${listing.id}"`, cta: "Restock" }));
  const unreplied = data.reviews.filter((review) => !review.reply).length;
  if (unreplied) items.push({ iconName: "star", tone: "lilac", title: `${plural(unreplied, "review")} without a reply`, sub: "A short thank-you builds trust with future buyers.", attrs: `data-view="seller-reviews"`, cta: "Reply" });
  const drafts = myListings().filter((listing) => listingStatus(listing) === "draft").length;
  if (drafts) items.push({ iconName: "edit", tone: "mint", title: `${plural(drafts, "draft listing")} to finish`, sub: "Publish them when you're ready for buyers.", attrs: `data-action="seller-set-listings-tab" data-tab="draft"`, cta: "Finish" });
  return items;
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
  const seller = mySeller();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const month = sumWindow(analyticsWindow(30));
  const previous = sumWindow(analyticsWindow(30, 30));
  const change = pctChange(month.earnings, previous.earnings);
  const active = myListings().filter((listing) => listingStatus(listing) === "active");
  const kinds = [...new Set(active.map((listing) => listing.kind === "service" ? "Book" : listing.kind === "ticket" ? "Tickets" : "Shop"))];
  return `${sellerHeader({ title: `${greeting}, ${escapeHtml(firstName(seller.name))}.`, sub: "Your storefront is live. Here is what needs your attention today.", actions: `<button class="primary-button" data-view="seller-scan">${icon("ticket")} Scan at the door</button>` })}
    <div class="snapshot-grid">
      ${snapshotCard({ tone: "coral", label: "This month", value: `$${formatNumber(month.earnings)}`, hint: `${change >= 0 ? "↑" : "↓"} ${Math.abs(change)}% from last month` })}
      ${snapshotCard({ tone: "lilac", label: "Active listings", value: String(active.length), hint: `${plural(kinds.length, "type", "types")}: ${escapeHtml(kinds.join(" + "))}` })}
      ${snapshotCard({ tone: "butter", label: "Completed", value: String(seller.completed), hint: "All-time transactions" })}
      ${snapshotCard({ tone: "mint", label: "Response time", value: RESPONSE_GOALS[seller.response] || escapeHtml(seller.response), hint: `Usually replies in ${escapeHtml(seller.response)}` })}
    </div>
    <div class="seller-dash-grid">
      <section class="seller-card"><div class="seller-card-header seller-card-header-stack"><div><div class="eyebrow">Needs attention</div><h2>Keep momentum.</h2></div><button class="text-button" data-view="seller-orders">View orders ${icon("arrow")}</button></div>${dashboardAttention()}</section>
      <section class="seller-card"><div class="seller-card-header seller-card-header-stack"><div><div class="eyebrow">Your storefront</div><h2>What buyers see.</h2></div><button class="text-button" data-view="seller-profile">Edit profile ${icon("arrow")}</button></div><div class="storefront-preview">${storefrontPreview(seller)}</div></section>
    </div>
    <section class="seller-card recent-activity"><div class="seller-card-header"><div><div class="eyebrow">Recent activity</div><h2>Orders moving through your shop.</h2></div><button class="text-button" data-view="seller-analytics">See earnings ${icon("arrow")}</button></div><div class="recent-order-list">${data.sellerOrders.slice(0, 4).map(recentOrderRow).join("")}</div></section>
    ${premiumBanner("Make your profile the one buyers open first.", "A premium subscription puts your photo, bio and best work ahead of other sellers, with a badge buyers can see before they message you.", "Upgrade your profile")}`;
}

/* ---------- Listings ---------- */

/** How a listing is doing: "live", "low" (nearly out of stock, or a service with no open times), "draft", "paused" or "soldout". */
function listingTone(listing) {
  const status = listingStatus(listing);
  if (status !== "active") return status;
  return isRunningLow(listing) || hasNoOpenings(listing) ? "low" : "live";
}

const listingNeedsAttention = (listing) => ["draft", "soldout", "low"].includes(listingTone(listing));

function listingNote(listing) {
  const status = listingStatus(listing);
  if (status === "draft") return "Not published. Buyers can't see it.";
  if (status === "paused") return "Paused. Hidden from your store.";
  if (status === "soldout") return "Sold out. Restock to sell it again.";
  if (hasNoOpenings(listing)) return "No open times, so buyers can't book.";
  if (isRunningLow(listing)) return `Only ${listing.quantityAvailable} left.`;
  return "";
}

function listingAvailabilityFact(listing) {
  if (listing.kind === "service") {
    return listing.nextOpening
      ? { label: "Next opening", value: slotLabel(listing.nextOpening), hint: "" }
      : { label: "Next opening", value: "None", hint: "Add a time to take bookings" };
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
        <p class="listing-manage-meta">${kindLabel} · ${escapeHtml(listing.category)}</p>
        ${note ? `<p class="listing-manage-note">${escapeHtml(note)}</p>` : ""}
      </div>
    </div>
    <dl class="listing-manage-facts">
      <div><dt>Price</dt><dd>${money(listing.price)}${priceUnitDetail(listing) ? ` <span>${escapeHtml(priceUnitDetail(listing))}</span>` : ""}</dd></div>
      <div><dt>${escapeHtml(fact.label)}</dt><dd class="${fact.hint === "Running low" || fact.value === "None" || fact.value === "0" ? "is-warning" : ""}">${escapeHtml(fact.value)} <span>${escapeHtml(fact.hint)}</span></dd></div>
      <div><dt>Orders</dt><dd>${formatNumber(stats.orders)} <span>${formatNumber(stats.views)} views</span></dd></div>
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
  const matches = all.filter((listing) => (ui.listingsKind === "all" || listing.kind === ui.listingsKind) && matchesSearch(state.listingsQuery, listing.title, listing.category, listing.description));
  const filtered = matches.filter((listing) => ui.listingsTab === "all" || (ui.listingsTab === "low" ? runningLow(listing) : listingStatus(listing) === ui.listingsTab));
  const narrowed = ui.listingsKind !== "all" || state.listingsQuery.trim();
  const groups = ui.listingsTab === "all"
    ? [
        { title: "Needs a look", items: filtered.filter(listingNeedsAttention) },
        { title: "Live", items: filtered.filter((listing) => listingStatus(listing) === "active" && !listingNeedsAttention(listing)) },
        { title: "Paused", items: filtered.filter((listing) => listingStatus(listing) === "paused") }
      ].filter((group) => group.items.length)
    : [{ title: "", items: filtered }];
  const columnHead = (items) => {
    const labels = [...new Set(items.map((listing) => listingAvailabilityFact(listing).label))];
    const middle = labels.length === 1 ? labels[0] : "Availability";
    return `<div class="listing-column-head" aria-hidden="true"><span></span><span class="listing-column-labels"><span>Price</span><span>${escapeHtml(middle)}</span><span>Orders</span></span><span></span></div>`;
  };
  const list = filtered.length
    ? groups.map((group) => `<section class="listing-group">${group.title ? `<div class="listing-group-head"><h2>${group.title}</h2></div>` : ""}<div class="listing-manage-list">${columnHead(group.items)}${group.items.map(listingManageCard).join("")}</div></section>`).join("")
    : "";
  const empty = all.length
    ? `<div class="empty-state"><div class="empty-shape">⌁</div><h3>Nothing matches.</h3><p class="muted">Try another status, or clear the type and search filters.</p><button class="ghost-button" data-action="seller-clear-listing-filters">Clear filters</button></div>`
    : `<div class="empty-state"><div class="empty-shape">＋</div><h3>No listings yet.</h3><p class="muted">Add a service or product. You can publish it now or keep it as a draft.</p><button class="primary-button" data-view="seller-new">${icon("plus")} New listing</button></div>`;
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Listings", sub: "What you offer, and whether buyers can see it.", actions: `<button class="primary-button" data-view="seller-new">${icon("plus")} New listing</button>` })}
    ${tabBar(tabs, ui.listingsTab, "seller-set-listings-tab", true)}
    <div class="listings-toolbar">
      <form class="global-search listings-search">${icon("search")}<input id="seller-listings-search-input" data-live="listingsQuery" type="search" value="${escapeHtml(state.listingsQuery)}" placeholder="Search by name or category" aria-label="Search your listings" autocomplete="off" /></form>
      <div class="listings-filter listings-filter-type"><span>Type</span><div class="segmented" role="group" aria-label="Listing type"><button type="button" class="segment ${ui.listingsKind === "all" ? "active" : ""}" data-action="seller-set-listings-kind" data-kind="all">All</button><button type="button" class="segment ${ui.listingsKind === "service" ? "active" : ""}" data-action="seller-set-listings-kind" data-kind="service">Services</button><button type="button" class="segment ${ui.listingsKind === "product" ? "active" : ""}" data-action="seller-set-listings-kind" data-kind="product">Products</button></div></div>
    </div>
    <div class="section-header seller-result-row"><span class="result-count">${narrowed || ui.listingsTab !== "all" ? `${filtered.length} of ${all.length}` : plural(filtered.length, "listing")}</span>${narrowed || ui.listingsTab !== "all" ? `<button class="text-button" data-action="seller-clear-listing-filters">Show everything</button>` : ""}</div>
    ${list || empty}`;
}

function openDeleteListingModal(listing) {
  renderModal(`<div class="eyebrow">Delete listing</div><h2>Delete “${escapeHtml(listing.title)}”?</h2><p class="muted">It disappears from your store. Past orders stay in your history. Consider pausing it instead.</p><div class="modal-actions"><button class="ghost-button" data-action="close-modal">Keep it</button>${listingStatus(listing) === "active" ? `<button class="ghost-button" data-action="seller-toggle-listing-status" data-id="${listing.id}">${icon("pause")} Pause instead</button>` : ""}<button class="danger-button" data-action="seller-confirm-delete-listing" data-id="${listing.id}">${icon("trash")} Delete</button></div>`);
}

/** The listing in the editor with its unsaved changes applied, for the preview card beside the form. */
function draftListing() {
  const listing = getListing(state.seller.editListingId);
  const draft = state.seller.draft;
  const product = listing.kind === "service" ? {} : { condition: draft.condition, availability: draft.availability };
  return { ...listing, ...product, title: draft.title || "Untitled listing", category: draft.category, price: Number(draft.price) || 0, unit: draft.unit, description: draft.description, emoji: draft.emoji || listing.emoji, accent: draft.accent };
}

function sellerListingEditView() {
  const listing = getListing(state.seller.editListingId);
  const draft = state.seller.draft;
  if (!listing || !draft) return sellerListingsView();
  const service = listing.kind === "service";
  const stats = statsFor(listing.id);
  const store = myStore();
  const collectionOptions = `<option value="">No collection</option>${(store?.collections || []).map((collection) => `<option ${collection.name === draft.collection ? "selected" : ""}>${escapeHtml(collection.name)}</option>`).join("")}`;
  const statusChoice = ["active", "paused", "draft"].map((status) => `<button type="button" class="segment ${draft.status === status ? "active" : ""}" data-action="seller-set-draft-status" data-status="${status}">${LISTING_STATUS_LABELS[status]}</button>`).join("");
  const swatches = ACCENTS.map((accent) => `<button type="button" class="swatch ${accent} ${draft.accent === accent ? "active" : ""}" data-action="seller-set-draft-accent" data-accent="${accent}" aria-label="${accent} cover"></button>`).join("");
  const hoursNote = `<div class="field full"><label>When buyers can book</label><p class="field-note">This ${durationMinutes(listing)}-minute service uses your weekly hours. Buyers choose a day, then a time that fits.</p><button type="button" class="ghost-button" data-view="seller-availability">${icon("calendar")} Edit weekly hours</button></div>`;
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
          <div class="field"><label for="edit-collection">Collection</label><select id="edit-collection" data-draft="collection">${collectionOptions}</select><span class="field-note">Collections are how buyers browse your store.</span></div>
          <div class="field full"><label for="edit-description">Description</label><textarea id="edit-description" required data-draft="description">${escapeHtml(draft.description)}</textarea></div>
          <div class="field full"><label for="edit-meeting">${service ? "Where it happens" : "Handoff location"}</label><input id="edit-meeting" data-draft="meeting" value="${escapeHtml(draft.meeting)}" /></div>
          ${service ? hoursNote : productFields}
        </div>
        <div class="button-row" style="margin-top: 18px"><button class="primary-button" type="submit">Save changes ${icon("check")}</button><button class="ghost-button" type="button" data-view="seller-listings">Cancel</button><button class="danger-button" type="button" data-action="seller-delete-listing" data-id="${listing.id}">${icon("trash")} Delete</button></div>
      </form>
      <aside class="editor-side">
        <div class="eyebrow">Live preview</div>
        <div id="seller-listing-preview" class="editor-preview">${listingCard(draftListing())}</div>
        <div class="seller-card editor-stats"><h3>Performance</h3><div class="mini-stats"><span><strong>${formatNumber(stats.views)}</strong> views</span><span><strong>${formatNumber(stats.saves)}</strong> saves</span><span><strong>${formatNumber(stats.messages)}</strong> messages</span><span><strong>${formatNumber(stats.orders)}</strong> orders</span></div><p class="muted small" style="margin:10px 0 0">${stats.views ? `${((stats.orders / stats.views) * 100).toFixed(1)}% of viewers ordered.` : "Stats appear once buyers find this listing."}</p></div>
      </aside>
    </div>`;
}

function sellerNewListingView() {
  return `${sellerHeader({ eyebrow: "New listing", title: "Add to your store", sub: "Publish now or save a draft. Drafts stay hidden from buyers.", back: { view: "seller-listings", label: "Back to listings" } })}${sellView()}`;
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
    <span class="cell" data-label="When"><strong>${escapeHtml(orderWhen(order))}</strong><span class="muted small">Placed ${escapeHtml(timeAgo(order.placedAt))}</span></span>
    <span class="cell" data-label="Amount"><strong>${money(order.amount)}</strong></span>
    <span class="cell" data-label="Status">${statusPill(order.status, orderStatusLabel(order))}</span>
    <span class="cell cell-chevron">${icon("chevron-right")}</span>
  </button>`;
}

function ordersWeekView() {
  const bookings = data.sellerOrders.filter((order) => order.kind === "service" && order.date && ["requested", "confirmed"].includes(order.status));
  const days = Array.from({ length: 7 }, (_, index) => addDays(todayKey(), index));
  return `<div class="week-grid">${days.map((date, index) => {
    const items = bookings.filter((order) => order.date === date).sort((a, b) => clockMinutes(a.time) - clockMinutes(b.time));
    return `<div class="week-col ${index === 0 ? "today" : ""}"><div class="week-day">${dayLabel(date)}</div>${items.length ? items.map((order) => `<button type="button" class="week-event s-${order.status}" data-action="seller-open-order" data-id="${order.id}"><strong>${escapeHtml(order.time)}</strong><span>${escapeHtml(orderListingTitle(order))}</span><span class="muted">${escapeHtml(order.buyer)}</span></button>`).join("") : `<span class="week-empty">Free</span>`}</div>`;
  }).join("")}</div><p class="muted small" style="margin-top:12px">Showing bookings for the next 7 days. Product pickups live under Ready for pickup.</p>`;
}

function sellerOrdersView() {
  const ui = state.seller;
  const tabs = ORDER_TABS.map((tab) => ({ ...tab, count: tab.id === "all" ? data.sellerOrders.length : ordersByStatus(tab.id).length }));
  const orders = ui.ordersTab === "all" ? data.sellerOrders : ordersByStatus(ui.ordersTab);
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
  if (order.status === "completed") return order.reviewRequested ? `<p class="muted small">${icon("check", 14)} Review requested.</p>` : `<button class="ghost-button" data-action="seller-order-thanks" data-id="${id}">${icon("star")} Ask for a review</button>`;
  return "";
}

function sellerOrderView() {
  const order = getSellerOrder(state.seller.selectedOrderId);
  if (!order) return sellerOrdersView();
  const listing = getListing(order.listingId);
  const unitPrice = order.amount / (order.qty || 1);
  const payoutLine = order.status === "completed" ? "Added to your balance" : order.status === "cancelled" ? "No payout · refunded" : "Released after completion";
  return `${sellerHeader({ eyebrow: `${order.kind === "service" ? "Booking" : "Order"} · CC-${order.id.slice(-4).toUpperCase()}`, title: escapeHtml(orderListingTitle(order)), sub: `${escapeHtml(order.buyer)} · placed ${escapeHtml(timeAgo(order.placedAt))}`, back: { action: "seller-back-to-orders", label: "Back to orders" }, actions: `<button class="ghost-button" data-action="seller-message-buyer" data-id="${order.id}">${icon("chat")} Message buyer</button>` })}
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
        ${order.note ? `<div class="buyer-note"><span class="small muted">Note from ${escapeHtml(firstName(order.buyer))}</span><p>“${escapeHtml(order.note)}”</p></div>` : ""}
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

function openOrderReasonModal(order, kind) {
  const decline = kind === "decline";
  const reasons = decline ? ["That time doesn't work for me", "I'm fully booked", "The request is outside what I offer", "Other"] : ["I can no longer make it", "Item is no longer available", "Buyer asked to cancel", "Other"];
  renderModal(`<div class="eyebrow">${decline ? "Decline request" : "Cancel & refund"}</div><h2>${decline ? `Decline ${escapeHtml(firstName(order.buyer))}'s request?` : "Cancel this order?"}</h2><p class="muted">${decline ? "The buyer isn't charged. We'll let them know kindly." : `${escapeHtml(order.buyer)} gets a full refund of ${money(order.amount)}.`}</p><form data-form="seller-order-reason" data-id="${order.id}" data-kind="${kind}"><div class="field"><label for="order-reason">Reason</label><select id="order-reason" name="reason">${reasons.map((reason) => `<option>${reason}</option>`).join("")}</select></div><div class="field" style="margin-top:13px"><label for="order-message">Message to buyer (optional)</label><textarea id="order-message" name="message" placeholder="Suggest another time or say thanks."></textarea></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Keep it</button><button class="danger-button" type="submit">${decline ? "Decline request" : "Cancel & refund"}</button></div></form>`);
}

/** `slots` are the service's open times ({ date, time }), from api.getAvailability. The next two weeks are offered. */
function openRescheduleModal(order, slots) {
  const options = slots.filter((slot) => daysFromToday(slot.date) < 14).map((slot) => `<option value="${slot.date}|${escapeHtml(slot.time)}">${escapeHtml(slotLabel(slot))}</option>`).join("");
  renderModal(`<div class="eyebrow">Reschedule</div><h2>Suggest a new time.</h2><p class="muted">Currently ${escapeHtml(orderWhen(order))}. ${escapeHtml(firstName(order.buyer))} gets a notification to confirm.</p><form data-form="seller-reschedule" data-id="${order.id}"><div class="field"><label for="reschedule-slot">New time</label><select id="reschedule-slot" name="slot" required>${options || `<option value="">No open times in the next two weeks</option>`}</select><span class="field-note">Times come from your weekly hours, with bookings and calendar conflicts removed.</span></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit" ${options ? "" : "disabled"}>Send new time ${icon("arrow")}</button></div></form>`);
}

/* ---------- Ticket scanning ---------- */

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
      <form class="form-card scan-code-card" data-form="seller-scan-code">
        <div class="field"><label for="ticket-code">Ticket code</label><input id="ticket-code" name="code" required maxlength="12" placeholder="e.g. CC7K3M9Q" autocomplete="off" /></div>
        ${banner}
        <button class="primary-button" type="submit">Mark used ${icon("check")}</button>
      </form>
    </div>`;
}

/* ---------- Analytics ---------- */

/** `days` days of activity ending today, or ending `offset` days ago. */
function analyticsWindow(days, offset = 0) {
  const end = data.analytics.days.length - offset;
  return data.analytics.days.slice(Math.max(0, end - days), end);
}

function sumWindow(days) {
  return days.reduce((sum, day) => ({ views: sum.views + day.views, orders: sum.orders + day.orders, earnings: sum.earnings + day.earnings }), { views: 0, orders: 0, earnings: 0 });
}

function pctChange(current, previous) {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

function dateOffsetLabel(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function chartBuckets(days, key) {
  const window = analyticsWindow(days);
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

function svgBarChart(values, labels, { height = 190, format = (value) => formatNumber(value), label = "Chart" } = {}) {
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

function sellerAnalyticsView() {
  const range = state.seller.analyticsRange;
  const current = sumWindow(analyticsWindow(range));
  const previous = sumWindow(analyticsWindow(range, range));
  const conversion = current.views ? (current.orders / current.views) * 100 : 0;
  const previousConversion = previous.views ? (previous.orders / previous.views) * 100 : 0;
  const earnings = chartBuckets(range, "earnings");
  const views = chartBuckets(range, "views");
  const saves = Math.round(current.views * 0.11);
  const messages = Math.round(current.views * 0.045);
  const funnel = [
    { label: "Listing views", value: current.views },
    { label: "Saves", value: saves },
    { label: "Messages", value: messages },
    { label: "Orders", value: current.orders }
  ];
  const listings = myListings().sort((a, b) => statsFor(b.id).orders - statsFor(a.id).orders).slice(0, 6);
  const rangeToggle = `<div class="segmented">${[7, 30, 90].map((days) => `<button class="segment ${range === days ? "active" : ""}" data-action="seller-set-range" data-range="${days}">${days} days</button>`).join("")}</div>`;
  const ratingTotal = Object.values(data.analytics.ratings).reduce((sum, count) => sum + count, 0);
  const store = myStore();
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Analytics", sub: `How buyers find and buy from ${escapeHtml(store?.name || "your store")} over the last ${range} days. Demo data.`, actions: rangeToggle })}
    <div class="kpi-grid">
      ${kpiCard({ label: "Earnings", value: `$${formatNumber(current.earnings)}`, delta: pctChange(current.earnings, previous.earnings), iconName: "wallet" })}
      ${kpiCard({ label: "Orders", value: formatNumber(current.orders), delta: pctChange(current.orders, previous.orders), iconName: "package" })}
      ${kpiCard({ label: "Listing views", value: formatNumber(current.views), delta: pctChange(current.views, previous.views), iconName: "eye" })}
      ${kpiCard({ label: "Conversion", value: `${conversion.toFixed(1)}%`, delta: pctChange(conversion, previousConversion), iconName: "trend-up" })}
    </div>
    <div class="analytics-grid">
      <section class="seller-card chart-card"><div class="seller-card-header"><div><h2>Earnings</h2><p class="muted small">${range > 30 ? "Weekly totals" : "Daily totals"}</p></div><strong class="chart-total">$${formatNumber(current.earnings)}</strong></div>${svgBarChart(earnings.values, earnings.labels, { format: (value) => `$${formatNumber(value)}`, label: "Earnings over time" })}</section>
      <section class="seller-card chart-card"><div class="seller-card-header"><div><h2>Listing views</h2><p class="muted small">${range > 30 ? "Weekly totals" : "Daily totals"}</p></div><strong class="chart-total">${formatNumber(current.views)}</strong></div>${svgLineChart(views.values, views.labels, { label: "Listing views over time" })}</section>
      <section class="seller-card"><div class="seller-card-header"><div><h2>From view to order</h2><p class="muted small">Where buyers drop off</p></div></div><div class="funnel">${funnel.map((step, index) => `<div class="funnel-row"><div class="funnel-copy"><strong>${step.label}</strong><span class="muted small">${formatNumber(step.value)}${index ? ` · ${((step.value / Math.max(funnel[0].value, 1)) * 100).toFixed(1)}%` : ""}</span></div><div class="funnel-track"><span class="funnel-bar" style="width:${Math.max(3, (step.value / Math.max(funnel[0].value, 1)) * 100)}%"></span></div></div>`).join("")}</div></section>
      <section class="seller-card"><div class="seller-card-header"><div><h2>Where buyers come from</h2><p class="muted small">Share of listing views</p></div></div><div class="source-list">${data.analytics.sources.map((source, index) => `<div class="source-row"><span class="source-label"><span class="source-dot" style="background:${SOURCE_COLORS[index % SOURCE_COLORS.length]}"></span>${escapeHtml(source.label)}</span><span class="source-track"><span style="width:${source.share}%;background:${SOURCE_COLORS[index % SOURCE_COLORS.length]}"></span></span><strong>${source.share}%</strong></div>`).join("")}</div></section>
    </div>
    ${premiumBanner("Turn a good profile into a full storefront.", "Premium adds featured placement, extra profile sections and a clearer view of who is looking at your listings.", "See what Premium includes")}
    <section class="seller-card analytics-wide"><div class="seller-card-header"><div><h2>Top listings</h2><p class="muted small">All-time performance</p><button class="text-button" data-view="seller-listings">Manage listings ${icon("arrow")}</button></div></div>
      <div class="seller-table top-table"><div class="seller-table-head"><span>Listing</span><span>Views</span><span>Saves</span><span>Orders</span><span>Conversion</span></div>${listings.map((listing) => { const stats = statsFor(listing.id); return `<div class="seller-row"><div class="cell cell-main"><button type="button" class="row-title" data-action="seller-edit-listing" data-id="${listing.id}">${listingThumb(listing)}<span><span class="activity-title">${escapeHtml(listing.title)}</span><span class="activity-sub">${money(listing.price)} · ${LISTING_STATUS_LABELS[listingStatus(listing)]}</span></span></button></div><div class="cell" data-label="Views"><strong>${formatNumber(stats.views)}</strong></div><div class="cell" data-label="Saves"><strong>${formatNumber(stats.saves)}</strong></div><div class="cell" data-label="Orders"><strong>${formatNumber(stats.orders)}</strong></div><div class="cell" data-label="Conversion"><strong>${stats.views ? ((stats.orders / stats.views) * 100).toFixed(1) : "0.0"}%</strong></div></div>`; }).join("")}</div>
    </section>
    <section class="seller-card analytics-wide"><div class="seller-card-header"><div><h2>Ratings</h2><p class="muted small">${ratingTotal} reviews on your store</p><button class="text-button" data-view="seller-reviews">Reviews ${icon("arrow")}</button></div></div><div class="rating-breakdown">${[5, 4, 3, 2, 1].map((stars) => `<div class="rating-row"><span>${stars} ★</span><span class="source-track"><span style="width:${(data.analytics.ratings[stars] / Math.max(ratingTotal, 1)) * 100}%;background:#e7a900"></span></span><span class="muted small">${data.analytics.ratings[stars]}</span></div>`).join("")}</div></section>`;
}

/* ---------- Messages ---------- */

const SELLER_QUICK_REPLIES = [
  "Thanks! I'll confirm in just a bit.",
  "Meet me at the Love Library steps.",
  "Your order is ready for pickup.",
  "Running five minutes late, see you soon!",
  "Bring two outfits if you want variety."
];

function sellerInboxView() {
  const header = sellerHeader({ eyebrow: "Seller Hub", title: "Messages", sub: "Every conversation stays linked to the order or listing it's about." });
  const active = selectedConversation();
  if (!active) return `${header}<div class="empty-state"><div class="empty-shape">✉</div><h3>No messages yet.</h3><p class="muted">When a buyer asks a question or books, the conversation shows up here.</p></div>`;
  const filter = state.seller.inboxFilter;
  const list = data.conversations.filter((conversation) => filter === "all" || conversation.unread);
  const contextOrder = getSellerOrder(active.orderId);
  const rows = list.length
    ? list.map((conversation) => `<button class="conversation-row ${conversation.id === active.id ? "active" : ""}" data-action="select-conversation" data-id="${conversation.id}">${buyerAvatar(conversation)}<span class="conversation-content"><span class="conversation-top"><span class="conversation-name">${escapeHtml(conversation.name)}</span><span class="conversation-time">${escapeHtml(conversationTime(conversation))}</span></span><span class="conversation-preview">${escapeHtml(conversationPreview(conversation))}</span>${conversation.done ? `<span class="conversation-done">${icon("check", 12)} Done</span>` : ""}</span>${conversation.unread ? `<span class="unread-dot" aria-label="Unread"></span>` : ""}</button>`).join("")
    : `<p class="muted small" style="padding: 18px">No unread messages. Nice work.</p>`;
  return `${header}
    <div class="inbox-layout seller-inbox">
      <aside class="conversation-list"><div class="conversation-header seller-conversation-header"><h2>Buyers</h2><div class="segmented"><button class="segment ${filter === "all" ? "active" : ""}" data-action="seller-set-inbox-filter" data-filter="all">All</button><button class="segment ${filter === "unread" ? "active" : ""}" data-action="seller-set-inbox-filter" data-filter="unread">Unread</button></div></div>${rows}</aside>
      <section class="chat-panel">
        <div class="chat-header"><div class="chat-person">${buyerAvatar(active)}<div><strong>${escapeHtml(active.name)}</strong><button type="button" class="context-chip" data-action="seller-open-context" data-id="${active.id}">${icon(contextOrder ? "package" : "eye", 12)} ${escapeHtml(active.context)}${contextOrder ? ` · ${escapeHtml(orderStatusLabel(contextOrder))}` : ""}</button></div></div>
          <div class="button-row"><button class="ghost-button compact ${active.done ? "is-done" : ""}" data-action="seller-toggle-done" data-id="${active.id}">${icon("check")} ${active.done ? "Done" : "Mark as done"}</button><button class="icon-button" data-action="open-report" aria-label="Report conversation">${icon("shield")}</button></div></div>
        <div class="chat-messages">${messageBubbles(active.messages, `This is the start of your conversation with ${active.name}.`)}</div>
        <div class="quick-reply-chips" aria-label="Saved replies">${SELLER_QUICK_REPLIES.map((reply) => `<button type="button" class="quick-reply" data-action="seller-quick-reply" data-text="${escapeHtml(reply)}">${escapeHtml(reply)}</button>`).join("")}</div>
        <form class="chat-composer" data-form="send-message"><textarea name="message" placeholder="Reply to ${escapeHtml(firstName(active.name))}…" aria-label="Write a reply" rows="1"></textarea><button class="primary-button" type="submit" aria-label="Send message">${icon("arrow")}</button></form>
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

function sellerNotificationsView() {
  const filter = state.seller.notificationsFilter;
  const list = data.notifications.filter((notification) => filter === "all" || notification.category === filter);
  const chips = NOTIFICATION_FILTERS.map((entry) => { const count = data.notifications.filter((notification) => entry.id === "all" || notification.category === entry.id).length; return `<button type="button" class="filter-button ${filter === entry.id ? "active" : ""}" data-action="seller-set-notifications-filter" data-filter="${entry.id}">${entry.label} · ${count}</button>`; }).join("");
  const unread = data.notifications.filter((notification) => notification.unread).length;
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Notifications", sub: unread ? `${unread} unread. Tap one to jump straight to it.` : "You're all caught up.", actions: `<button class="ghost-button" data-action="seller-open-notification-settings">${icon("settings")} Settings</button><button class="primary-button" data-action="mark-all-notifications-read">${icon("check")} Mark all read</button>` })}
    <div class="seller-chip-row" style="margin-bottom:16px">${chips}</div>
    ${list.length ? `<div class="seller-notification-list">${list.map((notification) => `<button type="button" class="seller-notification ${notification.unread ? "unread" : ""}" data-action="open-notification" data-id="${notification.id}"><span class="activity-thumb ${notification.accent}">${notification.emoji}</span><span class="seller-notification-copy"><span class="notification-popover-top"><strong>${escapeHtml(notification.title)}</strong><span class="muted small">${escapeHtml(timeAgo(notification.at))}</span></span><span class="muted small">${escapeHtml(notification.body)}</span></span>${notification.unread ? `<span class="unread-dot" aria-label="Unread"></span>` : ""}${icon("chevron-right")}</button>`).join("")}</div>`
      : `<div class="empty-state"><div class="empty-shape">🔔</div><h3>Nothing here yet.</h3><p class="muted">Try another filter.</p></div>`}`;
}

/* ---------- Profile and settings ---------- */

function sellerProfileSections() {
  const unreplied = data.reviews.filter((review) => !review.reply).length;
  return [
    { id: "public", label: "Public profile", hint: "What buyers see", icon: "user" },
    { id: "verification", label: "Verification", hint: "Badges and trust", icon: "shield" },
    { id: "availability", label: "Availability", hint: data.sellerSettings.awayMode ? "Away mode is on" : data.calendar.connected ? "Calendar synced" : "Away mode and booking", icon: "calendar" },
    { id: "notifications", label: "Notifications", hint: "Orders, messages, reviews", icon: "bell" },
    { id: "reviews", label: "Reviews", hint: unreplied ? `${unreplied} need a reply` : "All replied", icon: "star", view: "seller-reviews" },
    { id: "payouts", label: "Payouts", hint: `${dollars(data.payouts.available)} available`, icon: "wallet", view: "seller-payouts" },
    { id: "account", label: "Account", hint: "Switch or sign out", icon: "settings" }
  ];
}

function sellerProfilePublic(seller) {
  return `<form class="settings-form" data-form="seller-save-profile">
    <div class="seller-hero seller-hero-preview"><div class="seller-hero-main"><div class="seller-avatar">${escapeHtml(seller.initials)}</div><div>${studentVerifiedPill()}<h2>${escapeHtml(seller.name)}</h2><p class="muted" style="margin:0">${escapeHtml(seller.campus)} · ${escapeHtml(seller.handle)}</p><div class="seller-stats"><span><strong>${seller.rating}</strong> ★</span><span><strong>${seller.reviews}</strong> reviews</span><span><strong>${seller.completed}</strong> completed</span><span>Replies in <strong>${escapeHtml(seller.response)}</strong></span></div></div></div></div>
    <div class="form-grid">
      <div class="field"><label for="profile-name">Display name</label><input id="profile-name" name="name" required maxlength="48" value="${escapeHtml(seller.name)}" /></div>
      <div class="field"><label for="profile-handle">Handle</label><input id="profile-handle" name="handle" required maxlength="24" value="${escapeHtml(seller.handle)}" /></div>
      <div class="field full"><label for="profile-campus">Campus line</label><input id="profile-campus" name="campus" maxlength="60" value="${escapeHtml(seller.campus)}" /><span class="field-note">Year and major help buyers feel like they know you.</span></div>
      <div class="field full"><label for="profile-bio">Bio</label><textarea id="profile-bio" name="bio" maxlength="240">${escapeHtml(seller.bio)}</textarea></div>
      <div class="field"><label for="profile-response">Response-time goal</label><select id="profile-response" name="response">${Object.keys(RESPONSE_GOALS).map((option) => `<option ${option === seller.response ? "selected" : ""}>${option}</option>`).join("")}</select></div>
    </div>
    <div class="button-row" style="margin-top: 16px"><button class="primary-button" type="submit">Save profile ${icon("check")}</button><button class="ghost-button" type="button" data-action="seller-preview-profile">${icon("eye")} View public profile</button></div>
  </form>`;
}

function sellerProfileVerification() {
  const phone = data.sellerSettings.backupPhone;
  const rows = [
    { done: true, title: "Student verified", body: "Confirmed with an @sdsu.edu email. Shown on every listing." },
    { done: true, title: "Certified photographer", body: "Shown as a caption on your photography services." },
    { done: true, title: "Payout account", body: `${escapeHtml(data.payouts.method)} confirmed for payouts.` },
    { done: Boolean(phone), title: "Backup phone number", body: phone ? `${escapeHtml(phone)} is on file as a recovery option.` : "Adds a recovery option and faster support." }
  ];
  return `<div class="settings-group"><h2>Verification</h2><p class="muted small">Badges show what was checked. They don't guarantee quality or university endorsement.</p>
    <div class="verify-list">${rows.map((row) => `<div class="settings-row"><div class="verify-row"><span class="trust-icon ${row.done ? "" : "pending"}">${icon(row.done ? "verified" : "clock")}</span><div class="settings-row-copy"><strong>${row.title}</strong><p class="muted small">${row.body}</p></div></div>${row.done ? statusPill("active", "Verified") : `<button class="ghost-button compact" data-action="seller-add-phone">Add</button>`}</div>`).join("")}</div>
    <div class="trust-note" style="margin-top:16px">In the real app, the verification method and support path would be explained in plain language.</div></div>`;
}

function sellerAvailabilitySettings() {
  const openDays = WEEK_DAYS.filter((day) => data.schedule.days[day.id].length);
  const slotDetail = openDays.length
    ? `Weekly hours on ${openDays.map((day) => day.short).join(", ")}. Buyers pick a day, then a time.`
    : "Add weekly hours so buyers have times to book.";
  const calendarCopy = data.calendar.connected
    ? `Synced with ${escapeHtml(data.calendar.email)}. Busy times stay closed, and accepted bookings are added.`
    : "Block times you're already busy, and add accepted bookings to your calendar.";
  const calendarAction = data.calendar.connected
    ? `<button class="ghost-button compact" data-view="seller-availability">${icon("calendar")} Manage</button>`
    : `<button class="ghost-button compact" data-action="seller-connect-google">${icon("calendar")} Connect</button>`;
  return `<div class="settings-group"><h2>Availability</h2><p class="muted small">Control when buyers can book and buy.</p>
    ${sellerSettingsRow("awayMode", "Away mode", "Pause every active listing at once, for finals or a trip. Turning it off restores them.")}
    ${sellerSettingsRow("instantBook", "Instant booking", "Let buyers book open slots without waiting for you to accept.")}
    <div class="settings-row"><div class="settings-row-copy"><strong>Google Calendar</strong><p class="muted small">${calendarCopy}</p></div>${calendarAction}</div>
    <div class="settings-row"><div class="settings-row-copy"><strong>Weekly hours</strong><p class="muted small">${slotDetail}</p></div><button class="ghost-button compact" data-view="seller-availability">${icon("calendar")} Manage</button></div></div>`;
}

function sellerProfileSection() {
  const seller = mySeller();
  const section = state.seller.profileSection;
  if (section === "verification") return sellerProfileVerification();
  if (section === "availability") return sellerAvailabilitySettings();
  if (section === "notifications") return `<div class="settings-group"><h2>What should reach you</h2><p class="muted small">These stay in the app for this prototype. Nothing is emailed.</p>
    ${sellerSettingsRow("notifyRequests", "New orders and requests", "Bookings, purchases and cancellations.")}
    ${sellerSettingsRow("notifyMessages", "Buyer messages", "When a buyer asks a question or replies.")}
    ${sellerSettingsRow("notifyReviews", "Reviews", "When a buyer leaves a review you can reply to.")}
    ${sellerSettingsRow("notifyPayouts", "Payouts", "When money is sent to your account.")}
    ${sellerSettingsRow("notifyDigest", "Weekly summary", "A Monday recap of views, orders and earnings.")}</div>`;
  if (section === "account") return `<div class="settings-group"><h2>Account</h2><p class="muted small">You're signed in to the Seller Hub demo as ${escapeHtml(seller.name)}.</p>
    <div class="settings-row"><div class="settings-row-copy"><strong>Switch to buying</strong><p class="muted small">Browse Campus Connect as Katarina, the buyer demo account.</p></div><button class="ghost-button" data-action="switch-mode">${icon("repeat")} Switch</button></div>
    <div class="settings-safety"><h3>Support and safety</h3><div class="button-row"><button type="button" class="ghost-button" data-action="open-help">${icon("help")} Get help</button><button type="button" class="ghost-button" data-action="open-report">${icon("shield")} Report a buyer</button></div></div>
    <div class="settings-signout"><div><strong>Sign out</strong><p class="muted small">Signing out starts the demo over.</p></div><button type="button" class="danger-button" data-action="sign-out">${icon("logout")} Sign out</button></div></div>`;
  return sellerProfilePublic(seller);
}

function sellerProfileView() {
  const nav = sellerProfileSections().map((item) => `<button type="button" class="settings-nav-item ${item.id === state.seller.profileSection ? "active" : ""}" ${item.view ? `data-view="${item.view}"` : `data-action="seller-set-profile-section" data-section="${item.id}"`}><span class="trust-icon">${icon(item.icon)}</span><span class="settings-nav-copy"><span class="settings-nav-label">${item.label}</span><span class="muted small">${escapeHtml(item.hint)}</span></span></button>`).join("");
  return `<div class="settings-page">${sellerHeader({ eyebrow: "Seller Hub", title: "Profile", sub: "How you show up to buyers, plus your seller settings.", actions: `<button class="ghost-button" data-action="seller-preview-profile">${icon("eye")} View public profile</button>` })}
    <div class="settings-layout"><aside class="settings-nav" aria-label="Profile sections">${nav}</aside><section class="settings-panel">${sellerProfileSection()}</section></div></div>`;
}

function openPhoneModal() {
  renderModal(`<div class="eyebrow">Verification</div><h2>Add a backup phone number.</h2><p class="muted">Adds a recovery option and faster support. Demo only, so no text is sent.</p><form data-form="seller-save-phone"><div class="field"><label for="backup-phone">Phone number</label><input id="backup-phone" name="backupPhone" type="tel" required autocomplete="tel" pattern="[0-9()+. \\-]{7,20}" placeholder="(619) 555-0142" /></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Save number ${icon("check")}</button></div></form>`);
}

/* ---------- Weekly hours ---------- */

const WEEK_DAYS = [
  { id: "sun", name: "Sunday", short: "Sun" },
  { id: "mon", name: "Monday", short: "Mon" },
  { id: "tue", name: "Tuesday", short: "Tue" },
  { id: "wed", name: "Wednesday", short: "Wed" },
  { id: "thu", name: "Thursday", short: "Thu" },
  { id: "fri", name: "Friday", short: "Fri" },
  { id: "sat", name: "Saturday", short: "Sat" }
];

/** Weekly hours run from 7:00 AM to 9:00 PM in quarter hours. Times are minutes after midnight. */
const DAY_START = 7 * 60;
const DAY_END = 21 * 60;
const SCHEDULE_TIMES = Array.from({ length: (DAY_END - DAY_START) / 15 + 1 }, (_, index) => DAY_START + index * 15);

function timeOptions(selected) {
  const times = SCHEDULE_TIMES.includes(selected) ? SCHEDULE_TIMES : [selected, ...SCHEDULE_TIMES];
  return times.map((minutes) => `<option value="${minutes}" ${minutes === selected ? "selected" : ""}>${clockLabel(minutes)}</option>`).join("");
}

function hoursRangeEditor(day, ranges) {
  if (!ranges.length) return `<span class="hours-unavailable muted">Unavailable</span>`;
  return ranges.map((range, index) => `<div class="hours-range"><select aria-label="${day.name} start" data-schedule-day="${day.id}" data-schedule-index="${index}" data-schedule-field="start">${timeOptions(range.start)}</select><span aria-hidden="true">–</span><select aria-label="${day.name} end" data-schedule-day="${day.id}" data-schedule-index="${index}" data-schedule-field="end">${timeOptions(range.end)}</select>${ranges.length > 1 ? `<button type="button" class="icon-button" data-action="seller-schedule-remove" data-day="${day.id}" data-index="${index}" aria-label="Remove ${day.name} hours">${icon("close")}</button>` : ""}</div>`).join("");
}

/** `state.seller.hoursPreview` is a booking (see loadBooking in ui.js) for the service picked under "What buyers see". */
function sellerAvailabilityView() {
  const ui = state.seller;
  const services = myListings().filter((listing) => listing.kind === "service");
  const hours = WEEK_DAYS.map((day) => {
    const ranges = data.schedule.days[day.id];
    const on = ranges.length > 0;
    const copy = ui.scheduleCopy?.from === day.id
      ? `<div class="hours-copy"><strong>Copy ${day.name}'s hours to</strong><div class="copy-days">${WEEK_DAYS.filter((other) => other.id !== day.id).map((other) => `<button type="button" class="copy-day ${ui.scheduleCopy.targets.includes(other.id) ? "on" : ""}" data-action="seller-schedule-copy-toggle" data-day="${other.id}" aria-pressed="${ui.scheduleCopy.targets.includes(other.id)}">${other.short}</button>`).join("")}</div><button type="button" class="primary-button compact" data-action="seller-schedule-copy-apply">Apply</button></div>`
      : "";
    return `<div class="hours-row ${on ? "" : "is-off"}"><button type="button" class="settings-switch ${on ? "on" : ""}" role="switch" aria-checked="${on}" aria-label="${day.name} availability" data-action="seller-schedule-toggle" data-day="${day.id}"><span class="settings-switch-knob"></span></button><div class="hours-main"><div class="hours-line"><span class="hours-name">${day.name}</span><div class="hours-ranges">${hoursRangeEditor(day, ranges)}</div>${on ? `<div class="hours-tools"><button type="button" class="icon-button" data-action="seller-schedule-add" data-day="${day.id}" aria-label="Add hours on ${day.name}">${icon("plus")}</button><button type="button" class="icon-button" data-action="seller-schedule-copy" data-day="${day.id}" aria-label="Copy ${day.name}'s hours">${icon("copy")}</button></div>` : ""}</div>${copy}</div></div>`;
  }).join("");
  const calendar = data.calendar.connected
    ? `<div class="calendar-account"><span class="trust-icon">${icon("calendar")}</span><div><strong>${escapeHtml(data.calendar.email)}</strong><span class="muted small">Busy times stay closed. Accepted bookings are added here.</span></div>${statusPill("active", "Synced")}</div><ul class="busy-list">${data.calendar.events.map((event) => `<li><strong>${escapeHtml(slotLabel(event))}</strong><span>${escapeHtml(event.title)}</span></li>`).join("")}</ul><button type="button" class="ghost-button" data-action="seller-disconnect-google">Disconnect</button>`
    : `<p class="muted small">Buyers won't be offered a time that overlaps an event. Accepted bookings get added to the same calendar. This demo stays in the browser.</p><button type="button" class="primary-button" data-action="seller-connect-google">${icon("calendar")} Connect Google Calendar</button>`;
  const preview = ui.hoursPreview
    ? `<div class="preview-body"><label class="preview-service"><span class="small muted">Service</span><select data-preview-listing aria-label="Service to preview">${services.map((item) => `<option value="${item.id}" ${item.id === ui.hoursPreview.listingId ? "selected" : ""}>${escapeHtml(item.title)} · ${durationMinutes(item)} min</option>`).join("")}</select></label>${bookingCalendar(ui.hoursPreview, { dateAction: "seller-preview-date", monthAction: "seller-preview-month", slotAction: "seller-preview-slot" })}<p class="field-note">Booked sessions${data.calendar.connected ? " and Google Calendar events" : ""} are already left out.</p></div>`
    : `<p class="muted">Add a service to preview what buyers can book.</p>`;
  const away = data.sellerSettings.awayMode ? `<p class="field-note">Away mode is on, so these hours are hidden until you turn it off.</p>` : "";
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Weekly hours", sub: "Buyers only see times inside these hours. Each service uses its own length.", back: { action: "seller-back-availability", label: "Back to availability" } })}
    ${away}
    <div class="availability-layout">
      <section class="seller-card hours-card"><div class="seller-card-header"><div><h2>Weekly hours</h2><p class="muted small">${escapeHtml(data.schedule.timezone)} · San Diego</p></div></div><div class="hours-list">${hours}</div></section>
      <section class="seller-card calendar-card"><div class="seller-card-header"><div><h2>Google Calendar</h2></div></div>${calendar}</section>
      <section class="seller-card availability-preview"><div class="seller-card-header"><div><h2>What buyers see</h2><p class="muted small">A day, then a time. Same as the booking page.</p></div></div>${preview}</section>
    </div>`;
}

/* ---------- Store ---------- */

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
      <div class="store-manage-stats"><span><strong>${store.sales}</strong> sales</span><span><strong>${store.rating}</strong> ★</span><span><strong>${active}/${listings.length}</strong> live</span></div>
      ${store.announcement ? `<div class="store-announcement compact"><span class="trust-icon">${icon("megaphone")}</span><span>${escapeHtml(store.announcement)}</span></div>` : ""}
      <div class="button-row"><button class="primary-button" data-action="seller-edit-store" data-id="${store.id}">${icon("edit")} Edit store</button><button class="ghost-button" data-action="seller-preview-store" data-id="${store.id}">${icon("eye")} Preview</button><button class="ghost-button" data-action="seller-post-announcement">${icon("megaphone")} Announcement</button><button class="icon-button" data-action="share" data-path="store/${store.id}" aria-label="Share ${escapeHtml(store.name)}">${icon("share")}</button></div>
    </div>
  </article>`;
}

function sellerStoresView() {
  const store = myStore();
  if (!store) return `${sellerHeader({ eyebrow: "Seller Hub", title: "Your store", sub: "A profile has one store." })}<div class="empty-state"><div class="empty-shape">⌁</div><h3>No store on this profile.</h3><p class="muted">Listings, collections and policies all belong to that one store.</p></div>`;
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Your store", sub: "A profile has one store, and every listing lives here." })}
    <div class="store-manage-grid store-manage-single">${storeManageCard(store)}</div>`;
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
  return `${sellerHeader({ eyebrow: "Edit store", title: escapeHtml(store.name), sub: plural(storeItems.length, "listing"), back: { view: "seller-stores", label: "Back to your store" }, actions: `<button class="ghost-button" data-action="seller-preview-store" data-id="${store.id}">${icon("eye")} Preview store</button>` })}
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
        <div class="button-row" style="margin-top: 22px"><button class="primary-button" type="submit">Save store ${icon("check")}</button><button class="ghost-button" type="button" data-view="seller-stores">Cancel</button></div>
      </form>
      <aside class="editor-side"><div class="eyebrow">Card preview</div><div id="seller-store-preview" class="editor-preview">${storeCard(draftStore())}</div><div class="trust-note" style="margin-top:14px">Policies are shown to buyers again before checkout.</div></aside>
    </div>`;
}

function openAnnouncementModal() {
  const store = myStore();
  if (!store) return;
  renderModal(`<div class="eyebrow">Store announcement</div><h2>Tell students visiting ${escapeHtml(store.name)} something.</h2><p class="muted">It shows at the top of your store page until you change it.</p><form data-form="seller-announcement"><div class="field"><label for="announce-text">Announcement</label><input id="announce-text" name="text" required maxlength="100" value="${escapeHtml(store.announcement || "")}" placeholder="e.g. Grad season weekends are filling up fast." /></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Post ${icon("megaphone")}</button></div></form>`);
}

/* ---------- Reviews ---------- */

function sellerReviewsView() {
  const filter = state.seller.reviewsFilter;
  const list = data.reviews.filter((review) => filter === "all" || (filter === "reply" ? !review.reply : filter === "3" ? review.rating <= 3 : review.rating === Number(filter)));
  const average = data.reviews.length ? (data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length).toFixed(1) : "–";
  const chips = [{ id: "all", label: "All" }, { id: "reply", label: "Needs reply" }, { id: "5", label: "5 ★" }, { id: "4", label: "4 ★" }, { id: "3", label: "3 ★ and below" }]
    .map((chip) => `<button type="button" class="filter-button ${filter === chip.id ? "active" : ""}" data-action="seller-set-reviews-filter" data-filter="${chip.id}">${chip.label}</button>`).join("");
  const rows = list.map((review) => {
    const listing = getListing(review.listingId);
    return `<article class="store-review"><div class="store-review-top"><div><strong>${escapeHtml(review.author)}</strong> <span class="muted small">· ${escapeHtml(timeAgo(review.at))}</span></div><span class="store-review-stars" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span></div><p>“${escapeHtml(review.text)}”</p>${listing ? `<span class="store-review-listing">${listing.emoji} ${escapeHtml(listing.title)}</span>` : ""}
      ${review.reply ? `<div class="review-reply"><span class="small"><strong>Your reply</strong></span><p>${escapeHtml(review.reply)}</p></div>` : `<form class="review-reply-form" data-form="seller-review-reply" data-id="${review.id}"><textarea name="reply" rows="2" required placeholder="Thank ${escapeHtml(firstName(review.author))} or add context…" aria-label="Reply to ${escapeHtml(review.author)}"></textarea><button class="primary-button" type="submit">Reply</button></form>`}</article>`;
  }).join("");
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Reviews", sub: "Every review comes from a completed booking or pickup. Replies are public.", back: { view: "seller-profile", label: "Back to profile" } })}
    <div class="store-reviews"><div class="store-review-summary"><div class="store-review-score">${average}</div><div><div class="store-review-stars large">★★★★★</div><p class="muted small" style="margin:4px 0 0">${plural(data.reviews.length, "recent review")} · ${data.reviews.filter((review) => !review.reply).length} without a reply</p></div></div>
      <div><div class="seller-chip-row" style="margin-bottom:14px">${chips}</div><div class="store-review-list">${rows || `<div class="empty-state seller-empty"><div class="empty-shape">★</div><h3>Nothing here.</h3><p class="muted">Try another filter.</p></div>`}</div></div></div>`;
}

/* ---------- Payouts ---------- */

function sellerPayoutsView() {
  const thisMonth = data.payouts.history.filter((payout) => payout.at.slice(0, 7) === new Date().toISOString().slice(0, 7));
  const paidThisMonth = thisMonth.filter((payout) => payout.status === "Paid").reduce((sum, payout) => sum + payout.amount, 0);
  return `${sellerHeader({ eyebrow: "Seller Hub", title: "Payouts", sub: "Money from completed orders lands in your balance. Campus Connect charges no seller fees in this demo.", back: { view: "seller-profile", label: "Back to profile" }, actions: `<button class="primary-button" data-action="seller-withdraw" ${data.payouts.available > 0 ? "" : "disabled"}>${icon("wallet")} Withdraw</button>` })}
    <div class="kpi-grid">
      ${kpiCard({ label: "Available now", value: dollars(data.payouts.available), hint: "Ready to withdraw", iconName: "wallet" })}
      ${kpiCard({ label: "Pending", value: dollars(data.payouts.pending), hint: "From accepted, not yet completed orders", iconName: "clock" })}
      ${kpiCard({ label: `Paid out in ${new Date().toLocaleDateString("en-US", { month: "long" })}`, value: dollars(paidThisMonth), hint: plural(thisMonth.length, "payout"), iconName: "check" })}
      ${kpiCard({ label: "Next automatic payout", value: "Mon", hint: data.payouts.schedule, iconName: "calendar" })}
    </div>
    <div class="analytics-grid">
      <section class="seller-card"><div class="seller-card-header"><div><h2>History</h2></div></div><div class="seller-table payouts-table"><div class="seller-table-head"><span>Date</span><span>Destination</span><span>Amount</span><span>Status</span></div>${data.payouts.history.map((payout) => `<div class="seller-row"><div class="cell" data-label="Date"><strong>${escapeHtml(longDate(payout.at))}</strong></div><div class="cell" data-label="To"><span class="muted small">${escapeHtml(data.payouts.method)}</span></div><div class="cell" data-label="Amount"><strong>${dollars(payout.amount)}</strong></div><div class="cell" data-label="Status">${statusPill(payout.status === "Paid" ? "completed" : "requested", payout.status)}</div></div>`).join("")}</div></section>
      <section class="seller-card"><div class="seller-card-header"><div><h2>Payout method</h2></div></div><div class="payout-method"><span class="trust-icon">${icon("wallet")}</span><div><strong>${escapeHtml(data.payouts.method)}</strong><span class="muted small">${escapeHtml(data.payouts.schedule)} · usually arrives in 1–2 business days</span></div><button class="ghost-button compact" data-action="seller-change-method">Change</button></div><div class="trust-note" style="margin-top:14px">Keep every payment on Campus Connect. Buyers are protected and you're covered if something goes wrong.</div></section>
    </div>`;
}

function openWithdrawModal() {
  renderModal(`<div class="eyebrow">Withdraw</div><h2>Send money to ${escapeHtml(data.payouts.method)}.</h2><p class="muted">${dollars(data.payouts.available)} is available. Demo only, so no money moves.</p><form data-form="seller-withdraw"><div class="field"><label for="withdraw-amount">Amount ($)</label><input id="withdraw-amount" name="amount" type="number" min="1" step="0.01" max="${data.payouts.available.toFixed(2)}" value="${data.payouts.available.toFixed(2)}" required /></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Withdraw ${icon("arrow")}</button></div></form>`);
}

function openPayoutMethodModal() {
  renderModal(`<div class="eyebrow">Payout method</div><h2>Where should payouts go?</h2><p class="muted">Payouts go to ${escapeHtml(data.payouts.method)} now. Demo only, so no bank is contacted.</p><form data-form="seller-payout-method"><div class="form-grid"><div class="field"><label for="payout-type">Account type</label><select id="payout-type" name="type"><option>Checking</option><option>Savings</option></select></div><div class="field"><label for="payout-last4">Last four digits</label><input id="payout-last4" name="last4" required inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" placeholder="4821" /></div></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Save method ${icon("check")}</button></div></form>`);
}

/* ---------- Views ---------- */

/* A buyer view opened from the Seller Hub is a preview: the same page under a banner that leads back. */
Object.entries(VIEWS).forEach(([name, view]) => {
  VIEWS[name] = () => `${sellerPreviewBanner()}${view()}`;
});

const sellerPage = (view) => () => `<div class="seller-page">${view()}</div>`;

Object.assign(VIEWS, {
  "seller-dashboard": sellerPage(sellerDashboardView),
  "seller-listings": sellerPage(sellerListingsView),
  "seller-listing-edit": sellerPage(sellerListingEditView),
  "seller-new": sellerPage(sellerNewListingView),
  "seller-orders": sellerPage(sellerOrdersView),
  "seller-order": sellerPage(sellerOrderView),
  "seller-scan": sellerPage(sellerScanView),
  "seller-analytics": sellerPage(sellerAnalyticsView),
  "seller-inbox": sellerPage(sellerInboxView),
  "seller-notifications": sellerPage(sellerNotificationsView),
  "seller-profile": sellerPage(sellerProfileView),
  "seller-availability": sellerPage(sellerAvailabilityView),
  "seller-stores": sellerPage(sellerStoresView),
  "seller-store-edit": sellerPage(sellerStoreEditView),
  "seller-reviews": sellerPage(sellerReviewsView),
  "seller-payouts": sellerPage(sellerPayoutsView)
});

Object.assign(NAV_PARENTS, {
  "seller-order": "seller-orders",
  "seller-scan": "seller-orders",
  "seller-listing-edit": "seller-listings",
  "seller-new": "seller-listings",
  "seller-store-edit": "seller-stores",
  "seller-reviews": "seller-profile",
  "seller-payouts": "seller-profile",
  "seller-availability": "seller-profile",
  listing: "seller-listings",
  store: "seller-stores",
  seller: "seller-profile"
});
