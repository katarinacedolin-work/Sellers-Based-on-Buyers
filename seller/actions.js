/** Seller Hub actions: overrides buyer preview handlers and registers seller ACTIONS, FORMS and notification targets. */

const SELLER_DAYS = ["Today", "Tomorrow", "Sat", "Sun", "Mon", "Tue", "Wed"];
const SCHEDULE_DEFAULT = { start: 540, end: 1020 };
const PREVIEW_TOAST = "Buyers use this in the live app. Preview is read-only here.";

const SELLER_SETTING_LABELS = {
  notifyRequests: "Order notifications",
  notifyMessages: "Message notifications",
  notifyReviews: "Review notifications",
  notifyPayouts: "Payout notifications",
  notifyDigest: "Weekly summary",
  awayMode: "Away mode",
  instantBook: "Instant book",
  premium: "Premium"
};

const sellerUpdate = (changes) => (target) => {
  Object.assign(state.seller, changes(target));
  render();
};

function formatTime(value) {
  if (!value) return "12:00 PM";
  const [hour, minute] = String(value).split(":").map(Number);
  return clockLabel(hour * 60 + (minute || 0));
}

function rememberPreviewReturn() {
  if (state.view.startsWith("seller-")) state.seller.previewReturn = state.view;
}

function exitPreview() {
  setView(state.seller.previewReturn || "seller-dashboard");
}

function previewReadOnly() {
  showToast(PREVIEW_TOAST);
}

function openListingEditor(id) {
  const listing = getListing(id);
  if (!listing) return;
  const store = myStore();
  closeModal();
  state.seller.editListingId = id;
  state.seller.draft = {
    title: listing.title,
    category: listing.category,
    price: String(listing.price),
    unit: listing.unit || "",
    description: listing.description || "",
    collection: store?.collections.find((collection) => collection.listingIds.includes(id))?.name || "",
    meeting: listing.meeting || "",
    availability: listing.availability || "",
    slots: [...(listing.slots || []).filter((slot) => slot !== "Choose a time")],
    quantityAvailable: String(listing.quantityAvailable ?? 1),
    condition: listing.condition || "New",
    status: listingStatus(listing) === "soldout" ? "active" : listingStatus(listing),
    emoji: listing.emoji,
    accent: listing.accent
  };
  setView("seller-listing-edit");
}

function openStoreEditor(id) {
  const store = getStore(id || myStore()?.id);
  if (!store) return;
  closeModal();
  state.seller.editStoreId = store.id;
  state.seller.draft = {
    name: store.name,
    handle: store.handle,
    tagline: store.tagline,
    emoji: store.emoji,
    accent: store.accent,
    announcement: store.announcement || "",
    about: store.about || "",
    cancellation: store.policies?.cancellation || "",
    pickup: store.policies?.pickup || "",
    hours: store.policies?.hours || "",
    collections: store.collections.map((collection) => ({ name: collection.name, listingIds: [...collection.listingIds] }))
  };
  setView("seller-store-edit");
}

function openSellerOrder(id) {
  closeModal();
  state.seller.selectedOrderId = id;
  setView("seller-order");
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

async function reloadHoursPreview() {
  const booking = state.seller.hoursPreview;
  if (!booking?.listingId) return;
  state.seller.hoursPreview = await loadBooking(booking.listingId, booking);
}

async function saveSchedule(days) {
  await api.updateSchedule(days);
  await refresh("schedule", "listings");
  await reloadHoursPreview();
}

function cloneScheduleDays() {
  return structuredClone(data.schedule.days);
}

let ticketScanStream = null;

function stopTicketScan() {
  ticketScanStream?.getTracks().forEach((track) => track.stop());
  ticketScanStream = null;
}

async function applyScan(code) {
  const result = await api.scanTicket(code);
  state.seller.scanResult = result;
  stopTicketScan();
  await refresh("sellerOrders", "payouts", "orders", "listings");
  showToast(result.ok ? "Ticket marked used." : result.title, result.ok ? "success" : "error");
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
        if (value) return applyScan(value);
      } catch { /* keep watching */ }
      requestAnimationFrame(watch);
    };
    watch();
    if (note) note.textContent = "Point the camera at the buyer's QR code.";
  } catch {
    if (note) note.textContent = "Camera permission was blocked. Enter the code under the QR instead.";
  }
}

