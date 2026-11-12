/** Shared UI: the registries each page fills in, plus the toast, modal, badge and booking pieces both pages use. */

/**
 * How a page plugs into the app shell (app.js):
 *   VIEWS[name]        () => markup for <main>. Shown when state.view === name.
 *   ACTIONS[name]      (target, event) => void. Runs when an element with data-action="name" is clicked.
 *   FORMS[name]        (fields, form, event) => void. Runs when <form data-form="name"> is submitted. `fields` holds the trimmed values.
 *   NAV_PARENTS[name]  the navigation button to highlight on a view that has none of its own (a view name, or a function returning one).
 *   NOTIFICATION_TARGETS[name]  (notification) => void. Where a clicked notification whose `action` is "name" leads.
 * Handlers may be async. If one throws, the error message is shown as a toast (see `run`).
 */
const VIEWS = {};
const ACTIONS = {};
const FORMS = {};
const NAV_PARENTS = {};
const NOTIFICATION_TARGETS = {};

/** Runs a handler and shows whatever it throws as a toast. Every action and form goes through this. */
async function run(handler, ...args) {
  try {
    await handler(...args);
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  }
}

/* ---------- Moving around ---------- */

function setView(view, extra = {}) {
  Object.assign(state, extra, { view });
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Fetches the named parts of `data` again, then redraws. */
async function refresh(...keys) {
  await load(...keys);
  render();
}

/* ---------- Toasts and modals ---------- */

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === "success" ? icon("check") : "!"}</span><span>${escapeHtml(message)}</span>`;
  document.querySelector("#toast-region").appendChild(toast);
  window.setTimeout(() => toast.remove(), 3600);
}

function renderModal(content) {
  document.querySelector("#modal-root").innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="Campus Connect dialog"><button class="modal-close" data-action="close-modal" aria-label="Close dialog">${icon("close")}</button>${content}</div></div>`;
}

function closeModal() {
  document.querySelector("#modal-root").innerHTML = "";
}

/** Copies a link to a buyer page, such as "listing/maya-portraits". The buyer page opens it on load. */
async function shareLink(path) {
  const link = new URL(`index.html#/${path}`, location.href).href;
  try {
    await navigator.clipboard.writeText(link);
    showToast("Link copied.");
  } catch {
    showToast(link);
  }
}

/* ---------- Badges and small pieces ---------- */

const studentVerifiedPill = () => `<span class="verified-pill">${icon("verified")} Student verified</span>`;
const identityPill = (entity) => (entity?.verified ? studentVerifiedPill() : "");
const identityMark = (entity) => (entity?.verified ? `<span class="verified-check" title="Student verified">${icon("verified")}</span>` : "");

function schoolBadgeHtml(variant = "caption") {
  const label = "School-provided service";
  return variant === "pill" ? `<span class="school-badge inline">${icon("school", 14)} ${label}</span>` : `<span class="school-badge">${icon("school", 13)} ${label}</span>`;
}

function listingPriceHtml(listing) {
  const showUnit = listing.price && listing.unit && (listing.kind === "service" || listing.unit === "month");
  return `<span class="price">${money(listing.price)}${showUnit ? ` <small>/ ${escapeHtml(listing.unit)}</small>` : ""}</span>`;
}

function settingsSwitch(on, label, action, key) {
  return `<button type="button" class="settings-switch ${on ? "on" : ""}" role="switch" aria-checked="${Boolean(on)}" aria-label="${escapeHtml(label)}" data-action="${action}" data-key="${key}"><span class="settings-switch-knob"></span></button>`;
}

function settingsRow(on, title, body, action, key) {
  return `<div class="settings-row"><div class="settings-row-copy"><strong>${title}</strong><p class="muted small">${body}</p></div>${settingsSwitch(on, title, action, key)}</div>`;
}

/* ---------- Conversations ---------- */

function conversationPreview(conversation) {
  const last = conversation.messages.at(-1);
  return last ? `${last.from === "me" ? "You: " : ""}${last.text}` : "No messages yet";
}

