/** Buyer views. Each function returns markup built from `data` and `state`. Nothing here changes either one. */

/* ---------- Listing cards ---------- */

function listingConditionLabel(listing) {
  if (listing.kind !== "product") return "";
  return listing.condition || "Good condition";
}

function merchandiseTypeLabel(listingOrType) {
  const type = typeof listingOrType === "string" ? listingOrType : listingOrType?.merchandiseType;
  return type === "new" ? "New & student-made" : type === "resale" ? "Pre-owned" : "";
}

function listingCertificationLabel(listing) {
  const certification = listing.certification || getSeller(listing.sellerId)?.certification;
  return listing.kind === "service" && certification ? `Certified ${certification}` : "";
}

/** Shown in place of a page whose listing, order, store or profile no longer exists. */
function missingView(what) {
  return `<div class="empty-state"><div class="empty-shape">⌁</div><h3>That ${what} is no longer here.</h3><p class="muted">It may have been removed since you last saw it.</p><button class="primary-button" data-action="go-home">Back to the start ${icon("arrow")}</button></div>`;
}

function listingProductMetaLine(listing) {
  if (listing.kind !== "product") return "";
  return [merchandiseTypeLabel(listing), listing.availability].filter(Boolean).join(" · ");
}

function shortCardText(text, maxLength = 72) {
  const trimmed = String(text || "").trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const base = (lastSpace > 24 ? slice.slice(0, lastSpace) : slice).trim();
  return `${base}…`;
}

function ticketHost(listing) {
  return listing.host || listing.seller || "Campus event";
}

function ticketSchedule(listing) {
  if (listing.date || listing.time || listing.location) return [listing.date, listing.time, listing.location].filter(Boolean).join(" · ");
  return [listing.availability, listing.meeting].filter(Boolean).join(" · ");
}