const firstServiceListing = () => myListings().find((listing) => listing.kind === "service");

/* ---------- Actions ---------- */

Object.assign(ACTIONS, {
  "seller-exit-preview": () => exitPreview(),

  "back-from-detail": () => exitPreview(),
  "back-from-store": () => setView(state.seller.previewReturn || "seller-stores", { storeReturn: null }),

  "message-seller": previewReadOnly,
  "message-store": previewReadOnly,
  "primary-listing-action": previewReadOnly,
  "toggle-save": previewReadOnly,
  "toggle-follow-store": previewReadOnly,
  "confirm-order": previewReadOnly,
  "start-checkout": previewReadOnly,

  "seller-new-listing": () => {
    state.sellKind = null;
    state.sellMerchandiseType = null;
    setView("seller-new");
  },

  "seller-edit-listing": (target) => openListingEditor(target.dataset.id),

  "seller-preview-listing": async (target) => {
    const listing = getListing(target.dataset.id);
    if (!listing) return;
    rememberPreviewReturn();
    const booking = listing.kind === "service" ? await loadBooking(listing.id) : null;
    setView("listing", { selectedListingId: listing.id, detailReturn: null, booking, quantity: 1 });
  },

  "seller-preview-profile": () => {
    rememberPreviewReturn();
    setView("seller", { selectedSellerId: myId() });
  },

  "seller-preview-store": (target) => {
    const storeId = target.dataset.id || myStore()?.id;
    if (!storeId) return;
    rememberPreviewReturn();
    setView("store", { selectedStoreId: storeId, storeReturn: null, storeTab: "shop", storeCollection: "All", storeQuery: "", storeKind: "all" });
  },

  "seller-toggle-listing-status": async (target) => {
    const listing = getListing(target.dataset.id);
    if (!listing) return;
    const status = listingStatus(listing);
    const next = status === "active" ? "paused" : "active";
    await api.updateListing(listing.id, { status: next });
    await refresh("listings");
    showToast(next === "active" ? `${listing.title} is live for buyers.` : `${listing.title} is paused and hidden from buyers.`);
  },

  "seller-duplicate-listing": async (target) => {
    const copy = await api.duplicateListing(target.dataset.id);
    await refresh("listings");
    showToast("Duplicated as a draft.");
    openListingEditor(copy.id);
  },

  "seller-delete-listing": (target) => {
    const listing = getListing(target.dataset.id);
    if (listing) openDeleteListingModal(listing);
  },

  "seller-confirm-delete-listing": async (target) => {
    const listing = getListing(target.dataset.id);
    await api.deleteListing(target.dataset.id);
    closeModal();
    await refresh("listings", "stores");
    showToast(`${listing?.title || "Listing"} deleted.`);
    setView("seller-listings");
  },

  "seller-set-listings-tab": (target) => {
    state.seller.listingsTab = target.dataset.tab;
    if (state.view === "seller-listings") render();
    else setView("seller-listings");
  },
  "seller-set-listings-kind": sellerUpdate((target) => ({ listingsKind: target.dataset.kind })),
  "seller-clear-listing-filters": () => {
    Object.assign(state, { listingsQuery: "" });
    Object.assign(state.seller, { listingsTab: "all", listingsKind: "all" });
    render();
  },

  "seller-set-draft-status": (target) => {
    if (state.seller.draft) state.seller.draft.status = target.dataset.status;
    render();
  },
  "seller-set-draft-accent": (target) => {
    if (state.seller.draft) state.seller.draft.accent = target.dataset.accent;
    render();
  },

  "seller-add-slot": () => {
    const draft = state.seller.draft;
    if (!draft) return;
    const day = document.querySelector("#seller-slot-day")?.value || "Today";
    const time = formatTime(document.querySelector("#seller-slot-time")?.value);
    const slot = `${day} · ${time}`;
    if (draft.slots.includes(slot)) return showToast("That slot is already open.", "error");
    draft.slots.push(slot);
    render();
  },

  "seller-remove-slot": (target) => {
    state.seller.draft?.slots.splice(Number(target.dataset.index), 1);
    render();
  },

  "seller-open-order": (target) => openSellerOrder(target.dataset.id),

  "seller-back-to-orders": () => {
    const order = getSellerOrder(state.seller.selectedOrderId);
    if (order) state.seller.ordersTab = order.status;
    state.seller.ordersLayout = "list";
    setView("seller-orders");
  },

  "seller-set-orders-tab": sellerUpdate((target) => ({ ordersTab: target.dataset.tab })),
  "seller-set-orders-layout": (target) => {
    state.seller.ordersLayout = target.dataset.layout;
    if (state.view === "seller-orders") render();
    else setView("seller-orders");
  },

  "seller-order-accept": async (target) => {
    const order = await api.updateOrderStatus(target.dataset.id, "confirmed");
    await refresh("sellerOrders", "notifications", "listings");
    const calendar = order.kind === "service" && data.calendar.connected ? " Added to Google Calendar." : "";
    showToast(`Accepted. ${firstName(order.buyer)} has been notified.${calendar}`);
  },

  "seller-order-ready": async (target) => {
    await api.updateOrderStatus(target.dataset.id, "ready");
    await refresh("sellerOrders", "notifications", "listings");
    showToast("Marked ready. The buyer knows where to meet you.");
  },

  "seller-order-complete": async (target) => {
    const order = await api.updateOrderStatus(target.dataset.id, "completed");
    await refresh("sellerOrders", "notifications", "listings", "payouts");
    showToast(`Completed. ${money(order.amount)} added to your balance.`);
  },

  "seller-order-decline": (target) => openOrderReasonModal(getSellerOrder(target.dataset.id), "decline"),
  "seller-order-cancel": (target) => openOrderReasonModal(getSellerOrder(target.dataset.id), "cancel"),

  "seller-order-reschedule": async (target) => {
    const order = getSellerOrder(target.dataset.id);
    const { slots } = await api.getAvailability(order.listingId);
    openRescheduleModal(order, slots);
  },

  "seller-order-thanks": async (target) => {
    await api.requestReview(target.dataset.id);
    await refresh("sellerOrders", "notifications");
    showToast("Review request sent to the buyer.");
  },

  "seller-message-buyer": async (target) => {
    const conversation = await api.openOrderConversation(target.dataset.id);
    await refresh("conversations");
    setView("seller-inbox", { selectedConversationId: conversation.id });
  },

  "seller-start-scan": () => startTicketCamera(),

  "seller-set-inbox-filter": sellerUpdate((target) => ({ inboxFilter: target.dataset.filter })),

  "seller-toggle-done": async (target) => {
    const conversation = data.conversations.find((entry) => entry.id === target.dataset.id);
    await api.setConversationDone(target.dataset.id, !conversation?.done);
    await refresh("conversations");
    showToast(conversation?.done ? "Moved back to active." : "Marked as done.");
  },

  "seller-quick-reply": (target) => {
    const input = document.querySelector(".chat-composer textarea");
    if (!input) return;
    input.value = input.value ? `${input.value} ${target.dataset.text}` : target.dataset.text;
    input.focus();
  },

  "seller-open-context": (target) => {
    const conversation = data.conversations.find((entry) => entry.id === target.dataset.id);
    if (conversation?.orderId && getSellerOrder(conversation.orderId)) return openSellerOrder(conversation.orderId);
    if (conversation?.listingId) openListingEditor(conversation.listingId);
  },

  "seller-set-notifications-filter": sellerUpdate((target) => ({ notificationsFilter: target.dataset.filter })),
  "seller-open-notification-settings": () => {
    state.seller.profileSection = "notifications";
    setView("seller-profile");
  },

  "seller-set-profile-section": sellerUpdate((target) => ({ profileSection: target.dataset.section })),

  "seller-toggle-setting": async (target) => {
    const { key } = target.dataset;
    await api.updateSellerSettings({ [key]: !data.sellerSettings[key] });
    await refresh("sellerSettings", "listings");
    const label = SELLER_SETTING_LABELS[key] || target.getAttribute("aria-label") || key;
    if (key === "awayMode") {
      showToast(data.sellerSettings.awayMode ? "Away mode on. All active listings are paused." : "Welcome back. Your listings are live again.");
    } else {
      showToast(`${label} ${data.sellerSettings[key] ? "on" : "off"}.`);
    }
  },

  "seller-premium": () => openPremiumModal(),

  "seller-toggle-premium": async () => {
    await api.updateSellerSettings({ premium: !data.sellerSettings.premium });
    await refresh("sellerSettings", "listings");
    closeModal();
    showToast(data.sellerSettings.premium ? "Premium is on for this demo." : "Premium turned off.");
  },

  "seller-add-phone": () => openPhoneModal(),

  "seller-connect-google": async () => {
    await api.connectCalendar();
    await refresh("calendar", "listings");
    await reloadHoursPreview();
    showToast("Google Calendar connected. Times that overlap an event stay closed.");
  },

  "seller-disconnect-google": async () => {
    await api.disconnectCalendar();
    await refresh("calendar", "listings");
    await reloadHoursPreview();
    showToast("Google Calendar disconnected. Your weekly hours stay as they are.");
  },

  "seller-edit-store": (target) => openStoreEditor(target.dataset.id || myStore()?.id),
  "seller-share-store": (target) => shareLink(`store/${target.dataset.id || myStore()?.id}`),
  "seller-post-announcement": () => openAnnouncementModal(),

  "seller-add-collection": () => {
    const name = document.querySelector("#seller-new-collection")?.value.trim();
    if (!name) return showToast("Give the collection a name first.", "error");
    state.seller.draft.collections.push({ name, listingIds: [] });
    render();
  },

  "seller-remove-collection": (target) => {
    state.seller.draft?.collections.splice(Number(target.dataset.index), 1);
    render();
  },

  "seller-set-reviews-filter": sellerUpdate((target) => ({ reviewsFilter: target.dataset.filter })),
  "seller-withdraw": () => openWithdrawModal(),
  "seller-change-method": () => openPayoutMethodModal(),

  "seller-back-availability": () => {
    state.seller.profileSection = "availability";
    setView("seller-profile");
  },

  "seller-schedule-toggle": async (target) => {
    const days = cloneScheduleDays();
    const day = target.dataset.day;
    days[day] = days[day]?.length ? [] : [{ ...SCHEDULE_DEFAULT }];
    state.seller.scheduleCopy = null;
    await saveSchedule(days);
    render();
  },

  "seller-schedule-add": async (target) => {
    const days = cloneScheduleDays();
    const ranges = days[target.dataset.day];
    if (!ranges?.length) return;
    const last = ranges[ranges.length - 1];
    const start = last ? last.end : SCHEDULE_DEFAULT.start;
    const end = Math.min(start + 60, 21 * 60);
    if (end <= start || (last && end > 21 * 60)) return showToast("No room for another block that day.", "error");
    ranges.push({ start, end: last ? end : SCHEDULE_DEFAULT.end });
    await saveSchedule(days);
    render();
  },

  "seller-schedule-remove": async (target) => {
    const days = cloneScheduleDays();
    days[target.dataset.day]?.splice(Number(target.dataset.index), 1);
    await saveSchedule(days);
    render();
  },

  "seller-schedule-copy": (target) => {
    const day = target.dataset.day;
    state.seller.scheduleCopy = state.seller.scheduleCopy?.from === day ? null : { from: day, targets: [] };
    render();
  },

  "seller-schedule-copy-toggle": (target) => {
    const copy = state.seller.scheduleCopy;
    if (!copy) return;
    const { day } = target.dataset;
    copy.targets = copy.targets.includes(day) ? copy.targets.filter((id) => id !== day) : [...copy.targets, day];
    render();
  },

  "seller-schedule-copy-apply": async () => {
    const copy = state.seller.scheduleCopy;
    if (!copy?.from || !copy.targets.length) return showToast("Pick at least one day.", "error");
    const days = cloneScheduleDays();
    const source = days[copy.from];
    if (!source) return;
    copy.targets.forEach((id) => { days[id] = source.map((range) => ({ ...range })); });
    const names = copy.targets.map((id) => WEEK_DAYS.find((entry) => entry.id === id)?.short).filter(Boolean);
    state.seller.scheduleCopy = null;
    await saveSchedule(days);
    showToast(`Hours copied to ${names.join(", ")}.`);
    render();
  },

  "seller-preview-date": (target) => {
    if (!state.seller.hoursPreview) return;
    pickBookingDate(state.seller.hoursPreview, target.dataset.date);
    render();
  },

  "seller-preview-month": (target) => {
    if (!state.seller.hoursPreview) return;
    shiftBookingMonth(state.seller.hoursPreview, target.dataset.delta);
    render();
  },

  "seller-preview-slot": (target) => {
    if (!state.seller.hoursPreview) return;
    state.seller.hoursPreview.time = target.dataset.time;
    render();
  },

  "seller-set-range": sellerUpdate((target) => ({ analyticsRange: Number(target.dataset.range) }))
});

