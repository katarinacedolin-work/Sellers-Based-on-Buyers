/** Small pure helpers shared by the app and the mock backend. Nothing here reads or writes app state. */

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

/** A listing price: "$24.00", or "Free" when it costs nothing. */
const money = (amount) => (Number(amount) === 0 ? "Free" : `$${Number(amount).toFixed(2)}`);

/** A balance or total, always numeric: "$0.00". */
const dollars = (amount) => `$${Number(amount).toFixed(2)}`;

/** The first dollar figure in free text such as "$25/hour", as a number. */
const amountValue = (text) => Number((String(text ?? "").match(/\d+(?:\.\d+)?/) || [0])[0]);

const formatNumber = (value) => Math.round(value).toLocaleString("en-US");
const plural = (count, one, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;
const firstName = (name) => String(name || "").trim().split(/\s+/)[0] || "";
const initialsOf = (name) => String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");

/* ---------- Dates. A "date key" is a local calendar day written as YYYY-MM-DD. ---------- */

const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const todayKey = () => dateKey(new Date());

function parseDateKey(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(key, count) {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + count);
  return dateKey(date);
}

const daysFromToday = (key) => Math.round((parseDateKey(key) - parseDateKey(todayKey())) / 86400000);

/** "Today", "Tomorrow", "Yesterday", a weekday within the week, otherwise "Nov 21". */
function dayLabel(key) {
  const days = daysFromToday(key);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  const date = parseDateKey(key);
  return Math.abs(days) < 7
    ? date.toLocaleDateString("en-US", { weekday: "short" })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** A booking slot ({ date, time }) as "Sat · 2:00 PM". */
const slotLabel = (slot) => [dayLabel(slot.date), slot.time].filter(Boolean).join(" · ");

/* ---------- Timestamps. The API sends ISO strings and the UI formats them. ---------- */

/** "just now", "12m ago", "2h ago", then the day ("Yesterday", "Mon", "Sep 17"). */
function timeAgo(iso) {
  const then = new Date(iso);
  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const day = dateKey(then);
  return day === todayKey() ? `${Math.floor(minutes / 60)}h ago` : dayLabel(day);
}

/** A chat timestamp: the clock time for today, otherwise the day. */
function messageTime(iso) {
  const then = new Date(iso);
  return dateKey(then) === todayKey() ? then.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : dayLabel(dateKey(then));
}

/** "Mon, Sep 21". */
const longDate = (iso) => new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

/* ---------- Clock times. Hours are stored as minutes after midnight. ---------- */

/** "4:00 PM" → 960, or null when the text is not a clock time. */
function clockMinutes(label) {
  const match = String(label ?? "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  return (Number(match[1]) % 12) * 60 + Number(match[2]) + (match[3].toUpperCase() === "PM" ? 720 : 0);
}

/** 960 → "4:00 PM". */
const clockLabel = (minutes) => `${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${minutes >= 720 ? "PM" : "AM"}`;

/** How long a service runs, read from its unit ("45 min", "2 hours", "hour"). Defaults to an hour. */
function durationMinutes(listing) {
  const unit = String(listing?.unit || "").toLowerCase();
  const hours = unit.match(/(\d+(?:\.\d+)?)\s*(hour|hr)/);
  if (hours) return Math.round(Number(hours[1]) * 60);
  const minutes = unit.match(/(\d+)\s*min/);
  return minutes ? Number(minutes[1]) : 60;
}
