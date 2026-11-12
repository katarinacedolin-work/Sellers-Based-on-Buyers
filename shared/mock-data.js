/**
 * Seed data for the mock backend in api.js. This is the only place demo content lives.
 *
 * Timestamps and booking dates are written relative to "now", so the demo always looks current.
 * Delete this file once api.js talks to a real service.
 */
const MOCK_BUYER_ID = "katarina-cedolin";
const MOCK_SELLER_ID = "maya-chen";

function createMockDb() {
  const HOUR = 60;
  const DAY = 24 * HOUR;
  const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();
  const inDays = (count) => addDays(todayKey(), count);
  /** 9 AM on the Monday `weeks` weeks before this week's. Automatic payouts go out on Mondays. */
  const pastMonday = (weeks) => {
    const date = new Date();
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7) - weeks * 7);
    date.setHours(9, 0, 0, 0);
    return date.toISOString();
  };

  /* ---------- Catalog ---------- */

  const categories = [
    { name: "Learn", dot: "sky", kind: "service", icon: "book-open" },
    { name: "Create", dot: "lilac", kind: "service", icon: "palette" },
    { name: "Beauty", dot: "coral", kind: "service", icon: "sparkles" },
    { name: "Tech", dot: "mint", kind: "service", icon: "laptop" },
    { name: "Lifestyle", dot: "butter", kind: "service", icon: "sun" },
    { name: "Help", dot: "sky", kind: "service", icon: "hand-helping" },
    { name: "Events", dot: "coral", kind: "service", icon: "calendar-star" },
    { name: "Furniture", dot: "butter", kind: "product", icon: "lamp" },
    { name: "Clothing", dot: "lilac", kind: "product", icon: "shirt" },
    { name: "Textbooks", dot: "sky", kind: "product", icon: "book" }
  ];

  const services = [
    {
      id: "maya-portraits", kind: "service", category: "Create", title: "Grad portraits with Maya", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.9", reviews: 18, completed: 28, price: 65, unit: "45 min", accent: "coral", emoji: "📸", tag: "Popular", availability: "Today · 4:00 PM", campus: "SDSU", verified: true,
      description: "Natural, colorful graduation portraits around campus. You get 20 edited photos delivered within five days.", meeting: "Love Library steps or another campus spot", response: "Usually replies in under an hour", slots: ["Today · 4:00 PM", "Today · 5:00 PM", "Tomorrow · 11:00 AM", "Sat · 2:00 PM"]
    },
    {
      id: "noah-calculus", kind: "service", category: "Learn", title: "Calculus II tutoring", seller: "Noah Williams", initials: "NW", sellerId: "noah-williams", storeId: "noah-studies", rating: "5.0", reviews: 11, completed: 19, price: 30, unit: "hour", accent: "sky", emoji: "∫", tag: "New this week", availability: "Today · 6:00 PM", campus: "SDSU", verified: true,
      description: "Patient, practical tutoring for sequences, series and exam prep. Bring the problems you are stuck on.", meeting: "Library study room or video call", response: "Usually replies in a few hours", slots: ["Today · 6:00 PM", "Wed · 3:30 PM", "Thu · 5:00 PM", "Sun · 12:00 PM"]
    },
    {
      id: "zoe-nails", kind: "service", category: "Beauty", title: "Soft gel set by Zoe", seller: "Zoe Rivera", initials: "ZR", sellerId: "zoe-rivera", storeId: "zoe-nail-studio", rating: "4.8", reviews: 26, completed: 34, price: 45, unit: "90 min", accent: "lilac", emoji: "💅", tag: "Student favorite", availability: "Fri · 4:30 PM", campus: "SDSU", verified: true,
      description: "Simple, glossy gel sets with custom color and tiny details. A calm appointment between classes.", meeting: "On-campus beauty studio", response: "Usually replies in under two hours", slots: ["Fri · 4:30 PM", "Sat · 11:00 AM", "Sat · 1:00 PM", "Sun · 3:00 PM"]
    },
    {
      id: "ari-video", kind: "service", category: "Tech", title: "Short-form video edit", seller: "Ari Patel", initials: "AP", sellerId: "ari-patel", storeId: "ari-edits", rating: "4.9", reviews: 9, completed: 14, price: 40, unit: "per video", accent: "mint", emoji: "🎬", tag: "Portfolio ready", availability: "Next opening · Tue", campus: "SDSU", verified: true,
      description: "A punchy social edit from your raw clips: captions, pacing, music and one revision included.", meeting: "Digital delivery", response: "Usually replies same day", slots: ["Tue · 2:00 PM", "Wed · 1:00 PM", "Thu · 4:00 PM"]
    },
    {
      id: "leo-move", kind: "service", category: "Help", title: "Move-out help", seller: "Leo Thompson", initials: "LT", sellerId: "leo-thompson", storeId: "leo-lifts", rating: "4.9", reviews: 7, completed: 12, price: 25, unit: "hour", accent: "butter", emoji: "📦", tag: "Useful now", availability: "Sat · 10:00 AM", campus: "SDSU", verified: true,
      description: "One extra pair of hands for boxes, small furniture and a tidy move between campus housing.", meeting: "Your residence hall", response: "Usually replies within a few hours", slots: ["Sat · 10:00 AM", "Sat · 1:00 PM", "Sun · 10:00 AM"]
    },
    {
      id: "leo-carry", kind: "service", category: "Help", title: "Furniture carry", seller: "Leo Thompson", initials: "LT", sellerId: "leo-thompson", storeId: "leo-lifts", rating: "4.8", reviews: 5, completed: 8, price: 30, unit: "hour", accent: "butter", emoji: "🪑", availability: "Sat · 1:00 PM", campus: "SDSU", verified: true,
      description: "A second person for a desk, dresser or mini fridge. Leo meets you at the hall and carries it to the car or the new room.", meeting: "Your residence hall", response: "Usually replies within a few hours", slots: ["Sat · 1:00 PM", "Sun · 11:00 AM", "Sun · 2:00 PM"]
    },
    {
      id: "leo-reset", kind: "service", category: "Help", title: "Dorm reset", seller: "Leo Thompson", initials: "LT", sellerId: "leo-thompson", storeId: "leo-lifts", rating: "5.0", reviews: 4, completed: 6, price: 40, unit: "2 hours", accent: "mint", emoji: "🧹", availability: "Sun · 12:00 PM", campus: "SDSU", verified: true,
      description: "A two-hour reset before a tour or a parent visit: trash out, surfaces wiped, and the room put back together.", meeting: "Your residence hall", response: "Usually replies within a few hours", slots: ["Sun · 12:00 PM", "Fri · 4:00 PM"]
    },
    {
      id: "taylor-laundry", kind: "service", category: "Help", title: "Laundry run", seller: "Taylor Brooks", initials: "TB", sellerId: "taylor-brooks", storeId: "dorm-drop", rating: "4.8", reviews: 9, completed: 14, price: 18, unit: "run", accent: "sky", emoji: "👕", availability: "Today · 5:00 PM", campus: "SDSU", verified: true,
      description: "Pickup from your hall, a wash and dry, and the bag back at your door the same evening.", meeting: "Your residence hall", response: "Usually replies same day", slots: ["Today · 5:00 PM", "Tomorrow · 10:00 AM", "Thu · 6:00 PM"]
    },
    {
      id: "taylor-grocery", kind: "service", category: "Help", title: "Grocery run", seller: "Taylor Brooks", initials: "TB", sellerId: "taylor-brooks", storeId: "dorm-drop", rating: "4.9", reviews: 11, completed: 16, price: 12, unit: "run", accent: "mint", emoji: "🛒", availability: "Today · 4:00 PM", campus: "SDSU", verified: true,
      description: "Send a short list. Taylor shops Viejas or the market and drops the bags at your hall.", meeting: "Your residence hall", response: "Usually replies same day", slots: ["Today · 4:00 PM", "Tomorrow · 3:00 PM", "Sat · 11:00 AM"]
    },
    {
      id: "jordan-boxes", kind: "service", category: "Help", title: "Boxes to the car", seller: "Jordan Lee", initials: "JL", sellerId: "jordan-lee", storeId: "dorm-reset", rating: "4.7", reviews: 6, completed: 9, price: 20, unit: "hour", accent: "coral", emoji: "📫", availability: "Sat · 9:00 AM", campus: "SDSU", verified: true,
      description: "Load labeled boxes from your room out to a car at the hall loop. You book the hour and meet Jordan downstairs.", meeting: "Residence hall loop", response: "Usually replies same day", slots: ["Sat · 9:00 AM", "Sat · 12:00 PM", "Sun · 9:00 AM"]
    },
    {
      id: "mia-headshots", kind: "service", category: "Create", title: "LinkedIn headshots", seller: "Mia Torres", initials: "MT", sellerId: "mia-torres", storeId: "mia-torres-studio", rating: "4.7", reviews: 13, completed: 21, price: 50, unit: "30 min", accent: "sky", emoji: "🪪", tag: "Career ready", availability: "Thu · 12:00 PM", campus: "SDSU", verified: true,
      description: "Clean, confident headshots for internships, student orgs and the next opportunity.", meeting: "Student union courtyard", response: "Usually replies in under a day", slots: ["Thu · 12:00 PM", "Thu · 1:00 PM", "Fri · 11:00 AM"]
    },
    {
      id: "maya-events", kind: "service", category: "Events", title: "Event & org photo coverage", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "5.0", reviews: 6, completed: 9, price: 120, unit: "2 hours", accent: "butter", emoji: "🎉", tag: "Book early", availability: "Sat · 6:00 PM", campus: "SDSU", verified: true,
      description: "Candid coverage for club socials, formals and org events. 60+ edited photos delivered within a week.", meeting: "Your event venue on or near campus", response: "Usually replies in under an hour", slots: ["Sat · 6:00 PM", "Sun · 5:00 PM", "Fri · 7:00 PM"]
    },
    {
      id: "maya-mini", kind: "service", status: "paused", category: "Create", title: "Friends mini session", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.9", reviews: 5, completed: 8, price: 40, unit: "20 min", accent: "lilac", emoji: "🌼", tag: "Bring a friend", availability: "Tomorrow · 4:00 PM", campus: "SDSU", verified: true,
      description: "A quick, playful session for you and up to three friends. 10 edited photos, perfect for a new profile pic.", meeting: "Aztec Green or another campus spot", response: "Usually replies in under an hour", slots: ["Tomorrow · 4:00 PM", "Sat · 3:00 PM", "Sun · 11:00 AM"]
    },
    {
      id: "noah-linear", kind: "service", category: "Learn", title: "Linear algebra tutoring", seller: "Noah Williams", initials: "NW", sellerId: "noah-williams", storeId: "noah-studies", rating: "4.9", reviews: 7, completed: 10, price: 30, unit: "hour", accent: "mint", emoji: "🧮", availability: "Tomorrow · 2:00 PM", campus: "SDSU", verified: true,
      description: "Matrices, eigenvalues and proofs explained with pictures first and symbols second.", meeting: "Library study room or video call", response: "Usually replies in a few hours", slots: ["Tomorrow · 2:00 PM", "Wed · 6:00 PM", "Fri · 1:00 PM"]
    },
    {
      id: "noah-cram", kind: "service", category: "Learn", title: "Midterm cram session (group)", seller: "Noah Williams", initials: "NW", sellerId: "noah-williams", storeId: "noah-studies", rating: "5.0", reviews: 9, completed: 12, price: 15, unit: "per person · 2 hr", accent: "butter", emoji: "📝", tag: "Group rate", availability: "Thu · 7:00 PM", campus: "SDSU", verified: true,
      description: "A focused two-hour review with up to six students. Practice exam, worked solutions and plenty of questions.", meeting: "Library group study room", response: "Usually replies in a few hours", slots: ["Thu · 7:00 PM", "Sun · 4:00 PM"]
    },
    {
      id: "zoe-art", kind: "service", category: "Beauty", title: "Nail art add-on", seller: "Zoe Rivera", initials: "ZR", sellerId: "zoe-rivera", storeId: "zoe-nail-studio", rating: "4.9", reviews: 10, completed: 14, price: 15, unit: "30 min", accent: "coral", emoji: "🎨", availability: "Fri · 6:00 PM", campus: "SDSU", verified: true,
      description: "Tiny hearts, chrome tips, florals or your own idea added to any set. Bring a reference photo.", meeting: "On-campus beauty studio", response: "Usually replies in under two hours", slots: ["Fri · 6:00 PM", "Sat · 3:00 PM"]
    },
    {
      id: "riley-wheel", kind: "service", category: "Create", title: "Intro to the pottery wheel", seller: "Riley Kim", initials: "RK", sellerId: "riley-kim", storeId: "riley-clay", rating: "4.9", reviews: 5, completed: 7, price: 35, unit: "90 min", accent: "butter", emoji: "🏺", tag: "Small class", availability: "Wed · 5:00 PM", campus: "SDSU", verified: true,
      description: "Learn to center, open and pull your first cylinder. Clay and glazing included; pieces ready in two weeks.", meeting: "Art North ceramics studio", response: "Usually replies within a day", slots: ["Wed · 5:00 PM", "Sat · 10:00 AM"]
    },
    {
      id: "sam-scans", kind: "service", category: "Create", title: "Film developing & scans", seller: "Sam Okafor", initials: "SO", sellerId: "sam-okafor", storeId: "film-and-frames", rating: "5.0", reviews: 8, completed: 11, price: 18, unit: "per roll", accent: "sky", emoji: "🖨️", availability: "Drop-off Mon or Thu", campus: "SDSU", verified: true,
      description: "Drop off 35mm color film and get high-res scans back in-app within four days. Negatives returned in sleeves.", meeting: "Student Union entrance", response: "Usually replies in under two hours", slots: ["Mon · drop-off", "Thu · drop-off"]
    },
    {
      id: "ari-thumbnails", kind: "service", category: "Tech", title: "YouTube thumbnail design", seller: "Ari Patel", initials: "AP", sellerId: "ari-patel", storeId: "ari-edits", rating: "4.8", reviews: 6, completed: 9, price: 20, unit: "per thumbnail", accent: "coral", emoji: "🖼️", availability: "Next opening · Tue", campus: "SDSU", verified: true,
      description: "Bold, readable thumbnails built from your footage. Two concepts and one round of tweaks.", meeting: "Digital delivery", response: "Usually replies same day", slots: ["Tue · 10:00 AM", "Thu · 10:00 AM"]
    },
    {
      id: "cubbies-reserve", kind: "service", category: "Lifestyle", storeOnly: true, title: "Summer storage reservation", seller: "College Cubbies", initials: "CC", sellerId: "college-cubbies", storeId: "college-cubbies", rating: "4.9", reviews: 22, completed: 40, price: 49, unit: "reservation", accent: "butter", emoji: "📦", certification: "valet storage", tag: "5 boxes included", availability: "May 12–15 pickup", campus: "SDSU", verified: true,
      description: "Hold a summer storage spot. The reservation includes five boxes, tape, door-to-door pickup on the May move-out dates, and $100 of coverage on each item. Storage after that is priced per item, per month.", meeting: "Your dorm, apartment, or house", response: "Usually replies the same day", slots: ["May 12 · morning", "May 13 · morning", "May 14 · afternoon", "May 15 · morning"]
    }
  ];

  const schoolServices = [
    {
      id: "sdsu-safe-ride",
      category: "Help",
      title: "SDSU Safe Ride",
      provider: "SDSU Transportation",
      accent: "coral",
      emoji: "🚐",
      hours: "Mon–Fri · 7:00 PM–3:30 AM",
      description: "Free rides for students, faculty and staff from more than 30 campus locations. Request one in the SDSU Safe app.",
      website: "https://transportation.sdsu.edu/commuting/saferide",
      websiteLabel: "Visit website"
    },
    {
      id: "mslc",
      category: "Learn",
      title: "Math & Science Learning Center",
      provider: "Love Library Room 328",
      accent: "mint",
      emoji: "📐",
      hours: "Drop in · no appointment",
      description: "Free drop-in tutoring and course office hours for math and science. Come during the posted hours.",
      website: "https://mslc.sdsu.edu/",
      websiteLabel: "Visit website"
    },
    {
      id: "as-headshots",
      category: "Create",
      title: "Free professional headshots",
      provider: "A.S. Career Advantage",
      accent: "sky",
      emoji: "🪪",
      hours: "Tue & Fri · 8:30–10:30 AM",
      description: "Free headshots for current SDSU students at The Backdoor Studio. Walk-ins are welcome, and an appointment is recommended.",
      website: "https://as.sdsu.edu/careeradvantage/",
      websiteLabel: "Visit website"
    }
  ];

  const products = [
    {
      id: "desk-lamp", kind: "product", merchandiseType: "resale", category: "Furniture", title: "Vintage desk lamp", seller: "Jordan Lee", initials: "JL", sellerId: "jordan-lee", storeId: "dorm-reset", rating: "4.9", reviews: 8, completed: 10, price: 24, unit: "each", accent: "butter", emoji: "💡", condition: "Good condition", availability: "Pickup near the library", campus: "SDSU", verified: true, quantityAvailable: 2,
      description: "Warm little desk lamp with a brass finish. Works perfectly and makes a dorm room feel less like a dorm room.", meeting: "Local pickup near Love Library", response: "Usually replies same day"
    },
    {
      id: "film-camera", kind: "product", merchandiseType: "resale", category: "Tech", title: "35mm film camera", seller: "Sam Okafor", initials: "SO", sellerId: "sam-okafor", storeId: "film-and-frames", rating: "5.0", reviews: 6, completed: 8, price: 70, unit: "one camera", accent: "lilac", emoji: "📷", condition: "Like new", availability: "Pickup at Student Union", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "A tested 35mm point-and-shoot with a fresh battery. Great for campus events and weekend trips.", meeting: "Student Union entrance", response: "Usually replies in under two hours"
    },
    {
      id: "calc-textbook", kind: "product", merchandiseType: "resale", category: "Textbooks", title: "Calculus II textbook", seller: "Emily Park", initials: "EP", sellerId: "emily-park", storeId: "emily-book-swap", rating: "4.8", reviews: 5, completed: 7, price: 35, unit: "one book", accent: "sky", emoji: "📚", condition: "Used — good", availability: "Pickup near Engineering", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "Used, highlighted in the useful places and ready for the next student. Includes the original study notes.", meeting: "Engineering building lobby", response: "Usually replies next day"
    },
    {
      id: "vintage-hoodie", kind: "product", merchandiseType: "resale", category: "Clothing", title: "Vintage campus hoodie", seller: "Chris Nguyen", initials: "CN", sellerId: "chris-nguyen", storeId: "aztec-thrift", rating: "4.9", reviews: 12, completed: 15, price: 28, unit: "size M", accent: "coral", emoji: "🧥", condition: "Good condition", availability: "Pickup near Campanile", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "Soft broken-in hoodie in a faded red. Size M, relaxed fit, no stains or weird surprises.", meeting: "Campanile walk", response: "Usually replies within an hour"
    },
    {
      id: "ceramic-mug", kind: "product", merchandiseType: "new", category: "Student-made", title: "Handmade ceramic mug", seller: "Riley Kim", initials: "RK", sellerId: "riley-kim", storeId: "riley-clay", rating: "4.8", reviews: 4, completed: 6, price: 18, unit: "one mug", accent: "mint", emoji: "☕", condition: "New", availability: "Pickup near Art North", campus: "SDSU", verified: true, quantityAvailable: 3,
      description: "A one-of-a-kind student-made mug with a soft blue glaze and just enough room for a late-night study drink.", meeting: "Art North studio lobby", response: "Usually replies within a day"
    },
    {
      id: "mini-fan", kind: "product", merchandiseType: "resale", category: "Dorm", title: "Quiet desk fan", seller: "Taylor Brooks", initials: "TB", sellerId: "taylor-brooks", storeId: "dorm-drop", rating: "4.7", reviews: 3, completed: 4, price: 15, unit: "one fan", accent: "sky", emoji: "🌀", condition: "Good condition", availability: "Pickup at Tenochca", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "Small, quiet and perfect for a warm dorm room. Three speeds and a USB cable included.", meeting: "Tenochca front desk", response: "Usually replies same day"
    },
    {
      id: "maya-presets", kind: "product", merchandiseType: "new", category: "Create", title: "Lightroom preset pack", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.9", reviews: 14, completed: 22, price: 12, unit: "digital pack", accent: "coral", emoji: "🎛️", condition: "Digital download", availability: "Instant digital delivery", campus: "SDSU", verified: true, quantityAvailable: 99,
      description: "The eight warm, colorful presets Maya uses for her campus portraits. Works on desktop and mobile Lightroom.", meeting: "Digital delivery in the app", response: "Usually replies in under an hour"
    },
    {
      id: "maya-prints", kind: "product", merchandiseType: "new", category: "Create", title: "Campus photo print (8×10)", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.8", reviews: 4, completed: 11, price: 15, unit: "one print", accent: "sky", emoji: "🌅", condition: "New", availability: "Pickup near Love Library", campus: "SDSU", verified: true, quantityAvailable: 3,
      description: "Golden-hour prints of Hepner Hall and the Campanile on matte paper. A nice little dorm wall upgrade.", meeting: "Love Library steps", response: "Usually replies in under an hour"
    },
    {
      id: "maya-jeans", kind: "product", merchandiseType: "resale", category: "Clothing", title: "Vintage straight-leg jeans", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.8", reviews: 3, completed: 5, price: 26, unit: "W28", accent: "sky", emoji: "👖", condition: "Good condition", availability: "Pickup at Art North", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "Mid-wash, high-rise and perfectly broken in. Waist 28, inseam 30.", meeting: "Art North studio lobby", response: "Usually replies in under an hour"
    },
    {
      id: "maya-sundress", kind: "product", status: "soldout", merchandiseType: "resale", category: "Clothing", title: "Linen sundress", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.9", reviews: 4, completed: 5, price: 22, unit: "size S", accent: "lilac", emoji: "👗", condition: "Like new", availability: "Pickup at Art North", campus: "SDSU", verified: true, quantityAvailable: 0,
      description: "Breezy lilac linen dress, worn twice. Great for grad photos or a beach day.", meeting: "Art North studio lobby", response: "Usually replies in under an hour"
    },
    {
      id: "maya-tote", kind: "product", merchandiseType: "resale", category: "Clothing", title: "Canvas tote bag", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.7", reviews: 2, completed: 4, price: 10, unit: "one bag", accent: "butter", emoji: "👜", condition: "Good condition", availability: "Pickup near Love Library", campus: "SDSU", verified: true, quantityAvailable: 2,
      description: "Sturdy canvas tote that fits a laptop, a water bottle and too many snacks.", meeting: "Love Library steps", response: "Usually replies in under an hour"
    },
    {
      id: "noah-guide", kind: "product", merchandiseType: "new", category: "Textbooks", title: "Calc II study guide", seller: "Noah Williams", initials: "NW", sellerId: "noah-williams", storeId: "noah-studies", rating: "5.0", reviews: 12, completed: 30, price: 8, unit: "printed + PDF", accent: "sky", emoji: "📘", condition: "New", availability: "Pickup at the library", campus: "SDSU", verified: true, quantityAvailable: 20,
      description: "A 40-page guide to series, integration techniques and the problems that show up on every midterm.", meeting: "Love Library front desk", response: "Usually replies in a few hours"
    },
    {
      id: "zoe-pressons", kind: "product", merchandiseType: "new", category: "Beauty", title: "Custom press-on set", seller: "Zoe Rivera", initials: "ZR", sellerId: "zoe-rivera", storeId: "zoe-nail-studio", rating: "4.8", reviews: 7, completed: 9, price: 25, unit: "one set", accent: "lilac", emoji: "💖", condition: "Made to order", availability: "Pickup at the beauty studio", campus: "SDSU", verified: true, quantityAvailable: 5,
      description: "Hand-painted reusable press-ons sized to you. Comes with glue, tabs and a tiny file.", meeting: "On-campus beauty studio", response: "Usually replies in under two hours"
    },
    {
      id: "jordan-rug", kind: "product", merchandiseType: "resale", category: "Furniture", title: "Soft area rug (4×6)", seller: "Jordan Lee", initials: "JL", sellerId: "jordan-lee", storeId: "dorm-reset", rating: "4.9", reviews: 2, completed: 3, price: 30, unit: "one rug", accent: "coral", emoji: "🧶", condition: "Good condition", availability: "Pickup near the library", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "Plush cream rug that makes a dorm floor feel warm. Freshly cleaned.", meeting: "Local pickup near Love Library", response: "Usually replies same day"
    },
    {
      id: "jordan-mirror", kind: "product", merchandiseType: "resale", category: "Furniture", title: "Full-length mirror", seller: "Jordan Lee", initials: "JL", sellerId: "jordan-lee", storeId: "dorm-reset", rating: "4.8", reviews: 2, completed: 2, price: 20, unit: "one mirror", accent: "sky", emoji: "🪞", condition: "Like new", availability: "Pickup near the library", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "Over-the-door or leaning mirror with a thin black frame. No cracks, hardware included.", meeting: "Local pickup near Love Library", response: "Usually replies same day"
    },
    {
      id: "jordan-shelf", kind: "product", merchandiseType: "resale", category: "Furniture", title: "Small bookshelf", seller: "Jordan Lee", initials: "JL", sellerId: "jordan-lee", storeId: "dorm-reset", rating: "4.9", reviews: 1, completed: 1, price: 25, unit: "one shelf", accent: "butter", emoji: "🗄️", condition: "Good condition", availability: "Pickup near the library", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "Three-shelf white bookcase, about waist height. Fits under most lofted beds.", meeting: "Local pickup near Love Library", response: "Usually replies same day"
    },
    {
      id: "riley-planter", kind: "product", merchandiseType: "new", category: "Student-made", title: "Speckled planter", seller: "Riley Kim", initials: "RK", sellerId: "riley-kim", storeId: "riley-clay", rating: "4.9", reviews: 3, completed: 5, price: 22, unit: "one planter", accent: "mint", emoji: "🪴", condition: "New", availability: "Pickup near Art North", campus: "SDSU", verified: true, quantityAvailable: 4,
      description: "Wheel-thrown planter with a drainage hole and speckled cream glaze. Fits a small pothos perfectly.", meeting: "Art North studio lobby", response: "Usually replies within a day"
    },
    {
      id: "sam-film", kind: "product", merchandiseType: "new", category: "Tech", title: "Color film roll (36 exp)", seller: "Sam Okafor", initials: "SO", sellerId: "sam-okafor", storeId: "film-and-frames", rating: "5.0", reviews: 5, completed: 16, price: 14, unit: "one roll", accent: "butter", emoji: "🎞️", condition: "New", availability: "Pickup at Student Union", campus: "SDSU", verified: true, quantityAvailable: 12,
      description: "Fresh, fridge-stored ISO 400 color film. Pairs nicely with the film developing service.", meeting: "Student Union entrance", response: "Usually replies in under two hours"
    },
    {
      id: "chris-crewneck", kind: "product", merchandiseType: "resale", category: "Clothing", title: "Faded Aztecs crewneck", seller: "Chris Nguyen", initials: "CN", sellerId: "chris-nguyen", storeId: "aztec-thrift", rating: "4.8", reviews: 5, completed: 6, price: 24, unit: "size L", accent: "lilac", emoji: "👕", condition: "Good condition", availability: "Pickup near Campanile", campus: "SDSU", verified: true, quantityAvailable: 1,
      description: "Early-2000s Aztecs crewneck with a cracked vintage print. Size L, boxy fit.", meeting: "Campanile walk", response: "Usually replies within an hour"
    },
    {
      id: "cubbies-medium", kind: "product", merchandiseType: "storage", category: "Dorm", storeOnly: true, title: "Medium box", seller: "College Cubbies", initials: "CC", sellerId: "college-cubbies", storeId: "college-cubbies", rating: "4.9", reviews: 14, completed: 30, price: 25, unit: "month", accent: "butter", emoji: "📦", condition: "Summer storage", availability: "Picked up with your reservation", campus: "SDSU", verified: true, quantityAvailable: 40,
      description: "One medium box in summer storage. College Cubbies prices it at $25 a month with a four-month minimum, picks it up with your reservation, and brings it back in August.", meeting: "Your dorm, apartment, or house", response: "Usually replies the same day"
    },
    {
      id: "cubbies-large", kind: "product", merchandiseType: "storage", category: "Dorm", storeOnly: true, title: "Large box", seller: "College Cubbies", initials: "CC", sellerId: "college-cubbies", storeId: "college-cubbies", rating: "4.8", reviews: 9, completed: 18, price: 30, unit: "month", accent: "sky", emoji: "📫", condition: "Summer storage", availability: "Picked up with your reservation", campus: "SDSU", verified: true, quantityAvailable: 40,
      description: "One large box in summer storage, $30 a month with a four-month minimum. It rides with your reservation and comes back for fall move-in.", meeting: "Your dorm, apartment, or house", response: "Usually replies the same day"
    },
    {
      id: "cubbies-suitcase", kind: "product", merchandiseType: "storage", category: "Dorm", storeOnly: true, title: "Large suitcase", seller: "College Cubbies", initials: "CC", sellerId: "college-cubbies", storeId: "college-cubbies", rating: "4.9", reviews: 11, completed: 22, price: 30, unit: "month", accent: "lilac", emoji: "🧳", condition: "Summer storage", availability: "Picked up with your reservation", campus: "SDSU", verified: true, quantityAvailable: 40,
      description: "One large suitcase in summer storage, $30 a month with a four-month minimum. Leave it packed. They pick it up and return it in the fall.", meeting: "Your dorm, apartment, or house", response: "Usually replies the same day"
    },
    {
      id: "cubbies-desk", kind: "product", merchandiseType: "storage", category: "Furniture", storeOnly: true, title: "Desk", seller: "College Cubbies", initials: "CC", sellerId: "college-cubbies", storeId: "college-cubbies", rating: "4.8", reviews: 6, completed: 10, price: 40, unit: "month", accent: "coral", emoji: "🪑", condition: "Summer storage", availability: "Picked up with your reservation", campus: "SDSU", verified: true, quantityAvailable: 20,
      description: "One desk in summer storage, $40 a month with a four-month minimum. Student movers load it at your place and deliver it back before fall.", meeting: "Your dorm, apartment, or house", response: "Usually replies the same day"
    }
  ];

  const tickets = [
    {
      id: "maya-open-studio", kind: "ticket", category: "Events", title: "Open studio night", host: "VisCom Collective", date: "Sat", time: "7:00 PM", location: "Art North studio", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.9", reviews: 18, completed: 28, price: 10, unit: "ticket", accent: "coral", emoji: "🎨", availability: "Sat · 7:00 PM", campus: "SDSU", verified: true, quantityAvailable: 40,
      summary: "A Saturday studio night. Student price, mobile entry.",
      description: "One admission to the VisCom Collective open studio. Photos on the wall, prints for sale, and the door list is this QR code.", meeting: "Art North studio", response: "Usually replies in under an hour"
    },
    {
      id: "sam-film-night", kind: "ticket", category: "Events", title: "Slow Hours live", host: "Slow Hours", date: "Fri", time: "8:00 PM", location: "Student Union theatre", seller: "Sam Okafor", initials: "SO", sellerId: "sam-okafor", storeId: "film-and-frames", rating: "5.0", reviews: 19, completed: 35, price: 12, unit: "ticket", accent: "lilac", emoji: "🎸", availability: "Fri · 8:00 PM", campus: "SDSU", verified: true, quantityAvailable: 60,
      summary: "A student-band set. One admission, mobile entry.",
      description: "Slow Hours plays a full set in the Student Union theatre. Buy it from the store and bring the QR code to the door.", meeting: "Student Union theatre", response: "Usually replies in under two hours"
    },
    {
      id: "ticket-aztecs", kind: "ticket", category: "Events", title: "Aztecs vs. Boise State", host: "Snapdragon Stadium", date: "Sat", time: "7:30 PM", location: "Student section", seller: "Chris Nguyen", initials: "CN", sellerId: "chris-nguyen", storeId: "aztec-thrift", rating: "4.9", reviews: 12, completed: 15, price: 25, unit: "ticket", accent: "coral", emoji: "🏈", availability: "Sat · 7:30 PM", campus: "SDSU", verified: true, quantityAvailable: 40,
      summary: "Student-section seats for Saturday's game. Digital ticket transfers in the app.",
      description: "Student-section seats for Saturday's game. Your QR code is the ticket at the gate.", meeting: "Student section", response: "Usually replies within an hour"
    },
    {
      id: "ticket-show", kind: "ticket", category: "Events", title: "Open Air concert", host: "Cal Coast Credit Union Open Air", date: "Fri", time: "8:00 PM", location: "Lawn", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.9", reviews: 18, completed: 28, price: 40, unit: "ticket", accent: "lilac", emoji: "🎤", availability: "Fri · 8:00 PM", campus: "SDSU", verified: true, quantityAvailable: 80,
      summary: "A Friday lawn ticket. Student price, mobile entry.",
      description: "A Friday lawn ticket for the Open Air concert. Student price, and the QR code is your mobile entry.", meeting: "Lawn", response: "Usually replies in under an hour"
    },
    {
      id: "ticket-formal", kind: "ticket", category: "Events", title: "Org formal guest ticket", host: "Delta Gamma", date: "Sat", time: "6:00 PM", location: "Downtown", seller: "Zoe Rivera", initials: "ZR", sellerId: "zoe-rivera", storeId: "zoe-nail-studio", rating: "4.8", reviews: 26, completed: 34, price: 35, unit: "ticket", accent: "butter", emoji: "✨", availability: "Sat · 6:00 PM", campus: "SDSU", verified: true, quantityAvailable: 12,
      summary: "One extra guest ticket for the spring formal. Includes dinner.",
      description: "One extra guest ticket for the spring formal. Dinner is included, and the QR code gets you in.", meeting: "Downtown", response: "Usually replies in under two hours"
    },
    {
      id: "ticket-comedy", kind: "ticket", category: "Events", title: "Comedy night", host: "Conrad Prebys Aztec Student Union", date: "Thu", time: "8:00 PM", location: "General admission", seller: "Ari Patel", initials: "AP", sellerId: "ari-patel", storeId: "ari-edits", rating: "4.9", reviews: 15, completed: 23, price: 12, unit: "ticket", accent: "mint", emoji: "😂", availability: "Thu · 8:00 PM", campus: "SDSU", verified: true, quantityAvailable: 50,
      summary: "Campus comedy showcase. General admission, doors at 7:30.",
      description: "Campus comedy showcase at the Aztec Student Union. General admission, doors at 7:30, and the QR code is your ticket.", meeting: "General admission", response: "Usually replies the same day"
    }
  ];

  const sellers = [
    { id: "maya-chen", name: "Maya Chen", initials: "MC", handle: "@mayamakes", certification: "photographer", campus: "SDSU · Senior · Design", verified: true, bio: "Photographer, design student and the person behind the camera at your favorite campus events.", rating: "4.9", reviews: 18, completed: 28, response: "under an hour", accent: "coral" },
    { id: "noah-williams", name: "Noah Williams", initials: "NW", handle: "@noahstudies", certification: "tutor", campus: "SDSU · Junior · Mathematics", verified: true, bio: "I like making intimidating problems feel manageable. Bring the one that is bothering you.", rating: "5.0", reviews: 11, completed: 19, response: "a few hours", accent: "sky" },
    { id: "zoe-rivera", name: "Zoe Rivera", initials: "ZR", handle: "@zoecreates", certification: "nail tech", campus: "SDSU · Senior · Psychology", verified: true, bio: "Soft gel sets, tiny details and a relaxing appointment between the busy parts of college.", rating: "4.8", reviews: 26, completed: 34, response: "two hours", accent: "lilac" },
    { id: "jordan-lee", name: "Jordan Lee", initials: "JL", handle: "@jordanlists", certification: "campus helper", campus: "SDSU · Senior · Business", verified: true, bio: "Selling the useful things I am done with so they can have a second life on campus.", rating: "4.9", reviews: 8, completed: 10, response: "same day", accent: "butter" },
    { id: "ari-patel", name: "Ari Patel", initials: "AP", handle: "@ariedits", certification: "video editor", campus: "SDSU · Sophomore · Film", verified: true, bio: "I edit for student creators and clubs. Fast turnarounds, clean captions and good music choices.", rating: "4.9", reviews: 15, completed: 23, response: "same day", accent: "mint" },
    { id: "leo-thompson", name: "Leo Thompson", initials: "LT", handle: "@leolifts", certification: "campus helper", campus: "SDSU · Junior · Kinesiology", verified: true, bio: "Strong, careful and on time. I help students move without the stress.", rating: "4.9", reviews: 7, completed: 12, response: "a few hours", accent: "butter" },
    { id: "mia-torres", name: "Mia Torres", initials: "MT", handle: "@miatorres", certification: "photographer", campus: "SDSU · Senior · Communication", verified: true, bio: "Headshots that look like you on a good day, ready for LinkedIn and org pages.", rating: "4.7", reviews: 13, completed: 21, response: "under a day", accent: "sky" },
    { id: "sam-okafor", name: "Sam Okafor", initials: "SO", handle: "@samshootsfilm", certification: "photo lab tech", campus: "SDSU · Junior · Art", verified: true, bio: "Film nerd. I test every camera I sell and develop film for friends on the side.", rating: "5.0", reviews: 19, completed: 35, response: "two hours", accent: "lilac" },
    { id: "emily-park", name: "Emily Park", initials: "EP", handle: "@emilyreads", campus: "SDSU · Senior · Engineering", verified: true, bio: "Passing along the STEM textbooks that got me through, notes included.", rating: "4.8", reviews: 5, completed: 7, response: "next day", accent: "sky" },
    { id: "chris-nguyen", name: "Chris Nguyen", initials: "CN", handle: "@aztecthrift", campus: "SDSU · Junior · Marketing", verified: true, bio: "I dig through thrift stores for vintage Aztecs gear so you do not have to.", rating: "4.9", reviews: 17, completed: 21, response: "an hour", accent: "coral" },
    { id: "riley-kim", name: "Riley Kim", initials: "RK", handle: "@rileyclay", certification: "ceramics instructor", campus: "SDSU · Senior · Studio Art", verified: true, bio: "Ceramics major making small-batch mugs and planters, and teaching friends the wheel.", rating: "4.9", reviews: 12, completed: 18, response: "a day", accent: "mint" },
    { id: "taylor-brooks", name: "Taylor Brooks", initials: "TB", handle: "@taylordorm", certification: "campus helper", campus: "SDSU · Sophomore · Biology", verified: true, bio: "Small dorm essentials I no longer need, priced to move.", rating: "4.7", reviews: 3, completed: 4, response: "same day", accent: "sky" },
    { id: "college-cubbies", name: "College Cubbies", initials: "CC", handle: "@collegecubbies", campus: "SDSU · Student-run", verified: true, bio: "Valet summer storage started by SDSU students. They pick up from your place, store it, and bring it back in the fall.", rating: "4.9", reviews: 48, completed: 500, response: "the same day", accent: "butter" }
  ];

  const stores = [
    {
      id: "maya-makes-photo", sellerId: "maya-chen", name: "Maya Makes Photo", handle: "@mayamakes", emoji: "📸", accent: "coral",
      tagline: "Portraits, events and prints from around campus",
      about: "Maya has photographed hundreds of SDSU students, from grad portraits to club formals. This store has her sessions, the prints and presets people keep asking about, and a small rack of vintage pieces from her own closet.",
      announcement: "Grad season is here — spring weekends are filling up fast.",
      rating: "4.9", reviews: 52, sales: 92, followers: 400,
      policies: { cancellation: "Free cancellation up to 24 hours before a session. Reschedule once for free. Closet pieces can be returned within 24 hours of pickup if they don't fit.", pickup: "Prints and closet pieces pick up at the Love Library steps or Art North. Presets are delivered in the app.", hours: "Sessions weekdays after 3 PM and most weekends" },
      collections: [
        { name: "Featured", listingIds: ["maya-portraits", "maya-events", "maya-presets"] },
        { name: "Sessions", listingIds: ["maya-portraits", "maya-mini", "maya-events"] },
        { name: "Prints & presets", listingIds: ["maya-prints", "maya-presets"] },
        { name: "Closet", listingIds: ["maya-sundress", "maya-jeans", "maya-tote"] },
        { name: "Tickets", listingIds: ["maya-open-studio", "ticket-show"] }
      ],
      reviewsSample: [
        { author: "Priya S.", rating: 5, text: "Maya made the session feel easy. The photos looked like me, not a stock photo.", listingId: "maya-portraits" },
        { author: "Delta Gamma", rating: 5, text: "She covered our formal and had previews up the next morning.", listingId: "maya-events" },
        { author: "Marcus T.", rating: 4, text: "The presets are great on mobile. One felt a little orange on indoor shots.", listingId: "maya-presets" },
        { author: "Jess L.", rating: 5, text: "The sundress was exactly as described and Maya was super flexible on pickup.", listingId: "maya-sundress" },
        { author: "Omar K.", rating: 5, text: "Tote is sturdier than it looks. Easy handoff.", listingId: "maya-tote" }
      ]
    },
    {
      id: "noah-studies", sellerId: "noah-williams", name: "Noah Studies", handle: "@noahstudies", emoji: "∫", accent: "sky",
      tagline: "Math tutoring that makes it click",
      about: "One-on-one and group math help for lower-division courses, plus the study guide Noah wishes he had as a freshman.",
      announcement: "Midterm cram sessions are open for Calc II and Linear Algebra.",
      rating: "5.0", reviews: 28, sales: 71, followers: 164,
      policies: { cancellation: "Cancel up to 12 hours before a session for a full refund.", pickup: "Printed guides pick up at the Love Library front desk.", hours: "Afternoons and evenings, Sunday through Thursday" },
      collections: [
        { name: "Featured", listingIds: ["noah-calculus", "noah-cram"] },
        { name: "1:1 tutoring", listingIds: ["noah-calculus", "noah-linear"] },
        { name: "Study materials", listingIds: ["noah-guide"] }
      ],
      reviewsSample: [
        { author: "Hannah R.", rating: 5, text: "Went from a C to a B+ on the second midterm. Noah is so patient.", listingId: "noah-calculus" },
        { author: "Luis M.", rating: 5, text: "The cram session practice exam was almost identical in style to the real one.", listingId: "noah-cram" }
      ]
    },
    {
      id: "zoe-nail-studio", sellerId: "zoe-rivera", name: "Zoe's Nail Studio", handle: "@zoecreates", emoji: "💅", accent: "lilac",
      tagline: "Soft gel sets and tiny details between classes",
      about: "Calm, tidy nail appointments on campus, plus custom press-ons for when you can't make it in.",
      announcement: "",
      rating: "4.8", reviews: 43, sales: 57, followers: 241,
      policies: { cancellation: "Free cancellation up to 24 hours before. Late cancellations lose the deposit.", pickup: "Press-ons pick up at the beauty studio.", hours: "Thursday through Sunday" },
      collections: [
        { name: "Appointments", listingIds: ["zoe-nails", "zoe-art"] },
        { name: "Take-home", listingIds: ["zoe-pressons"] },
        { name: "Tickets", listingIds: ["ticket-formal"] }
      ],
      reviewsSample: [
        { author: "Ava C.", rating: 5, text: "Lasted three weeks with zero lifting. Booking again.", listingId: "zoe-nails" },
        { author: "Sofia G.", rating: 4, text: "Press-ons were gorgeous, sizing was slightly big on one nail.", listingId: "zoe-pressons" }
      ]
    },
    {
      id: "dorm-reset", sellerId: "jordan-lee", name: "Dorm Reset", handle: "@jordanlists", emoji: "🛋️", accent: "butter",
      tagline: "Gently used dorm upgrades, ready for pickup",
      about: "Jordan is graduating and clearing out four years of dorm and apartment finds. Everything is cleaned and tested.",
      announcement: "Moving out May 15 — everything must go.",
      rating: "4.9", reviews: 8, sales: 10, followers: 47,
      policies: { cancellation: "Orders can be cancelled any time before pickup.", pickup: "Pickup near Love Library. Bigger items can be walked to nearby dorms.", hours: "Pickups weekdays 12–6 PM" },
      collections: [
        { name: "Lighting", listingIds: ["desk-lamp"] },
        { name: "Decor", listingIds: ["jordan-rug", "jordan-mirror"] },
        { name: "Storage", listingIds: ["jordan-shelf"] }
      ],
      reviewsSample: [
        { author: "Ben W.", rating: 5, text: "Lamp works perfectly and Jordan helped me carry the shelf to my car.", listingId: "desk-lamp" }
      ]
    },
    {
      id: "riley-clay", sellerId: "riley-kim", name: "Riley Clay", handle: "@rileyclay", emoji: "🏺", accent: "mint",
      tagline: "Handmade ceramics and beginner wheel classes",
      about: "Small-batch mugs and planters from a ceramics major, plus relaxed intro classes on the wheel.",
      announcement: "Spring glaze drop coming next week.",
      rating: "4.9", reviews: 12, sales: 18, followers: 133,
      policies: { cancellation: "Classes can be moved up to 48 hours before.", pickup: "Pickup at the Art North studio lobby.", hours: "Studio hours Wednesday and Saturday" },
      collections: [
        { name: "Mugs", listingIds: ["ceramic-mug"] },
        { name: "Planters", listingIds: ["riley-planter"] },
        { name: "Classes", listingIds: ["riley-wheel"] }
      ],
      reviewsSample: [
        { author: "Nina P.", rating: 5, text: "My favorite mug now. The glaze is even prettier in person.", listingId: "ceramic-mug" },
        { author: "Tom H.", rating: 5, text: "The wheel class was so fun, Riley is a great teacher.", listingId: "riley-wheel" }
      ]
    },
    {
      id: "film-and-frames", sellerId: "sam-okafor", name: "Film & Frames", handle: "@samshootsfilm", emoji: "📷", accent: "butter",
      tagline: "Tested film cameras, fresh rolls and scans",
      about: "Everything you need to shoot film on campus: tested cameras, fresh film and a student-run developing service.",
      announcement: "",
      rating: "5.0", reviews: 19, sales: 35, followers: 176,
      policies: { cancellation: "Cameras come with a 7-day it-works guarantee.", pickup: "Pickup and film drop-off at the Student Union entrance.", hours: "Monday and Thursday drop-offs" },
      collections: [
        { name: "Cameras", listingIds: ["film-camera"] },
        { name: "Film", listingIds: ["sam-film"] },
        { name: "Lab", listingIds: ["sam-scans"] },
        { name: "Tickets", listingIds: ["sam-film-night"] }
      ],
      reviewsSample: [
        { author: "Kai D.", rating: 5, text: "Camera works great and Sam showed me how to load it.", listingId: "film-camera" },
        { author: "Rosa E.", rating: 5, text: "Scans came back in three days and look amazing.", listingId: "sam-scans" }
      ]
    },
    {
      id: "ari-edits", sellerId: "ari-patel", name: "Ari Edits", handle: "@ariedits", emoji: "🎬", accent: "mint",
      tagline: "Short-form edits and thumbnails that pop",
      about: "Video edits and thumbnail design for student creators, clubs and small campus businesses.",
      announcement: "",
      rating: "4.9", reviews: 15, sales: 23, followers: 92,
      policies: { cancellation: "Full refund before editing starts.", pickup: "All work is delivered in the app.", hours: "Replies weekdays" },
      collections: [
        { name: "Video", listingIds: ["ari-video"] },
        { name: "Design", listingIds: ["ari-thumbnails"] },
        { name: "Tickets", listingIds: ["ticket-comedy"] }
      ],
      reviewsSample: [
        { author: "SDSU Dance Club", rating: 5, text: "Our recruitment reel got 3x our usual views.", listingId: "ari-video" }
      ]
    },
    {
      id: "leo-lifts", sellerId: "leo-thompson", name: "Leo Lifts", handle: "@leolifts", emoji: "📦", accent: "butter",
      tagline: "Extra hands for move-in and move-out",
      about: "Book Leo by the hour for boxes, small furniture and dorm-to-apartment moves.",
      announcement: "Move-out weekends book up fast.",
      rating: "4.9", reviews: 7, sales: 12, followers: 38,
      policies: { cancellation: "Free cancellation up to 24 hours before.", pickup: "Leo meets you at your residence hall.", hours: "Weekends" },
      collections: [],
      reviewsSample: [
        { author: "Grace Y.", rating: 5, text: "On time and super careful with my mirror.", listingId: "leo-move" }
      ]
    },
    {
      id: "mia-torres-studio", sellerId: "mia-torres", name: "Mia Torres Studio", handle: "@miatorres", emoji: "🪪", accent: "sky",
      tagline: "Headshots for internships and orgs",
      about: "Clean, confident headshots in 30 minutes, edited and delivered within three days.",
      announcement: "",
      rating: "4.7", reviews: 13, sales: 21, followers: 64,
      policies: { cancellation: "Free cancellation up to 24 hours before.", pickup: "Photos delivered in the app.", hours: "Thursday and Friday midday" },
      collections: [],
      reviewsSample: [
        { author: "Dev A.", rating: 5, text: "Got two interview callbacks the week I updated my LinkedIn.", listingId: "mia-headshots" }
      ]
    },
    {
      id: "emily-book-swap", sellerId: "emily-park", name: "Emily's Book Swap", handle: "@emilyreads", emoji: "📚", accent: "sky",
      tagline: "Used STEM textbooks at student prices",
      about: "Engineering and math textbooks with helpful notes, priced well under the bookstore.",
      announcement: "",
      rating: "4.8", reviews: 5, sales: 7, followers: 21,
      policies: { cancellation: "Cancel any time before pickup.", pickup: "Engineering building lobby.", hours: "Weekday mornings" },
      collections: [],
      reviewsSample: [
        { author: "Chris L.", rating: 5, text: "The notes in the margins actually helped.", listingId: "calc-textbook" }
      ]
    },
    {
      id: "aztec-thrift", sellerId: "chris-nguyen", name: "Aztec Thrift", handle: "@aztecthrift", emoji: "🧥", accent: "coral",
      tagline: "Vintage campus sweats and tees",
      about: "Hand-picked vintage SDSU and Aztecs gear, washed and ready to wear.",
      announcement: "Game-day restock Friday.",
      rating: "4.9", reviews: 17, sales: 21, followers: 205,
      policies: { cancellation: "Cancel any time before pickup.", pickup: "Pickup along the Campanile walk.", hours: "Afternoons" },
      collections: [
        { name: "Sweats", listingIds: ["vintage-hoodie", "chris-crewneck"] },
        { name: "Tickets", listingIds: ["ticket-aztecs"] }
      ],
      reviewsSample: [
        { author: "Jay R.", rating: 5, text: "Hoodie is so soft. Chris had it ready right on time.", listingId: "vintage-hoodie" }
      ]
    },
    {
      id: "dorm-drop", sellerId: "taylor-brooks", name: "Taylor's Dorm Drop", handle: "@taylordorm", emoji: "🌀", accent: "sky",
      tagline: "Small dorm essentials, quick pickup",
      about: "The little things that make a dorm room livable, passed along after freshman year.",
      announcement: "",
      rating: "4.7", reviews: 3, sales: 4, followers: 12,
      policies: { cancellation: "Cancel any time before pickup.", pickup: "Tenochca front desk.", hours: "Evenings" },
      collections: [],
      reviewsSample: [
        { author: "Mo S.", rating: 5, text: "Fan is super quiet, exactly as described.", listingId: "mini-fan" }
      ]
    },
    {
      id: "college-cubbies", sellerId: "college-cubbies", name: "College Cubbies", handle: "@collegecubbies", emoji: "📦", accent: "butter",
      tagline: "Valet summer storage, picked up at your door",
      about: "College Cubbies is student-run storage for SDSU. They drop off packing supplies, pick up from your dorm or apartment, keep everything in climate-controlled storage for the summer, and deliver it back in the fall. You pay per item, per month, with a four-month minimum. Each item includes $100 of coverage.",
      announcement: "Complimentary pickup is May 12–15. Fall delivery is Aug 8 and Aug 18–22.",
      rating: "4.9", reviews: 48, sales: 500, followers: 70,
      policies: { cancellation: "The reservation holds your pickup window. Message them if your move-out date changes.", pickup: "Door-to-door at your dorm, apartment, or house. Complimentary on May 12–15. Other dates add a convenience fee.", hours: "Fall delivery on Aug 8 and Aug 18–22" },
      collections: [
        { name: "Reserve", listingIds: ["cubbies-reserve"] },
        { name: "What you store", listingIds: ["cubbies-medium", "cubbies-large", "cubbies-suitcase", "cubbies-desk"] }
      ],
      reviewsSample: [
        { author: "Mina L.", rating: 5, text: "The boxes showed up before finals, and pickup was at my apartment.", listingId: "cubbies-reserve" },
        { author: "Jordan P.", rating: 5, text: "My desk and boxes were back the day I moved into the new place.", listingId: "cubbies-desk" }
      ]
    }
  ];

  const jobs = [
    { id: "job-arc", title: "Lifeguard", kicker: "Aztec Recreation Center", meta: "Evenings and weekends · On campus", price: "$17.50/hr", accent: "sky", emoji: "🏊", poster: "Sam Ortiz", initials: "SO", summary: "Watch the ARC pool during open swims and intramurals. Current certification required, or ARC will schedule the class.", facts: [["Schedule", "Evenings and weekends"], ["Where", "Aztec Recreation Center"], ["Type", "On-campus job"]] },
    { id: "job-library", title: "Library desk assistant", kicker: "Love Library", meta: "10–15 hrs/week · Student assistant", price: "$16.75/hr", accent: "lilac", emoji: "📚", poster: "Elena Park", initials: "EP", summary: "Check out materials, answer desk questions, and shelve returns between classes.", facts: [["Schedule", "10–15 hours a week"], ["Where", "Love Library"], ["Type", "Student assistant"]] },
    { id: "job-research", title: "Research assistant", kicker: "Psychology lab", meta: "Spring semester · Flexible hours", price: "$18/hr", accent: "mint", emoji: "🧪", poster: "Avery Cole", initials: "AC", summary: "Help run study sessions and keep participant notes organized. Psychology coursework is a plus.", facts: [["Schedule", "Flexible, about 8 hours a week"], ["Where", "Life Sciences"], ["Type", "Research"]] },
    { id: "job-cafe", title: "Opening barista", kicker: "Aztec Cafe", meta: "Weekday mornings · Food service", price: "$16.50/hr", accent: "butter", emoji: "☕", poster: "Chris Nguyen", initials: "CN", summary: "Open the cafe before the first class rush. Training is paid.", facts: [["Schedule", "Weekday mornings"], ["Where", "Student Union"], ["Type", "Campus dining"]] },
    { id: "job-events", title: "Event staff", kicker: "Associated Students", meta: "Game days and org nights", price: "$16/hr", accent: "coral", emoji: "🎟️", poster: "Jordan Hale", initials: "JH", summary: "Set up, scan tickets, and reset rooms for campus events. Shifts are posted a week ahead.", facts: [["Schedule", "Nights and weekends"], ["Where", "Around campus"], ["Type", "Event staff"]] },
    { id: "job-note", title: "Note taker", kicker: "Student Disability Services", meta: "One class · Semester long", price: "$200/class", accent: "sky", emoji: "📝", poster: "Taylor Brooks", initials: "TB", summary: "Share clear notes from a class you are already taking. SDS matches you with a student who needs them.", facts: [["Schedule", "Your current class"], ["Where", "Your classroom"], ["Type", "Semester role"]] }
  ];

  const housing = [
    { id: "home-college", title: "Private room in a 4-bedroom", kicker: "College Area", meta: "Jan–May · 8 minute walk", price: "$950/mo", accent: "butter", emoji: "🛏️", poster: "Riley Santos", initials: "RS", summary: "Furnished room in a student house. Utilities split four ways. Available when the current roommate studies abroad.", facts: [["Dates", "January through May"], ["Rent", "$950 a month"], ["Place", "College Area, 8 minute walk"]] },
    { id: "home-studio", title: "Summer studio sublease", kicker: "South Campus Plaza", meta: "May 20–Aug 10 · Furnished", price: "$1,400/mo", accent: "sky", emoji: "🏢", poster: "Alex Kim", initials: "AK", summary: "A furnished studio for the summer, with the gym and a shuttle stop downstairs.", facts: [["Dates", "May 20 through August 10"], ["Rent", "$1,400 a month"], ["Place", "South Campus Plaza"]] },
    { id: "home-shared", title: "Shared room, spring only", kicker: "University Towers", meta: "Jan–May · One roommate", price: "$720/mo", accent: "mint", emoji: "🪴", poster: "Jordan Ellis", initials: "JE", summary: "One side of a shared double. The roommate is a junior in business and is keeping the lease.", facts: [["Dates", "January through May"], ["Rent", "$720 a month"], ["Place", "University Towers"]] },
    { id: "home-house", title: "Master bedroom sublease", kicker: "Rolando", meta: "Now–July · Private bath", price: "$1,100/mo", accent: "coral", emoji: "🏠", poster: "Noah Brooks", initials: "NB", summary: "Master bedroom with its own bathroom in a house of four students. Street parking and a short bus ride to campus.", facts: [["Dates", "Now through July"], ["Rent", "$1,100 a month"], ["Place", "Rolando"]] }
  ];

  const openChores = [
    { id: "chore-dog", title: "Dog walker", meta: "Today · 3:30 PM · Campanile", price: "$15", amount: "$15", accent: "sky", emoji: "🐕", poster: "Sam Ortiz", initials: "SO", summary: "A 30-minute walk for a small dog. Leash and bags are by the door.", facts: [["When", "Today, 3:30 PM"], ["Where", "Campanile"], ["Pay", "$15"]], status: "open" },
    { id: "chore-move", title: "Move-out help", meta: "Sat · 10:00 AM · Tenochca", price: "$25/hour", amount: "$25", accent: "butter", emoji: "📦", poster: "Alex Ruiz", initials: "AR", summary: "Need an extra pair of hands for boxes and a mini fridge from Tenochca out to a car.", facts: [["When", "Saturday, 10:00 AM"], ["Where", "Tenochca"], ["Pay", "$25 an hour"]], status: "open" },
    { id: "chore-laundry", title: "Laundry pickup", meta: "Today · 5:00 PM · Zura", price: "$12/load", amount: "$12", accent: "sky", emoji: "🧺", poster: "Priya Shah", initials: "PS", summary: "One load to wash, dry, and fold. It will be in a bag at the Zura lobby.", facts: [["When", "Today, 5:00 PM"], ["Where", "Zura lobby"], ["Pay", "$12 a load"]], status: "open" },
    { id: "chore-groceries", title: "Grocery run", meta: "Today · 4:00 PM · Viejas", price: "$8 + receipt", amount: "$8", accent: "mint", emoji: "🛒", poster: "Lena Brooks", initials: "LB", summary: "A short list from the campus market. The receipt is covered, plus $8 for the run.", facts: [["When", "Today, 4:00 PM"], ["Where", "Drop-off at Chapultepec"], ["Pay", "$8 plus the receipt"]], status: "open" },
    { id: "chore-package", title: "Package drop", meta: "Today · 2:00 PM · Mailroom", price: "$10", amount: "$10", accent: "coral", emoji: "📬", poster: "Elena Park", initials: "EP", summary: "A small box that needs to reach the campus mailroom before it closes.", facts: [["When", "Today, 2:00 PM"], ["Where", "Campus mailroom"], ["Pay", "$10"]], status: "open" },
    { id: "chore-plants", title: "Plant water", meta: "Fri · 6:00 PM · Maya Hall", price: "$12", amount: "$12", accent: "mint", emoji: "🪴", poster: "Avery Cole", initials: "AC", summary: "Three plants on the windowsill. A key is with the front desk.", facts: [["When", "Friday, 6:00 PM"], ["Where", "Maya Hall"], ["Pay", "$12"]], status: "open" },
    { id: "chore-notes", title: "Notes pickup", meta: "Tomorrow · 11:00 AM · Library", price: "$8", amount: "$8", accent: "lilac", emoji: "📝", poster: "Jordan Hale", initials: "JH", summary: "A printed study packet at the Love Library hold shelf, name Hale.", facts: [["When", "Tomorrow, 11:00 AM"], ["Where", "Love Library"], ["Pay", "$8"]], status: "open" },
    { id: "chore-bike", title: "Bike to class", meta: "Mon · 8:15 AM · PS12", price: "$10", amount: "$10", accent: "sky", emoji: "🚲", poster: "Chris Nguyen", initials: "CN", summary: "Roll a locked bike from Parking Structure 12 to the engineering steps.", facts: [["When", "Monday, 8:15 AM"], ["Where", "Parking Structure 12"], ["Pay", "$10"]], status: "open" },
    { id: "chore-posters", title: "Poster hang", meta: "Thu · 1:00 PM · Union", price: "$15", amount: "$15", accent: "coral", emoji: "📌", poster: "Riley Santos", initials: "RS", summary: "Six club posters for the bulletin strips in the Student Union.", facts: [["When", "Thursday, 1:00 PM"], ["Where", "Student Union"], ["Pay", "$15"]], status: "open" },
    { id: "chore-trash", title: "Trash run", meta: "Tonight · 9:00 PM · Tenochca", price: "$10", amount: "$10", accent: "butter", emoji: "🗑️", poster: "Noah Brooks", initials: "NB", summary: "Two bags from a third-floor room down to the dumpster.", facts: [["When", "Tonight, 9:00 PM"], ["Where", "Tenochca"], ["Pay", "$10"]], status: "open" },
    { id: "chore-tidy", title: "Room reset", meta: "Sun · 1:00 PM · Cuicacalli", price: "$20/hour", amount: "$20", accent: "lilac", emoji: "🧹", poster: "Dana Kim", initials: "DK", summary: "Surfaces, floors, and a bag of trash out the door before a Sunday visitor.", facts: [["When", "Sunday, 1:00 PM"], ["Where", "Cuicacalli"], ["Pay", "$20 an hour"]], status: "open" },
    { id: "chore-desk", title: "Desk carry", meta: "Sat · 12:00 PM · Art North", price: "$20", amount: "$20", accent: "butter", emoji: "🪑", poster: "Harper Diaz", initials: "HD", summary: "A small desk from Art North to a car at the curb. One other person is already helping.", facts: [["When", "Saturday, 12:00 PM"], ["Where", "Art North"], ["Pay", "$20"]], status: "open" }
  ];

  const agents = [
    { id: "agent-camila", name: "Camila Reyes", initials: "CR", brokerage: "College Area Homes", focus: "College Area", summary: "Studios and shared houses a short walk from campus.", rating: "4.9", reviews: 18, accent: "coral" },
    { id: "agent-owen", name: "Owen Blake", initials: "OB", brokerage: "Plaza Residential", focus: "South Campus Plaza", summary: "Furnished units by the trolley, gym, and shuttle stop.", rating: "4.8", reviews: 24, accent: "mint" },
    { id: "agent-sofia", name: "Sofia Nguyen", initials: "SN", brokerage: "Rolando Homes", focus: "Rolando", summary: "Student houses with street parking and a short bus ride.", rating: "4.9", reviews: 15, accent: "sky" },
    { id: "agent-malik", name: "Malik Johnson", initials: "MJ", brokerage: "Aztec Lease Co.", focus: "First leases", summary: "Help comparing rent, roommates, and move-in dates.", rating: "4.7", reviews: 21, accent: "butter" },
    { id: "agent-harper", name: "Harper Diaz", initials: "HD", brokerage: "Campus Key Realty", focus: "Summer subleases", summary: "Short stays and summer takeovers near SDSU.", rating: "4.8", reviews: 12, accent: "lilac" },
    { id: "agent-quinn", name: "Quinn Alvarez", initials: "QA", brokerage: "Trolley Line Living", focus: "A quick ride away", summary: "Places a bus or trolley ride from class, often for less.", rating: "4.9", reviews: 16, accent: "coral" },
    { id: "agent-elise", name: "Elise Cho", initials: "EC", brokerage: "Mesa Realty", focus: "High-rise studios", summary: "Studios and shares with a front desk and a gym downstairs.", rating: "4.8", reviews: 19, accent: "sky" }
  ];

  const ticketPosts = [
    { id: "tpost-alex", kind: "resell", event: "Boise State", price: "25", name: "Alex Ruiz", initials: "AR", accent: "coral", mine: false, messages: [] },
    { id: "tpost-priya", kind: "request", event: "the Open Air concert", name: "Priya Shah", initials: "PS", accent: "lilac", mine: false, messages: [] },
    { id: "tpost-lena", kind: "resell", event: "spring formal", price: "35", name: "Lena Brooks", initials: "LB", accent: "butter", mine: false, messages: [] },
    { id: "tpost-dana", kind: "request", event: "Comedy night", name: "Dana Kim", initials: "DK", accent: "mint", mine: false, messages: [] }
  ];

  /* ---------- The buyer demo account: Katarina Cedolin ---------- */

  const mayaThread = [
    { from: "them", text: "Hey! Thanks for reaching out. What kind of photos are you thinking?", at: minutesAgo(10) },
    { from: "me", text: "Something natural around campus for graduation announcements.", at: minutesAgo(8) },
    { from: "them", text: "4:00 PM works perfectly! Meet me at the Love Library steps and bring two outfits if you want variety.", at: minutesAgo(2) }
  ];

  const buyer = {
    id: MOCK_BUYER_ID,
    account: { displayName: "Katarina Cedolin", email: "kcedolin@sdsu.edu", school: "San Diego State University", notifyMessages: true, notifyOrders: true, notifyHousing: false, profileVisible: true, showCampus: true },
    paymentMethods: [],
    orders: [
      { id: "order-maya", listingId: "maya-portraits", kind: "service", status: "confirmed", date: inDays(0), time: "4:00 PM", quantity: 1, total: 65, placedAt: minutesAgo(3 * HOUR), sellerOrderId: "so-1001" },
      { id: "order-lamp", listingId: "desk-lamp", kind: "product", status: "ready", note: "Pickup by Friday", quantity: 1, total: 24, placedAt: minutesAgo(DAY + 2 * HOUR) }
    ],
    conversations: [
      { id: "maya", sellerId: "maya-chen", name: "Maya Chen", initials: "MC", accent: "coral", context: "Grad portraits with Maya", unread: true, messages: mayaThread },
      { id: "jordan", sellerId: "jordan-lee", name: "Jordan Lee", initials: "JL", accent: "butter", context: "Vintage desk lamp", unread: true, messages: [{ from: "them", text: "It is still available for pickup near the library.", at: minutesAgo(HOUR) }] },
      { id: "noah", sellerId: "noah-williams", name: "Noah Williams", initials: "NW", accent: "sky", context: "Calculus II tutoring", unread: false, messages: [{ from: "them", text: "I sent over the practice set. We can work through the series problems together.", at: minutesAgo(DAY + 2 * HOUR) }] }
    ],
    notifications: [
      { id: "notif-maya-booking", unread: true, title: "Booking confirmed", body: "Grad portraits with Maya · Today · 4:00 PM", at: minutesAgo(2), emoji: "📸", accent: "coral", action: "order", orderId: "order-maya" },
      { id: "notif-lamp-pickup", unread: true, title: "Ready for pickup", body: "Vintage desk lamp — Jordan marked your order ready.", at: minutesAgo(HOUR), emoji: "💡", accent: "butter", action: "order", orderId: "order-lamp" },
      { id: "notif-noah-review", unread: false, title: "Leave a review", body: "How was Calculus II tutoring with Noah?", at: minutesAgo(DAY + HOUR), emoji: "∫", accent: "sky", action: "inbox", conversationId: "noah" },
      { id: "notif-store-follow", unread: false, title: "Store update", body: "Maya Makes Photo posted a grad season announcement.", at: minutesAgo(DAY + 5 * HOUR), emoji: "📸", accent: "coral", action: "store", storeId: "maya-makes-photo" }
    ]
  };

  sellers.push({ id: MOCK_BUYER_ID, name: "Katarina Cedolin", initials: "KC", handle: "@katarina", campus: "SDSU · Student", verified: true, bio: "A student seller on Campus Connect.", rating: "New", reviews: 0, completed: 0, response: "soon", accent: "lilac" });

  openChores.unshift({ id: "chore-your-drop", title: "Mailroom drop", meta: "Today · 4:00 PM · Zura", price: "$15", amount: "$15", accent: "coral", emoji: "📬", poster: "Katarina Cedolin", initials: "KC", summary: "A small box from Zura to the campus mailroom before it closes.", facts: [["When", "Today, 4:00 PM"], ["Where", "Zura to the mailroom"], ["Pay", "$15"]], mine: true, status: "requested", offerName: "Priya Shah" });

  /* ---------- The seller demo account: Maya Chen ---------- */

  const draft = { seller: "Maya Chen", initials: "MC", sellerId: MOCK_SELLER_ID, storeId: "maya-makes-photo", rating: "New", reviews: 0, completed: 0, campus: "SDSU", verified: true, response: "Usually replies in under an hour", status: "draft" };
  const drafts = [
    { ...draft, id: "maya-senior-package", kind: "service", category: "Create", title: "Senior photo package", price: 150, unit: "90 min", accent: "mint", emoji: "🎓", description: "Three locations, two outfit changes and 40 edited photos. Built for grads who want the full story of their time at State.", meeting: "Hepner Hall, Aztec Green and one spot of your choice" },
    { ...draft, id: "maya-postcards", kind: "product", merchandiseType: "new", category: "Create", title: "Campus postcard set (6)", price: 9, unit: "set of 6", accent: "butter", emoji: "✉️", condition: "New", availability: "Pickup near Love Library", quantityAvailable: 15, description: "Six matte postcards of SDSU landmarks at golden hour. Send one home or pin them over your desk.", meeting: "Love Library steps" }
  ];

  /* Service bookings carry a date and time. Product orders carry a pickup note in `when` until they are done. */
  const sellerOrders = [
    { id: "so-1011", listingId: "maya-prints", kind: "product", buyer: "Tom Huang", initials: "TH", accent: "sky", status: "requested", qty: 1, amount: 15, when: "Pickup once you accept", placedAt: minutesAgo(12), updatedAt: minutesAgo(12), note: "Could I get the Hepner Hall one? Happy to pick up any afternoon.", conversationId: null },
    { id: "so-1002", listingId: "maya-events", kind: "service", buyer: "Ava Robinson", initials: "AR", accent: "butter", status: "requested", date: inDays(2), time: "6:00 PM", qty: 1, amount: 120, placedAt: minutesAgo(40), updatedAt: minutesAgo(40), note: "Delta Gamma spring formal at the Prado. About 80 guests, mostly candids plus one big group photo.", conversationId: "sc-ava" },
    { id: "so-1003", listingId: "maya-mini", kind: "service", buyer: "Priya Shah", initials: "PS", accent: "coral", status: "requested", date: inDays(1), time: "4:00 PM", qty: 1, amount: 40, placedAt: minutesAgo(2 * HOUR), updatedAt: minutesAgo(2 * HOUR), note: "Three of us in matching sweaters. Aztec Green if the light is good!", conversationId: "sc-priya" },
    { id: "so-1001", listingId: "maya-portraits", kind: "service", buyer: "Katarina Cedolin", initials: "KC", accent: "lilac", status: "confirmed", date: inDays(0), time: "4:00 PM", qty: 1, amount: 65, placedAt: minutesAgo(3 * HOUR), updatedAt: minutesAgo(3 * HOUR - 10), note: "Something natural around campus for graduation announcements.", conversationId: "sc-katarina", buyerOrderId: "order-maya" },
    { id: "so-1007", listingId: "maya-portraits", kind: "service", buyer: "Hannah Reyes", initials: "HR", accent: "mint", status: "confirmed", date: inDays(3), time: "11:00 AM", qty: 1, amount: 65, placedAt: minutesAgo(DAY + HOUR), updatedAt: minutesAgo(DAY), note: "Cap and gown, plus one casual outfit.", conversationId: null },
    { id: "so-1013", listingId: "maya-events", kind: "service", buyer: "SDSU Film Club", initials: "FC", accent: "sky", status: "confirmed", date: inDays(5), time: "7:00 PM", qty: 1, amount: 120, placedAt: minutesAgo(3 * DAY), updatedAt: minutesAgo(3 * DAY - HOUR), note: "Screening night at the Don Powell Theatre. Red-carpet style photos at the entrance.", conversationId: null },
    { id: "so-1005", listingId: "maya-prints", kind: "product", buyer: "Jess Lin", initials: "JL", accent: "mint", status: "confirmed", qty: 2, amount: 30, when: "Pickup tomorrow · Love Library steps", placedAt: minutesAgo(DAY + 3 * HOUR), updatedAt: minutesAgo(DAY + 2 * HOUR), note: "One Hepner Hall and one Campanile, please.", conversationId: "sc-jess" },
    { id: "so-1006", listingId: "maya-jeans", kind: "product", buyer: "Omar Khan", initials: "OK", accent: "sky", status: "ready", qty: 1, amount: 26, when: "Pickup today by 5:00 PM · Art North", placedAt: minutesAgo(2 * DAY), updatedAt: minutesAgo(HOUR + 40), note: "", conversationId: "sc-omar" },
    { id: "so-1004", listingId: "maya-presets", kind: "product", buyer: "Marcus Tran", initials: "MT", accent: "butter", status: "completed", qty: 1, amount: 12, placedAt: minutesAgo(DAY + 5 * HOUR), updatedAt: minutesAgo(DAY + 4 * HOUR), note: "", conversationId: null },
    { id: "so-1008", listingId: "maya-sundress", kind: "product", buyer: "Jess Lin", initials: "JL", accent: "mint", status: "completed", qty: 1, amount: 22, placedAt: minutesAgo(8 * DAY), updatedAt: minutesAgo(6 * DAY), note: "", conversationId: "sc-jess" },
    { id: "so-1009", listingId: "maya-events", kind: "service", buyer: "Alpha Phi", initials: "AΦ", accent: "coral", status: "completed", qty: 1, amount: 120, placedAt: minutesAgo(16 * DAY), updatedAt: minutesAgo(7 * DAY), note: "Sisterhood retreat group photos.", conversationId: null },
    { id: "so-1012", listingId: "maya-portraits", kind: "service", buyer: "Dev Arora", initials: "DA", accent: "sky", status: "completed", qty: 1, amount: 65, placedAt: minutesAgo(13 * DAY), updatedAt: minutesAgo(8 * DAY), note: "", conversationId: null },
    { id: "so-1010", listingId: "maya-tote", kind: "product", buyer: "Nina Park", initials: "NP", accent: "lilac", status: "cancelled", qty: 1, amount: 10, placedAt: minutesAgo(10 * DAY), updatedAt: minutesAgo(9 * DAY), note: "", cancelReason: "Buyer cancelled before pickup.", conversationId: null }
  ];

  /* `buyerThreadId` marks the one thread whose other end is the buyer demo account. Both copies get every message. */
  const sellerConversations = [
    { id: "sc-ava", name: "Ava Robinson", initials: "AR", accent: "butter", orderId: "so-1002", context: "Event & org photo coverage", unread: true, messages: [
      { from: "them", text: "Hi Maya! I just sent a booking request for our spring formal.", at: minutesAgo(39) },
      { from: "them", text: "Do you also do one big group shot with the whole chapter?", at: minutesAgo(38) }
    ] },
    { id: "sc-omar", name: "Omar Khan", initials: "OK", accent: "sky", orderId: "so-1006", context: "Vintage straight-leg jeans", unread: true, messages: [
      { from: "me", text: "The jeans are ready! I'm at Art North until 5.", at: minutesAgo(HOUR + 38) },
      { from: "them", text: "On my way to Art North now!", at: minutesAgo(HOUR) }
    ] },
    { id: "sc-leah", name: "Leah Morgan", initials: "LM", accent: "mint", listingId: "maya-presets", context: "Question about Lightroom preset pack", unread: true, messages: [
      { from: "them", text: "Do the presets work on the free Lightroom mobile app?", at: minutesAgo(3 * HOUR) }
    ] },
    { id: "sc-katarina", buyerThreadId: "maya", name: "Katarina Cedolin", initials: "KC", accent: "lilac", orderId: "so-1001", context: "Grad portraits with Maya", unread: false, messages: mayaThread.map((message) => ({ ...message, from: message.from === "me" ? "them" : "me" })) },
    { id: "sc-priya", name: "Priya Shah", initials: "PS", accent: "coral", orderId: "so-1003", context: "Friends mini session", unread: false, messages: [
      { from: "them", text: "Hi! Is the friends mini session okay for three people?", at: minutesAgo(2 * HOUR + 22) },
      { from: "me", text: "Totally, up to four. Tomorrow at 4 has great light on Aztec Green.", at: minutesAgo(2 * HOUR + 11) },
      { from: "them", text: "Sent the request! Hope tomorrow works.", at: minutesAgo(2 * HOUR) }
    ] },
    { id: "sc-jess", name: "Jess Lin", initials: "JL", accent: "mint", orderId: "so-1005", context: "Campus photo print (8×10) × 2", unread: false, messages: [
      { from: "them", text: "Can I grab the prints tomorrow after my 2 PM class?", at: minutesAgo(DAY + 2 * HOUR) },
      { from: "me", text: "Perfect, see you at the library steps.", at: minutesAgo(DAY + HOUR) }
    ] }
  ];

  const sellerNotifications = [
    { id: "sn-order-tom", unread: true, category: "orders", title: "New order", body: "Tom Huang bought a Campus photo print (8×10).", at: minutesAgo(12), emoji: "🌅", accent: "sky", action: "order", orderId: "so-1011" },
    { id: "sn-request-ava", unread: true, category: "orders", title: "New booking request", body: "Ava Robinson · Event & org photo coverage", at: minutesAgo(40), emoji: "🎉", accent: "butter", action: "order", orderId: "so-1002" },
    { id: "sn-msg-omar", unread: true, category: "messages", title: "Omar Khan sent a message", body: "“On my way to Art North now!”", at: minutesAgo(HOUR), emoji: "💬", accent: "sky", action: "inbox", conversationId: "sc-omar" },
    { id: "sn-low-stock", unread: false, category: "store", title: "Running low", body: "Campus photo print (8×10) has 3 left in stock.", at: minutesAgo(3 * HOUR), emoji: "📦", accent: "coral", action: "listing", listingId: "maya-prints" },
    { id: "sn-review-marcus", unread: false, category: "reviews", title: "New 4★ review", body: "Marcus T. reviewed the Lightroom preset pack.", at: minutesAgo(DAY + HOUR), emoji: "⭐", accent: "butter", action: "reviews" },
    { id: "sn-payout", unread: false, category: "payouts", title: "Payout sent", body: "$186.00 is on its way to checking ••4821.", at: pastMonday(0), emoji: "💸", accent: "mint", action: "payouts" }
  ];

  const reviewAges = [2 * DAY, 7 * DAY, DAY];
  const reviews = [
    ...stores.find((store) => store.id === "maya-makes-photo").reviewsSample.map((review, index) => ({ ...review, id: `rv-${index}`, storeId: "maya-makes-photo", at: minutesAgo(reviewAges[index] || 14 * DAY), reply: index === 0 ? "Thank you Priya! It was such a fun session." : "" })),
    { id: "rv-hannah", author: "Hannah R.", rating: 5, text: "Maya found the best light on campus and kept me laughing the whole time.", listingId: "maya-portraits", storeId: "maya-makes-photo", at: minutesAgo(15 * DAY), reply: "Thank you Hannah! You made it easy. Congrats, grad!" },
    { id: "rv-leo", author: "Leo T.", rating: 3, text: "Photos were great, but delivery took eight days instead of five.", listingId: "maya-portraits", storeId: "maya-makes-photo", at: minutesAgo(21 * DAY), reply: "" }
  ];

  /* 180 days of activity, oldest first. The last entry is today. */
  const ANALYTICS_DAYS = 180;
  const analyticsDays = Array.from({ length: ANALYTICS_DAYS }, (_, index) => {
    const growth = 0.72 + (index / ANALYTICS_DAYS) * 0.55;
    const weekly = 1 + 0.3 * Math.sin((index / 7) * Math.PI * 2);
    const noise = 1 + 0.18 * Math.sin(index * 2.7) * Math.cos(index * 1.3);
    const views = Math.round(34 * growth * weekly * noise);
    const orders = Math.max(0, Math.round(views / 21 + 0.6 * Math.sin(index * 1.9)));
    return { views, orders, earnings: orders * (24 + ((index * 17) % 31)) };
  });

  const seller = {
    id: MOCK_SELLER_ID,
    settings: { notifyRequests: true, notifyMessages: true, notifyReviews: true, notifyPayouts: true, notifyDigest: false, awayMode: false, instantBook: false, premium: false, backupPhone: "" },
    /* Weekly hours, as minutes after midnight. */
    schedule: {
      timezone: "Pacific Time",
      days: {
        sun: [],
        mon: [{ start: 720, end: 1080 }],
        tue: [{ start: 720, end: 1080 }],
        wed: [{ start: 720, end: 1080 }],
        thu: [{ start: 720, end: 1080 }],
        fri: [{ start: 720, end: 960 }],
        sat: [{ start: 540, end: 1200 }]
      }
    },
    calendar: {
      connected: false,
      email: "maya.chen@sdsu.edu",
      events: [
        { date: inDays(0), time: "10:00 AM", title: "JMS 480 lecture" },
        { date: inDays(0), time: "1:00 PM", title: "Studio hours" },
        { date: inDays(0), time: "5:00 PM", title: "Yearbook meeting" },
        { date: inDays(1), time: "9:00 AM", title: "Group critique" },
        { date: inDays(1), time: "4:00 PM", title: "Office hours" },
        { date: inDays(2), time: "11:00 AM", title: "Farmers market" },
        { date: inDays(3), time: "2:00 PM", title: "Family lunch" },
        { date: inDays(4), time: "11:00 AM", title: "JMS 480 lecture" },
        { date: inDays(5), time: "3:00 PM", title: "Editing block" },
        { date: inDays(6), time: "10:00 AM", title: "JMS 480 lecture" }
      ]
    },
    orders: sellerOrders,
    conversations: sellerConversations,
    notifications: sellerNotifications,
    reviews,
    payouts: {
      available: 248.5,
      method: "Checking ••4821",
      schedule: "Weekly, every Monday",
      history: [
        { id: "po-1", at: pastMonday(0), amount: 186, status: "Paid" },
        { id: "po-2", at: pastMonday(1), amount: 242, status: "Paid" },
        { id: "po-3", at: pastMonday(2), amount: 131.5, status: "Paid" },
        { id: "po-4", at: pastMonday(3), amount: 208, status: "Paid" }
      ]
    },
    listingStats: {
      "maya-portraits": { views: 1284, saves: 142, messages: 38, orders: 28 },
      "maya-events": { views: 612, saves: 71, messages: 19, orders: 9 },
      "maya-mini": { views: 455, saves: 60, messages: 11, orders: 8 },
      "maya-presets": { views: 903, saves: 88, messages: 6, orders: 22 },
      "maya-prints": { views: 377, saves: 41, messages: 4, orders: 11 },
      "maya-jeans": { views: 214, saves: 29, messages: 7, orders: 5 },
      "maya-sundress": { views: 188, saves: 34, messages: 5, orders: 5 },
      "maya-tote": { views: 97, saves: 9, messages: 2, orders: 4 }
    },
    analytics: {
      days: analyticsDays,
      sources: [
        { label: "Home shelves", share: 38 },
        { label: "Search", share: 27 },
        { label: "Store page", share: 21 },
        { label: "Shared links", share: 14 }
      ],
      ratings: { 5: 44, 4: 6, 3: 2, 2: 0, 1: 0 }
    }
  };

  return {
    categories,
    schoolServices,
    agents,
    listings: [...services, ...products, ...tickets, ...drafts],
    sellers,
    stores,
    jobs,
    housing,
    chores: openChores,
    ticketPosts,
    supportCases: [],
    reports: [],
    buyer,
    seller
  };
}