/* ---------- Forms ---------- */

Object.assign(FORMS, {
  "publish-listing": async (fields, form) => {
    const listing = await api.createListing({
      ...fields,
      kind: state.sellKind,
      merchandiseType: state.sellMerchandiseType,
      draft: fields.intent === "draft"
    });
    await load("listings");
    state.sellKind = null;
    state.sellMerchandiseType = null;
    if (listing.kind === "service" && fields.intent !== "draft") {
      openListingEditor(listing.id);
      showToast("Your service is live. Weekly hours control when buyers can book.");
      return;
    }
    state.seller.listingsTab = fields.intent === "draft" ? "draft" : "all";
    setView("seller-listings");
    showToast(fields.intent === "draft" ? "Saved as a draft. Only you can see it." : `${listing.title} is live.`);
  },

  "seller-save-listing": async () => {
    const id = state.seller.editListingId;
    const draft = state.seller.draft;
    if (!id || !draft) return;
    await api.updateListing(id, {
      title: draft.title,
      category: draft.category,
      price: draft.price,
      unit: draft.unit,
      description: draft.description,
      meeting: draft.meeting,
      emoji: draft.emoji,
      accent: draft.accent,
      status: draft.status,
      quantityAvailable: draft.quantityAvailable,
      condition: draft.condition,
      availability: draft.availability,
      collection: draft.collection
    });
    state.seller.draft = null;
    state.seller.editListingId = null;
    await refresh("listings");
    setView("seller-listings");
    showToast("Listing saved.");
  },

  "seller-order-reason": async (fields, form) => {
    const reason = [fields.reason, fields.message].filter(Boolean).join(". ");
    await api.updateOrderStatus(form.dataset.id, "cancelled", { reason });
    closeModal();
    await refresh("sellerOrders", "notifications", "listings", "payouts");
    showToast(form.dataset.kind === "decline" ? "Request declined. The buyer wasn't charged." : "Order cancelled and refunded.");
  },

  "seller-reschedule": async (fields, form) => {
    const [date, time] = (fields.slot || "").split("|");
    await api.rescheduleOrder(form.dataset.id, { date, time });
    closeModal();
    await refresh("sellerOrders", "notifications", "listings");
    showToast("New time sent to the buyer.");
  },

  "seller-save-profile": async (fields) => {
    await api.updateSellerProfile(fields);
    await refresh("sellers", "listings");
    showToast("Profile saved for this demo session.");
  },

  "seller-save-store": async () => {
    const id = state.seller.editStoreId;
    const draft = state.seller.draft;
    if (!id || !draft) return;
    await api.updateStore(id, {
      name: draft.name,
      handle: draft.handle,
      tagline: draft.tagline,
      emoji: draft.emoji,
      accent: draft.accent,
      announcement: draft.announcement,
      about: draft.about,
      policies: { cancellation: draft.cancellation, pickup: draft.pickup, hours: draft.hours },
      collections: draft.collections
    });
    state.seller.draft = null;
    state.seller.editStoreId = null;
    await refresh("stores");
    setView("seller-stores");
    showToast("Store saved.");
  },

  "seller-review-reply": async (fields, form) => {
    await api.replyToReview(form.dataset.id, fields.reply);
    await refresh("reviews");
    showToast("Reply posted publicly.");
  },

  "seller-scan-code": async (fields) => {
    await applyScan(fields.code);
  },

  "seller-withdraw": async (fields) => {
    await api.withdraw(fields.amount);
    closeModal();
    await refresh("payouts");
    showToast(`${money(Number(fields.amount))} is on its way to ${data.payouts.method}.`);
  },

  "seller-announcement": async (fields) => {
    const store = myStore();
    if (!store) return;
    await api.updateStore(store.id, { announcement: fields.text });
    closeModal();
    await refresh("stores");
    showToast(`Posted to ${store.name}.`);
  },

  "seller-save-phone": async (fields) => {
    await api.updateSellerSettings({ backupPhone: fields.backupPhone });
    closeModal();
    await refresh("sellerSettings");
    showToast("Phone number saved for this demo.");
  },

  "seller-payout-method": async (fields) => {
    await api.updatePayoutMethod(fields);
    closeModal();
    await refresh("payouts");
    showToast("Payout method updated.");
  }
});