function conversationTime(conversation) {
  const last = conversation.messages.at(-1);
  return last ? timeAgo(last.at) : "";
}

function messageBubbles(messages, emptyText) {
  if (!messages.length) return `<p class="muted small">${escapeHtml(emptyText)}</p>`;
  return messages.map((message) => `<div class="message ${message.from}">${escapeHtml(message.text)}<div class="message-meta">${escapeHtml(messageTime(message.at))}</div></div>`).join("");
}

/* ---------- Booking: the open times for one service, and which one is picked ---------- */

/**
 * Fetches a service's open times and returns { listingId, duration, slots, date, time, month, expanded }.
 * `date` and `time` are the current pick, `month` is the calendar page on screen. Pass the previous
 * booking to keep the pick when it is still open.
 */
async function loadBooking(listingId, previous = null) {
  const { duration, slots } = await api.getAvailability(listingId);
  const kept = previous?.listingId === listingId ? previous : null;
  const date = kept && slots.some((slot) => slot.date === kept.date) ? kept.date : slots[0]?.date || todayKey();
  const booking = { listingId, duration, slots, date, time: "", month: kept?.month || date.slice(0, 7), expanded: Boolean(kept?.expanded) };
  booking.time = slotsOn(booking, date).some((slot) => slot.time === kept?.time) ? kept.time : slotsOn(booking, date)[0]?.time || "";
  return booking;
}

const slotsOn = (booking, date) => booking.slots.filter((slot) => slot.date === date);

function pickBookingDate(booking, date) {
  Object.assign(booking, { date, month: date.slice(0, 7), time: slotsOn(booking, date)[0]?.time || "" });
}

function shiftBookingMonth(booking, delta) {
  const [year, month] = booking.month.split("-").map(Number);
  booking.month = dateKey(new Date(year, month - 1 + Number(delta), 1)).slice(0, 7);
}

/** A month grid and the times on the picked day. The three actions receive data-date, data-delta and data-time. */
function bookingCalendar(booking, { dateAction, monthAction, slotAction }) {
  const first = parseDateKey(`${booking.month}-01`);
  const openDates = new Set(booking.slots.map((slot) => slot.date));
  const cells = [...Array(first.getDay()).fill(null), ...Array.from({ length: new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate() }, (_, index) => index + 1)];
  const days = cells.map((day) => {
    if (!day) return `<span class="book-day is-empty"></span>`;
    const key = `${booking.month}-${String(day).padStart(2, "0")}`;
    if (!openDates.has(key)) return `<span class="book-day is-muted">${day}</span>`;
    const selected = key === booking.date;
    return `<button type="button" class="book-day ${selected ? "is-selected" : ""}" data-action="${dateAction}" data-date="${key}" aria-pressed="${selected}" aria-label="${escapeHtml(dayLabel(key))} ${day}">${day}</button>`;
  }).join("");
  const slots = slotsOn(booking, booking.date);
  const times = slots.length
    ? slots.map((slot) => `<button type="button" class="book-time ${slot.time === booking.time ? "is-selected" : ""}" data-action="${slotAction}" data-time="${escapeHtml(slot.time)}">${escapeHtml(slot.time)}</button>`).join("")
    : `<p class="muted small">No openings this day.</p>`;
  const monthTitle = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const dayTitle = parseDateKey(booking.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  return `<div class="book-cal"><div class="book-month-wrap"><div class="book-month-bar"><button type="button" class="icon-button" data-action="${monthAction}" data-delta="-1" aria-label="Previous month">${icon("chevron-left")}</button><strong>${monthTitle}</strong><button type="button" class="icon-button" data-action="${monthAction}" data-delta="1" aria-label="Next month">${icon("chevron-right")}</button></div><div class="book-month">${["S", "M", "T", "W", "T", "F", "S"].map((letter) => `<span class="book-dow">${letter}</span>`).join("")}${days}</div></div><div class="book-times"><span class="book-times-label">${dayTitle}</span><div class="book-times-list">${times}</div></div></div>`;
}