function ticketPriceLabel(amount) {
  const value = Number(amount);
  if (!value) return "Free";
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function ticketListingCard(listing) {
  const blurb = listing.summary || listing.description;
  return `<article class="board-card ticket-card">
    <button type="button" class="board-card-button" data-action="open-listing" data-id="${listing.id}">
      <span class="board-card-visual ${listing.accent}"><span class="board-card-emoji" aria-hidden="true">${listing.emoji}</span></span>
      <span class="board-card-body">
        <span class="board-card-kicker">${escapeHtml(ticketHost(listing))}</span>
        <span class="board-card-title">${escapeHtml(listing.title)}</span>
        <span class="board-card-meta">${escapeHtml(ticketSchedule(listing))}</span>
        ${blurb ? `<span class="board-card-summary">${escapeHtml(shortCardText(blurb, 90))}</span>` : ""}
        <span class="board-card-price">${ticketPriceLabel(listing.price)}</span>
      </span>
    </button>
  </article>`;
}

function listingCardMetaHtml(listing) {
  const meta =
    listing.kind === "product"
      ? listingProductMetaLine(listing)
      : listing.kind === "ticket"
        ? [listing.availability, listing.meeting].filter(Boolean).join(" · ")
        : listing.kind === "service"
          ? shortCardText(listing.description)
          : "";
  return meta ? `<div class="listing-meta-line muted small">${escapeHtml(meta)}</div>` : "";
}

function listingVisual(listing, detail = false) {
  if (detail) return `<div class="detail-visual ${listing.accent}"><span class="detail-figure" aria-hidden="true">${listing.emoji}</span></div>`;
  const caption = listing.kind === "service" ? listingCertificationLabel(listing) : listingConditionLabel(listing);
  return `<div class="listing-visual ${listing.accent}">${caption ? `<span class="visual-caption">${escapeHtml(caption)}</span>` : ""}</div>`;
}

function listingCard(listing) {
  if (listing.kind === "ticket") return ticketListingCard(listing);
  return `<article class="listing-card">
    <button type="button" class="listing-card-button" data-action="open-listing" data-id="${listing.id}">
      ${listingVisual(listing)}
      <div class="listing-body">
        <div class="listing-title">${escapeHtml(listing.title)}</div>
        ${listingCardMetaHtml(listing)}
        ${isChoreListing(listing) ? "" : `<div class="seller-line"><span class="mini-avatar">${escapeHtml(listing.initials)}</span><span class="seller-name">${escapeHtml(listing.seller)}</span>${identityMark(listing)}</div>`}
        <div class="listing-meta">${listingPriceHtml(listing)}<span class="rating">${icon("star", 14)} ${listing.rating} <span class="muted">(${listing.reviews})</span></span></div>
      </div>
    </button>
  </article>`;
}

function scrollSectionLink(link) {
  if (!link) return "";
  if (link.view) return `<button class="text-button" data-view="${link.view}">${escapeHtml(link.label)} ${icon("arrow")}</button>`;
  const attrs = [`data-action="${escapeHtml(link.action)}"`];
  if (link.id) attrs.push(`data-id="${escapeHtml(link.id)}"`);
  if (link.query !== undefined) attrs.push(`data-query="${escapeHtml(link.query)}"`);
  return `<button class="text-button" ${attrs.join(" ")}>${escapeHtml(link.label)} ${icon("arrow")}</button>`;
}

function listingScrollSection(title, listings, link, sectionClass = "") {
  if (!listings.length) return "";
  const extraClass = sectionClass ? ` ${sectionClass}` : "";
  return `<section class="section section-home-shelf${extraClass}"><div class="section-header section-header-shelf"><h2>${title}</h2>${scrollSectionLink(link)}</div><div class="home-scroll-row listing-scroll-row">${listings.map(listingCard).join("")}</div></section>`;
}

function storeScrollSection(title, storeList, link, lead = "") {
  if (!storeList.length && !lead) return "";
  return `<section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>${title}</h2>${scrollSectionLink(link)}</div>${lead}<div class="home-scroll-row store-scroll-row">${storeList.map(storeCard).join("")}</div></section>`;
}

function categoryChipIcon(category) {
  return `<span class="category-chip-icon ${category.dot}" aria-hidden="true">${icon(category.icon, 22)}</span>`;
}

function categoryChips(kind = "all") {
  const visible = data.categories.filter((category) => kind === "all" || category.kind === kind).slice(0, kind === "all" ? 7 : 10);
  return visible.map((category) => `<button type="button" class="category-chip ${state.category === category.name ? "active" : ""}" data-action="choose-category" data-category="${category.name}">${categoryChipIcon(category)}${category.name}</button>`).join("");
}

/* ---------- Home ---------- */

function homeView() {
  const shelf = allListings().filter((listing) => !isChoreListing(listing) && !listing.storeOnly);
  const popular = shelf.filter((listing) => listing.kind !== "ticket").sort((a, b) => b.reviews + b.completed - (a.reviews + a.completed)).slice(0, 8);
  const booked = [...new Set(data.orders.map((order) => order.listingId))].map(getListing).filter(Boolean);
  const bookAgain = [...booked, ...shelf.filter((listing) => listing.kind === "service" && !booked.includes(listing))].slice(0, 8);
  const featuredStores = [...data.stores].sort((a, b) => b.followers - a.followers).slice(0, 8);
  const shown = new Set([...popular, ...bookAgain]);
  const recommended = [...shelf.filter((listing) => !shown.has(listing)), ...shelf.filter((listing) => shown.has(listing))].slice(0, 9);
  return `<section class="hero">
    <div class="hero-copy">
      <div class="eyebrow">The student marketplace</div>
      <h1>Someone on campus does that.</h1>
      <p>Find useful services, good stuff and real student sellers at your school. Book a time or shop a local pickup.</p>
      <form class="hero-search" data-form="global-search">
        ${icon("search")}<input name="query" type="search" placeholder="What do you need?" aria-label="Search the marketplace" />
        <button class="primary-button" type="submit">Find it ${icon("arrow")}</button>
      </form>
    </div>
    <div class="hero-art" aria-label="A visual collage of student services and products">
      <span class="floating-pill">Real students · Real reviews</span>
      <div class="art-card art-card-main"><div class="mini-title">Grad portraits with Maya</div><div class="art-portrait">📸</div><div><span class="mini-price">$65</span><br /><span class="small muted">45 min · Student verified</span></div></div>
      <div class="art-card art-card-small"><div class="mini-title">Desk lamp</div><div class="mini-price">$24</div><div class="small">Local pickup</div></div>
    </div>
  </section>

  <section class="section split-banner">
    <div class="mode-card book"><div class="eyebrow">Book</div><h3>Make time for the thing.</h3><p>Tutoring, portraits, beauty, editing and more — with availability you can actually see.</p><button class="primary-button" data-view="book">Explore services ${icon("arrow")}</button></div>
    <div class="mode-card shop"><div class="eyebrow">Shop</div><h3>Made here. Loved before.</h3><p>Discover new and student-made goods or give useful pre-owned items a second life.</p><button class="secondary-button" data-view="shop">Browse products ${icon("arrow")}</button></div>
  </section>

  ${listingScrollSection("Popular on campus", popular, { view: "search", label: "See all" })}
  ${storeScrollSection("Campus stores", featuredStores, { view: "stores", label: "All stores" }, choreBoardCard())}
  ${listingScrollSection("Book again", bookAgain, { view: "you", label: "View bookings" })}

  <section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>Recommended</h2><button class="text-button" data-view="search">Browse more ${icon("arrow")}</button></div><div class="listing-grid listing-grid-recommended">${recommended.map(listingCard).join("")}</div></section>

  <section class="section sell-hero"><div class="eyebrow">For student sellers</div><h2>Turn what you know into what you earn.</h2><p>List a service, sell something you are done with or build a reputation on campus.</p><button class="primary-button" data-view="sell">Start selling ${icon("arrow")}</button></section>`;
}

/* ---------- Book, Shop and Search ---------- */

function matchingSchoolServices() {
  return data.schoolServices.filter((service) => (state.category === "All" || service.category === state.category) && matchesSearch(state.query, service.title, service.provider, service.category, service.description, service.hours));
}

function schoolServiceCard(service) {
  return `<article class="school-service-card">
    <button type="button" class="school-service-button" data-action="open-school-service" data-id="${escapeHtml(service.id)}">
      <div class="listing-visual ${service.accent}">
        <span class="visual-figure" aria-hidden="true">${service.emoji}</span>
        ${schoolBadgeHtml()}
      </div>
      <div class="school-service-body">
        <div class="listing-title">${escapeHtml(service.title)}</div>
        <div class="listing-meta-line muted small">${escapeHtml(service.hours)}</div>
        <p class="school-service-copy">${escapeHtml(shortCardText(service.description, 120))}</p>
        <div class="seller-line"><span class="seller-name">${escapeHtml(service.provider)}</span></div>
      </div>
    </button>
  </article>`;
}

function schoolServiceDetailView(service) {
  if (!service) return browseView("service");
  const backView = state.schoolServiceReturn === "search" || state.schoolServiceReturn === "home" ? state.schoolServiceReturn : "book";
  const backLabel = backView === "search" ? "results" : backView === "home" ? "Home" : "Book";
  const others = data.schoolServices.filter((entry) => entry.id !== service.id);
  const more = others.length
    ? `<section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>More school services</h2></div><div class="home-scroll-row listing-scroll-row">${others.map(schoolServiceCard).join("")}</div></section>`
    : "";
  return `<div class="page-top-row"><button class="back-button" data-action="back-from-school-service">${icon("chevron-left")} Back to ${backLabel}</button><div class="button-row"><button class="ghost-button" data-action="share" data-path="school-service/${service.id}">${icon("share")} Share</button></div></div>
    <div class="detail-layout">
      <div class="detail-gallery"><div class="detail-visual ${service.accent}">${schoolBadgeHtml()}<span class="detail-figure" aria-hidden="true">${service.emoji}</span></div></div>
      <div class="detail-copy">
        <div class="eyebrow">${escapeHtml(service.category)} · School-provided service</div>
        <h1>${escapeHtml(service.title)}</h1>
        <p class="lede">${escapeHtml(service.description)}</p>
        <div class="detail-actions"><a class="primary-button school-service-link" href="${escapeHtml(service.website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(service.websiteLabel)} ${icon("arrow")}</a></div>
        <div class="seller-card"><div class="seller-card-main"><div><div class="small muted">Provided by</div><div class="seller-name">${escapeHtml(service.provider)}</div><div class="seller-sub">${schoolBadgeHtml("pill")}</div></div></div></div>
        <div class="detail-block"><h3>Hours</h3><div class="info-row info-row-line"><span class="trust-icon">${icon("calendar")}</span><strong>${escapeHtml(service.hours)}</strong></div><p class="muted small">This service is run by the university. Their site has the request form and the latest hours.</p></div>
      </div>
    </div>
    ${more}`;
}

function schoolProvidedSection() {
  const cards = matchingSchoolServices().map(schoolServiceCard);
  if (!cards.length) return "";
  return `<section class="section section-home-shelf section-browse-shelf"><div class="section-header section-header-shelf"><h2>School-provided services</h2></div><p class="school-service-note">Run by the university. Open a service for hours and their site.</p><div class="home-scroll-row listing-scroll-row">${cards.join("")}</div></section>`;
}

const SORT_OPTIONS = { recommended: "Recommended", "price-low": "Price: low to high", "price-high": "Price: high to low", rating: "Top rated" };
const TRUST_OPTIONS = { any: "Any seller", verified: "Student verified", rated: "4.8+ rating" };

/** The listings on a browse page ("service", "product" or "all") after search, category, filters and sort. */
function browseResults(kind) {
  const searching = Boolean(state.query.trim());
  const results = allListings().filter((listing) => {
    if (kind !== "all" && listing.kind !== kind) return false;
    if (kind === "service" && isChoreListing(listing)) return false;
    if (kind === "product" && state.shopType !== "all" && listing.merchandiseType !== state.shopType) return false;
    if (listing.storeOnly && !searching) return false;
    if (state.category !== "All" && listing.category !== state.category) return false;
    if (state.trust === "verified" && !listing.verified) return false;
    if (state.trust === "rated" && !(Number(listing.rating) >= 4.8)) return false;
    return matchesSearch(state.query, listing.title, listing.seller, listing.category, listing.description, merchandiseTypeLabel(listing), getStore(listing.storeId)?.name || "");
  });
  const order = {
    "price-low": (a, b) => a.price - b.price,
    "price-high": (a, b) => b.price - a.price,
    rating: (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
  }[state.sort];
  return order ? results.sort(order) : results;
}

function browseView(kind) {
  const service = kind === "service";
  const product = kind === "product";
  const query = state.query.trim();
  const results = browseResults(kind);
  const matchingStores = query ? data.stores.filter((store) => matchesSearch(query, store.name, store.handle, store.tagline, getSeller(store.sellerId).name, ...store.collections.map((collection) => collection.name))) : [];
  const title = service ? "Book something useful." : product ? "Good stuff, already here." : query ? `Results for “${escapeHtml(query)}”` : "Find what you need.";
  const subtitle = service
    ? "See who is available, when it can happen and what it costs."
    : product
      ? state.shopType === "new" ? "Originals, new goods and made-to-order items from students." : state.shopType === "resale" ? "Useful items getting a second life at your school." : "Shop new and student-made goods or find useful pre-owned items at your school."
      : "Browse services and products from students at your school.";
  const sortButton = (label) => `<button class="text-button" data-action="open-sort">${label} ${icon("chevron-down")}</button>`;
  const resultsHeader = service
    ? `<div class="section-header section-header-shelf section-browse-main"><h2>${SORT_OPTIONS[state.sort]}</h2>${sortButton("Sort")}</div>`
    : `<div class="section-header" style="margin-top: 12px"><span class="result-count">${plural(results.length, "result")} · SDSU</span>${sortButton(SORT_OPTIONS[state.sort])}</div>`;
  const resultsGrid = results.length
    ? service
      ? `<section class="section section-browse-main"><div class="listing-grid listing-grid-recommended">${results.map(listingCard).join("")}</div></section>`
      : `<div class="listing-grid">${results.map(listingCard).join("")}</div>`
    : `<div class="empty-state"><div class="empty-shape">⌁</div><h3>No matches yet.</h3><p class="muted">Try another category or search for something nearby.</p><div class="button-row"><button class="ghost-button" data-action="clear-filters">Clear filters</button><button class="primary-button" data-view="sell">${product ? "List an item" : "List what you do"}</button></div></div>`;
  const categoryBar = `<div class="category-row"><div class="filter-bar"><button type="button" class="filter-button category-chip ${state.category === "All" ? "active" : ""}" data-action="choose-category" data-category="All"><span class="category-chip-icon cobalt" aria-hidden="true">${icon("grid", 22)}</span>All</button>${categoryChips(kind)}</div><button type="button" class="ghost-button" data-action="open-filters">${icon("plus")} Filters${state.trust === "any" ? "" : " · 1"}</button></div>`;
  const body = `${product ? "" : schoolProvidedSection()}
    ${matchingStores.length ? `<div class="search-stores">${storeScrollSection("Stores", matchingStores, { action: "search-stores", query, label: "See all matching stores" })}</div>` : ""}
    ${resultsHeader}
    ${resultsGrid}`;
  const shopTab = (type, label) => `<button type="button" class="book-tab ${state.shopType === type ? "active" : ""}" role="tab" aria-selected="${state.shopType === type}" data-action="set-shop-type" data-shop-type="${type}">${label}</button>`;
  return `<div class="browse-header"><div><div class="eyebrow">${product ? "Shop" : service ? "Book" : "Search"}</div><h1>${title}</h1><p class="lede">${subtitle}</p></div></div>
    <div class="browse-filters">
      <form class="global-search browse-page-search">${icon("search")}<input id="browse-search-input" data-live="query" type="search" value="${escapeHtml(state.query)}" placeholder="What do you need?" aria-label="Search the marketplace" autocomplete="off" /><kbd>⌘ K</kbd></form>
      ${product ? `<div class="book-tabs">
        <div class="book-tablist" role="tablist" aria-label="Shop listing type">${shopTab("all", "All")}${shopTab("new", "New & student-made")}${shopTab("resale", "Pre-owned")}</div>
        <div class="book-tab-panel" role="tabpanel">
          ${categoryBar}
          ${body}
        </div>
      </div>` : `${categoryBar}${service ? `${choreBoardSection(state.query)}${body}` : ""}`}
    </div>
    ${service || product ? "" : body}`;
}

function openSortModal() {
  const rows = Object.entries(SORT_OPTIONS).map(([id, label]) => `<button type="button" class="activity-row" data-action="set-sort" data-sort="${id}"><span class="activity-title">${label}</span><span class="list-save-state ${state.sort === id ? "in-list" : ""}">${state.sort === id ? "Selected" : "Choose"}</span></button>`).join("");
  renderModal(`<div class="eyebrow">Browse controls</div><h2>Sort results.</h2><div class="notification-list">${rows}</div>`);
}

function openFiltersModal() {
  const option = (value, label, selected) => `<option value="${escapeHtml(value)}" ${selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
  const categoryOptions = ["All", ...data.categories.map((category) => category.name)].map((name) => option(name, name, name === state.category)).join("");
  const trustOptions = Object.entries(TRUST_OPTIONS).map(([id, label]) => option(id, label, id === state.trust)).join("");
  renderModal(`<div class="eyebrow">Browse controls</div><h2>Filter what you need.</h2><form data-form="filters"><div class="field"><label for="modal-category">Category</label><select id="modal-category" name="category">${categoryOptions}</select></div><div class="field" style="margin-top: 13px"><label for="modal-trust">Trust signal</label><select id="modal-trust" name="trust">${trustOptions}</select></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Apply filters</button></div></form>`);
}

/* ---------- Listing detail, checkout and orders ---------- */

function trustBadges(listing) {
  return `<span class="trust-symbols">${identityPill(listing)}<span class="trust-rating">${icon("star", 16)} ${escapeHtml(listing.rating)}</span></span>`;
}

/** The first `count` items, with `selected` swapped into the last place when it would otherwise be cut off. */
function firstFew(items, count, selected) {
  const few = items.slice(0, count);
  return few.includes(selected) || !items.includes(selected) ? few : [...few.slice(0, -1), selected];
}

/**
 * The time picker on a service page, drawn from state.booking. Services booked from weekly hours get the full
 * calendar. Services with a few fixed openings get quick buttons, with the calendar behind "See more times".
 */
function bookingPicker() {
  const booking = state.booking;
  const heading = `<h3>When can it happen?</h3>`;
  const calendar = () => bookingCalendar(booking, { dateAction: "select-booking-date", monthAction: "shift-booking-month", slotAction: "select-booking-time" });
  if (!booking?.slots.length) return `<div class="detail-block">${heading}<p class="muted small">No open times right now. Message the seller to ask about one.</p></div>`;
  if (booking.duration) return `<div class="detail-block">${heading}<p class="muted small">Choose a day, then a time. Each opening is ${booking.duration} minutes.</p>${calendar()}</div>`;
  const intro = `<p class="muted small">Pick a slot that works for you. The seller confirms the appointment after checkout.</p>`;
  if (booking.expanded) return `<div class="detail-block">${heading}${intro}${calendar()}<button type="button" class="text-button see-more-times is-open" data-action="toggle-more-times">Show fewer times ${icon("chevron-down", 14)}</button></div>`;
  const dates = [...new Set(booking.slots.map((slot) => slot.date))];
  const times = slotsOn(booking, booking.date).map((slot) => slot.time);
  const dateButtons = firstFew(dates, 4, booking.date).map((date) => `<button type="button" class="option-button date-button ${booking.date === date ? "active" : ""}" data-action="select-booking-date" data-date="${date}"><strong>${parseDateKey(date).getDate()}</strong><span>${escapeHtml(dayLabel(date))}</span></button>`).join("");
  const timeButtons = firstFew(times, 3, booking.time).map((time) => `<button type="button" class="option-button ${booking.time === time ? "active" : ""}" data-action="select-booking-time" data-time="${escapeHtml(time)}">${escapeHtml(time)}</button>`).join("");
  const more = dates.length > 4 || times.length > 3 ? `<button type="button" class="text-button see-more-times" data-action="toggle-more-times">See more times ${icon("chevron-down", 14)}</button>` : "";
  return `<div class="detail-block">${heading}${intro}<div class="date-options">${dateButtons}</div><div class="time-options">${timeButtons}</div>${more}</div>`;
}

function listingDetailView(listing) {
  if (!listing) return missingView("listing");
  const service = listing.kind === "service";
  const ticket = listing.kind === "ticket";
  const onBoard = isChoreListing(listing);
  const store = getStore(listing.storeId);
  const returnStore = getStore(state.detailReturn);
  const sellerCard = onBoard
    ? `<div class="seller-card sold-by-card"><div class="seller-card-main"><div><div class="small muted">Listed on</div><div class="seller-name">Chore Board</div></div></div><button class="text-button visit-store-button" data-action="open-chore-board">Open Chore Board ${icon("arrow")}</button></div>`
    : store
      ? `<div class="seller-card sold-by-card"><div class="seller-card-main"><div class="store-logo-small ${store.accent}" aria-hidden="true">${store.emoji}</div><div><div class="small muted">Sold by</div><div class="seller-name">${escapeHtml(store.name)}</div><div class="seller-sub">Run by <button type="button" class="inline-link" data-action="open-seller" data-id="${listing.sellerId}">${escapeHtml(listing.seller)}</button> ${trustBadges(listing)}</div></div></div><button class="text-button visit-store-button" data-action="open-store" data-id="${store.id}">Visit store ${icon("arrow")}</button></div>`
      : `<div class="seller-card"><div class="seller-card-main"><div class="seller-avatar">${escapeHtml(listing.initials)}</div><div><div class="seller-name">${escapeHtml(listing.seller)}</div><div class="seller-sub">${escapeHtml(listing.campus)}</div>${trustBadges(listing)}</div></div><button class="text-button" data-action="open-seller" data-id="${listing.sellerId}">View profile ${icon("arrow")}</button></div>`;
  const soldOut = !service && listing.quantityAvailable < 1;
  const unavailable = soldOut || (service && !state.booking?.time);
  const backLabel = state.detailReturn === "chore-board" || onBoard ? "Chore Board" : returnStore ? escapeHtml(returnStore.name) : ticket ? "Tickets" : service ? "Book" : "Shop";
  const kindLabel = service ? "Service" : ticket ? escapeHtml(ticketHost(listing)) : escapeHtml(merchandiseTypeLabel(listing) || "Product");
  const buyLabel = soldOut ? "Sold out" : service ? "Book this time" : ticket ? "Buy ticket" : "Buy now";
  const detailBlock = service
    ? bookingPicker()
    : ticket
      ? `<div class="detail-block"><h3>At the door</h3><div class="info-row info-row-line"><span class="trust-icon">${icon("calendar")}</span><div><span class="small muted">Date and time</span><strong>${escapeHtml([listing.date, listing.time].filter(Boolean).join(" · ") || listing.availability)}</strong></div></div><div class="info-row info-row-line"><span class="trust-icon">${icon("check")}</span><div><span class="small muted">Location</span><strong>${escapeHtml(listing.location || listing.meeting)}</strong></div></div><p class="ticket-detail-price">${ticketPriceLabel(listing.price)}</p><p class="muted small">Buying this gives you a QR code. ${escapeHtml(ticketHost(listing))} scans it once at the door, and that scan marks the ticket used.</p><span class="small muted">${listing.quantityAvailable} left</span></div>`
      : `<div class="detail-block"><h3>Pickup details</h3><div class="info-row info-row-line"><span class="trust-icon">${icon("check")}</span><strong>${escapeHtml(listing.availability)}</strong></div><div class="info-row info-row-line"><span class="trust-icon">${icon("handshake")}</span><strong>Meet in public and message in the app</strong></div><div class="quantity-control"><button data-action="decrease-quantity" aria-label="Decrease quantity">${icon("minus")}</button><output>${state.quantity}</output><button data-action="increase-quantity" aria-label="Increase quantity">${icon("plus")}</button></div><span class="small muted" style="margin-left: 10px">${listing.quantityAvailable} available</span></div>`;
  const moreFromBoard = onBoard ? allListings().filter((entry) => isChoreListing(entry) && entry.id !== listing.id).slice(0, 8) : [];
  const moreFromStore = store ? storeListings(store).filter((entry) => entry.id !== listing.id).slice(0, 8) : [];
  return `<div class="page-top-row"><button class="back-button" data-action="back-from-detail">${icon("chevron-left")} Back to ${backLabel}</button><div class="button-row"><button class="ghost-button" data-action="share" data-path="listing/${listing.id}">${icon("share")} Share</button></div></div>
    <div class="detail-layout"><div class="detail-gallery">${listingVisual(listing, true)}<div class="small muted" style="margin-top: 10px">Demo imagery — the real product would use seller-approved portfolio or product photos.</div></div>
      <div class="detail-copy"><div class="eyebrow">${ticket ? kindLabel : `${escapeHtml(listing.category)} · ${kindLabel}`}</div><h1>${escapeHtml(listing.title)}</h1>${ticket ? `<p class="ticket-detail-when">${escapeHtml(ticketSchedule(listing))}</p>` : ""}<p class="lede">${escapeHtml(listing.description)}</p>
        <div class="detail-actions"><button class="primary-button" data-action="start-checkout" data-id="${listing.id}" ${unavailable ? "disabled" : ""}>${buyLabel} ${unavailable ? "" : icon("arrow")}</button>${onBoard ? "" : `<button class="icon-button" data-action="message-seller" data-seller="${listing.sellerId}" data-listing="${listing.id}" aria-label="Message seller">${icon("chat")}</button>`}</div>
        ${sellerCard}
        ${detailBlock}
      </div>
    </div>
    ${moreFromBoard.length ? listingScrollSection("More on the Chore Board", moreFromBoard, { action: "open-chore-board", label: "Open Chore Board" }) : ""}
    ${moreFromStore.length ? listingScrollSection(`More from ${escapeHtml(store.name)}`, moreFromStore, { action: "open-store", id: store.id, label: "Visit store" }) : ""}`;
}

function checkoutView(listing) {
  if (!listing) return missingView("listing");
  const service = listing.kind === "service";
  const ticket = listing.kind === "ticket";
  const quantity = service || ticket ? 1 : state.quantity;
  const total = listing.price * quantity;
  const steps = service
    ? `<div class="step"><span class="step-number">2</span><div><strong>${escapeHtml(slotLabel(state.booking))}</strong><p>${escapeHtml(listing.meeting)} · ${escapeHtml(listing.unit)}</p></div></div><div class="step"><span class="step-number">3</span><div><strong>Cancellation terms</strong><p>Free cancellation up to 24 hours before the appointment. Support is available from your order page.</p></div></div>`
    : ticket
      ? `<div class="step"><span class="step-number">2</span><div><strong>${escapeHtml(ticketSchedule(listing))}</strong><p>${escapeHtml(ticketHost(listing))}</p></div></div><div class="step"><span class="step-number">3</span><div><strong>Your QR code</strong><p>It shows up as soon as you pay. They scan it once at the door.</p></div></div>`
      : `<div class="step"><span class="step-number">2</span><div><strong>${plural(quantity, "item")}</strong><p>${escapeHtml(listing.availability)} · ${escapeHtml(listing.meeting)}</p></div></div><div class="step"><span class="step-number">3</span><div><strong>Local handoff</strong><p>We will show the pickup details after the seller confirms the order.</p></div></div>`;
  const priceLine = listing.price ? `${ticket ? ticketPriceLabel(listing.price) : money(listing.price)}${service ? ` / ${escapeHtml(listing.unit)}` : ticket ? "" : " each"}` : "Free";
  return `<div class="page-top-row"><button class="back-button" data-action="back-from-checkout">${icon("chevron-left")} Back to listing</button><span class="small muted">Demo checkout · no payment is processed</span></div>
    <div class="checkout-layout"><section class="checkout-panel"><div class="eyebrow">${ticket ? escapeHtml(ticketHost(listing)) : service ? "Book" : "Shop"}</div><h1>${ticket ? "Review your ticket." : service ? "Review your booking." : "Review your order."}</h1><p class="lede">${ticket ? "One purchase, one QR code. Bring it to the door." : service ? "Make sure the time, price and cancellation terms look right before you confirm." : "Make sure the seller, quantity and pickup details look right before you confirm."}</p>
      <div class="step-list"><div class="step"><span class="step-number">1</span><div><strong>${escapeHtml(listing.title)}</strong><p>${escapeHtml(ticket ? ticketHost(listing) : listing.seller)} · ${priceLine}</p></div></div>${steps}</div>
      <div class="button-row stretch"><button class="primary-button" data-action="confirm-order" data-id="${listing.id}">${listing.price ? `Confirm & pay ${money(total)}` : "Confirm · Free"} ${icon("arrow")}</button><button class="ghost-button" data-action="open-help">Questions about this order?</button></div>
    </section><aside class="summary-card"><div class="summary-visual"><div class="summary-thumb ${listing.accent}">${listing.emoji}</div><div><strong>${escapeHtml(listing.title)}</strong><div class="small muted">${escapeHtml(ticket ? ticketSchedule(listing) : listing.seller)}</div></div></div><div class="summary-line"><span>${ticket ? "Ticket" : service ? "Service" : `Item × ${quantity}`}</span><strong>${money(total)}</strong></div><div class="summary-line"><span>Platform fee</span><strong>$0.00</strong></div><div class="summary-line total"><span>Total</span><strong>${money(total)}</strong></div><p class="checkout-disclaimer">This is a prototype only. No real account, order or payment is created.</p></aside></div>`;
}

function ticketPass(order, listing) {
  const used = order.ticketStatus === "used";
  return `<div class="ticket-pass ${used ? "is-used" : ""}">
    <div class="ticket-pass-copy">
      <div class="eyebrow">${used ? "Used" : "Valid"}</div>
      <h2>${escapeHtml(listing?.title || "Ticket")}</h2>
      <p>${escapeHtml(listing?.availability || "")}${listing?.meeting ? ` · ${escapeHtml(listing.meeting)}` : ""}</p>
      <p class="ticket-pass-code">${escapeHtml(order.ticketCode)}</p>
      <p class="muted small">${used ? `Scanned ${escapeHtml(timeAgo(order.usedAt))}. This code will not scan again.` : "Show this QR code at the door. One scan marks it used."}</p>
    </div>
    <div class="ticket-pass-qr">${qrSvg(order.ticketCode)}</div>
  </div>`;
}

const BUYER_ORDER_STATUS = {
  service: { requested: "Awaiting confirmation", confirmed: "Upcoming", completed: "Completed", cancelled: "Cancelled" },
  product: { requested: "Awaiting confirmation", confirmed: "Accepted", ready: "Ready for pickup", completed: "Picked up", cancelled: "Cancelled" },
  ticket: { confirmed: "Valid", completed: "Used" },
  chore: { paid: "Paid on Campus Connect" }
};
const buyerOrderStatus = (order) => BUYER_ORDER_STATUS[order.kind]?.[order.status] || order.status;
const buyerOrderWhen = (order) => (order.date ? slotLabel(order) : order.note || "");

function orderView(order) {
  if (!order) return missingView("order");
  const backToYou = `<button class="back-button" data-view="you">${icon("chevron-left")} Back to You</button>`;
  if (order.kind === "chore") {
    return `<div class="page-top-row">${backToYou}<button class="ghost-button" data-action="open-chore-board">Chore Board</button></div>
      <div class="order-success"><div class="success-mark">${icon("check")}</div><div class="eyebrow">Paid on Campus Connect</div><h1>${escapeHtml(order.payer)} paid ${escapeHtml(order.payee)}.</h1><p class="lede">${dollars(order.total)} for ${escapeHtml(order.title)} stayed on the platform.</p><div class="order-detail-card"><div class="order-detail-row"><span>Chore</span><strong>${escapeHtml(order.title)}</strong></div><div class="order-detail-row"><span>When</span><strong>${escapeHtml(order.note)}</strong></div><div class="order-detail-row"><span>Paid to</span><strong>${escapeHtml(order.payee)}</strong></div></div><div class="button-row"><button class="primary-button" data-view="you">View activity</button><button class="ghost-button" data-action="open-chore-board">Back to the board</button></div></div>`;
  }
  const listing = getListing(order.listingId);
  if (order.kind === "ticket") {
    return `<div class="page-top-row">${backToYou}<button class="ghost-button" data-view="tickets">More tickets</button></div>
      <div class="order-success ticket-order"><div class="eyebrow">Ticket</div><h1>${order.ticketStatus === "used" ? "This ticket has been used." : "Your ticket is ready."}</h1><p class="lede">${escapeHtml(listing?.seller || "The seller")} scans the code at the door.</p>${ticketPass(order, listing)}</div>`;
  }
  const service = order.kind === "service";
  const cancelled = order.status === "cancelled";
  const waiting = order.status === "requested";
  const eyebrow = cancelled ? "Cancelled" : !service ? "Order placed" : waiting ? "Booking requested" : "Booking confirmed";
  const heading = cancelled ? "This one was cancelled." : !service ? "That one is yours." : waiting ? "Your request is in." : "You are on the calendar.";
  const lede = cancelled
    ? order.cancelReason || "The seller cancelled this order."
    : waiting
      ? "The seller has your request. You will get a notification when they answer."
      : "It is saved in your activity, and updates show up in your notifications.";
  const rows = [
    [service ? "Service" : "Product", listing?.title || "Campus Connect listing"],
    service ? ["When", buyerOrderWhen(order)] : ["Quantity", order.quantity],
    ["Status", buyerOrderStatus(order)],
    ["Total", money(order.total)],
    ["Order reference", `CC-DEMO-${order.id.slice(-4).toUpperCase()}`]
  ].map(([label, value]) => `<div class="order-detail-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  return `<div class="page-top-row">${backToYou}${listing ? `<button class="ghost-button" data-action="message-seller" data-seller="${listing.sellerId}" data-listing="${listing.id}">${icon("chat")} Message seller</button>` : ""}</div>
    <div class="order-success">${cancelled ? "" : `<div class="success-mark">${icon("check")}</div>`}<div class="eyebrow">${eyebrow}</div><h1>${heading}</h1><p class="lede">${escapeHtml(lede)}</p><div class="order-detail-card">${rows}</div><div class="button-row"><button class="primary-button" data-view="you">View activity</button><button class="ghost-button" data-view="home">Keep exploring</button></div></div>`;
}

/* ---------- Sellers and stores ---------- */

function sellerView(seller) {
  if (!seller) return missingView("profile");
  const listings = allListings().filter((listing) => listing.sellerId === seller.id);
  const sellerStores = storesForSeller(seller.id);
  return `<div class="page-top-row"><button class="ghost-button" data-action="share" data-path="seller/${seller.id}">${icon("share")} Share profile</button></div>
    <section class="seller-hero"><div class="seller-hero-main"><div class="seller-avatar">${escapeHtml(seller.initials)}</div><div>${identityPill(seller)}<h1>${escapeHtml(seller.name)}</h1><p class="muted" style="margin-bottom:0">${escapeHtml(seller.campus)} · ${escapeHtml(seller.handle)}</p><div class="seller-stats"><span><strong>${seller.rating}</strong> ★ rating</span><span><strong>${seller.reviews}</strong> reviews</span><span><strong>${seller.completed}</strong> completed</span><span>Replies in <strong>${escapeHtml(seller.response)}</strong></span></div></div></div></section>
    <section class="section" style="margin-top: 28px"><p class="lede">${escapeHtml(seller.bio)}</p></section>
    ${sellerStores.length ? `<section class="section seller-stores"><div class="section-header section-header-shelf"><h2>${sellerStores.length === 1 ? "Store" : "Stores"} by ${escapeHtml(firstName(seller.name))}</h2></div><div class="store-grid">${sellerStores.map(storeCard).join("")}</div></section>` : ""}
    <div class="seller-tabs"><button class="seller-tab active">All listings (${listings.length})</button><button class="seller-tab" data-action="open-seller-reviews" data-id="${seller.id}">Reviews (${seller.reviews})</button></div>
    ${listings.length ? `<div class="listing-grid">${listings.map(listingCard).join("")}</div>` : `<div class="empty-state"><div class="empty-shape">✦</div><h3>Listings are on the way.</h3><p class="muted">This seller is getting their storefront ready.</p></div>`}`;
}

function openSellerReviewsModal(seller) {
  const reviews = storesForSeller(seller.id).flatMap((store) => store.reviewsSample);
  const rows = reviews.length
    ? reviews.map((review) => `<div class="notification-item"><span class="trust-icon">${icon("star")}</span><div><strong>“${escapeHtml(review.text)}”</strong><p>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} · ${escapeHtml(review.author)}</p></div></div>`).join("")
    : `<p class="muted">No written reviews yet.</p>`;
  renderModal(`<div class="eyebrow">Completed transactions</div><h2>What students say about ${escapeHtml(firstName(seller.name))}</h2><div class="notification-list">${rows}</div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Done</button></div>`);
}

function storeKindChips(store) {
  const kinds = storeKinds(store);
  return `${kinds.has("service") ? `<span class="store-kind-chip">${icon("calendar", 13)} Book</span>` : ""}${kinds.has("product") ? `<span class="store-kind-chip">${icon("bag", 13)} Shop</span>` : ""}${kinds.has("ticket") ? `<span class="store-kind-chip">${icon("ticket", 13)} Tickets</span>` : ""}`;
}

function storePreviewEmojis(store, count = 3) {
  return storeListings(store).slice(0, count).map((listing) => `<span>${listing.emoji}</span>`).join("");
}

function storeCard(store) {
  const seller = getSeller(store.sellerId);
  const count = storeListings(store).length;
  return `<article class="store-card">
    <button type="button" class="store-card-button" data-action="open-store" data-id="${store.id}">
      <span class="store-card-banner ${store.accent}"></span>
      <span class="store-card-logo" aria-hidden="true">${escapeHtml(seller.initials)}</span>
      <span class="store-card-body">
        <span class="store-card-name">${escapeHtml(store.name)}${identityMark(seller)}</span>
        <span class="store-card-owner">by ${escapeHtml(seller.name)}</span>
        <span class="store-card-tagline">${escapeHtml(store.tagline)}</span>
        <span class="store-card-meta"><span class="rating">${icon("star", 14)} ${store.rating} <span class="muted">(${store.reviews})</span></span><span class="muted">${plural(count, "listing")}</span></span>
        <span class="store-kind-chips">${storeKindChips(store)}</span>
      </span>
    </button>
  </article>`;
}

function storeShopTab(store, listings) {
  const kinds = storeKinds(store);
  const activeCollection = store.collections.find((collection) => collection.name === state.storeCollection);
  const filtered = listings.filter((listing) => {
    const inCollection = !activeCollection || activeCollection.listingIds.includes(listing.id);
    const matchesKind = state.storeKind === "all" || listing.kind === state.storeKind;
    return inCollection && matchesKind && matchesSearch(state.storeQuery, listing.title, listing.category, listing.description);
  });
  const collectionChips = [{ name: "All", count: listings.length }, ...store.collections.map((collection) => ({ name: collection.name, count: listings.filter((listing) => collection.listingIds.includes(listing.id)).length }))]
    .map((collection) => `<button type="button" class="category-chip ${state.storeCollection === collection.name || (collection.name === "All" && !activeCollection) ? "active" : ""}" data-action="set-store-collection" data-collection="${escapeHtml(collection.name)}">${escapeHtml(collection.name)}<span class="store-collection-count">${collection.count}</span></button>`).join("");
  const hasFilters = Boolean(activeCollection || state.storeQuery.trim() || state.storeKind !== "all");
  return `<div class="store-toolbar">
      ${store.collections.length ? `<div class="store-collections" aria-label="Store collections">${collectionChips}</div>` : ""}
      <div class="store-toolbar-row">
        <form class="global-search store-search">${icon("search")}<input id="store-search-input" data-live="storeQuery" type="search" value="${escapeHtml(state.storeQuery)}" placeholder="Search ${escapeHtml(store.name)}" aria-label="Search this store" autocomplete="off" /></form>
        ${kinds.size > 1 ? `<div class="segmented"><button class="segment ${state.storeKind === "all" ? "active" : ""}" data-action="set-store-kind" data-kind="all">All</button>${kinds.has("service") ? `<button class="segment ${state.storeKind === "service" ? "active" : ""}" data-action="set-store-kind" data-kind="service">Book</button>` : ""}${kinds.has("product") ? `<button class="segment ${state.storeKind === "product" ? "active" : ""}" data-action="set-store-kind" data-kind="product">Shop</button>` : ""}${kinds.has("ticket") ? `<button class="segment ${state.storeKind === "ticket" ? "active" : ""}" data-action="set-store-kind" data-kind="ticket">Tickets</button>` : ""}</div>` : ""}
      </div>
    </div>
    <div class="section-header" style="margin-top: 12px"><span class="result-count">${plural(filtered.length, "listing")}${activeCollection ? ` in ${escapeHtml(activeCollection.name)}` : ""}</span>${hasFilters ? `<button class="text-button" data-action="clear-store-filters">Clear filters</button>` : ""}</div>
    ${filtered.length ? `<div class="listing-grid">${filtered.map(listingCard).join("")}</div>` : `<div class="empty-state"><div class="empty-shape">⌁</div><h3>Nothing matches in this store.</h3><p class="muted">Try another collection or clear your search.</p><button class="ghost-button" data-action="clear-store-filters">Clear filters</button></div>`}`;
}

function storeReviewsTab(store) {
  const reviewRows = store.reviewsSample.map((review) => {
    const listing = getListing(review.listingId);
    return `<article class="store-review"><div class="store-review-top"><strong>${escapeHtml(review.author)}</strong><span class="store-review-stars" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span></div><p>“${escapeHtml(review.text)}”</p>${listing ? `<button type="button" class="store-review-listing" data-action="open-listing" data-id="${listing.id}"><span aria-hidden="true">${listing.emoji}</span> ${escapeHtml(listing.title)} ${icon("chevron-right", 14)}</button>` : ""}</article>`;
  }).join("");
  return `<div class="store-reviews">
    <div class="store-review-summary"><div class="store-review-score">${store.rating}</div><div><div class="store-review-stars large">★★★★★</div><p class="muted small" style="margin:4px 0 0">${store.reviews} reviews · every review is tied to a completed booking or pickup</p></div></div>
    <div class="store-review-list">${reviewRows}</div>
  </div>`;
}

function storeAboutTab(store, seller) {
  const otherStores = storesForSeller(seller.id).filter((entry) => entry.id !== store.id);
  return `<div class="store-about">
    <div>
      <div class="detail-block"><h3>About this store</h3><p class="lede" style="margin:0">${escapeHtml(store.about)}</p></div>
      <div class="detail-block"><h3>Store policies</h3>
        <div class="info-row"><span class="trust-icon">${icon("calendar")}</span><div><strong>Cancellations & returns</strong><span>${escapeHtml(store.policies.cancellation)}</span></div></div>
        <div class="info-row"><span class="trust-icon">${icon("bag")}</span><div><strong>Pickup & delivery</strong><span>${escapeHtml(store.policies.pickup)}</span></div></div>
        <div class="info-row"><span class="trust-icon">${icon("sun")}</span><div><strong>Hours</strong><span>${escapeHtml(store.policies.hours)}</span></div></div>
        <div class="info-row"><span class="trust-icon">${icon("chat")}</span><div><strong>Response time</strong><span>Usually replies in ${escapeHtml(seller.response)}</span></div></div>
        <div class="trust-note">Keep payments and messages in the app. Store policies are set by the student seller and shown again before checkout.</div>
      </div>
    </div>
    <aside class="store-about-side">
      <div class="seller-card"><div class="seller-card-main"><div class="seller-avatar">${escapeHtml(seller.initials)}</div><div><div class="small muted">Run by</div><div class="seller-name">${escapeHtml(seller.name)} ${identityMark(seller)}</div><div class="seller-sub">${escapeHtml(seller.campus)}</div></div></div><button class="text-button" data-action="open-seller" data-id="${seller.id}">Profile ${icon("arrow")}</button></div>
      ${otherStores.length ? `<div class="store-about-more"><h3>More stores by ${escapeHtml(firstName(seller.name))}</h3><div class="store-grid store-grid-compact">${otherStores.map(storeCard).join("")}</div></div>` : ""}
    </aside>
  </div>`;
}

function storeView(store) {
  if (!store) return storesView();
  const seller = getSeller(store.sellerId);
  const listings = storeListings(store);
  const tabs = [
    { id: "shop", label: `Shop (${listings.length})` },
    { id: "reviews", label: `Reviews (${store.reviews})` },
    { id: "about", label: "About" }
  ];
  const tabContent = state.storeTab === "reviews" ? storeReviewsTab(store) : state.storeTab === "about" ? storeAboutTab(store, seller) : storeShopTab(store, listings);
  const backLabel = state.storeReturn === "housing" ? "Housing" : "Stores";
  return `<div class="page-top-row"><button class="back-button" data-action="back-from-store">${icon("chevron-left")} Back to ${backLabel}</button><button class="ghost-button" data-action="share" data-path="store/${store.id}">${icon("share")} Share store</button></div>
    <section class="store-hero">
      <div class="store-hero-banner ${store.accent}"><span class="store-hero-previews" aria-hidden="true">${storePreviewEmojis(store, 4)}</span></div>
      <div class="store-hero-body">
        <div class="store-hero-logo ${store.accent}" aria-hidden="true">${store.emoji}</div>
        <div class="store-hero-info">
          <div class="store-hero-kicker">${identityPill(seller)}<span>${escapeHtml(store.handle)}</span></div>
          <h1>${escapeHtml(store.name)}</h1>
          <p class="store-hero-tagline">${escapeHtml(store.tagline)}</p>
          <button type="button" class="store-owner-link" data-action="open-seller" data-id="${seller.id}"><span class="mini-avatar">${escapeHtml(seller.initials)}</span><span>Run by <strong>${escapeHtml(seller.name)}</strong></span>${identityMark(seller)}</button>
          <div class="seller-stats"><span><strong>${store.rating}</strong> ★ rating</span><span><strong>${store.reviews}</strong> reviews</span><span><strong>${store.sales}</strong> sales</span><span>Replies in <strong>${escapeHtml(seller.response)}</strong></span></div>
        </div>
        <div class="store-hero-actions">
          <button type="button" class="ghost-button" data-action="message-store" data-id="${store.id}">${icon("chat")} Message</button>
        </div>
      </div>
    </section>
    ${store.announcement ? `<div class="store-announcement"><span class="trust-icon">${icon("bell")}</span><span>${escapeHtml(store.announcement)}</span></div>` : ""}
    <div class="seller-tabs store-tabs" role="tablist">${tabs.map((tab) => `<button type="button" role="tab" class="seller-tab ${state.storeTab === tab.id ? "active" : ""}" aria-selected="${state.storeTab === tab.id}" data-action="set-store-tab" data-tab="${tab.id}">${tab.label}</button>`).join("")}</div>
    ${tabContent}`;
}

function storeMatchesQuery(store, query) {
  return matchesSearch(query, store.name, store.handle, store.tagline, getSeller(store.sellerId).name, ...store.collections.map((collection) => collection.name), ...storeListings(store).flatMap((listing) => [listing.title, listing.category]));
}

function storesView() {
  const storeCategoryNames = new Set(data.stores.flatMap(storeCategories));
  const filters = [
    { id: "All", label: "All stores", icon: "grid", dot: "cobalt" },
    { id: "service", label: "Book", icon: "calendar", dot: "sky" },
    { id: "product", label: "Shop", icon: "bag", dot: "butter" },
    ...data.categories.filter((category) => storeCategoryNames.has(category.name)).map((category) => ({ id: category.name, label: category.name, icon: category.icon, dot: category.dot }))
  ];
  const activeFilter = state.storesFilter;
  const filtered = data.stores.filter((store) => {
    const matchesFilter = activeFilter === "All"
      || (activeFilter === "service" || activeFilter === "product" ? storeKinds(store).has(activeFilter)
        : storeCategories(store).includes(activeFilter));
    return matchesFilter && storeMatchesQuery(store, state.storesQuery);
  }).sort((a, b) => b.followers - a.followers);
  return `<div class="browse-header"><div><div class="eyebrow">Stores</div><h1>Shop by student store.</h1><p class="lede">Every store is run by a student-verified seller.</p></div></div>
    <div class="browse-filters">
      <form class="global-search browse-page-search">${icon("search")}<input id="stores-search-input" data-live="storesQuery" type="search" value="${escapeHtml(state.storesQuery)}" placeholder="Search stores, sellers or what they sell" aria-label="Search stores" autocomplete="off" /></form>
      <div class="filter-bar">${filters.map((filter) => `<button type="button" class="category-chip ${activeFilter === filter.id ? "active" : ""}" data-action="set-stores-filter" data-filter="${escapeHtml(filter.id)}"><span class="category-chip-icon ${filter.dot}" aria-hidden="true">${icon(filter.icon, 22)}</span>${escapeHtml(filter.label)}</button>`).join("")}</div>
    </div>
    ${choreBoardSection(state.storesQuery)}
    <div class="section-header" style="margin-top: 12px"><span class="result-count">${plural(filtered.length, "store")} · SDSU</span></div>
    ${filtered.length ? `<div class="store-grid">${filtered.map(storeCard).join("")}</div>` : `<div class="empty-state"><div class="empty-shape">⌁</div><h3>No stores match yet.</h3><p class="muted">Try another filter or search for something else.</p><button class="ghost-button" data-action="clear-stores-filters">Clear filters</button></div>`}`;
}

/* ---------- Job Board and Housing ---------- */

function contentBoardCard(item, action) {
  const face = `<span class="board-card-visual ${item.accent}"><span class="board-card-emoji" aria-hidden="true">${item.emoji}</span></span>
      <span class="board-card-body">
        <span class="board-card-kicker">${escapeHtml(item.kicker)}</span>
        <span class="board-card-title">${escapeHtml(item.title)}</span>
        <span class="board-card-meta">${escapeHtml(item.meta)}</span>
        ${item.summary ? `<span class="board-card-summary">${escapeHtml(item.summary)}</span>` : ""}
        <span class="board-card-price">${escapeHtml(item.price)}</span>
      </span>`;
  return `<article class="board-card"><button type="button" class="board-card-button" data-action="${action}" data-id="${item.id}">${face}</button></article>`;
}

function boardInquiryDetail(kind, item) {
  const job = kind === "job";
  const backLabel = job ? "Job Board" : "Housing";
  const backButton = (content, className) => `<button class="${className}" data-action="close-board-item">${content}</button>`;
  const facts = item.facts.map(([label, value]) => `<div class="info-row info-row-line"><span class="trust-icon">${icon("check")}</span><strong>${escapeHtml(label)} · ${escapeHtml(value)}</strong></div>`).join("");
  const messageAction = item.mine
    ? `<p class="muted" style="margin: 23px 0">You posted this. Other students can message you about it.</p>`
    : `<div class="detail-actions"><button class="primary-button" data-action="message-board-item" data-kind="${kind}" data-id="${item.id}">${icon("chat")} Message ${escapeHtml(firstName(item.poster))}</button></div>`;
  const others = (job ? data.jobs : data.housing).filter((entry) => entry.id !== item.id).slice(0, 8);
  const more = others.length
    ? `<section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>${job ? "More jobs" : "More places"}</h2>${backButton(`Back to ${backLabel} ${icon("arrow")}`, "text-button")}</div><div class="home-scroll-row listing-scroll-row">${others.map((entry) => contentBoardCard(entry, job ? "open-job" : "open-housing")).join("")}</div></section>`
    : "";
  return `<div class="page-top-row">${backButton(`${icon("chevron-left")} Back to ${backLabel}`, "back-button")}<div class="button-row"><button class="ghost-button" data-action="share" data-path="${kind}/${item.id}">${icon("share")} Share</button></div></div>
    <div class="detail-layout"><div class="detail-gallery"><div class="detail-visual ${item.accent}"><span class="detail-figure" aria-hidden="true">${item.emoji}</span></div></div>
      <div class="detail-copy"><div class="eyebrow">${escapeHtml(item.kicker)} · ${job ? "Job" : "Housing"}</div><h1>${escapeHtml(item.title)}</h1><span class="price">${escapeHtml(item.price)}</span>
        ${messageAction}
        <div class="seller-card"><div class="seller-card-main"><div class="seller-avatar">${escapeHtml(item.initials)}</div><div><div class="small muted">${item.mine ? "Posted by you" : job ? "Hiring contact" : "Posted by"}</div><div class="seller-name">${escapeHtml(item.poster)}</div><div class="seller-sub">${studentVerifiedPill()}</div></div></div></div>
        <div class="detail-block board-role"><div class="board-description"><h3>Description</h3><p>${escapeHtml(item.summary)}</p></div><div class="board-facts"><h3>${job ? "The role" : "The place"}</h3>${facts}<div class="trust-note">Keep the conversation in the app. ${job ? "Pay and the schedule get confirmed in messages." : "Rent, dates, and a tour get confirmed in messages."}</div></div></div>
      </div>
    </div>
    ${more}`;
}

function jobPostForm() {
  return `<form class="form-card job-post-form" data-form="post-job">
    <div class="eyebrow">Post a job</div>
    <h3>Put a job on the board.</h3>
    <p class="muted small">Other students on campus can see it. This demo keeps the post for this session only.</p>
    <div class="form-grid">
      <div class="field"><label for="job-title">Job title</label><input id="job-title" name="title" required maxlength="60" placeholder="e.g. Move-in helper" /></div>
      <div class="field"><label for="job-where">Where</label><input id="job-where" name="where" required maxlength="60" placeholder="e.g. Tenochca" /></div>
      <div class="field"><label for="job-schedule">Schedule</label><input id="job-schedule" name="schedule" required maxlength="60" placeholder="e.g. Saturday morning" /></div>
      <div class="field"><label for="job-pay">Pay</label><input id="job-pay" name="pay" required maxlength="24" placeholder="e.g. $20/hr" /></div>
      <div class="field full"><label for="job-summary">What the job is</label><textarea id="job-summary" name="summary" required maxlength="240" placeholder="What should a student know before they take it?"></textarea></div>
    </div>
    <div class="button-row" style="margin-top: 16px"><button class="primary-button" type="submit">Post job ${icon("arrow")}</button><button class="ghost-button" type="button" data-action="toggle-job-form">Cancel</button></div>
  </form>`;
}

function jobBoardView() {
  const selected = data.jobs.find((job) => job.id === state.selectedJobId);
  if (selected) return boardInquiryDetail("job", selected);
  const jobs = data.jobs.filter((job) => matchesSearch(state.jobQuery, job.title, job.kicker, job.meta, job.summary, job.poster, job.price));
  const grid = jobs.length
    ? `<div class="board-grid">${jobs.map((job) => contentBoardCard(job, "open-job")).join("")}</div>`
    : `<div class="empty-state"><div class="empty-shape">⌕</div><h3>No jobs match that.</h3><p class="muted">Try a role, a workplace, or part of the pay.</p></div>`;
  return `<div class="browse-header"><div><div class="eyebrow">Campus work</div><h1>Job Board</h1><p class="lede">On-campus roles and jobs students post for each other.</p></div><button class="primary-button" data-action="toggle-job-form">${state.jobFormOpen ? "Close" : `Post a job ${icon("plus")}`}</button></div>
    <form class="global-search browse-page-search">${icon("search")}<input id="job-search-input" data-live="jobQuery" type="search" value="${escapeHtml(state.jobQuery)}" placeholder="Search jobs" aria-label="Search jobs" autocomplete="off" /></form>
    ${state.jobFormOpen ? jobPostForm() : ""}
    ${grid}`;
}

function housingPostForm() {
  return `<form class="form-card job-post-form" data-form="post-housing">
    <div class="eyebrow">Post a place</div>
    <h3>Put a room or sublease on the board.</h3>
    <p class="muted small">Other students on campus can see it. This demo keeps the post for this session only.</p>
    <div class="form-grid">
      <div class="field"><label for="housing-title">What's available</label><input id="housing-title" name="title" required maxlength="60" placeholder="e.g. Private room in a 3-bedroom" /></div>
      <div class="field"><label for="housing-place">Neighborhood</label><input id="housing-place" name="place" required maxlength="60" placeholder="e.g. College Area" /></div>
      <div class="field"><label for="housing-dates">Dates</label><input id="housing-dates" name="dates" required maxlength="60" placeholder="e.g. Jan–May" /></div>
      <div class="field"><label for="housing-rent">Rent</label><input id="housing-rent" name="rent" required maxlength="24" placeholder="e.g. $900/mo" /></div>
      <div class="field full"><label for="housing-summary">Details</label><textarea id="housing-summary" name="summary" required maxlength="240" placeholder="Furnished? Roommates? How far from campus?"></textarea></div>
    </div>
    <div class="button-row" style="margin-top: 16px"><button class="primary-button" type="submit">Post place ${icon("arrow")}</button><button class="ghost-button" type="button" data-action="toggle-housing-form">Cancel</button></div>
  </form>`;
}

function realEstateAgentCard(agent) {
  return `<article class="listing-card">
    <button type="button" class="listing-card-button" data-action="open-agent" data-id="${escapeHtml(agent.id)}">
      <div class="listing-visual ${agent.accent}"><span class="agent-badge">${icon("home", 13)} Licensed agent</span></div>
      <div class="listing-body">
        <div class="listing-title">${escapeHtml(agent.name)}</div>
        <div class="listing-meta-line muted small">${escapeHtml(shortCardText(agent.summary))}</div>
        <div class="seller-line"><span class="mini-avatar">${escapeHtml(agent.initials)}</span><span class="seller-name">${escapeHtml(agent.brokerage)}</span></div>
        <div class="listing-meta"><span class="price">Free <small>/ consult</small></span><span class="rating">${icon("star", 14)} ${escapeHtml(agent.rating)} <span class="muted">(${agent.reviews})</span></span></div>
      </div>
    </button>
  </article>`;
}

function collegeCubbiesBand() {
  const store = getStore("college-cubbies");
  if (!store) return "";
  return `<section class="section housing-partner"><button type="button" class="housing-partner-button" data-action="open-store" data-id="${store.id}">
      <span class="housing-partner-copy">
        <span class="eyebrow">Moving out</span>
        <span class="housing-partner-name">${escapeHtml(store.name)}</span>
        <span class="housing-partner-tagline">Student movers pick up from your dorm or apartment, keep it for the summer, and bring it back in the fall.</span>
        <span class="housing-partner-steps"><span>${icon("package", 14)} 5 boxes included</span><span>${icon("home", 14)} Pickup at your door</span><span>${icon("arrow", 14)} Back before fall</span></span>
      </span>
      <span class="housing-partner-aside">
        <span class="housing-partner-price">$49 <small>to reserve</small></span>
        <span class="rating">${icon("star", 14)} ${escapeHtml(store.rating)} <span>(${store.reviews})</span></span>
        <span class="housing-partner-go">Visit store ${icon("arrow")}</span>
      </span>
    </button></section>`;
}

function realEstateAgentSection(agents = data.agents, title = "Real estate agents") {
  if (!agents.length) return "";
  return `<section class="section section-home-shelf section-browse-shelf"><div class="section-header section-header-shelf"><h2>${title}</h2></div><div class="home-scroll-row listing-scroll-row">${agents.map(realEstateAgentCard).join("")}</div></section>`;
}

function agentInquiryDetail(agent) {
  const facts = [["Focus", agent.focus], ["Brokerage", agent.brokerage], ["Consult", "Free"]]
    .map(([label, value]) => `<div class="info-row info-row-line"><span class="trust-icon">${icon("check")}</span><strong>${escapeHtml(label)} · ${escapeHtml(value)}</strong></div>`).join("");
  const others = data.agents.filter((entry) => entry.id !== agent.id);
  return `<div class="page-top-row"><button class="back-button" data-action="close-board-item">${icon("chevron-left")} Back to Housing</button><div class="button-row"><button class="ghost-button" data-action="share" data-path="agent/${agent.id}">${icon("share")} Share</button></div></div>
    <div class="detail-layout"><div class="detail-gallery"><div class="detail-visual ${agent.accent}"><span class="agent-badge agent-badge-detail">${icon("home", 13)} Licensed agent</span></div></div>
      <div class="detail-copy"><div class="eyebrow">${escapeHtml(agent.brokerage)} · Agent</div><h1>${escapeHtml(agent.name)}</h1><span class="price">Free consult</span>
        <div class="detail-actions"><button class="primary-button" data-action="message-agent" data-id="${agent.id}">${icon("chat")} Message ${escapeHtml(firstName(agent.name))}</button></div>
        <div class="seller-card"><div class="seller-card-main"><div class="seller-avatar">${escapeHtml(agent.initials)}</div><div><div class="small muted">Real estate agent</div><div class="seller-name">${escapeHtml(agent.name)}</div><div class="seller-sub">${escapeHtml(agent.brokerage)}</div></div></div></div>
        <div class="detail-block board-role"><div class="board-description"><h3>Description</h3><p>${escapeHtml(agent.summary)}</p></div><div class="board-facts"><h3>How they help</h3>${facts}<div class="trust-note">Keep the conversation in the app. Tours and next steps get confirmed in messages.</div></div></div>
      </div>
    </div>
    ${realEstateAgentSection(others, "More agents")}`;
}

function housingView() {
  const homes = data.housing;
  const selected = homes.find((home) => home.id === state.selectedHousingId);
  if (selected) return boardInquiryDetail("housing", selected);
  const agent = data.agents.find((entry) => entry.id === state.selectedAgentId);
  if (agent) return agentInquiryDetail(agent);
  return `<div class="browse-header"><div><div class="eyebrow">Near SDSU</div><h1>Housing & subleases</h1><p class="lede">Rooms and subleases posted by students who already have the lease.</p></div><button class="primary-button" data-action="toggle-housing-form">${state.housingFormOpen ? "Close" : "Post a place"} ${state.housingFormOpen ? "" : icon("plus")}</button></div>
    ${state.housingFormOpen ? housingPostForm() : ""}
    ${realEstateAgentSection()}
    ${collegeCubbiesBand()}
    <section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>Posted by students</h2></div><div class="board-grid">${homes.map((home) => contentBoardCard(home, "open-housing")).join("")}</div></section>`;
}

/* ---------- Tickets ---------- */

function ticketPostLine(post) {
  if (post.kind === "resell") return `Reselling a ${post.event} ticket for $${post.price}`;
  return `Looking for a ticket for ${post.event}`;
}

function ticketPostForm(kind) {
  if (kind === "resell") {
    return `<form class="ticket-post-form" data-form="post-ticket" data-kind="resell">
      <div class="field"><label for="ticket-event">Event</label><input id="ticket-event" name="event" required maxlength="60" placeholder="e.g. Boise State" /></div>
      <div class="field"><label for="ticket-price">Price</label><input id="ticket-price" name="price" required maxlength="8" inputmode="decimal" placeholder="25" /></div>
      <div class="button-row"><button class="primary-button" type="submit">Post</button><button class="ghost-button" type="button" data-action="close-ticket-post">Cancel</button></div>
    </form>`;
  }
  return `<form class="ticket-post-form" data-form="post-ticket" data-kind="request">
    <div class="field"><label for="ticket-event">Event</label><input id="ticket-event" name="event" required maxlength="60" placeholder="e.g. Open Air concert" /></div>
    <div class="button-row"><button class="primary-button" type="submit">Post</button><button class="ghost-button" type="button" data-action="close-ticket-post">Cancel</button></div>
  </form>`;
}

function ticketBubble(post) {
  return `<div class="message ${post.mine ? "me" : "them"} ticket-post">
    <span class="ticket-post-copy"><span class="ticket-post-name">${escapeHtml(post.name)}</span><span>${escapeHtml(ticketPostLine(post))}</span></span>
    <button type="button" class="ticket-dm-button" data-action="open-ticket-dm" data-id="${escapeHtml(post.id)}" aria-label="Private message">${icon("send", 15)}</button>
  </div>`;
}

function ticketDmView(post) {
  return `<section class="chat-panel ticket-chat">
    <div class="chat-header"><button class="back-button" type="button" data-action="close-ticket-dm">${icon("chevron-left")} Back</button><div class="chat-person"><span class="mini-avatar" style="background:var(--${post.accent})">${escapeHtml(post.initials)}</span><div><strong>${escapeHtml(post.name)}</strong><span>${escapeHtml(ticketPostLine(post))}</span></div></div></div>
    <div class="chat-messages">${messageBubbles(post.messages, `This is a private message with ${post.name}.`)}</div>
    <form class="chat-composer" data-form="send-ticket-dm"><textarea name="message" placeholder="Private message…" aria-label="Private message" rows="1"></textarea><button class="primary-button" type="submit" aria-label="Send message">${icon("arrow")}</button></form>
  </section>`;
}

function ticketChat() {
  const dm = data.ticketPosts.find((post) => post.id === state.ticketDmPostId);
  if (dm) return ticketDmView(dm);
  const kind = state.ticketPostKind;
  const posts = data.ticketPosts.filter((post) => matchesSearch(state.ticketQuery, post.name, ticketPostLine(post)));
  const bubbles = posts.length ? posts.map(ticketBubble).join("") : `<p class="muted small">${state.ticketQuery.trim() ? "No posts match that." : "No posts yet."}</p>`;
  return `<section class="chat-panel ticket-chat">
    <div class="chat-header ticket-chat-header">
      <div class="ticket-chat-top">
        <div class="chat-person"><span class="ticket-chat-mark">${icon("ticket", 22)}</span><strong>Ticket chat</strong></div>
        <div class="button-row ticket-post-actions"><button type="button" class="ghost-button ticket-post-button ${kind === "resell" ? "is-open" : ""}" data-action="open-ticket-post" data-kind="resell">Resell</button><button type="button" class="ghost-button ticket-post-button ${kind === "request" ? "is-open" : ""}" data-action="open-ticket-post" data-kind="request">Request</button></div>
      </div>
      <form class="global-search ticket-chat-search">${icon("search")}<input id="ticket-search-input" data-live="ticketQuery" type="search" value="${escapeHtml(state.ticketQuery)}" placeholder="Search tickets" aria-label="Search tickets" autocomplete="off" /></form>
    </div>
    ${kind ? ticketPostForm(kind) : ""}
    <div class="chat-messages">${bubbles}</div>
  </section>`;
}

function ticketsView() {
  const storeTickets = allListings().filter((listing) => listing.kind === "ticket" && listing.quantityAvailable > 0);
  const cards = storeTickets.length ? storeTickets.map(listingCard).join("") : `<p class="muted">No tickets are on sale right now.</p>`;
  const mine = data.orders.filter((order) => order.kind === "ticket");
  const owned = mine.length
    ? `<section class="section"><div class="section-header"><h2>Your tickets</h2></div><div class="activity-list">${mine.map((order) => {
      const listing = getListing(order.listingId);
      return `<button class="activity-row" data-action="open-order" data-id="${order.id}"><span class="activity-main"><span class="activity-thumb ${listing?.accent || "coral"}">${listing?.emoji || "🎟️"}</span><span><span class="activity-title">${escapeHtml(listing?.title || "Ticket")}</span><span class="activity-sub">${order.ticketStatus === "used" ? "Used" : "Show QR code"} · ${escapeHtml(order.ticketCode)}</span></span></span>${icon("chevron-right")}</button>`;
    }).join("")}</div></section>`
    : "";
  return `<div class="tickets-layout">
    <div class="tickets-main">
      <div class="browse-header"><div><div class="eyebrow">On campus stores</div><h1>Tickets</h1><p class="lede">Organizations and bands sell tickets from their store. You get a QR code, and they scan it once at the door.</p></div></div>
      <div class="board-grid">${cards}</div>
      ${owned}
    </div>
    ${ticketChat()}
  </div>`;
}

/* ---------- Chore Board ---------- */

const CHORE_BOARD_TAGLINE = "Post a chore or pick one up. Open to every student.";

function choreBoardBack() {
  if (state.boardReturn === "stores") return { view: "stores", label: "Stores" };
  if (state.boardReturn === "you") return { view: "you", label: "You" };
  if (state.boardReturn === "home") return { view: "home", label: "Home" };
  return { view: "book", label: "Book" };
}

function choreBoardCard() {
  return `<article class="chore-board-card">
    <button type="button" class="chore-board-button" data-action="open-chore-board" aria-label="Open Chore Board">
      <span class="chore-board-banner" aria-hidden="true"></span>
      <span class="chore-board-body">
        <span class="chore-board-name">Chore Board</span>
        <span class="chore-board-tagline">${CHORE_BOARD_TAGLINE}</span>
      </span>
    </button>
  </article>`;
}

function choreBoardSection(query) {
  if (!matchesSearch(query, "Chore Board", CHORE_BOARD_TAGLINE, ...data.chores.flatMap((chore) => [chore.title, chore.summary, chore.poster]))) return "";
  return `<section class="section section-home-shelf section-chore-board">${choreBoardCard()}</section>`;
}

function choreSlipMeta(chore) {
  if (chore.status === "paid") return `Paid on Campus Connect · ${chore.meta}`;
  if (chore.status === "approved") return `Approved · pay on Campus Connect · ${chore.meta}`;
  if (chore.status === "requested" && chore.mine) return `Needs your approval · ${chore.meta}`;
  if (chore.status === "requested") return `Waiting on ${firstName(chore.poster)} · ${chore.meta}`;
  if (chore.mine) return `Your post · ${chore.meta}`;
  return chore.meta;
}

function choreSlip(chore) {
  const quiet = chore.status !== "open";
  const label = `Open ${chore.title}, ${choreSlipMeta(chore)}`;
  return `<button type="button" class="chore-slip${quiet ? " is-quiet" : ""}" data-action="open-chore" data-id="${escapeHtml(chore.id)}" aria-label="${escapeHtml(label)}">
    <span class="chore-slip-price">${escapeHtml(chore.amount)}</span>
    <span class="chore-slip-copy">
      <span class="chore-slip-title">${escapeHtml(chore.title)}</span>
      <span class="chore-slip-meta">${escapeHtml(choreSlipMeta(chore))}</span>
    </span>
    <span class="chore-slip-go" aria-hidden="true">${icon("arrow", 26)}</span>
  </button>`;
}

function chorePostForm() {
  return `<form class="form-card job-post-form" data-form="post-chore">
    <div class="eyebrow">Post a chore</div>
    <h3>Ask another student to do it.</h3>
    <p class="muted small">This post stays on your student account.</p>
    <div class="form-grid">
      <div class="field"><label for="chore-title">What you need</label><input id="chore-title" name="title" required maxlength="60" placeholder="e.g. Take a package to the mailroom" /></div>
      <div class="field"><label for="chore-when">When</label><input id="chore-when" name="when" required maxlength="60" placeholder="e.g. Today after 4" /></div>
      <div class="field"><label for="chore-where">Where</label><input id="chore-where" name="where" required maxlength="60" placeholder="e.g. Zura lobby" /></div>
      <div class="field"><label for="chore-pay">Pay</label><input id="chore-pay" name="pay" required maxlength="24" placeholder="e.g. $15" /></div>
      <div class="field full"><label for="chore-summary">Details</label><textarea id="chore-summary" name="summary" required maxlength="240" placeholder="What should a student know before they pick it up?"></textarea></div>
    </div>
    <div class="button-row" style="margin-top: 16px"><button class="primary-button" type="submit">Post chore ${icon("arrow")}</button><button class="ghost-button" type="button" data-action="toggle-chore-form">Cancel</button></div>
  </form>`;
}

function choreSection(title, chores) {
  if (!chores.length) return "";
  return `<section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>${title}</h2></div><div class="chore-slip-grid">${chores.map(choreSlip).join("")}</div></section>`;
}

/** What the chore page asks of you, which depends on who posted it and how far along it is. */
function choreOfferActions(chore) {
  const poster = escapeHtml(chore.poster);
  const posterFirst = escapeHtml(firstName(chore.poster));
  const taker = escapeHtml(chore.offerName);
  const amount = escapeHtml(chore.amount);
  const note = (text) => `<p class="muted" style="margin: 23px 0">${text}</p>`;
  if (chore.status === "open") {
    return chore.mine
      ? note(`You posted this. When a student says they can take it, you approve them and pay ${amount} through Campus Connect.`)
      : `<div class="detail-actions"><button class="primary-button" data-action="offer-chore" data-id="${chore.id}">I can take this chore</button></div><p class="muted small">${posterFirst} approves you first. Then they pay ${amount} through Campus Connect.</p>`;
  }
  if (chore.status === "requested") {
    return chore.mine
      ? `<p class="muted" style="margin: 23px 0 12px">${taker} says they can take this chore.</p><div class="detail-block chore-approval"><h3>Your approval</h3><p>You posted this chore. Approving opens a ${amount} payment through Campus Connect.</p><button class="primary-button" data-action="approve-chore" data-id="${chore.id}">Approve</button></div>`
      : note(`You told ${posterFirst} you can take this chore. Waiting for ${poster} to approve. The ${amount} is paid through Campus Connect when they do.`);
  }
  if (chore.status === "approved") {
    return `<div class="detail-actions"><button class="primary-button" data-action="open-chore-pay" data-id="${chore.id}">Pay ${amount} through Campus Connect ${icon("arrow")}</button></div><p class="muted small">You approved ${taker}. The money moves on Campus Connect.</p>`;
  }
  return note(`${poster} paid ${taker} ${amount} through Campus Connect.`);
}

function choreDetail(chore) {
  const facts = chore.facts.map(([label, value]) => `<div class="info-row info-row-line"><span class="trust-icon">${icon("check")}</span><strong>${escapeHtml(label)} · ${escapeHtml(value)}</strong></div>`).join("");
  const others = data.chores.filter((entry) => entry.id !== chore.id && !entry.mine && entry.status === "open").slice(0, 8);
  const more = others.length
    ? `<section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>More on the board</h2><button class="text-button" data-action="close-chore">Back to Chore Board ${icon("arrow")}</button></div><div class="chore-board"><div class="chore-slip-grid">${others.map(choreSlip).join("")}</div></div></section>`
    : "";
  return `<div class="page-top-row"><button class="back-button" data-action="close-chore">${icon("chevron-left")} Back to Chore Board</button><div class="button-row"><button class="ghost-button" data-action="share" data-path="chore/${chore.id}">${icon("share")} Share</button></div></div>
    <div class="detail-layout"><div class="detail-gallery"><div class="detail-visual ${chore.accent}"><span class="detail-figure" aria-hidden="true">${chore.emoji}</span></div></div>
      <div class="detail-copy"><div class="eyebrow">Chore Board · ${chore.mine ? "Your post" : "Student post"}</div><h1>${escapeHtml(chore.title)}</h1><span class="price">${escapeHtml(chore.price)}</span>
        ${choreOfferActions(chore)}
        <div class="seller-card"><div class="seller-card-main"><div class="seller-avatar">${escapeHtml(chore.initials)}</div><div><div class="small muted">${chore.mine ? "Posted by you" : "Posted by"}</div><div class="seller-name">${escapeHtml(chore.poster)}</div><div class="seller-sub">${studentVerifiedPill()}</div></div></div></div>
        <div class="detail-block board-role"><div class="board-description"><h3>Description</h3><p>${escapeHtml(chore.summary)}</p></div><div class="board-facts"><h3>The chore</h3>${facts}<div class="trust-note">The poster approves a student, then pays them through Campus Connect.</div></div></div>
      </div>
    </div>
    ${more}`;
}

function choreBookings() {
  return allListings().filter(isChoreListing);
}

function yourChoreSections() {
  const posted = data.chores.filter((chore) => chore.mine);
  const waiting = data.chores.filter((chore) => chore.offeredByMe && chore.status !== "paid");
  const paid = data.chores.filter((chore) => chore.offeredByMe && chore.status === "paid");
  return `${choreSection("Chores you posted", posted)}${choreSection("Waiting on approval", waiting)}${choreSection("Paid through Campus Connect", paid)}`;
}

function choreBoardView() {
  const selected = data.chores.find((chore) => chore.id === state.selectedChoreId);
  if (selected) return choreDetail(selected);
  const back = choreBoardBack();
  const open = data.chores.filter((chore) => !chore.mine && chore.status === "open");
  const bookings = choreBookings();
  const openGrid = open.length
    ? `<div class="chore-slip-grid">${open.map(choreSlip).join("")}</div>`
    : `<div class="empty-state"><div class="empty-shape">⌁</div><h3>Nothing is waiting on the board.</h3><p class="muted">Post a chore if you need something done.</p></div>`;
  const bookingSection = bookings.length
    ? `<section class="section section-home-shelf section-chore-bookings"><div class="section-header section-header-shelf"><h2>Book a chore</h2></div><p class="lede">Student sellers you can book for a chore. Pick a time and pay through Campus Connect.</p><div class="listing-grid listing-grid-recommended">${bookings.map(listingCard).join("")}</div></section>`
    : "";
  return `<div class="page-top-row"><button class="back-button" data-view="${back.view}">${icon("chevron-left")} Back to ${back.label}</button></div>
    <div class="browse-header"><div><div class="eyebrow">${back.label}</div><h1>Chore Board</h1><p class="lede">Open a chore and say you can take it. The poster approves, then pays through Campus Connect.</p></div><button class="primary-button chore-post-button" data-action="toggle-chore-form">${state.choreFormOpen ? "Close" : "Post a chore"} ${state.choreFormOpen ? "" : icon("plus")}</button></div>
    ${state.choreFormOpen ? chorePostForm() : ""}
    <section class="chore-board" aria-label="Open chores">${openGrid}</section>
    ${bookingSection}`;
}

function chorePayView(chore) {
  if (!chore) return choreBoardView();
  const taker = escapeHtml(chore.offerName);
  const total = dollars(amountValue(chore.amount));
  return `<div class="page-top-row"><button class="back-button" data-action="back-from-chore-pay">${icon("chevron-left")} Back to chore</button><span class="small muted">Campus Connect payment · demo only</span></div>
    <div class="checkout-layout"><section class="checkout-panel"><div class="eyebrow">Chore Board</div><h1>Pay through Campus Connect.</h1><p class="lede">${escapeHtml(firstName(chore.poster))} approved ${taker}. This payment stays on the platform.</p>
      <div class="step-list"><div class="step"><span class="step-number">1</span><div><strong>${escapeHtml(chore.title)}</strong><p>${escapeHtml(chore.meta)}</p></div></div><div class="step"><span class="step-number">2</span><div><strong>Pay ${taker}</strong><p>${escapeHtml(chore.poster)} is paying the student who is taking the chore.</p></div></div><div class="step"><span class="step-number">3</span><div><strong>On Campus Connect</strong><p>The money does not move outside the app.</p></div></div></div>
      <div class="button-row stretch"><button class="primary-button" data-action="confirm-chore-pay" data-id="${chore.id}">Confirm & pay ${total} ${icon("arrow")}</button></div>
    </section><aside class="summary-card"><div class="summary-visual"><div class="summary-thumb ${chore.accent}">${chore.emoji}</div><div><strong>${escapeHtml(chore.title)}</strong><div class="small muted">To ${taker}</div></div></div><div class="summary-line"><span>Chore</span><strong>${total}</strong></div><div class="summary-line"><span>Platform fee</span><strong>$0.00</strong></div><div class="summary-line total"><span>Total</span><strong>${total}</strong></div><p class="checkout-disclaimer">This is a prototype only. No real account, order or payment is created.</p></aside></div>`;
}

/* ---------- Inbox ---------- */

function inboxView() {
  const header = `<div class="page-top-row"><div><div class="eyebrow">Keep it on-platform</div><h1 style="margin-bottom: 6px">Inbox</h1><p class="muted" style="margin:0">Messages stay connected to the listing or order they belong to.</p></div><button class="ghost-button" data-action="open-help">${icon("chat")} Get help</button></div>`;
  const active = selectedConversation();
  if (!active) return `${header}<div class="empty-state"><div class="empty-shape">✉</div><h3>No messages yet.</h3><p class="muted">Message a seller from any listing and the conversation shows up here.</p><button class="primary-button" data-view="book">Find something to book ${icon("arrow")}</button></div>`;
  const rows = data.conversations.map((conversation) => `<button class="conversation-row ${conversation.id === active.id ? "active" : ""}" data-action="select-conversation" data-id="${conversation.id}"><span class="mini-avatar">${escapeHtml(conversation.initials)}</span><span class="conversation-content"><span class="conversation-top"><span class="conversation-name">${escapeHtml(conversation.name)}</span><span class="conversation-time">${escapeHtml(conversationTime(conversation))}</span></span><span class="conversation-preview">${escapeHtml(conversationPreview(conversation))}</span></span>${conversation.unread ? `<span class="unread-dot" aria-label="Unread"></span>` : ""}</button>`).join("");
  return `${header}<div class="inbox-layout"><aside class="conversation-list"><div class="conversation-header"><h2>Messages</h2></div>${rows}</aside><section class="chat-panel"><div class="chat-header"><div class="chat-person"><span class="mini-avatar" style="background:var(--${active.accent})">${escapeHtml(active.initials)}</span><div><strong>${escapeHtml(active.name)}</strong><span>${escapeHtml(active.context)}</span></div></div><div class="button-row"><button class="icon-button" data-action="open-report" aria-label="Report conversation">${icon("shield")}</button><button class="icon-button" data-action="open-help" aria-label="Get help">${icon("help")}</button></div></div><div class="chat-messages">${messageBubbles(active.messages, `This is the start of your conversation with ${active.name}.`)}</div><form class="chat-composer" data-form="send-message"><textarea name="message" placeholder="Write a message…" aria-label="Write a message" rows="1"></textarea><button class="primary-button" type="submit" aria-label="Send message">${icon("arrow")}</button></form></section></div>`;
}

/* ---------- You and settings ---------- */

const SETTINGS_SECTIONS = [
  { id: "account", label: "Account", hint: "Name and campus", icon: "user" },
  { id: "payment", label: "Payment", hint: "Cards for checkout", icon: "wallet" },
  { id: "notifications", label: "Notifications", hint: "Messages and orders", icon: "bell" },
  { id: "privacy", label: "Privacy & safety", hint: "Who can see you", icon: "shield" }
];

const accountRow = (key, title, body) => settingsRow(data.account[key], title, body, "toggle-setting", key);

function settingsAccountPanel() {
  const name = data.account.displayName;
  return `<form class="settings-form" data-form="save-account">
    <div class="settings-identity">
      <div class="seller-avatar">${escapeHtml(initialsOf(name))}</div>
      <div>
        <h2>${escapeHtml(name)}</h2>
        ${data.account.showCampus ? `<p class="muted small">SDSU</p>` : ""}
        ${studentVerifiedPill()}
      </div>
    </div>
    <div class="form-grid">
      <div class="field full"><label for="settings-name">Display name</label><input id="settings-name" name="displayName" required maxlength="48" value="${escapeHtml(name)}" /></div>
      <div class="field"><label for="settings-email">Campus email</label><input id="settings-email" value="${escapeHtml(data.account.email)}" readonly /></div>
      <div class="field"><label for="settings-school">School</label><input id="settings-school" value="${escapeHtml(data.account.school)}" readonly /></div>
    </div>
    <p class="field-note">Campus email and school come from student verification. Changes stay in this demo session.</p>
    <div class="button-row" style="margin-top: 16px"><button class="primary-button" type="submit">Save account ${icon("check")}</button></div>
  </form>`;
}

function settingsPaymentPanel() {
  const methods = data.paymentMethods;
  const cards = methods.length
    ? `<div class="payment-list">${methods.map((method) => `<article class="payment-card ${method.isDefault ? "is-default" : ""}">
        <div class="payment-card-copy">
          <strong>${escapeHtml(method.brand)} ···· ${escapeHtml(method.last4)}</strong>
          <p class="muted small">${escapeHtml(method.name)} · Expires ${escapeHtml(method.exp)}${method.isDefault ? " · Default" : ""}</p>
        </div>
        <div class="button-row">
          ${method.isDefault ? "" : `<button type="button" class="ghost-button compact" data-action="set-default-payment" data-id="${method.id}">Make default</button>`}
          <button type="button" class="ghost-button compact" data-action="remove-payment" data-id="${method.id}">Remove</button>
        </div>
      </article>`).join("")}</div>`
    : `<div class="payment-empty"><strong>No card saved yet</strong><p class="muted small">Add one to use at checkout. This demo keeps it in the session only.</p></div>`;
  return `<div class="settings-group">
    <h2>Payment</h2>
    <p class="muted small">Save a card for campus bookings and pickups. Only the last four digits stay on this page, and nothing is charged.</p>
    ${cards}
    <form class="settings-form" data-form="save-payment">
      <h3>Add a card</h3>
      <div class="form-grid">
        <div class="field full"><label for="card-name">Name on card</label><input id="card-name" name="name" required maxlength="48" autocomplete="cc-name" placeholder="Katarina Cedolin" /></div>
        <div class="field full"><label for="card-number">Card number</label><input id="card-number" name="number" required inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23" /></div>
        <div class="field"><label for="card-exp">Expiration</label><input id="card-exp" name="exp" required inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5" /></div>
      </div>
      <p class="field-note">The full number is not stored. A security code is never asked for here.</p>
      <div class="button-row" style="margin-top: 16px"><button class="primary-button" type="submit">Save card ${icon("check")}</button></div>
    </form>
  </div>`;
}

function settingsNotificationsPanel() {
  return `<div class="settings-group">
    <h2>What should reach you</h2>
    <p class="muted small">These stay in the app for this prototype. Nothing is emailed.</p>
    ${accountRow("notifyMessages", "Messages", "When a seller replies about a listing or order.")}
    ${accountRow("notifyOrders", "Orders and bookings", "Pickup updates, confirmations and schedule changes.")}
    ${accountRow("notifyHousing", "Housing & subleases", "New rooms and subleases near campus.")}
  </div>`;
}

function settingsPrivacyPanel() {
  return `<div class="settings-group">
    <h2>Who can see you</h2>
    <p class="muted small">Other students only see what you choose to share.</p>
    ${accountRow("profileVisible", "Show my profile", "Let sellers and buyers open your student profile.")}
    ${accountRow("showCampus", "Show my campus", "Display SDSU next to your name.")}
    <div class="settings-safety">
      <h3>Safety</h3>
      <div class="button-row">
        <button type="button" class="ghost-button" data-action="open-help">${icon("help")} Get help</button>
        <button type="button" class="ghost-button" data-action="open-report">${icon("shield")} Report a concern</button>
      </div>
    </div>
    <div class="settings-signout">
      <div><strong>Sign out</strong><p class="muted small">Signing out starts the demo over.</p></div>
      <button type="button" class="danger-button" data-action="sign-out">${icon("logout")} Sign out</button>
    </div>
  </div>`;
}

function settingsView() {
  const section = SETTINGS_SECTIONS.find((item) => item.id === state.settingsSection) || SETTINGS_SECTIONS[0];
  const nav = SETTINGS_SECTIONS.map((item) => `<button type="button" class="settings-nav-item ${item.id === section.id ? "active" : ""}" data-action="set-settings-section" data-section="${item.id}"><span class="trust-icon">${icon(item.icon)}</span><span class="settings-nav-copy"><span class="settings-nav-label">${item.label}</span><span class="muted small">${item.hint}</span></span></button>`).join("");
  const panel = section.id === "payment" ? settingsPaymentPanel() : section.id === "notifications" ? settingsNotificationsPanel() : section.id === "privacy" ? settingsPrivacyPanel() : settingsAccountPanel();
  return `<div class="settings-page"><div class="page-top-row"><div><div class="eyebrow">Your account</div><h1 style="margin-bottom: 6px">Settings</h1><p class="muted" style="margin:0">How Campus Connect works for you on campus.</p></div><button class="ghost-button" data-view="you">${icon("chevron-left")} Back to You</button></div>
  <div class="settings-layout">
    <aside class="settings-nav" aria-label="Settings sections">${nav}</aside>
    <section class="settings-panel">${panel}</section>
  </div></div>`;
}

function youView() {
  const name = data.account.displayName;
  const unread = unreadCount(data.conversations);
  const orderRows = data.orders.map((order) => {
    const listing = getListing(order.listingId);
    return `<button class="activity-row" data-action="open-order" data-id="${order.id}"><span class="activity-main"><span class="activity-thumb ${order.accent || listing?.accent || "lilac"}">${order.emoji || listing?.emoji || "✦"}</span><span><span class="activity-title">${escapeHtml(order.title || listing?.title || "Campus Connect order")}</span><span class="activity-sub">${escapeHtml([buyerOrderStatus(order), buyerOrderWhen(order)].filter(Boolean).join(" · "))}</span></span></span>${icon("chevron-right")}</button>`;
  }).join("");
  return `<div class="page-top-row"><div><div class="eyebrow">Your campus activity</div><h1 style="margin-bottom: 6px">You</h1><p class="muted" style="margin:0">Keep track of bookings, purchases and messages.</p></div><button class="ghost-button" data-view="settings">${icon("settings")} Settings</button></div>
  <section class="seller-hero profile-hero"><div class="seller-hero-main"><div class="seller-avatar">${escapeHtml(initialsOf(name))}</div><div>${studentVerifiedPill()}<h2>${escapeHtml(name)}</h2>${data.account.showCampus ? `<p class="muted">SDSU</p>` : ""}<div class="seller-stats"><span><strong>${data.orders.length}</strong> orders</span><span><strong>${data.conversations.length}</strong> messages</span></div></div></div></section>
  <section class="profile-layout">
    <div class="profile-orders-panel">
      <div class="section-header profile-orders-header"><div><div class="eyebrow">Your activity</div><h2>Orders & bookings</h2></div></div>
      <div class="activity-list">${orderRows || `<p class="muted small">Nothing yet. Bookings and purchases show up here.</p>`}</div>
    </div>
    <div class="quick-actions profile-help-grid">
      <button class="quick-action" data-action="open-chore-board"><span class="trust-icon">${icon("handshake")}</span><strong>Chore Board</strong><span>Post or pick up a chore</span></button>
      <button class="quick-action" data-view="inbox"><span class="trust-icon">${icon("chat")}</span><strong>Inbox</strong><span>${unread ? plural(unread, "unread message") : "No unread messages"}</span></button>
      <button class="quick-action" data-action="open-help"><span class="trust-icon">${icon("help")}</span><strong>Get help</strong><span>Support and safety</span></button>
    </div>
  </section>
  ${yourChoreSections()}
  <section class="section sell-hero profile-sell-hero"><div class="eyebrow">For student sellers</div><h2>Turn what you know into what you earn.</h2><p>List a service, sell something you are done with or build a reputation on campus. The Seller Hub demo opens as Maya Chen, an established campus seller.</p><div class="button-row"><button class="primary-button" data-action="switch-mode">Open Seller Hub ${icon("arrow")}</button><button class="ghost-button sell-hero-ghost" data-view="sell">List something quickly</button></div></section>`;
}

/* ---------- Selling ---------- */

function sellView() {
  const hasType = Boolean(state.sellKind);
  const productTypeChosen = state.sellKind !== "product" || Boolean(state.sellMerchandiseType);
  return `<section class="sell-hero"><div class="eyebrow">Seller tools</div><h1>What are you good at?</h1><p>Turn what you know or what you have into something another student can find, understand and trust.</p><button class="primary-button" data-action="open-verified">You are student verified ${icon("verified")}</button></section><section class="section"><div class="eyebrow">Step 1 of ${state.sellKind === "product" ? "3" : "2"}</div><h2>Choose what you are listing.</h2><div class="sell-options"><button type="button" class="sell-option ${state.sellKind === "service" ? "selected" : ""}" data-action="choose-sell-kind" data-kind="service"><span class="sell-option-icon coral">🗓️</span><span><strong>A service</strong><span class="muted small">Something someone books time for</span></span></button><button type="button" class="sell-option ${state.sellKind === "product" ? "selected" : ""}" data-action="choose-sell-kind" data-kind="product"><span class="sell-option-icon butter">📦</span><span><strong>A product</strong><span class="muted small">Something someone buys for pickup or delivery</span></span></button></div>${state.sellKind === "product" ? sellProductTypeChooser() : ""}${hasType && productTypeChosen ? sellForm(state.sellKind) : `<div class="empty-state sell-start-state"><div class="empty-shape">✦</div><h3>${state.sellKind === "product" ? "Choose how this item is being sold." : "Start with the kind of listing."}</h3><p class="muted">We will keep the form focused on the details a buyer needs.</p></div>`}</section>`;
}

function sellProductTypeChooser() {
  return `<div class="sell-product-type"><div class="eyebrow">Step 2 of 3</div><h3>How are you selling this item?</h3><p class="muted small">This helps buyers understand what they are browsing before they open a listing.</p><div class="sell-options sell-product-options">
    <button type="button" class="sell-option ${state.sellMerchandiseType === "new" ? "selected" : ""}" data-action="choose-merchandise-type" data-merchandise-type="new"><span class="sell-option-icon lilac">${icon("sparkles", 24)}</span><span><strong>New & student-made</strong><span class="muted small">Something you made, designed, stocked new or make to order</span></span></button>
    <button type="button" class="sell-option ${state.sellMerchandiseType === "resale" ? "selected" : ""}" data-action="choose-merchandise-type" data-merchandise-type="resale"><span class="sell-option-icon mint">${icon("bag", 24)}</span><span><strong>Pre-owned</strong><span class="muted small">Something previously owned that you are reselling</span></span></button>
  </div></div>`;
}

function sellForm(kind) {
  const service = kind === "service";
  const isNewProduct = !service && state.sellMerchandiseType === "new";
  const productCategories = isNewProduct
    ? ["Student-made", "Create", "Tech", "Beauty", "Clothing", "Other"]
    : ["Furniture", "Clothing", "Textbooks", "Tech", "Dorm", "Other"];
  const categoryOptions = service
    ? ["Learn", "Create", "Beauty", "Help", "Tech", "Events"].map((category) => `<option>${category}</option>`).join("")
    : productCategories.map((category) => `<option>${category}</option>`).join("");
  const conditionOptions = isNewProduct
    ? ["New", "Made to order", "Digital download"].map((condition) => `<option>${condition}</option>`).join("")
    : ["Like new", "Good condition", "Fair condition"].map((condition) => `<option>${condition}</option>`).join("");
  const stepLabel = service ? "Step 2 of 2" : "Step 3 of 3";
  const submitButtons = IS_SELLER
    ? `<button class="primary-button" type="submit" name="intent" value="publish">Publish listing ${icon("arrow")}</button><button class="ghost-button" type="submit" name="intent" value="draft">Save as draft</button><button class="ghost-button" type="button" data-view="seller-listings">Cancel</button>`
    : `<button class="primary-button" type="submit">Publish demo listing ${icon("arrow")}</button><button class="ghost-button" type="button" data-action="cancel-sell">Cancel</button>`;
  return `<form class="form-card" data-form="publish-listing"><div class="progress-steps"><span class="progress-step active"></span><span class="progress-step active"></span>${service ? "" : `<span class="progress-step active"></span>`}</div><div class="eyebrow">${stepLabel} · ${service ? "Service details" : merchandiseTypeLabel(state.sellMerchandiseType)}</div><h3>${service ? "Make the offer clear." : isNewProduct ? "Show buyers what makes it original." : "Give it a good second home."}</h3><p class="muted small">This is a prototype form — publishing adds a demo listing to your local session only.</p><div class="form-grid"><div class="field full"><label for="listing-title">Title</label><input id="listing-title" name="title" required placeholder="${service ? "e.g. Beginner guitar lesson" : isNewProduct ? "e.g. Hand-painted campus tote" : "e.g. White desk chair"}" /></div><div class="field"><label for="listing-category">Category</label><select id="listing-category" name="category">${categoryOptions}</select></div><div class="field"><label for="listing-price">Price</label><input id="listing-price" name="price" type="number" min="1" required placeholder="${service ? "35" : "20"}" /></div>${service ? `<div class="field"><label for="listing-duration">Duration</label><select id="listing-duration" name="duration"><option>30 min</option><option>45 min</option><option>60 min</option><option>90 min</option></select></div>` : `<div class="field"><label for="listing-quantity">Quantity</label><input id="listing-quantity" name="quantity" type="number" min="1" value="1" /></div><div class="field"><label for="listing-condition">${isNewProduct ? "Availability" : "Condition"}</label><select id="listing-condition" name="condition">${conditionOptions}</select></div>`}<div class="field full"><label for="listing-description">Description</label><textarea id="listing-description" name="description" required placeholder="${isNewProduct ? "What did you make or source, and what should a buyer know?" : "What should another student know before they choose this?"}"></textarea><span class="field-note">${isNewProduct ? "Explain materials, what is included and whether it is ready now or made to order." : "Use real details, clear expectations and an honest condition and handoff plan."}</span></div></div><div class="button-row" style="margin-top: 18px">${submitButtons}</div></form>`;
}

/* ---------- Views ---------- */

Object.assign(VIEWS, {
  home: homeView,
  book: () => browseView("service"),
  shop: () => browseView("product"),
  search: () => browseView("all"),
  listing: () => listingDetailView(getListing(state.selectedListingId)),
  checkout: () => checkoutView(getListing(state.selectedListingId)),
  order: () => orderView(data.orders.find((order) => order.id === state.selectedOrderId)),
  seller: () => sellerView(getSeller(state.selectedSellerId)),
  stores: storesView,
  store: () => storeView(getStore(state.selectedStoreId)),
  "school-service": () => schoolServiceDetailView(data.schoolServices.find((service) => service.id === state.selectedSchoolServiceId)),
  jobs: jobBoardView,
  housing: housingView,
  tickets: ticketsView,
  "chore-board": choreBoardView,
  "chore-pay": () => chorePayView(data.chores.find((chore) => chore.id === state.selectedChoreId)),
  inbox: inboxView,
  you: youView,
  settings: settingsView,
  sell: sellView
});

/** Views without a navigation button of their own highlight one of these instead. */
Object.assign(NAV_PARENTS, {
  search: "home",
  settings: "you",
  "chore-board": () => state.boardReturn || "book",
  "school-service": () => (["search", "home"].includes(state.schoolServiceReturn) ? "home" : "book")
});
