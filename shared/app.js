/**
 * The app shell. It draws the current view, keeps the header in sync, and routes clicks, form submits and
 * keys to the registries in ui.js. Loaded last, after the page's views and actions.
 *
 * Markup talks to the shell through attributes:
 *   data-view="name"     go to that view, clearing filters (a navigation link)
 *   data-action="name"   run ACTIONS[name]
 *   data-form="name"     on a <form>: run FORMS[name] with its fields when submitted
 *   data-live="key"      on an <input>: copy what is typed into state[key] and redraw
 */

/* ---------- Drawing ---------- */

function render() {
  const view = VIEWS[state.view] || VIEWS[HOME_VIEW];
  document.querySelector("#app-main").innerHTML = view();
  updateChrome();
  document.querySelectorAll(".chat-messages").forEach((thread) => { thread.scrollTop = thread.scrollHeight; });
  document.dispatchEvent(new CustomEvent("app:render"));
}

/** The header: which link is current, the unread badges, the avatar and the notification popover. */
function updateChrome() {
  const parent = NAV_PARENTS[state.view];
  const current = typeof parent === "function" ? parent() : parent || state.view;
  document.querySelectorAll(".desktop-header [data-view], .mobile-bottom-nav [data-view]").forEach((link) => {
    const active = link.dataset.view === current;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  setBadge(".messages-nav-button", unreadCount(data.conversations), "Messages");
  setBadge(".notifications-nav-button", unreadCount(data.notifications), "Notifications");
  document.querySelector(".profile-nav-button").textContent = initialsOf(IS_SELLER ? getSeller(myId())?.name : data.account.displayName);

  if (IS_SELLER) {
    const requests = data.sellerOrders.filter((order) => order.status === "requested").length;
    document.querySelectorAll(".seller-orders-badge").forEach((badge) => {
      badge.textContent = requests > 9 ? "9+" : String(requests);
      badge.hidden = !requests;
    });
  }

  const bell = document.querySelector(".notifications-nav-button");
  bell.classList.toggle("active", state.notificationsOpen);
  bell.setAttribute("aria-expanded", state.notificationsOpen);
  const popover = document.querySelector("#notification-popover");
  popover.hidden = !state.notificationsOpen;
  popover.innerHTML = state.notificationsOpen ? notificationPopover() : "";
}

function setBadge(buttonSelector, count, label) {
  const button = document.querySelector(buttonSelector);
  const badge = button.querySelector(".header-badge");
  badge.textContent = count > 9 ? "9+" : count;
  badge.hidden = !count;
  button.setAttribute("aria-label", count ? `${label}, ${count} unread` : label);
}

function notificationPopover() {
  const unread = unreadCount(data.notifications);
  const rows = data.notifications.map((notification) => `<button type="button" class="notification-popover-row ${notification.unread ? "unread" : ""}" data-action="open-notification" data-id="${notification.id}"><span class="activity-thumb ${notification.accent}">${notification.emoji}</span><span class="notification-popover-copy"><span class="notification-popover-top"><strong>${escapeHtml(notification.title)}</strong><span class="muted small">${escapeHtml(timeAgo(notification.at))}</span></span><span class="notification-popover-body muted">${escapeHtml(notification.body)}</span></span>${notification.unread ? `<span class="unread-dot" aria-label="Unread"></span>` : ""}</button>`).join("");
  return `<div class="notification-popover-header"><div><strong>Notifications</strong>${unread ? `<span class="muted small">${unread} unread</span>` : ""}</div><button type="button" class="text-button" data-action="mark-all-notifications-read">Mark all read</button></div>
    <div class="notification-popover-list">${rows || `<p class="muted small" style="padding: 14px">Nothing new yet.</p>`}</div>
    <div class="notification-popover-footer">${IS_SELLER ? `<button type="button" class="text-button" data-view="seller-notifications">View all ${icon("arrow")}</button>` : ""}<button type="button" class="ghost-button" data-action="close-notifications">Close</button></div>`;
}

function toggleNotifications(open) {
  state.notificationsOpen = open;
  updateChrome();
}

/** Goes to a view from a navigation link: filters and open items start over. */
function navigate(view) {
  closeModal();
  Object.assign(state, NAVIGATION_DEFAULTS, { notificationsOpen: false });
  setView(view);
}

/* ---------- Shared modals ---------- */

function openHelpModal() {
  renderModal(`<div class="eyebrow">Support</div><h2>Tell us what happened.</h2><p class="muted">This prototype does not send a real case, but the interaction shows how support should feel: calm, specific and connected to the order.</p><form data-form="support"><div class="field"><label for="support-topic">What do you need help with?</label><select id="support-topic" name="topic"><option>Question about a booking</option><option>Question about a product pickup</option><option>Safety or trust concern</option><option>Payment or refund question</option></select></div><div class="field" style="margin-top: 13px"><label for="support-message">Tell us more</label><textarea id="support-message" name="message" required placeholder="Share the details we need to understand."></textarea></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Create demo case ${icon("arrow")}</button></div></form>`);
}

function openReportModal() {
  renderModal(`<div class="eyebrow">Safety and trust</div><h2>Report a concern.</h2><p class="muted">Report content, a message or a handoff that does not feel right. Your report would be linked to the relevant context for review.</p><form data-form="report"><div class="field"><label for="report-reason">Reason</label><select id="report-reason" name="reason"><option>Unsafe meetup or behavior</option><option>Off-platform payment request</option><option>Harassment or discrimination</option><option>Listing is misleading</option></select></div><div class="field" style="margin-top: 13px"><label for="report-message">What should the team know?</label><textarea id="report-message" name="message" required placeholder="Describe what happened."></textarea></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="danger-button" type="submit">Submit report</button></div></form>`);
}

function openVerifiedModal() {
  renderModal(`<div class="success-mark">${icon("verified")}</div><div class="eyebrow">Trust detail</div><h2>Student verified</h2><p class="muted">This demo badge represents a successful student-status check. It does not mean a seller is university-approved, guaranteed or automatically safe.</p><div class="trust-note">In the real app, the verification method, evidence collected and support path would be explained in plain language.</div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Got it</button></div>`);
}

function openSignOutModal() {
  renderModal(`<div class="eyebrow">Your account</div><h2>Sign out?</h2><p class="muted">You will go back to the start, and this demo starts over.</p><div class="modal-actions"><button class="ghost-button" data-action="close-modal">Stay signed in</button><button class="danger-button" data-action="confirm-sign-out">${icon("logout")} Sign out</button></div>`);
}

/* ---------- Actions and forms every page has ---------- */

Object.assign(ACTIONS, {
  "go-home": () => navigate(HOME_VIEW),
  "switch-mode": () => {
    api.keepDemoData();
    location.href = IS_SELLER ? "index.html" : "seller.html";
  },
  reload: () => location.reload(),
  "close-modal": () => closeModal(),
  share: (target) => shareLink(target.dataset.path),
  "open-help": () => openHelpModal(),
  "open-report": () => openReportModal(),
  "open-verified": () => openVerifiedModal(),
  "sign-out": () => openSignOutModal(),
  "confirm-sign-out": async () => {
    await api.signOut();
    location.href = "index.html";
  },

  "toggle-notifications": () => toggleNotifications(!state.notificationsOpen),
  "close-notifications": () => toggleNotifications(false),
  "mark-all-notifications-read": async () => {
    await api.markAllNotificationsRead();
    await refresh("notifications");
    showToast("All notifications marked as read.");
  },
  "open-notification": async (target) => {
    const notification = data.notifications.find((entry) => entry.id === target.dataset.id);
    state.notificationsOpen = false;
    if (!notification) {
      await refresh("notifications");
      showToast("That notification is no longer here.", "error");
      return;
    }
    await api.markNotificationRead(notification.id);
    await refresh("notifications");
    await NOTIFICATION_TARGETS[notification.action]?.(notification);
  }
});

Object.assign(FORMS, {
  support: async (fields) => {
    await api.createSupportCase(fields);
    closeModal();
    showToast("Demo support case created. Someone would follow up here.");
  },
  report: async (fields) => {
    await api.submitReport(fields);
    closeModal();
    showToast("Demo report submitted for review.");
  }
});

/* ---------- Events ---------- */

/** Runs a handler for an element, ignoring repeat clicks or submits while the first one is still in flight. */
async function runOnce(element, handler, ...args) {
  if (element.dataset.busy) return;
  element.dataset.busy = "true";
  await run(handler, ...args);
  delete element.dataset.busy;
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-backdrop")) return closeModal();
  if (state.notificationsOpen && !event.target.closest(".header-popover-anchor")) toggleNotifications(false);
  const target = event.target.closest("[data-view], [data-action]");
  if (!target) return;
  if (target.dataset.view) return navigate(target.dataset.view);
  const handler = ACTIONS[target.dataset.action];
  if (handler) runOnce(target, handler, target, event);
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const handler = FORMS[form.dataset.form];
  if (!handler) return;
  const fields = Object.fromEntries([...new FormData(form, event.submitter)].map(([name, value]) => [name, String(value).trim()]));
  runOnce(form, handler, fields, form, event);
});

document.addEventListener("input", (event) => {
  const input = event.target;
  if (!input.dataset.live) return;
  const caret = input.selectionStart;
  state[input.dataset.live] = input.value;
  render();
  const redrawn = document.getElementById(input.id);
  redrawn.focus();
  redrawn.setSelectionRange(caret, caret);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeModal();
  if (state.notificationsOpen) toggleNotifications(false);
});

/* ---------- Start ---------- */

async function start() {
  hydrateStaticIcons();
  try {
    await load(...(IS_SELLER ? SELLER_DATA : BUYER_DATA));
  } catch (error) {
    console.error(error);
    document.querySelector("#app-main").innerHTML = `<div class="empty-state"><div class="empty-shape">⌁</div><h3>Campus Connect could not load.</h3><p class="muted">${escapeHtml(error.message)}</p><button class="primary-button" data-action="reload">Try again</button></div>`;
    return;
  }
  render();
  document.dispatchEvent(new CustomEvent("app:ready"));
}

/* An old link format: index.html#seller opened the Seller Hub. */
if (!IS_SELLER && location.hash === "#seller") location.replace("seller.html");
else start();