/* ---------- Notifications ---------- */

Object.assign(NOTIFICATION_TARGETS, {
  order: (notification) => {
    if (!notification?.orderId || !getSellerOrder(notification.orderId)) return;
    openSellerOrder(notification.orderId);
  },
  inbox: (notification) => {
    if (!notification?.conversationId) return;
    setView("seller-inbox", { selectedConversationId: notification.conversationId });
  },
  listing: (notification) => {
    if (!notification?.listingId || !getListing(notification.listingId)) return;
    openListingEditor(notification.listingId);
  },
  reviews: () => setView("seller-reviews"),
  payouts: () => setView("seller-payouts"),
  store: () => setView("seller-stores")
});

/* ---------- Seller-only UI wiring ---------- */

if (IS_SELLER) {
  let loadingHoursPreview = false;
  let lastView = null;

  document.addEventListener("app:render", () => {
    if (state.view !== "seller-scan" && lastView === "seller-scan") stopTicketScan();
    lastView = state.view;

    run(async () => {
      const open = state.view === "seller-inbox" && selectedConversation();
      if (open?.unread) {
        await api.markConversationRead(open.id);
        await refresh("conversations");
      }
    });

    if (state.view === "seller-availability" && !state.seller.hoursPreview && !loadingHoursPreview) {
      const service = firstServiceListing();
      if (!service) return;
      loadingHoursPreview = true;
      run(async () => {
        state.seller.hoursPreview = await loadBooking(service.id);
        loadingHoursPreview = false;
        render();
      });
    }
  });

  document.addEventListener("input", (event) => {
    const field = event.target;
    const draft = state.seller.draft;
    if (!draft) return;
    if (field.dataset.draft) {
      draft[field.dataset.draft] = field.value;
      if (field.hasAttribute("data-rerender")) render();
      else refreshSellerPreview();
      return;
    }
    if (field.dataset.collectionName !== undefined) {
      draft.collections[Number(field.dataset.collectionName)].name = field.value;
      return;
    }
    if (field.dataset.collectionIndex !== undefined) {
      const collection = draft.collections[Number(field.dataset.collectionIndex)];
      collection.listingIds = field.checked
        ? [...new Set([...collection.listingIds, field.value])]
        : collection.listingIds.filter((listingId) => listingId !== field.value);
    }
  });

  document.addEventListener("change", async (event) => {
    const field = event.target;
    if (field.dataset.scheduleDay) {
      const days = cloneScheduleDays();
      const range = days[field.dataset.scheduleDay]?.[Number(field.dataset.scheduleIndex)];
      if (!range) return;
      range[field.dataset.scheduleField] = Number(field.value);
      if (range.end <= range.start) {
        range.end = Math.min(range.start + 60, 21 * 60);
        showToast("The end time has to be after the start.", "error");
      }
      await saveSchedule(days);
      render();
      return;
    }
    if (field.dataset.previewListing !== undefined) {
      state.seller.hoursPreview = await loadBooking(field.value, state.seller.hoursPreview);
      render();
    }
  });
}
