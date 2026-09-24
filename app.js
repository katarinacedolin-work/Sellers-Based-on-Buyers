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
    id: "leo-move", kind: "service", bookingType: "chore", category: "Help", title: "Move-out help", seller: "Leo Thompson", initials: "LT", sellerId: "leo-thompson", storeId: "leo-lifts", rating: "4.9", reviews: 7, completed: 12, price: 25, unit: "hour", accent: "butter", emoji: "📦", tag: "Useful now", availability: "Sat · 10:00 AM", campus: "SDSU", verified: true,
    description: "One extra pair of hands for boxes, small furniture and a tidy move between campus housing.", meeting: "Your residence hall", response: "Usually replies within a few hours", slots: ["Sat · 10:00 AM", "Sat · 1:00 PM", "Sun · 10:00 AM"]
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
    id: "maya-mini", kind: "service", category: "Create", title: "Friends mini session", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.9", reviews: 5, completed: 8, price: 40, unit: "20 min", accent: "lilac", emoji: "🌼", tag: "Bring a friend", availability: "Tomorrow · 4:00 PM", campus: "SDSU", verified: true,
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
    id: "maya-prints", kind: "product", merchandiseType: "new", category: "Create", title: "Campus photo print (8×10)", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "maya-makes-photo", rating: "4.8", reviews: 4, completed: 11, price: 15, unit: "one print", accent: "sky", emoji: "🌅", condition: "New", availability: "Pickup near Love Library", campus: "SDSU", verified: true, quantityAvailable: 10,
    description: "Golden-hour prints of Hepner Hall and the Campanile on matte paper. A nice little dorm wall upgrade.", meeting: "Love Library steps", response: "Usually replies in under an hour"
  },
  {
    id: "maya-jeans", kind: "product", merchandiseType: "resale", category: "Clothing", title: "Vintage straight-leg jeans", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "mayas-closet", rating: "4.8", reviews: 3, completed: 5, price: 26, unit: "W28", accent: "sky", emoji: "👖", condition: "Good condition", availability: "Pickup at Art North", campus: "SDSU", verified: true, quantityAvailable: 1,
    description: "Mid-wash, high-rise and perfectly broken in. Waist 28, inseam 30.", meeting: "Art North studio lobby", response: "Usually replies in under an hour"
  },
  {
    id: "maya-sundress", kind: "product", merchandiseType: "resale", category: "Clothing", title: "Linen sundress", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "mayas-closet", rating: "4.9", reviews: 4, completed: 5, price: 22, unit: "size S", accent: "lilac", emoji: "👗", condition: "Like new", availability: "Pickup at Art North", campus: "SDSU", verified: true, quantityAvailable: 1,
    description: "Breezy lilac linen dress, worn twice. Great for grad photos or a beach day.", meeting: "Art North studio lobby", response: "Usually replies in under an hour"
  },
  {
    id: "maya-tote", kind: "product", merchandiseType: "resale", category: "Clothing", title: "Canvas tote bag", seller: "Maya Chen", initials: "MC", sellerId: "maya-chen", storeId: "mayas-closet", rating: "4.7", reviews: 2, completed: 4, price: 10, unit: "one bag", accent: "butter", emoji: "👜", condition: "Good condition", availability: "Pickup near Love Library", campus: "SDSU", verified: true, quantityAvailable: 2,
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
  }
];

const sellers = {
  "maya-chen": { id: "maya-chen", name: "Maya Chen", initials: "MC", handle: "@mayamakes", campus: "SDSU · Senior · Design", verified: true, bio: "Photographer, design student and the person behind the camera at your favorite campus events.", rating: "4.9", reviews: 18, completed: 28, response: "under an hour", accent: "coral", storeIds: ["maya-makes-photo", "mayas-closet"] },
  "noah-williams": { id: "noah-williams", name: "Noah Williams", initials: "NW", handle: "@noahstudies", campus: "SDSU · Junior · Mathematics", verified: true, bio: "I like making intimidating problems feel manageable. Bring the one that is bothering you.", rating: "5.0", reviews: 11, completed: 19, response: "a few hours", accent: "sky", storeIds: ["noah-studies"] },
  "zoe-rivera": { id: "zoe-rivera", name: "Zoe Rivera", initials: "ZR", handle: "@zoecreates", campus: "SDSU · Senior · Psychology", verified: true, bio: "Soft gel sets, tiny details and a relaxing appointment between the busy parts of college.", rating: "4.8", reviews: 26, completed: 34, response: "two hours", accent: "lilac", storeIds: ["zoe-nail-studio"] },
  "jordan-lee": { id: "jordan-lee", name: "Jordan Lee", initials: "JL", handle: "@jordanlists", campus: "SDSU · Senior · Business", verified: true, bio: "Selling the useful things I am done with so they can have a second life on campus.", rating: "4.9", reviews: 8, completed: 10, response: "same day", accent: "butter", storeIds: ["dorm-reset"] },
  "ari-patel": { id: "ari-patel", name: "Ari Patel", initials: "AP", handle: "@ariedits", campus: "SDSU · Sophomore · Film", verified: true, bio: "I edit for student creators and clubs. Fast turnarounds, clean captions and good music choices.", rating: "4.9", reviews: 15, completed: 23, response: "same day", accent: "mint", storeIds: ["ari-edits"] },
  "leo-thompson": { id: "leo-thompson", name: "Leo Thompson", initials: "LT", handle: "@leolifts", campus: "SDSU · Junior · Kinesiology", verified: true, bio: "Strong, careful and on time. I help students move without the stress.", rating: "4.9", reviews: 7, completed: 12, response: "a few hours", accent: "butter", storeIds: ["leo-lifts"] },
  "mia-torres": { id: "mia-torres", name: "Mia Torres", initials: "MT", handle: "@miatorres", campus: "SDSU · Senior · Communication", verified: true, bio: "Headshots that look like you on a good day, ready for LinkedIn and org pages.", rating: "4.7", reviews: 13, completed: 21, response: "under a day", accent: "sky", storeIds: ["mia-torres-studio"] },
  "sam-okafor": { id: "sam-okafor", name: "Sam Okafor", initials: "SO", handle: "@samshootsfilm", campus: "SDSU · Junior · Art", verified: true, bio: "Film nerd. I test every camera I sell and develop film for friends on the side.", rating: "5.0", reviews: 19, completed: 35, response: "two hours", accent: "lilac", storeIds: ["film-and-frames"] },
  "emily-park": { id: "emily-park", name: "Emily Park", initials: "EP", handle: "@emilyreads", campus: "SDSU · Senior · Engineering", verified: true, bio: "Passing along the STEM textbooks that got me through, notes included.", rating: "4.8", reviews: 5, completed: 7, response: "next day", accent: "sky", storeIds: ["emily-book-swap"] },
  "chris-nguyen": { id: "chris-nguyen", name: "Chris Nguyen", initials: "CN", handle: "@aztecthrift", campus: "SDSU · Junior · Marketing", verified: true, bio: "I dig through thrift stores for vintage Aztecs gear so you do not have to.", rating: "4.9", reviews: 17, completed: 21, response: "an hour", accent: "coral", storeIds: ["aztec-thrift"] },
  "riley-kim": { id: "riley-kim", name: "Riley Kim", initials: "RK", handle: "@rileyclay", campus: "SDSU · Senior · Studio Art", verified: true, bio: "Ceramics major making small-batch mugs and planters, and teaching friends the wheel.", rating: "4.9", reviews: 12, completed: 18, response: "a day", accent: "mint", storeIds: ["riley-clay"] },
  "taylor-brooks": { id: "taylor-brooks", name: "Taylor Brooks", initials: "TB", handle: "@taylordorm", campus: "SDSU · Sophomore · Biology", verified: true, bio: "Small dorm essentials I no longer need, priced to move.", rating: "4.7", reviews: 3, completed: 4, response: "same day", accent: "sky", storeIds: ["dorm-drop"] }
};

const stores = [
  {
    id: "maya-makes-photo", sellerId: "maya-chen", name: "Maya Makes Photo", handle: "@mayamakes", emoji: "📸", accent: "coral",
    tagline: "Portraits, events and prints from around campus",
    about: "Maya has photographed hundreds of SDSU students, from grad portraits to club formals. This store has her sessions plus the prints and presets people keep asking about.",
    announcement: "Grad season is here — spring weekends are filling up fast.",
    rating: "4.9", reviews: 43, sales: 78, followers: 312,
    policies: { cancellation: "Free cancellation up to 24 hours before a session. Reschedule once for free.", pickup: "Prints pick up at the Love Library steps. Presets are delivered in the app.", hours: "Sessions weekdays after 3 PM and most weekends" },
    collections: [
      { name: "Featured", listingIds: ["maya-portraits", "maya-events", "maya-presets"] },
      { name: "Sessions", listingIds: ["maya-portraits", "maya-mini", "maya-events"] },
      { name: "Prints & presets", listingIds: ["maya-prints", "maya-presets"] }
    ],
    reviewsSample: [
      { author: "Priya S.", rating: 5, text: "Maya made the session feel easy. The photos looked like me, not a stock photo.", listingId: "maya-portraits" },
      { author: "Delta Gamma", rating: 5, text: "She covered our formal and had previews up the next morning.", listingId: "maya-events" },
      { author: "Marcus T.", rating: 4, text: "The presets are great on mobile. One felt a little orange on indoor shots.", listingId: "maya-presets" }
    ]
  },
  {
    id: "mayas-closet", sellerId: "maya-chen", name: "Maya's Closet", handle: "@mayascloset", emoji: "👗", accent: "lilac",
    tagline: "Thrifted pieces I've loved and am passing on",
    about: "Maya's second store: a rotating rack of vintage and barely-worn clothes from her own closet.",
    announcement: "New drop every Sunday evening.",
    rating: "4.8", reviews: 9, sales: 14, followers: 88,
    policies: { cancellation: "If it doesn't fit, message within 24 hours of pickup to return it.", pickup: "Pickup at Art North or the Love Library steps.", hours: "Pickups weekday afternoons" },
    collections: [
      { name: "Tops & dresses", listingIds: ["maya-sundress"] },
      { name: "Bottoms", listingIds: ["maya-jeans"] },
      { name: "Accessories", listingIds: ["maya-tote"] }
    ],
    reviewsSample: [
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
      { name: "Take-home", listingIds: ["zoe-pressons"] }
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
      { name: "Lab", listingIds: ["sam-scans"] }
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
      { name: "Design", listingIds: ["ari-thumbnails"] }
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
      { name: "Sweats", listingIds: ["vintage-hoodie", "chris-crewneck"] }
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
  }
];

const aztecDeals = [
  { id: "aztec-cafe", merchant: "Aztec Cafe", title: "Free drink upgrade", offer: "Medium → large any day", code: "AZTEC-SIP26", emoji: "☕", accent: "butter", expires: "Apr 30" },
  { id: "campus-books", merchant: "Campus Bookstore", title: "15% off textbooks", offer: "In-store pickup only", code: "AZTEC-READ15", emoji: "📚", accent: "sky", expires: "May 15" },
  { id: "union-bowl", merchant: "Student Union Bowl", title: "Buy one, get one slice", offer: "After 8 PM · dine-in", code: "AZTEC-PIZZA", emoji: "🍕", accent: "coral", expires: "Jun 1" },
  { id: "fit-club", merchant: "Aztec Fit Club", title: "First class free", offer: "Spin or yoga intro", code: "AZTEC-MOVE", emoji: "💪", accent: "mint", expires: "Apr 18" },
  { id: "print-shop", merchant: "Campus Print Lab", title: "$5 off poster prints", offer: "Up to 24×36", code: "AZTEC-PRINT5", emoji: "🖼️", accent: "lilac", expires: "May 30" },
  { id: "nail-bar", merchant: "Glamour Bar", title: "10% off gel sets", offer: "Student ID required", code: "AZTEC-GLOW10", emoji: "💅", accent: "coral", expires: "Apr 25" }
];

const notifications = [
  { id: "notif-maya-booking", unread: true, title: "Booking confirmed", body: "Grad portraits with Maya · Today · 4:00 PM", time: "2m ago", emoji: "📸", accent: "coral", action: "order", orderId: "order-maya" },
  { id: "notif-lamp-pickup", unread: true, title: "Ready for pickup", body: "Vintage desk lamp — Jordan marked your order ready.", time: "1h ago", emoji: "💡", accent: "butter", action: "order", orderId: "order-lamp" },
  { id: "notif-noah-review", unread: false, title: "Leave a review", body: "How was Calculus II tutoring with Noah?", time: "Yesterday", emoji: "∫", accent: "sky", action: "inbox", conversationId: "noah" },
  { id: "notif-store-follow", unread: false, title: "Store update", body: "Maya Makes Photo posted a grad season announcement.", time: "Yesterday", emoji: "📸", accent: "coral", action: "store", storeId: "maya-makes-photo" }
];

const conversations = [
  { id: "maya", name: "Maya Chen", initials: "MC", context: "Grad portraits with Maya", time: "2m", preview: "4:00 PM works perfectly!", unread: true, accent: "coral" },
  { id: "jordan", name: "Jordan Lee", initials: "JL", context: "Vintage desk lamp", time: "1h", preview: "It is still available for pickup.", unread: true, accent: "butter" },
  { id: "noah", name: "Noah Williams", initials: "NW", context: "Calculus II tutoring", time: "Yesterday", preview: "I sent over the practice set.", unread: false, accent: "sky" }
];

const state = {
  mode: "buyer",
  view: "home",
  activeKind: "all",
  category: "All",
  shopType: "all",
  bookType: "all",
  query: "",
  selectedListingId: null,
  selectedSellerId: null,
  selectedStoreId: null,
  storeTab: "shop",
  storeCollection: "All",
  storeQuery: "",
  storeKind: "all",
  followedStoreIds: ["maya-makes-photo", "riley-clay"],
  storesFilter: "All",
  storesQuery: "",
  detailReturn: null,
  selectedOrderId: null,
  selectedConversationId: "maya",
  selectedDate: "Today",
  selectedSlot: "Today · 4:00 PM",
  quantity: 1,
  lists: [
    { id: "list-favorites", name: "Favorites", listingIds: ["maya-portraits"] },
    { id: "list-dorm", name: "Dorm wishlist", listingIds: ["desk-lamp"] }
  ],
  selectedListId: "list-favorites",
  messages: {
    maya: [
      { who: "them", text: "Hey! Thanks for reaching out. What kind of photos are you thinking?", time: "1:54 PM" },
      { who: "me", text: "Something natural around campus for graduation announcements.", time: "1:56 PM" },
      { who: "them", text: "4:00 PM works perfectly! Meet me at the Love Library steps and bring two outfits if you want variety.", time: "2:02 PM" }
    ],
    jordan: [{ who: "them", text: "It is still available for pickup near the library.", time: "Yesterday" }],
    noah: [{ who: "them", text: "I sent over the practice set. We can work through the series problems together.", time: "Yesterday" }]
  },
  orders: [
    { id: "order-maya", listingId: "maya-portraits", status: "Upcoming", date: "Today · 4:00 PM", kind: "service" },
    { id: "order-lamp", listingId: "desk-lamp", status: "Ready for pickup", date: "Pickup by Friday", kind: "product" }
  ],
  userListings: [],
  sellKind: null,
  sellMerchandiseType: null,
  notificationsOpen: false,
  settingsSection: "account",
  settings: {
    displayName: "Katarina Cedolin",
    notifyMessages: true,
    notifyOrders: true,
    notifyDeals: false,
    profileVisible: true,
    showCampus: true
  }
};

const everyListing = () => [...services, ...products, ...state.userListings];
const isPublicListing = (listing) => !listing.status || listing.status === "active";
const allListings = () => everyListing().filter(isPublicListing);
const getListing = (id) => everyListing().find((listing) => listing.id === id);
const getList = (id) => state.lists.find((list) => list.id === id);
const getSelectedList = () => getList(state.selectedListId) || state.lists[0];
const isListingSaved = (listingId) => state.lists.some((list) => list.listingIds.includes(listingId));
const savedListingCount = () => new Set(state.lists.flatMap((list) => list.listingIds)).size;
const addListingToList = (listId, listingId) => {
  const list = getList(listId);
  if (!list || list.listingIds.includes(listingId)) return;
  list.listingIds.push(listingId);
};
const removeListingFromList = (listId, listingId) => {
  const list = getList(listId);
  if (!list) return;
  list.listingIds = list.listingIds.filter((id) => id !== listingId);
};
const getSeller = (id) => sellers[id] || { id, name: "You", initials: "KC", handle: "@you", campus: "SDSU · Student", verified: true, bio: "A student seller on Campus Connect.", rating: "New", reviews: 0, completed: 0, response: "soon", accent: "lilac", storeIds: [] };
const studentVerifiedPill = () => `<span class="verified-pill">${icon("verified")} Student verified</span>`;
const getStore = (id) => stores.find((store) => store.id === id);
const storesForSeller = (sellerId) => stores.filter((store) => store.sellerId === sellerId);
const storeListings = (store) => allListings().filter((listing) => listing.storeId === store.id);
const storeKinds = (store) => new Set(storeListings(store).map((listing) => listing.kind));
const storeCategories = (store) => [...new Set(storeListings(store).map((listing) => listing.category))];
const isFollowing = (storeId) => state.followedStoreIds.includes(storeId);
const storeMatchesQuery = (store, query) => {
  const search = query.trim().toLowerCase();
  if (!search) return true;
  const haystack = [store.name, store.handle, store.tagline, getSeller(store.sellerId).name, ...store.collections.map((collection) => collection.name), ...storeListings(store).flatMap((listing) => [listing.title, listing.category])];
  return haystack.join(" ").toLowerCase().includes(search);
};
const money = (amount) => `$${amount.toFixed(2)}`;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

function setView(view, extra = {}) {
  state.view = view;
  Object.assign(state, extra);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message, type = "success") {
  const region = document.querySelector("#toast-region");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === "success" ? icon("check") : "!"}</span><span>${escapeHtml(message)}</span>`;
  region.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3600);
}

function listingSaveButton(listing) {
  const saved = isListingSaved(listing.id);
  return `<button type="button" class="save-button ${saved ? "saved" : ""}" data-action="toggle-save" data-id="${listing.id}" aria-label="${saved ? "Manage lists" : "Save to a list"}">${icon("heart")}</button>`;
}

function listPageListingCard(listing, listId) {
  return `<article class="listing-card">
    <button type="button" class="save-button" data-action="remove-from-list" data-list-id="${listId}" data-id="${listing.id}" aria-label="Remove from list">${icon("close")}</button>
    <button type="button" class="listing-card-button" data-action="open-listing" data-id="${listing.id}">
      ${listingVisual(listing)}
      <div class="listing-body">
        <div class="listing-title">${escapeHtml(listing.title)}</div>
        ${listingCardMetaHtml(listing)}
        <div class="seller-line"><span class="mini-avatar">${escapeHtml(listing.initials)}</span><span class="seller-name">${escapeHtml(listing.seller)}</span>${listing.verified ? `<span class="verified-check" title="Student verified">${icon("verified")}</span>` : ""}</div>
        <div class="listing-meta"><span class="price">${money(listing.price)} <small>${listing.kind === "service" ? `/ ${escapeHtml(listing.unit)}` : ""}</small></span><span class="rating">${icon("star", 14)} ${listing.rating} <span class="muted">(${listing.reviews})</span></span></div>
      </div>
    </button>
  </article>`;
}

function listingConditionLabel(listing) {
  if (listing.kind !== "product") return "";
  return listing.condition || "Good condition";
}

function merchandiseTypeLabel(listingOrType) {
  const type = typeof listingOrType === "string" ? listingOrType : listingOrType?.merchandiseType;
  return type === "new" ? "New & student-made" : type === "resale" ? "Pre-owned" : "";
}

const sellerCertifications = {
  "maya-chen": "photographer",
  "noah-williams": "tutor",
  "zoe-rivera": "nail tech",
  "ari-patel": "video editor",
  "leo-thompson": "campus helper",
  "mia-torres": "photographer",
  "riley-kim": "ceramics instructor",
  "sam-okafor": "photo lab tech"
};

const serviceCertificationByCategory = {
  Learn: "tutor",
  Create: "creator",
  Beauty: "nail tech",
  Tech: "editor",
  Help: "campus helper",
  Events: "event photographer",
  Lifestyle: "provider"
};

function listingCertificationLabel(listing) {
  if (listing.kind !== "service") return "";
  const certification =
    listing.certification ||
    sellerCertifications[listing.sellerId] ||
    serviceCertificationByCategory[listing.category];
  if (!certification) return "";
  return `Certified ${certification}`;
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

function listingCardMetaHtml(listing) {
  const meta =
    listing.kind === "product"
      ? listingProductMetaLine(listing)
      : listing.kind === "service"
        ? shortCardText(listing.description)
        : "";
  return meta ? `<div class="listing-meta-line muted small">${escapeHtml(meta)}</div>` : "";
}

function listingVisual(listing, detail = false) {
  const bottomTagLabel = listing.kind === "service" ? listingCertificationLabel(listing) : listingConditionLabel(listing);
  return detail
    ? `<div class="detail-visual ${listing.accent}"><span class="detail-figure" aria-hidden="true">${listing.emoji}</span></div>`
    : `<div class="listing-visual ${listing.accent}">
        ${bottomTagLabel ? `<span class="visual-caption">${escapeHtml(bottomTagLabel)}</span>` : ""}
      </div>`;
}

function listingCard(listing) {
  return `<article class="listing-card">
    ${listingSaveButton(listing)}
    <button type="button" class="listing-card-button" data-action="open-listing" data-id="${listing.id}">
      ${listingVisual(listing)}
      <div class="listing-body">
        <div class="listing-title">${escapeHtml(listing.title)}</div>
        ${listingCardMetaHtml(listing)}
        <div class="seller-line"><span class="mini-avatar">${escapeHtml(listing.initials)}</span><span class="seller-name">${escapeHtml(listing.seller)}</span>${listing.verified ? `<span class="verified-check" title="Student verified">${icon("verified")}</span>` : ""}</div>
        <div class="listing-meta"><span class="price">${money(listing.price)} <small>${listing.kind === "service" ? `/ ${escapeHtml(listing.unit)}` : ""}</small></span><span class="rating">${icon("star", 14)} ${listing.rating} <span class="muted">(${listing.reviews})</span></span></div>
      </div>
    </button>
  </article>`;
}

function dealFlipCard(deal) {
  return `<article class="deal-flip-card">
    <div class="deal-flip-scene">
      <button type="button" class="deal-flip-trigger" data-action="flip-deal" aria-pressed="false" aria-label="Reveal code for ${escapeHtml(deal.title)}">
        <span class="deal-flip-inner">
          <span class="deal-face deal-front">
            <span class="deal-photo ${deal.accent}"><span class="deal-photo-emoji" aria-hidden="true">${deal.emoji}</span></span>
            <span class="deal-front-body">
              <span class="deal-merchant">${escapeHtml(deal.merchant)}</span>
              <span class="deal-title">${escapeHtml(deal.title)}</span>
              <span class="deal-offer muted">${escapeHtml(deal.offer)}</span>
            </span>
            <span class="deal-flip-hint">Tap to reveal code</span>
          </span>
          <span class="deal-face deal-back">
            <span class="deal-back-eyebrow">Aztec Deal</span>
            <span class="deal-code">${escapeHtml(deal.code)}</span>
            <span class="deal-back-note">Show this code at checkout</span>
            <span class="deal-expires">Valid through ${escapeHtml(deal.expires)}</span>
          </span>
        </span>
      </button>
    </div>
    <button type="button" class="deal-copy-button" data-action="copy-deal-code" data-code="${escapeHtml(deal.code)}">Copy code</button>
  </article>`;
}

function aztecDealsView() {
  return `<div class="deals-page">
    <div class="deals-hero">
      <div class="eyebrow">SDSU exclusive</div>
      <h1>Aztec Deals</h1>
      <p class="lede">Flip a card to reveal your campus discount code. Each deal is student-only and ready to use in person or online.</p>
    </div>
    <div class="deals-grid">${aztecDeals.map(dealFlipCard).join("")}</div>
  </div>`;
}

function scrollSectionLink(link) {
  if (!link) return "";
  if (link.view) return `<button class="text-button" data-view="${link.view}">${escapeHtml(link.label)} ${icon("arrow")}</button>`;
  const attrs = [`data-action="${escapeHtml(link.action)}"`];
  if (link.id) attrs.push(`data-id="${escapeHtml(link.id)}"`);
  if (link.query !== undefined) attrs.push(`data-query="${escapeHtml(link.query)}"`);
  return `<button class="text-button" ${attrs.join(" ")}>${escapeHtml(link.label)} ${icon("arrow")}</button>`;
}

const professionalServiceIds = ["mia-headshots", "ari-video", "ari-thumbnails", "noah-calculus", "noah-linear", "maya-events"];

function professionalServicesList() {
  return professionalServiceIds.map(getListing).filter(Boolean);
}

function listingScrollSection(title, listings, link, sectionClass = "") {
  if (!listings.length) return "";
  const extraClass = sectionClass ? ` ${sectionClass}` : "";
  return `<section class="section section-home-shelf${extraClass}"><div class="section-header section-header-shelf"><h2>${title}</h2>${scrollSectionLink(link)}</div><div class="home-scroll-row listing-scroll-row">${listings.map(listingCard).join("")}</div></section>`;
}

function homeScrollSection(title, listings, view, linkText) {
  return listingScrollSection(title, listings, { view, label: linkText });
}

function storeScrollSection(title, storeList, link) {
  if (!storeList.length) return "";
  return `<section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>${title}</h2>${scrollSectionLink(link)}</div><div class="home-scroll-row store-scroll-row">${storeList.map(storeCard).join("")}</div></section>`;
}

function categoryChipIcon(category) {
  return `<span class="category-chip-icon ${category.dot}" aria-hidden="true">${icon(category.icon, 22)}</span>`;
}

function categoryChips(kind = "all") {
  const visible = categories.filter((category) => kind === "all" || category.kind === kind).slice(0, kind === "all" ? 7 : 10);
  return visible.map((category) => `<button type="button" class="category-chip ${state.category === category.name ? "active" : ""}" data-action="choose-category" data-category="${category.name}" data-kind="${category.kind}">${categoryChipIcon(category)}${category.name}</button>`).join("");
}

function homeView() {
  const popular = [...services, ...products].sort((a, b) => b.reviews + b.completed - (a.reviews + a.completed)).slice(0, 8);
  const bookedIds = new Set(state.orders.map((order) => order.listingId));
  const bookAgain = [...bookedIds].map(getListing).filter(Boolean);
  services.forEach((listing) => {
    if (bookAgain.length >= 8) return;
    if (!bookedIds.has(listing.id)) bookAgain.push(listing);
  });
  const featuredStores = [...stores].sort((a, b) => b.followers - a.followers).slice(0, 8);
  const usedIds = new Set([...popular, ...bookAgain].map((listing) => listing.id));
  const recommended = allListings().filter((listing) => !usedIds.has(listing.id)).slice(0, 9);
  if (recommended.length < 9) {
    allListings().forEach((listing) => {
      if (recommended.length >= 9 || recommended.some((item) => item.id === listing.id)) return;
      recommended.push(listing);
    });
  }
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

  ${homeScrollSection("Popular on campus", popular, "search", "See all")}
  ${storeScrollSection("Campus stores", featuredStores, { view: "stores", label: "All stores" })}
  ${homeScrollSection("Book again", bookAgain, "book", "View bookings")}

  <section class="section section-home-shelf"><div class="section-header section-header-shelf"><h2>Recommended</h2><button class="text-button" data-view="search">Browse more ${icon("arrow")}</button></div><div class="listing-grid listing-grid-recommended">${recommended.map(listingCard).join("")}</div></section>

  <section class="section sell-hero"><div class="eyebrow">For student sellers</div><h2>Turn what you know into what you earn.</h2><p>List a service, sell something you are done with or build a reputation on campus.</p><button class="primary-button" data-view="sell">Start selling ${icon("arrow")}</button></section>`;
}

function browseView(kind = "all") {
  const activeKind = kind === "service" || kind === "product" ? kind : state.activeKind;
  const source = activeKind === "service"
    ? allListings().filter((listing) => listing.kind === "service")
    : activeKind === "product"
      ? allListings().filter((listing) => listing.kind === "product")
      : allListings();
  const filtered = source.filter((listing) => {
    const matchesCategory = state.category === "All" || listing.category === state.category;
    const bookingType = listing.bookingType || (listing.category === "Help" ? "chore" : "service");
    const matchesBookType = activeKind !== "service" || state.bookType === "all" || bookingType === state.bookType;
    const matchesShopType = activeKind !== "product" || state.shopType === "all" || listing.merchandiseType === state.shopType;
    const search = state.query.trim().toLowerCase();
    const matchesQuery = !search || [listing.title, listing.seller, listing.category, listing.description, merchandiseTypeLabel(listing), getStore(listing.storeId)?.name || ""].join(" ").toLowerCase().includes(search);
    return matchesCategory && matchesBookType && matchesShopType && matchesQuery;
  });
  const matchingStores = state.query.trim() ? stores.filter((store) => {
    const search = state.query.trim().toLowerCase();
    return [store.name, store.handle, store.tagline, getSeller(store.sellerId).name, ...store.collections.map((collection) => collection.name)].join(" ").toLowerCase().includes(search);
  }) : [];
  const title = activeKind === "service" ? "Book something useful." : activeKind === "product" ? "Good stuff, already here." : state.query ? `Results for “${escapeHtml(state.query)}”` : "Find what you need.";
  const subtitle = activeKind === "service"
    ? state.bookType === "chore" ? "Hands-on help for the stuff you'd rather not do alone." : state.bookType === "service" ? "Tutoring, beauty, creative work and other skilled bookings." : "See who is available, when it can happen and what it costs."
    : activeKind === "product"
      ? state.shopType === "new" ? "Originals, new goods and made-to-order items from students." : state.shopType === "resale" ? "Useful items getting a second life at your school." : "Shop new and student-made goods or find useful pre-owned items at your school."
      : "Browse services and products from students at your school.";
  const professionalShelf = activeKind === "service" && state.bookType !== "chore" && !state.query.trim() && state.category === "All"
    ? listingScrollSection("Professional Services", professionalServicesList(), null, "section-browse-shelf")
    : "";
  const resultsHeader = activeKind === "service"
    ? `<div class="section-header section-header-shelf section-browse-main"><h2>Recommended</h2><button class="text-button" data-action="sort-results">Sort ${icon("chevron-down")}</button></div>`
    : `<div class="section-header" style="margin-top: 12px"><span class="result-count">${filtered.length} ${filtered.length === 1 ? "result" : "results"} · SDSU</span><button class="text-button" data-action="sort-results">Recommended ${icon("chevron-down")}</button></div>`;
  const resultsGrid = filtered.length
    ? activeKind === "service"
      ? `<section class="section section-browse-main"><div class="listing-grid listing-grid-recommended">${filtered.map(listingCard).join("")}</div></section>`
      : `<div class="listing-grid">${filtered.map(listingCard).join("")}</div>`
    : `<div class="empty-state"><div class="empty-shape">⌁</div><h3>No matches yet.</h3><p class="muted">Try another category or search for something nearby.</p><div class="button-row"><button class="ghost-button" data-action="clear-filters">Clear filters</button><button class="primary-button" data-view="sell">${activeKind === "product" ? "List an item" : "List what you do"}</button></div></div>`;
  const categoryBar = `<div class="category-row"><div class="filter-bar"><button type="button" class="filter-button category-chip ${state.category === "All" ? "active" : ""}" data-action="choose-category" data-category="All"><span class="category-chip-icon cobalt" aria-hidden="true">${icon("grid", 22)}</span>All</button>${categoryChips(activeKind)}</div><button type="button" class="ghost-button" data-action="open-filters">${icon("plus")} Filters</button></div>`;
  const browseResults = `${professionalShelf}
    ${matchingStores.length ? `<div class="search-stores">${storeScrollSection("Stores", matchingStores, { action: "search-stores", query: state.query, label: "See all matching stores" })}</div>` : ""}
    ${resultsHeader}
    ${resultsGrid}`;
  return `<div class="browse-header"><div><div class="eyebrow">${activeKind === "product" ? "Shop" : activeKind === "service" ? "Book" : "Search"}</div><h1>${title}</h1><p class="lede">${subtitle}</p></div></div>
    <div class="browse-filters">
      <form class="global-search browse-page-search" data-form="browse-search">${icon("search")}<input id="browse-search-input" name="query" type="search" value="${escapeHtml(state.query)}" placeholder="What do you need?" aria-label="Search the marketplace" autocomplete="off" /><kbd>⌘ K</kbd></form>
      ${activeKind === "service" || activeKind === "product" ? `<div class="book-tabs">
        <div class="book-tablist" role="tablist" aria-label="${activeKind === "service" ? "Booking type" : "Shop listing type"}">
          ${activeKind === "service" ? `<button type="button" class="book-tab ${state.bookType === "all" ? "active" : ""}" role="tab" aria-selected="${state.bookType === "all"}" data-action="set-book-type" data-book-type="all">All</button>
          <button type="button" class="book-tab ${state.bookType === "chore" ? "active" : ""}" role="tab" aria-selected="${state.bookType === "chore"}" data-action="set-book-type" data-book-type="chore">Chores</button>
          <button type="button" class="book-tab ${state.bookType === "service" ? "active" : ""}" role="tab" aria-selected="${state.bookType === "service"}" data-action="set-book-type" data-book-type="service">Services</button>` : `<button type="button" class="book-tab ${state.shopType === "all" ? "active" : ""}" role="tab" aria-selected="${state.shopType === "all"}" data-action="set-shop-type" data-shop-type="all">All</button>
          <button type="button" class="book-tab ${state.shopType === "new" ? "active" : ""}" role="tab" aria-selected="${state.shopType === "new"}" data-action="set-shop-type" data-shop-type="new">New & student-made</button>
          <button type="button" class="book-tab ${state.shopType === "resale" ? "active" : ""}" role="tab" aria-selected="${state.shopType === "resale"}" data-action="set-shop-type" data-shop-type="resale">Pre-owned</button>`}
        </div>
        <div class="book-tab-panel" role="tabpanel">
          ${categoryBar}
          ${browseResults}
        </div>
      </div>` : categoryBar}
    </div>
    ${activeKind === "service" || activeKind === "product" ? "" : browseResults}`;
}

function listingDetailView(listing) {
  if (!listing) return homeView();
  const service = listing.kind === "service";
  const seller = getSeller(listing.sellerId);
  const saved = isListingSaved(listing.id);
  const store = getStore(listing.storeId);
  const returnStore = getStore(state.detailReturn);
  const moreFromStore = store ? storeListings(store).filter((entry) => entry.id !== listing.id).slice(0, 8) : [];
  const sellerCard = store
    ? `<div class="seller-card sold-by-card"><div class="seller-card-main"><div class="store-logo-small ${store.accent}" aria-hidden="true">${store.emoji}</div><div><div class="small muted">Sold by</div><div class="seller-name">${escapeHtml(store.name)}</div><div class="seller-sub">Run by <button type="button" class="inline-link" data-action="open-seller" data-id="${listing.sellerId}">${escapeHtml(listing.seller)}</button>${listing.verified ? ` <span class="verified-check" title="Student verified">${icon("verified")}</span>` : ""} · ${store.rating} ★ store rating</div></div></div><button class="text-button" data-action="open-store" data-id="${store.id}">Visit store ${icon("arrow")}</button></div>`
    : `<div class="seller-card"><div class="seller-card-main"><div class="seller-avatar">${escapeHtml(listing.initials)}</div><div><div class="seller-name">${escapeHtml(listing.seller)} ${listing.verified ? `<span class="verified-check">${icon("verified")} Student verified</span>` : ""}</div><div class="seller-sub">${escapeHtml(listing.campus)} · ${listing.rating} ★ from ${listing.reviews} reviews</div></div></div><button class="text-button" data-action="open-seller" data-id="${listing.sellerId}">View profile ${icon("arrow")}</button></div>`;
  return `<div class="page-top-row"><button class="back-button" data-action="back-from-detail">${icon("chevron-left")} Back to ${returnStore ? escapeHtml(returnStore.name) : service ? "Book" : "Shop"}</button><div class="button-row"><button class="ghost-button" data-action="share-listing">${icon("share")} Share</button><button class="ghost-button" data-action="toggle-save" data-id="${listing.id}">${icon("heart")} ${saved ? "In a list" : "Save"}</button></div></div>
    <div class="detail-layout"><div class="detail-gallery">${listingVisual(listing, true)}<div class="small muted" style="margin-top: 10px">Demo imagery — the real product would use seller-approved portfolio or product photos.</div></div>
      <div class="detail-copy"><div class="eyebrow">${escapeHtml(listing.category)} · ${service ? "Service" : escapeHtml(merchandiseTypeLabel(listing) || "Product")}</div><h1>${escapeHtml(listing.title)}</h1><p class="lede">${escapeHtml(listing.description)}</p>
        <div class="detail-actions"><button class="primary-button" data-action="primary-listing-action" data-id="${listing.id}">${service ? "Check availability" : "Buy now"} ${icon("arrow")}</button><button class="icon-button" data-action="message-seller" data-seller="${listing.sellerId}" aria-label="Message seller">${icon("chat")}</button></div>
        ${sellerCard}
        ${service ? `<div class="detail-block"><h3>When can it happen?</h3><p class="muted small">Pick a slot that works for you. The seller confirms the appointment after checkout.</p><div class="date-options">${["Today", "Tomorrow", "Sat", "Sun"].map((date, index) => `<button class="option-button date-button ${state.selectedDate === date ? "active" : ""}" data-action="select-date" data-date="${date}"><strong>${index === 0 ? "12" : index === 1 ? "13" : index === 2 ? "14" : "15"}</strong><span>${date}</span></button>`).join("")}</div><div class="time-options">${listing.slots.map((slot) => `<button class="option-button ${state.selectedSlot === slot ? "active" : ""}" data-action="select-slot" data-slot="${slot}">${escapeHtml(slot)}</button>`).join("")}</div></div>` : `<div class="detail-block"><h3>Pickup details</h3><div class="info-row"><span class="trust-icon">${icon("check")}</span><div><strong>${escapeHtml(listing.availability)}</strong><span>${escapeHtml(listing.meeting)}</span></div></div><div class="info-row"><span class="trust-icon">${icon("verified")}</span><div><strong>Keep the handoff simple</strong><span>Meet in a public or approved campus location and keep messages in the app.</span></div></div><div class="quantity-control"><button data-action="decrease-quantity" aria-label="Decrease quantity">${icon("minus")}</button><output>${state.quantity}</output><button data-action="increase-quantity" aria-label="Increase quantity">${icon("plus")}</button></div><span class="small muted" style="margin-left: 10px">${listing.quantityAvailable} available</span></div>`}
        <div class="detail-block"><h3>Trust details</h3><div class="info-row"><span class="trust-icon">${icon("verified")}</span><div><strong>${listing.verified ? "Student verified" : "School email verified"}</strong><span>This badge reflects the defined student-status check — not quality or university endorsement.</span></div></div><div class="info-row"><span class="trust-icon">${icon("star")}</span><div><strong>${listing.rating} from ${listing.reviews} completed transactions</strong><span>Reviews are tied to completed bookings or handoffs.</span></div></div><div class="trust-note">${service ? "Cancellation terms are shown before payment. If something changes, use the order page or support." : "Price, quantity and pickup terms are shown before payment. Never send payment details in chat."}</div></div>
      </div>
    </div>
    ${moreFromStore.length ? listingScrollSection(`More from ${escapeHtml(store.name)}`, moreFromStore, { action: "open-store", id: store.id, label: "Visit store" }) : ""}`;
}

function sellerView(seller) {
  const listingSet = allListings().filter((listing) => listing.sellerId === seller.id);
  const sellerStores = storesForSeller(seller.id);
  const firstName = seller.name.split(" ")[0];
  return `<div class="page-top-row"><button class="ghost-button" data-action="share-seller">${icon("share")} Share profile</button></div>
    <section class="seller-hero"><div class="seller-hero-main"><div class="seller-avatar">${escapeHtml(seller.initials)}</div><div>${studentVerifiedPill()}<h1>${escapeHtml(seller.name)}</h1><p class="muted" style="margin-bottom:0">${escapeHtml(seller.campus)} · ${escapeHtml(seller.handle)}</p><div class="seller-stats"><span><strong>${seller.rating}</strong> ★ rating</span><span><strong>${seller.reviews}</strong> reviews</span><span><strong>${seller.completed}</strong> completed</span><span>Replies in <strong>${escapeHtml(seller.response)}</strong></span></div></div></div></section>
    <section class="section" style="margin-top: 28px"><p class="lede">${escapeHtml(seller.bio)}</p></section>
    ${sellerStores.length ? `<section class="section seller-stores"><div class="section-header section-header-shelf"><h2>${sellerStores.length === 1 ? "Store" : "Stores"} by ${escapeHtml(firstName)}</h2></div><div class="store-grid">${sellerStores.map(storeCard).join("")}</div></section>` : ""}
    <div class="seller-tabs"><button class="seller-tab active">All listings (${listingSet.length})</button><button class="seller-tab" data-action="seller-reviews">Reviews (${seller.reviews})</button></div>
    ${listingSet.length ? `<div class="listing-grid">${listingSet.map(listingCard).join("")}</div>` : `<div class="empty-state"><div class="empty-shape">✦</div><h3>Listings are on the way.</h3><p class="muted">This seller is getting their storefront ready.</p></div>`}`;
}

function storeKindChips(store) {
  const kinds = storeKinds(store);
  return `${kinds.has("service") ? `<span class="store-kind-chip">${icon("calendar", 13)} Book</span>` : ""}${kinds.has("product") ? `<span class="store-kind-chip">${icon("bag", 13)} Shop</span>` : ""}`;
}

function storePreviewEmojis(store, count = 3) {
  return storeListings(store).slice(0, count).map((listing) => `<span>${listing.emoji}</span>`).join("");
}

function storeCard(store) {
  const seller = getSeller(store.sellerId);
  const count = storeListings(store).length;
  return `<article class="store-card">
    <button type="button" class="store-card-button" data-action="open-store" data-id="${store.id}">
      <span class="store-card-banner ${store.accent}">
        ${isFollowing(store.id) ? `<span class="visual-tag store-following-tag">${icon("check", 12)} Following</span>` : ""}
      </span>
      <span class="store-card-logo" aria-hidden="true">${escapeHtml(seller.initials)}</span>
      <span class="store-card-body">
        <span class="store-card-name">${escapeHtml(store.name)}${seller.verified ? `<span class="verified-check" title="Student verified">${icon("verified")}</span>` : ""}</span>
        <span class="store-card-owner">by ${escapeHtml(seller.name)}</span>
        <span class="store-card-tagline">${escapeHtml(store.tagline)}</span>
        <span class="store-card-meta"><span class="rating">${icon("star", 14)} ${store.rating} <span class="muted">(${store.reviews})</span></span><span class="muted">${count} ${count === 1 ? "listing" : "listings"}</span></span>
        <span class="store-kind-chips">${storeKindChips(store)}</span>
      </span>
    </button>
  </article>`;
}

function storeShopTab(store, listings) {
  const kinds = storeKinds(store);
  const activeCollection = store.collections.find((collection) => collection.name === state.storeCollection);
  const search = state.storeQuery.trim().toLowerCase();
  const filtered = listings.filter((listing) => {
    const inCollection = !activeCollection || activeCollection.listingIds.includes(listing.id);
    const matchesKind = state.storeKind === "all" || listing.kind === state.storeKind;
    const matchesQuery = !search || [listing.title, listing.category, listing.description].join(" ").toLowerCase().includes(search);
    return inCollection && matchesKind && matchesQuery;
  });
  const collectionChips = [{ name: "All", count: listings.length }, ...store.collections.map((collection) => ({ name: collection.name, count: listings.filter((listing) => collection.listingIds.includes(listing.id)).length }))]
    .map((collection) => `<button type="button" class="category-chip ${state.storeCollection === collection.name || (collection.name === "All" && !activeCollection) ? "active" : ""}" data-action="set-store-collection" data-collection="${escapeHtml(collection.name)}">${escapeHtml(collection.name)}<span class="store-collection-count">${collection.count}</span></button>`).join("");
  const hasFilters = Boolean(activeCollection || search || state.storeKind !== "all");
  return `<div class="store-toolbar">
      ${store.collections.length ? `<div class="store-collections" aria-label="Store collections">${collectionChips}</div>` : ""}
      <div class="store-toolbar-row">
        <form class="global-search store-search" data-form="store-search">${icon("search")}<input id="store-search-input" name="query" type="search" value="${escapeHtml(state.storeQuery)}" placeholder="Search ${escapeHtml(store.name)}" aria-label="Search this store" autocomplete="off" /></form>
        ${kinds.size > 1 ? `<div class="segmented"><button class="segment ${state.storeKind === "all" ? "active" : ""}" data-action="set-store-kind" data-kind="all">All</button><button class="segment ${state.storeKind === "service" ? "active" : ""}" data-action="set-store-kind" data-kind="service">Book</button><button class="segment ${state.storeKind === "product" ? "active" : ""}" data-action="set-store-kind" data-kind="product">Shop</button></div>` : ""}
      </div>
    </div>
    <div class="section-header" style="margin-top: 12px"><span class="result-count">${filtered.length} ${filtered.length === 1 ? "listing" : "listings"}${activeCollection ? ` in ${escapeHtml(activeCollection.name)}` : ""}</span>${hasFilters ? `<button class="text-button" data-action="clear-store-filters">Clear filters</button>` : ""}</div>
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
      <div class="seller-card"><div class="seller-card-main"><div class="seller-avatar">${escapeHtml(seller.initials)}</div><div><div class="small muted">Run by</div><div class="seller-name">${escapeHtml(seller.name)} ${seller.verified ? `<span class="verified-check">${icon("verified")}</span>` : ""}</div><div class="seller-sub">${escapeHtml(seller.campus)}</div></div></div><button class="text-button" data-action="open-seller" data-id="${seller.id}">Profile ${icon("arrow")}</button></div>
      ${otherStores.length ? `<div class="store-about-more"><h3>More stores by ${escapeHtml(seller.name.split(" ")[0])}</h3><div class="store-grid store-grid-compact">${otherStores.map(storeCard).join("")}</div></div>` : ""}
    </aside>
  </div>`;
}

function storeView(store) {
  if (!store) return storesView();
  const seller = getSeller(store.sellerId);
  const listings = storeListings(store);
  const following = isFollowing(store.id);
  const followers = store.followers + (following ? 1 : 0);
  const tabs = [
    { id: "shop", label: `Shop (${listings.length})` },
    { id: "reviews", label: `Reviews (${store.reviews})` },
    { id: "about", label: "About" }
  ];
  const tabContent = state.storeTab === "reviews" ? storeReviewsTab(store) : state.storeTab === "about" ? storeAboutTab(store, seller) : storeShopTab(store, listings);
  return `<div class="page-top-row"><button class="back-button" data-action="back-from-store">${icon("chevron-left")} Back to Stores</button><button class="ghost-button" data-action="share-store">${icon("share")} Share store</button></div>
    <section class="store-hero">
      <div class="store-hero-banner ${store.accent}"><span class="store-hero-previews" aria-hidden="true">${storePreviewEmojis(store, 4)}</span></div>
      <div class="store-hero-body">
        <div class="store-hero-logo ${store.accent}" aria-hidden="true">${store.emoji}</div>
        <div class="store-hero-info">
          <div class="store-hero-kicker">${studentVerifiedPill()}<span>${escapeHtml(store.handle)}</span></div>
          <h1>${escapeHtml(store.name)}</h1>
          <p class="store-hero-tagline">${escapeHtml(store.tagline)}</p>
          <button type="button" class="store-owner-link" data-action="open-seller" data-id="${seller.id}"><span class="mini-avatar">${escapeHtml(seller.initials)}</span><span>Run by <strong>${escapeHtml(seller.name)}</strong></span>${seller.verified ? `<span class="verified-check" title="Student verified">${icon("verified")}</span>` : ""}</button>
          <div class="seller-stats"><span><strong>${store.rating}</strong> ★ rating</span><span><strong>${store.reviews}</strong> reviews</span><span><strong>${store.sales}</strong> sales</span><span><strong>${followers}</strong> followers</span><span>Replies in <strong>${escapeHtml(seller.response)}</strong></span></div>
        </div>
        <div class="store-hero-actions">
          <button type="button" class="${following ? "ghost-button" : "primary-button"} follow-button ${following ? "following" : ""}" data-action="toggle-follow-store" data-id="${store.id}" aria-pressed="${following}">${following ? `${icon("check")} Following` : `${icon("plus")} Follow`}</button>
          <button type="button" class="icon-button" data-action="message-store" data-id="${store.id}" aria-label="Message ${escapeHtml(store.name)}">${icon("chat")}</button>
        </div>
      </div>
    </section>
    ${store.announcement ? `<div class="store-announcement"><span class="trust-icon">${icon("bell")}</span><span>${escapeHtml(store.announcement)}</span></div>` : ""}
    <div class="seller-tabs store-tabs" role="tablist">${tabs.map((tab) => `<button type="button" role="tab" class="seller-tab ${state.storeTab === tab.id ? "active" : ""}" aria-selected="${state.storeTab === tab.id}" data-action="set-store-tab" data-tab="${tab.id}">${tab.label}</button>`).join("")}</div>
    ${tabContent}`;
}

function storesView() {
  const storeCategoryNames = new Set(stores.flatMap(storeCategories));
  const filters = [
    { id: "All", label: "All stores", icon: "grid", dot: "cobalt" },
    { id: "Following", label: `Following (${state.followedStoreIds.length})`, icon: "heart", dot: "coral" },
    { id: "service", label: "Book", icon: "calendar", dot: "sky" },
    { id: "product", label: "Shop", icon: "bag", dot: "butter" },
    ...categories.filter((category) => storeCategoryNames.has(category.name)).map((category) => ({ id: category.name, label: category.name, icon: category.icon, dot: category.dot }))
  ];
  const activeFilter = state.storesFilter;
  const filtered = stores.filter((store) => {
    const matchesFilter = activeFilter === "All"
      || (activeFilter === "Following" ? isFollowing(store.id)
        : activeFilter === "service" || activeFilter === "product" ? storeKinds(store).has(activeFilter)
          : storeCategories(store).includes(activeFilter));
    return matchesFilter && storeMatchesQuery(store, state.storesQuery);
  }).sort((a, b) => b.followers - a.followers);
  const emptyFollowing = activeFilter === "Following" && !state.followedStoreIds.length;
  return `<div class="browse-header"><div><div class="eyebrow">Stores</div><h1>Shop by student store.</h1><p class="lede">Every store is run by a student-verified seller. Follow the ones you love so they are easy to find again.</p></div></div>
    <div class="browse-filters">
      <form class="global-search browse-page-search" data-form="stores-search">${icon("search")}<input id="stores-search-input" name="query" type="search" value="${escapeHtml(state.storesQuery)}" placeholder="Search stores, sellers or what they sell" aria-label="Search stores" autocomplete="off" /></form>
      <div class="filter-bar">${filters.map((filter) => `<button type="button" class="category-chip ${activeFilter === filter.id ? "active" : ""}" data-action="set-stores-filter" data-filter="${escapeHtml(filter.id)}"><span class="category-chip-icon ${filter.dot}" aria-hidden="true">${icon(filter.icon, 22)}</span>${escapeHtml(filter.label)}</button>`).join("")}</div>
    </div>
    <div class="section-header" style="margin-top: 12px"><span class="result-count">${filtered.length} ${filtered.length === 1 ? "store" : "stores"} · SDSU</span><span class="small muted">Sorted by followers</span></div>
    ${filtered.length ? `<div class="store-grid">${filtered.map(storeCard).join("")}</div>` : emptyFollowing
      ? `<div class="empty-state"><div class="empty-shape">♡</div><h3>You are not following any stores yet.</h3><p class="muted">Tap Follow on a store page and it will show up here.</p><button class="primary-button" data-action="set-stores-filter" data-filter="All">Browse all stores ${icon("arrow")}</button></div>`
      : `<div class="empty-state"><div class="empty-shape">⌁</div><h3>No stores match yet.</h3><p class="muted">Try another filter or search for something else.</p><button class="ghost-button" data-action="clear-stores-filters">Clear filters</button></div>`}`;
}

function checkoutView(listing) {
  if (!listing) return homeView();
  const service = listing.kind === "service";
  const total = listing.price * (service ? 1 : state.quantity);
  return `<div class="page-top-row"><button class="back-button" data-action="back-from-checkout">${icon("chevron-left")} Back to listing</button><span class="small muted">Demo checkout · no payment is processed</span></div>
    <div class="checkout-layout"><section class="checkout-panel"><div class="eyebrow">${service ? "Book" : "Shop"}</div><h1>${service ? "Review your booking." : "Review your order."}</h1><p class="lede">${service ? "Make sure the time, price and cancellation terms look right before you confirm." : "Make sure the seller, quantity and pickup details look right before you confirm."}</p>
      <div class="step-list"><div class="step"><span class="step-number">1</span><div><strong>${escapeHtml(listing.title)}</strong><p>${escapeHtml(listing.seller)} · ${money(listing.price)} ${service ? `/ ${escapeHtml(listing.unit)}` : "each"}</p></div></div>${service ? `<div class="step"><span class="step-number">2</span><div><strong>${escapeHtml(state.selectedSlot || listing.slots[0])}</strong><p>${escapeHtml(listing.meeting)} · ${escapeHtml(listing.unit)}</p></div></div><div class="step"><span class="step-number">3</span><div><strong>Cancellation terms</strong><p>Free cancellation up to 24 hours before the appointment. Support is available from your order page.</p></div></div>` : `<div class="step"><span class="step-number">2</span><div><strong>${state.quantity} ${state.quantity === 1 ? "item" : "items"}</strong><p>${escapeHtml(listing.availability)} · ${escapeHtml(listing.meeting)}</p></div></div><div class="step"><span class="step-number">3</span><div><strong>Local handoff</strong><p>We will show the pickup details after the seller confirms the order.</p></div></div>`}</div>
      <div class="button-row stretch"><button class="primary-button" data-action="confirm-order" data-id="${listing.id}">Confirm & pay ${money(total)} ${icon("arrow")}</button><button class="ghost-button" data-action="open-help">Questions about this order?</button></div>
    </section><aside class="summary-card"><div class="summary-visual"><div class="summary-thumb ${listing.accent}">${listing.emoji}</div><div><strong>${escapeHtml(listing.title)}</strong><div class="small muted">${escapeHtml(listing.seller)}</div></div></div><div class="summary-line"><span>${service ? "Service" : `Item × ${state.quantity}`}</span><strong>${money(total)}</strong></div><div class="summary-line"><span>Platform fee</span><strong>$0.00</strong></div><div class="summary-line total"><span>Total</span><strong>${money(total)}</strong></div><p class="checkout-disclaimer">This is a prototype only. No real account, order or payment is created.</p></aside></div>`;
}

function orderView(order) {
  const listing = getListing(order.listingId);
  return `<div class="page-top-row"><button class="back-button" data-view="you">${icon("chevron-left")} Back to You</button><button class="ghost-button" data-action="message-seller" data-seller="${listing?.sellerId || "maya-chen"}">${icon("chat")} Message seller</button></div><div class="order-success"><div class="success-mark">${icon("check")}</div><div class="eyebrow">${order.kind === "service" ? "Booking confirmed" : "Order placed"}</div><h1>${order.kind === "service" ? "You are on the calendar." : "That one is yours."}</h1><p class="lede">This demo order is saved in your prototype activity. In the real app, the seller and buyer would get an in-app notification.</p><div class="order-detail-card"><div class="order-detail-row"><span>${order.kind === "service" ? "Service" : "Product"}</span><strong>${escapeHtml(listing?.title || "Campus Connect listing")}</strong></div><div class="order-detail-row"><span>${order.kind === "service" ? "When" : "Status"}</span><strong>${escapeHtml(order.kind === "service" ? order.date : "Awaiting seller confirmation")}</strong></div><div class="order-detail-row"><span>Order reference</span><strong>CC-DEMO-${order.id.slice(-4).toUpperCase()}</strong></div></div><div class="button-row"><button class="primary-button" data-view="you">View activity</button><button class="ghost-button" data-view="home">Keep exploring</button></div></div>`;
}

function inboxView() {
  const active = conversations.find((conversation) => conversation.id === state.selectedConversationId) || conversations[0];
  const messages = state.messages[active.id] || [];
  return `<div class="page-top-row"><div><div class="eyebrow">Keep it on-platform</div><h1 style="margin-bottom: 6px">Inbox</h1><p class="muted" style="margin:0">Messages stay connected to the listing or order they belong to.</p></div><button class="ghost-button" data-action="open-help">${icon("chat")} Get help</button></div><div class="inbox-layout"><aside class="conversation-list"><div class="conversation-header"><h2>Messages</h2></div>${conversations.map((conversation) => `<button class="conversation-row ${conversation.id === active.id ? "active" : ""}" data-action="select-conversation" data-id="${conversation.id}"><span class="mini-avatar">${conversation.initials}</span><span class="conversation-content"><span class="conversation-top"><span class="conversation-name">${conversation.name}</span><span class="conversation-time">${conversation.time}</span></span><span class="conversation-preview">${conversation.preview}</span></span>${conversation.unread ? `<span class="unread-dot" aria-label="Unread"></span>` : ""}</button>`).join("")}</aside><section class="chat-panel"><div class="chat-header"><div class="chat-person"><span class="mini-avatar" style="background:var(--${active.accent})">${active.initials}</span><div><strong>${active.name}</strong><span>${active.context}</span></div></div><div class="button-row"><button class="icon-button" data-action="open-report" aria-label="Report conversation">${icon("shield")}</button><button class="icon-button" data-action="open-help" aria-label="Get help">${icon("help")}</button></div></div><div class="chat-messages"><div class="chat-date">Today</div>${messages.map((message) => `<div class="message ${message.who}">${escapeHtml(message.text)}<div class="message-meta">${message.time}</div></div>`).join("")}</div><form class="chat-composer" data-form="send-message"><textarea name="message" placeholder="Write a message…" aria-label="Write a message" rows="1"></textarea><button class="primary-button" type="submit" aria-label="Send message">${icon("arrow")}</button></form></section></div>`;
}

function openSaveToListModal(listingId) {
  const listing = getListing(listingId);
  if (!listing) return;
  const rows = state.lists.map((list) => {
    const inList = list.listingIds.includes(listingId);
    return `<button type="button" class="activity-row" data-action="toggle-listing-in-list" data-list-id="${list.id}" data-id="${listingId}"><span class="activity-main"><span class="activity-thumb lilac">📋</span><span><span class="activity-title">${escapeHtml(list.name)}</span><span class="activity-sub">${list.listingIds.length} ${list.listingIds.length === 1 ? "item" : "items"}</span></span></span><span class="list-save-state ${inList ? "in-list" : ""}">${inList ? "Saved" : "Add"}</span></button>`;
  }).join("");
  renderModal(`<div class="eyebrow">Save for later</div><h2>Add to a list</h2><p class="muted">${escapeHtml(listing.title)}</p><div class="notification-list">${rows}</div><div class="modal-actions"><button class="ghost-button" data-action="open-create-list">New list</button><button class="primary-button" data-action="close-modal">Done</button></div>`);
}

function openCreateListModal() {
  renderModal(`<div class="eyebrow">My lists</div><h2>Create a new list</h2><p class="muted">Keep services and products organized for move-in, graduation or anything in between.</p><form data-form="create-list"><div class="field"><label for="list-name">List name</label><input id="list-name" name="name" required placeholder="e.g. Graduation plans" maxlength="48" /></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Create list ${icon("arrow")}</button></div></form>`);
}

function openAddToListModal() {
  const list = getSelectedList();
  if (!list) return;
  const available = allListings().filter((listing) => !list.listingIds.includes(listing.id));
  const rows = available.length
    ? available.map((listing) => `<button type="button" class="activity-row" data-action="add-listing-to-list" data-list-id="${list.id}" data-id="${listing.id}"><span class="activity-main"><span class="activity-thumb ${listing.accent}">${listing.emoji}</span><span><span class="activity-title">${escapeHtml(listing.title)}</span><span class="activity-sub">${escapeHtml(listing.category)} · ${escapeHtml(listing.seller)} · ${money(listing.price)}</span></span></span><span class="list-save-state">Add</span></button>`).join("")
    : `<p class="muted" style="margin: 8px 0 0">Everything on campus is already in this list.</p>`;
  renderModal(`<div class="eyebrow">${escapeHtml(list.name)}</div><h2>Add to this list</h2><p class="muted">Pick a service or product from the marketplace.</p><div class="notification-list list-picker">${rows}</div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Done</button></div>`);
}

function myListsView() {
  const active = getSelectedList();
  if (!active && !state.lists.length) {
    return `<div class="page-top-row"><div><div class="eyebrow">Saved for later</div><h1 style="margin-bottom: 6px">My lists</h1><p class="muted" style="margin:0">Create a list to keep campus finds in one place.</p></div></div><div class="empty-state"><div class="empty-shape">♡</div><h3>Start your first list.</h3><p class="muted">Save services and products while you browse, or build a list from scratch.</p><button class="primary-button" data-action="open-create-list">Create a list ${icon("arrow")}</button></div>`;
  }
  const list = active || state.lists[0];
  const items = list.listingIds.map(getListing).filter(Boolean);
  const itemLabel = items.length === 1 ? "1 item" : `${items.length} items`;
  const sidebar = state.lists.map((entry) => `<button type="button" class="list-row ${entry.id === list.id ? "active" : ""}" data-action="select-list" data-id="${entry.id}"><span class="list-row-main"><span class="list-row-name">${escapeHtml(entry.name)}</span><span class="list-row-count muted">${entry.listingIds.length} ${entry.listingIds.length === 1 ? "item" : "items"}</span></span></button>`).join("");
  const grid = items.length
    ? `<div class="listing-grid">${items.map((listing) => listPageListingCard(listing, list.id)).join("")}</div>`
    : `<div class="empty-state list-empty"><div class="empty-shape">♡</div><h3>This list is empty.</h3><p class="muted">Tap the heart on any listing while you browse, or add campus picks here.</p><button class="primary-button" data-action="open-add-to-list">Add items ${icon("arrow")}</button></div>`;
  const canDelete = state.lists.length > 1;
  return `<div class="page-top-row"><div><div class="eyebrow">Saved for later</div><h1 style="margin-bottom: 6px">My lists</h1><p class="muted" style="margin:0">Private shortlists for services and products on campus.</p></div><button class="ghost-button" data-view="you">${icon("chevron-left")} Back to You</button></div>
  <div class="lists-layout">
    <aside class="lists-sidebar">
      <div class="lists-sidebar-header"><h2>Your lists</h2><button type="button" class="text-button" data-action="open-create-list">${icon("plus")} New</button></div>
      <div class="lists-sidebar-body">${sidebar}</div>
    </aside>
    <section class="lists-panel">
      <div class="lists-panel-header">
        <div><h2>${escapeHtml(list.name)}</h2><p class="muted small" style="margin:0">${itemLabel}</p></div>
        <div class="button-row">
          <button type="button" class="primary-button" data-action="open-add-to-list">Add items ${icon("plus")}</button>
          ${canDelete ? `<button type="button" class="ghost-button" data-action="delete-list" data-id="${list.id}">Delete list</button>` : ""}
        </div>
      </div>
      ${grid}
    </section>
  </div>`;
}

const SETTINGS_SECTIONS = [
  { id: "account", label: "Account", hint: "Name and campus", icon: "user" },
  { id: "notifications", label: "Notifications", hint: "Messages, orders, deals", icon: "bell" },
  { id: "privacy", label: "Privacy & safety", hint: "Who can see you", icon: "shield" }
];

function settingsSwitch(key, label) {
  const on = Boolean(state.settings[key]);
  return `<button type="button" class="settings-switch ${on ? "on" : ""}" role="switch" aria-checked="${on ? "true" : "false"}" aria-label="${escapeHtml(label)}" data-action="toggle-setting" data-key="${key}"><span class="settings-switch-knob"></span></button>`;
}

function settingsRow(key, title, body) {
  return `<div class="settings-row"><div class="settings-row-copy"><strong>${title}</strong><p class="muted small">${body}</p></div>${settingsSwitch(key, title)}</div>`;
}

function settingsAccountPanel() {
  const name = state.settings.displayName;
  return `<form class="settings-form" data-form="save-account">
    <div class="settings-identity">
      <div class="seller-avatar">KC</div>
      <div>
        <h2>${escapeHtml(name)}</h2>
        ${state.settings.showCampus ? `<p class="muted small">SDSU</p>` : ""}
        ${studentVerifiedPill()}
      </div>
    </div>
    <div class="form-grid">
      <div class="field full"><label for="settings-name">Display name</label><input id="settings-name" name="displayName" required maxlength="48" value="${escapeHtml(name)}" /></div>
      <div class="field"><label for="settings-email">Campus email</label><input id="settings-email" value="kcedolin@sdsu.edu" readonly /></div>
      <div class="field"><label for="settings-school">School</label><input id="settings-school" value="San Diego State University" readonly /></div>
    </div>
    <p class="field-note">Campus email and school come from student verification. Changes stay in this demo session.</p>
    <div class="button-row" style="margin-top: 16px"><button class="primary-button" type="submit">Save account ${icon("check")}</button></div>
  </form>`;
}

function settingsNotificationsPanel() {
  return `<div class="settings-group">
    <h2>What should reach you</h2>
    <p class="muted small">These stay in the app for this prototype. Nothing is emailed.</p>
    ${settingsRow("notifyMessages", "Messages", "When a seller replies about a listing or order.")}
    ${settingsRow("notifyOrders", "Orders and bookings", "Pickup updates, confirmations and schedule changes.")}
    ${settingsRow("notifyDeals", "Aztec Deals", "New student discounts near campus.")}
  </div>`;
}

function settingsPrivacyPanel() {
  return `<div class="settings-group">
    <h2>Who can see you</h2>
    <p class="muted small">Other students only see what you choose to share.</p>
    ${settingsRow("profileVisible", "Show my profile", "Let sellers and buyers open your student profile.")}
    ${settingsRow("showCampus", "Show my campus", "Display SDSU next to your name.")}
    <div class="settings-safety">
      <h3>Safety</h3>
      <div class="button-row">
        <button type="button" class="ghost-button" data-action="open-help">${icon("help")} Get help</button>
        <button type="button" class="ghost-button" data-action="open-report">${icon("shield")} Report a concern</button>
      </div>
    </div>
    <div class="settings-signout">
      <div><strong>Sign out</strong><p class="muted small">This demo stays signed in as your student account.</p></div>
      <button type="button" class="danger-button" data-action="sign-out">${icon("logout")} Sign out</button>
    </div>
  </div>`;
}

function settingsView() {
  const section = SETTINGS_SECTIONS.find((item) => item.id === state.settingsSection) || SETTINGS_SECTIONS[0];
  const nav = SETTINGS_SECTIONS.map((item) => `<button type="button" class="settings-nav-item ${item.id === section.id ? "active" : ""}" data-action="set-settings-section" data-section="${item.id}"><span class="trust-icon">${icon(item.icon)}</span><span class="settings-nav-copy"><span class="settings-nav-label">${item.label}</span><span class="muted small">${item.hint}</span></span></button>`).join("");
  const panel = section.id === "notifications" ? settingsNotificationsPanel() : section.id === "privacy" ? settingsPrivacyPanel() : settingsAccountPanel();
  return `<div class="settings-page"><div class="page-top-row"><div><div class="eyebrow">Your account</div><h1 style="margin-bottom: 6px">Settings</h1><p class="muted" style="margin:0">How Campus Connect works for you on campus.</p></div><button class="ghost-button" data-view="you">${icon("chevron-left")} Back to You</button></div>
  <div class="settings-layout">
    <aside class="settings-nav" aria-label="Settings sections">${nav}</aside>
    <section class="settings-panel">${panel}</section>
  </div></div>`;
}

function youView() {
  const listCount = state.lists.length;
  const itemCount = savedListingCount();
  const savedLabel = listCount === 1 ? `1 list · ${itemCount} saved` : `${listCount} lists · ${itemCount} saved`;
  const campusLine = state.settings.showCampus ? `<p class="muted">SDSU</p>` : "";
  const orderRows = state.orders.map((order) => {
    const listing = getListing(order.listingId);
    return `<button class="activity-row" data-action="open-order" data-id="${order.id}"><span class="activity-main"><span class="activity-thumb ${listing?.accent || "lilac"}">${listing?.emoji || "✦"}</span><span><span class="activity-title">${escapeHtml(listing?.title || "Campus Connect order")}</span><span class="activity-sub">${escapeHtml(order.status)} · ${escapeHtml(order.date)}</span></span></span>${icon("chevron-right")}</button>`;
  }).join("");
  return `<div class="page-top-row"><div><div class="eyebrow">Your campus activity</div><h1 style="margin-bottom: 6px">You</h1><p class="muted" style="margin:0">Keep track of bookings, purchases and messages.</p></div><button class="ghost-button" data-view="settings">${icon("settings")} Settings</button></div>
  <section class="seller-hero profile-hero"><div class="seller-hero-main"><div class="seller-avatar">KC</div><div>${studentVerifiedPill()}<h2>${escapeHtml(state.settings.displayName)}</h2>${campusLine}<div class="seller-stats"><span><strong>${state.orders.length}</strong> orders</span><span><strong>${listCount}</strong> lists</span><span><strong>${state.followedStoreIds.length}</strong> following</span></div></div></div></section>
  <section class="profile-layout">
    <div class="profile-orders-panel">
      <div class="section-header profile-orders-header"><div><div class="eyebrow">Your activity</div><h2>Orders & bookings</h2></div></div>
      <div class="activity-list">${orderRows}</div>
    </div>
    <div class="quick-actions profile-help-grid">
      <button class="quick-action" data-view="lists"><span class="trust-icon">${icon("heart")}</span><strong>My lists</strong><span>${savedLabel}</span></button>
      <button class="quick-action" data-action="open-following"><span class="trust-icon">${icon("store")}</span><strong>Following</strong><span>${state.followedStoreIds.length} ${state.followedStoreIds.length === 1 ? "store" : "stores"}</span></button>
      <button class="quick-action" data-view="inbox"><span class="trust-icon">${icon("chat")}</span><strong>Inbox</strong><span>2 unread messages</span></button>
      <button class="quick-action" data-action="open-help"><span class="trust-icon">${icon("help")}</span><strong>Get help</strong><span>Support and safety</span></button>
    </div>
  </section>
  <section class="section sell-hero profile-sell-hero"><div class="eyebrow">For student sellers</div><h2>Turn what you know into what you earn.</h2><p>List a service, sell something you are done with or build a reputation on campus. The Seller Hub demo opens as Maya Chen, an established campus seller.</p><div class="button-row"><button class="primary-button" data-action="switch-mode">Open Seller Hub ${icon("arrow")}</button><button class="ghost-button sell-hero-ghost" data-view="sell">List something quickly</button></div></section>`;
}

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
  const sellerMode = state.mode === "seller";
  const storeField = sellerMode ? `<div class="field full"><label for="listing-store">Store</label><select id="listing-store" name="storeId">${storesForSeller(SELLER_ID).map((store) => `<option value="${store.id}">${escapeHtml(store.emoji)} ${escapeHtml(store.name)}</option>`).join("")}</select></div>` : "";
  const submitButtons = sellerMode
    ? `<button class="primary-button" type="submit" name="intent" value="publish">Publish listing ${icon("arrow")}</button><button class="ghost-button" type="submit" name="intent" value="draft">Save as draft</button><button class="ghost-button" type="button" data-view="seller-listings">Cancel</button>`
    : `<button class="primary-button" type="submit">Publish demo listing ${icon("arrow")}</button><button class="ghost-button" type="button" data-action="cancel-sell">Cancel</button>`;
  return `<form class="form-card" data-form="publish-listing"><div class="progress-steps"><span class="progress-step active"></span><span class="progress-step active"></span>${service ? "" : `<span class="progress-step active"></span>`}</div><div class="eyebrow">${stepLabel} · ${service ? "Service details" : merchandiseTypeLabel(state.sellMerchandiseType)}</div><h3>${service ? "Make the offer clear." : isNewProduct ? "Show buyers what makes it original." : "Give it a good second home."}</h3><p class="muted small">This is a prototype form — publishing adds a demo listing to your local session only.</p><div class="form-grid">${storeField}<div class="field full"><label for="listing-title">Title</label><input id="listing-title" name="title" required placeholder="${service ? "e.g. Beginner guitar lesson" : isNewProduct ? "e.g. Hand-painted campus tote" : "e.g. White desk chair"}" /></div><div class="field"><label for="listing-category">Category</label><select id="listing-category" name="category">${categoryOptions}</select></div><div class="field"><label for="listing-price">Price</label><input id="listing-price" name="price" type="number" min="1" required placeholder="${service ? "35" : "20"}" /></div>${service ? `<div class="field"><label for="listing-duration">Duration</label><select id="listing-duration" name="duration"><option>30 min</option><option>45 min</option><option>60 min</option><option>90 min</option></select></div>` : `<div class="field"><label for="listing-quantity">Quantity</label><input id="listing-quantity" name="quantity" type="number" min="1" value="1" /></div><div class="field"><label for="listing-condition">${isNewProduct ? "Availability" : "Condition"}</label><select id="listing-condition" name="condition">${conditionOptions}</select></div>`}<div class="field full"><label for="listing-description">Description</label><textarea id="listing-description" name="description" required placeholder="${isNewProduct ? "What did you make or source, and what should a buyer know?" : "What should another student know before they choose this?"}"></textarea><span class="field-note">${isNewProduct ? "Explain materials, what is included and whether it is ready now or made to order." : "Use real details, clear expectations and an honest condition and handoff plan."}</span></div></div><div class="button-row" style="margin-top: 18px">${submitButtons}</div></form>`;
}

function renderModal(content) {
  document.querySelector("#modal-root").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-label="Campus Connect dialog" onclick="event.stopPropagation()"><button class="modal-close" data-action="close-modal" aria-label="Close dialog">${icon("close")}</button>${content}</div></div>`;
}

let searchCaret = null;

function render() {
  const main = document.querySelector("#app-main");
  let markup = "";
  if (state.view === "home") markup = homeView();
  if (state.view === "book") { state.activeKind = "service"; markup = browseView("service"); }
  if (state.view === "shop") { state.activeKind = "product"; markup = browseView("product"); }
  if (state.view === "search") markup = browseView("all");
  if (state.view === "listing") markup = listingDetailView(getListing(state.selectedListingId));
  if (state.view === "seller") markup = sellerView(getSeller(state.selectedSellerId));
  if (state.view === "checkout") markup = checkoutView(getListing(state.selectedListingId));
  if (state.view === "order") markup = orderView(state.orders.find((order) => order.id === state.selectedOrderId));
  if (state.view === "inbox") markup = inboxView();
  if (state.view === "you") markup = youView();
  if (state.view === "settings") markup = settingsView();
  if (state.view === "sell") markup = sellView();
  if (state.view === "deals") markup = aztecDealsView();
  if (state.view === "lists") markup = myListsView();
  if (state.view === "stores") markup = storesView();
  if (state.view === "store") markup = storeView(getStore(state.selectedStoreId));
  if (state.view.startsWith("seller-")) markup = renderSellerView();
  else if (state.mode === "seller") markup = sellerPreviewBanner() + markup;
  main.innerHTML = markup;
  updateNavigation();
  if (searchCaret !== null) {
    const input = document.querySelector(`#${searchCaret.id}`);
    if (input) {
      input.focus();
      input.setSelectionRange(searchCaret.position, searchCaret.position);
    }
    searchCaret = null;
  }
}

function activeConversations() {
  return state.mode === "seller" ? sellerConversations : conversations;
}

function activeNotifications() {
  return state.mode === "seller" ? sellerNotifications : notifications;
}

function unreadInboxCount() {
  return activeConversations().filter((conversation) => conversation.unread).length;
}

function unreadNotificationCount() {
  return activeNotifications().filter((notification) => notification.unread).length;
}

function getNotification(id) {
  return activeNotifications().find((notification) => notification.id === id);
}

function closeNotificationsPopover() {
  state.notificationsOpen = false;
  updateHeaderChrome();
}

function notificationPopoverMarkup() {
  const unread = unreadNotificationCount();
  const rows = activeNotifications().map((notification) => `<button type="button" class="notification-popover-row ${notification.unread ? "unread" : ""}" data-action="open-notification" data-id="${notification.id}"><span class="activity-thumb ${notification.accent}">${notification.emoji}</span><span class="notification-popover-copy"><span class="notification-popover-top"><strong>${escapeHtml(notification.title)}</strong><span class="muted small">${escapeHtml(notification.time)}</span></span><span class="notification-popover-body muted">${escapeHtml(notification.body)}</span></span>${notification.unread ? `<span class="unread-dot" aria-label="Unread"></span>` : ""}</button>`).join("");
  return `<div class="notification-popover-header"><div><strong>Notifications</strong>${unread ? `<span class="muted small">${unread} unread</span>` : ""}</div><button type="button" class="text-button" data-action="mark-all-notifications-read">Mark all read</button></div><div class="notification-popover-list">${rows}</div><div class="notification-popover-footer">${state.mode === "seller" ? `<button type="button" class="text-button" data-view="seller-notifications">View all ${icon("arrow")}</button>` : ""}<button type="button" class="ghost-button" data-action="close-notifications">Close</button></div>`;
}

function updateHeaderChrome() {
  const unreadMessages = unreadInboxCount();
  document.querySelectorAll(".messages-nav-button").forEach((button) => {
    const badge = button.querySelector(".inbox-badge");
    if (badge) {
      badge.textContent = unreadMessages > 9 ? "9+" : String(unreadMessages);
      badge.hidden = unreadMessages === 0;
    }
    button.classList.toggle("active", state.view === button.dataset.view);
    button.setAttribute("aria-label", unreadMessages ? `Messages, ${unreadMessages} unread` : "Messages");
  });
  const unreadNotes = unreadNotificationCount();
  document.querySelectorAll(".notifications-nav-button").forEach((button) => {
    const badge = button.querySelector(".notification-badge");
    if (badge) {
      badge.textContent = unreadNotes > 9 ? "9+" : String(unreadNotes);
      badge.hidden = unreadNotes === 0;
    }
    button.classList.toggle("active", state.notificationsOpen);
    button.setAttribute("aria-expanded", state.notificationsOpen ? "true" : "false");
    button.setAttribute("aria-label", unreadNotes ? `Notifications, ${unreadNotes} unread` : "Notifications");
  });
  if (state.mode === "seller") updateSellerChrome();
  const popover = document.querySelector("#notification-popover");
  if (!popover) return;
  if (state.notificationsOpen) {
    popover.innerHTML = notificationPopoverMarkup();
    popover.hidden = false;
    hydrateStaticIcons(popover);
  } else {
    popover.innerHTML = "";
    popover.hidden = true;
  }
}

function updateNavigation() {
  const sellerNavTarget = state.mode === "seller" ? sellerNavView(state.view) : null;
  document.querySelectorAll("[data-view]").forEach((button) => {
    const view = button.dataset.view;
    const active = view === state.view || view === sellerNavTarget || (state.view === "search" && view === "home") || (state.view === "store" && view === "stores") || (state.view === "settings" && view === "you" && button.classList.contains("profile-nav-button"));
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  updateHeaderChrome();
}

function openHelp() {
  renderModal(`<div class="eyebrow">Support</div><h2>Tell us what happened.</h2><p class="muted">This prototype does not send a real case, but the interaction shows how support should feel: calm, specific and connected to the order.</p><form data-form="support"><div class="field"><label for="support-topic">What do you need help with?</label><select id="support-topic"><option>Question about a booking</option><option>Question about a product pickup</option><option>Safety or trust concern</option><option>Payment or refund question</option></select></div><div class="field" style="margin-top: 13px"><label for="support-message">Tell us more</label><textarea id="support-message" required placeholder="Share the details we need to understand."></textarea></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Create demo case ${icon("arrow")}</button></div></form>`);
}

function openReport() {
  renderModal(`<div class="eyebrow">Safety and trust</div><h2>Report a concern.</h2><p class="muted">Report content, a message or a handoff that does not feel right. Your report would be linked to the relevant context for review.</p><form data-form="report"><div class="field"><label for="report-reason">Reason</label><select id="report-reason"><option>Unsafe meetup or behavior</option><option>Off-platform payment request</option><option>Harassment or discrimination</option><option>Listing is misleading</option></select></div><div class="field" style="margin-top: 13px"><label for="report-message">What should the team know?</label><textarea id="report-message" required placeholder="Describe what happened."></textarea></div><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancel</button><button class="danger-button" type="submit">Submit report</button></div></form>`);
}

function openVerified() {
  renderModal(`<div class="success-mark">${icon("verified")}</div><div class="eyebrow">Trust detail</div><h2>Student verified</h2><p class="muted">This demo badge represents a successful student-status check. It does not mean a seller is university-approved, guaranteed or automatically safe.</p><div class="trust-note">In the real app, the verification method, evidence collected and support path would be explained in plain language.</div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Got it</button></div>`);
}

function openSellerConversation(sellerId = "maya-chen") {
  const conversation = conversations.find((item) => item.name === getSeller(sellerId).name) || conversations[0];
  return setView("inbox", { selectedConversationId: conversation.id });
}

function syncModeChrome() {
  const seller = state.mode === "seller";
  document.body.dataset.mode = state.mode;
  const profileSeller = getSeller(SELLER_ID);
  document.querySelectorAll(".profile-nav-button").forEach((button) => {
    button.dataset.view = seller ? "seller-profile" : "you";
    button.textContent = seller ? profileSeller.initials : "KC";
    button.classList.toggle("seller-avatar-button", seller);
    button.setAttribute("aria-label", seller ? "Your seller profile" : "Your profile");
  });
  document.querySelectorAll(".messages-nav-button").forEach((button) => { button.dataset.view = seller ? "seller-inbox" : "inbox"; });
  document.querySelectorAll(".mode-switch").forEach((button) => {
    const label = seller ? "Switch to buying" : "Switch to selling";
    button.querySelector(".mode-switch-label").textContent = label;
    button.setAttribute("aria-label", label);
    button.classList.toggle("selling", seller);
  });
}

function setMode(mode) {
  state.mode = mode === "seller" ? "seller" : "buyer";
  state.notificationsOpen = false;
  document.querySelector("#modal-root").innerHTML = "";
  syncModeChrome();
  setView(state.mode === "seller" ? "seller-dashboard" : "home");
  showToast(state.mode === "seller" ? `Seller Hub · signed in as ${getSeller(SELLER_ID).name} (demo).` : "Back to buying as Katarina.");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, [data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const view = target.dataset.view;
  if (view) {
    document.querySelector("#modal-root").innerHTML = "";
    closeNotificationsPopover();
    state.query = "";
    state.category = "All";
    if (view === "search") state.activeKind = "all";
    if (view === "book") state.bookType = "all";
    if (view === "shop") state.shopType = "all";
    if (view === "sell" || view === "seller-new") { state.sellKind = null; state.sellMerchandiseType = null; }
    if (view === "stores") { state.storesFilter = "All"; state.storesQuery = ""; }
    setView(view);
    return;
  }
  if (!action) return;
  if (action === "switch-mode") return setMode(state.mode === "seller" ? "buyer" : "seller");
  if (state.mode === "seller" && handleSellerAction(action, target, event)) return;
  if (action === "go-home") return setView("home");
  if (action === "toggle-notifications") {
    state.notificationsOpen = !state.notificationsOpen;
    updateHeaderChrome();
    return;
  }
  if (action === "close-notifications") return closeNotificationsPopover();
  if (action === "mark-all-notifications-read") {
    activeNotifications().forEach((notification) => { notification.unread = false; });
    showToast("All notifications marked as read.");
    updateHeaderChrome();
    return;
  }
  if (action === "open-notification") {
    const notification = getNotification(target.dataset.id);
    if (!notification) return;
    notification.unread = false;
    closeNotificationsPopover();
    if (notification.action === "order" && notification.orderId) {
      state.selectedOrderId = notification.orderId;
      return setView("order");
    }
    if (notification.action === "inbox" && notification.conversationId) {
      return setView("inbox", { selectedConversationId: notification.conversationId });
    }
    if (notification.action === "store" && notification.storeId) {
      return setView("store", { selectedStoreId: notification.storeId, storeTab: "shop", storeCollection: "All", storeQuery: "", storeKind: "all" });
    }
    updateHeaderChrome();
    return;
  }
  if (action === "flip-deal") {
    const card = target.closest(".deal-flip-card");
    if (!card) return;
    const flipped = card.classList.toggle("is-flipped");
    card.querySelector(".deal-flip-trigger")?.setAttribute("aria-pressed", flipped ? "true" : "false");
    return;
  }
  if (action === "copy-deal-code") {
    const code = target.dataset.code || "";
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(() => showToast("Code copied to clipboard.")).catch(() => showToast(code, "success"));
    } else {
      showToast(code, "success");
    }
    return;
  }
  if (action === "toggle-save") {
    openSaveToListModal(target.dataset.id);
    return;
  }
  if (action === "select-list") {
    state.selectedListId = target.dataset.id;
    return render();
  }
  if (action === "open-create-list") return openCreateListModal();
  if (action === "open-add-to-list") return openAddToListModal();
  if (action === "toggle-listing-in-list") {
    const listId = target.dataset.listId;
    const listingId = target.dataset.id;
    const list = getList(listId);
    if (!list) return;
    if (list.listingIds.includes(listingId)) {
      removeListingFromList(listId, listingId);
      showToast(`Removed from ${list.name}.`);
    } else {
      addListingToList(listId, listingId);
      showToast(`Added to ${list.name}.`);
    }
    openSaveToListModal(listingId);
    return render();
  }
  if (action === "add-listing-to-list") {
    const listId = target.dataset.listId;
    const listingId = target.dataset.id;
    const list = getList(listId);
    const listing = getListing(listingId);
    if (!list || !listing) return;
    addListingToList(listId, listingId);
    showToast(`Added ${listing.title} to ${list.name}.`);
    openAddToListModal();
    return render();
  }
  if (action === "remove-from-list") {
    const list = getList(target.dataset.listId);
    const listing = getListing(target.dataset.id);
    removeListingFromList(target.dataset.listId, target.dataset.id);
    showToast(list && listing ? `Removed ${listing.title} from ${list.name}.` : "Removed from list.");
    return render();
  }
  if (action === "delete-list") {
    const listId = target.dataset.id;
    const list = getList(listId);
    if (!list || state.lists.length < 2) return;
    state.lists = state.lists.filter((entry) => entry.id !== listId);
    if (state.selectedListId === listId) state.selectedListId = state.lists[0]?.id;
    showToast(`${list.name} deleted.`);
    return render();
  }
  if (action === "open-listing") {
    document.querySelector("#modal-root").innerHTML = "";
    const detailReturn = state.view === "store" ? state.selectedStoreId : state.view === "listing" ? state.detailReturn : null;
    return setView("listing", { selectedListingId: target.dataset.id, selectedDate: "Today", detailReturn });
  }
  if (action === "open-seller") return setView("seller", { selectedSellerId: target.dataset.id });
  if (action === "open-store") {
    document.querySelector("#modal-root").innerHTML = "";
    return setView("store", { selectedStoreId: target.dataset.id, storeTab: "shop", storeCollection: "All", storeQuery: "", storeKind: "all" });
  }
  if (action === "back-from-store") return setView("stores");
  if (action === "set-store-tab") { state.storeTab = target.dataset.tab; return render(); }
  if (action === "set-store-collection") { state.storeCollection = target.dataset.collection; return render(); }
  if (action === "set-store-kind") { state.storeKind = target.dataset.kind; return render(); }
  if (action === "clear-store-filters") { state.storeCollection = "All"; state.storeQuery = ""; state.storeKind = "all"; return render(); }
  if (action === "set-stores-filter") { state.storesFilter = target.dataset.filter; return render(); }
  if (action === "clear-stores-filters") { state.storesFilter = "All"; state.storesQuery = ""; return render(); }
  if (action === "search-stores") return setView("stores", { storesFilter: "All", storesQuery: target.dataset.query || "" });
  if (action === "open-following") return setView("stores", { storesFilter: "Following", storesQuery: "" });
  if (action === "toggle-follow-store") {
    const store = getStore(target.dataset.id);
    if (!store) return;
    if (isFollowing(store.id)) {
      state.followedStoreIds = state.followedStoreIds.filter((id) => id !== store.id);
      showToast(`Unfollowed ${store.name}.`);
    } else {
      state.followedStoreIds.push(store.id);
      showToast(`Following ${store.name}. You will find it under Stores → Following.`);
    }
    return render();
  }
  if (action === "message-store") { const store = getStore(target.dataset.id); return openSellerConversation(store?.sellerId); }
  if (action === "share-store") { showToast("Store link copied — demo only."); return; }
  if (action === "primary-listing-action") { const listing = getListing(target.dataset.id); return setView("checkout", { selectedListingId: target.dataset.id, quantity: listing?.kind === "product" ? state.quantity : 1 }); }
  if (action === "select-date") { const listing = getListing(state.selectedListingId); state.selectedDate = target.dataset.date; state.selectedSlot = listing?.slots?.find((slot) => slot.startsWith(target.dataset.date)) || listing?.slots?.[0] || ""; return render(); }
  if (action === "select-slot") { state.selectedSlot = target.dataset.slot; return render(); }
  if (action === "increase-quantity") { const listing = getListing(state.selectedListingId); state.quantity = Math.min(listing?.quantityAvailable || 1, state.quantity + 1); return render(); }
  if (action === "decrease-quantity") { state.quantity = Math.max(1, state.quantity - 1); return render(); }
  if (action === "back-from-detail") {
    if (getStore(state.detailReturn)) return setView("store", { selectedStoreId: state.detailReturn, detailReturn: null });
    const listing = getListing(state.selectedListingId);
    return setView(listing?.kind === "product" ? "shop" : "book");
  }
  if (action === "back-from-checkout") return setView("listing", { selectedListingId: state.selectedListingId });
  if (action === "message-seller") return openSellerConversation(target.dataset.seller || getListing(state.selectedListingId)?.sellerId);
  if (action === "share-listing" || action === "share-seller") { showToast("Share link copied — demo only."); return; }
  if (action === "seller-reviews") { renderModal(`<div class="eyebrow">Completed transactions</div><h2>What students say</h2><div class="notification-list"><div class="notification-item"><span class="trust-icon">${icon("star")}</span><div><strong>“Maya made the session feel easy.”</strong><p>★★★★★ · Completed booking</p></div></div><div class="notification-item"><span class="trust-icon">${icon("star")}</span><div><strong>“The photos looked like me, not a stock photo.”</strong><p>★★★★★ · Completed booking</p></div></div><div class="notification-item"><span class="trust-icon">${icon("star")}</span><div><strong>“Clear communication and right on time.”</strong><p>★★★★☆ · Completed booking</p></div></div></div><div class="modal-actions"><button class="primary-button" data-action="close-modal">Done</button></div>`); return; }
  if (action === "confirm-order") {
    const listing = getListing(target.dataset.id);
    const order = { id: `order-${Date.now()}`, listingId: listing.id, status: listing.kind === "service" ? "Upcoming" : "Awaiting confirmation", date: listing.kind === "service" ? state.selectedSlot || listing.slots[0] : "Pickup details coming next", kind: listing.kind };
    state.orders.unshift(order);
    sellerReceiveBuyerOrder(order, listing);
    state.selectedOrderId = order.id;
    return setView("order");
  }
  if (action === "open-order") { state.selectedOrderId = target.dataset.id; return setView("order"); }
  if (action === "select-conversation") { state.selectedConversationId = target.dataset.id; return render(); }
  if (action === "set-shop-type") { state.shopType = target.dataset.shopType || "all"; return render(); }
  if (action === "set-book-type") { state.bookType = target.dataset.bookType || "all"; return render(); }
  if (action === "choose-category") { const category = target.dataset.category; const kind = target.dataset.kind || state.activeKind; if (state.view === "home") return setView(kind === "product" ? "shop" : "book", { category, activeKind: kind }); state.category = category; state.activeKind = kind; return render(); }
  if (action === "clear-filters") { state.query = ""; state.category = "All"; state.shopType = "all"; state.bookType = "all"; return render(); }
  if (action === "sort-results") { showToast("Recommended order is active in this demo."); return; }
  if (action === "open-filters") { renderModal(`<div class="eyebrow">Browse controls</div><h2>Filter what you need.</h2><div class="field"><label for="modal-category">Category</label><select id="modal-category"><option>All</option>${categories.map((category) => `<option>${category.name}</option>`).join("")}</select></div><div class="field" style="margin-top: 13px"><label for="modal-trust">Trust signal</label><select id="modal-trust"><option>Any seller</option><option>Student verified</option><option>4.8+ rating</option></select></div><div class="modal-actions"><button class="ghost-button" data-action="close-modal">Cancel</button><button class="primary-button" data-action="apply-modal-filter">Apply filters</button></div>`); return; }
  if (action === "apply-modal-filter") { const value = document.querySelector("#modal-category")?.value || "All"; state.category = value; document.querySelector("#modal-root").innerHTML = ""; render(); return; }
  if (action === "open-help") return openHelp();
  if (action === "open-report") return openReport();
  if (action === "open-verified") return openVerified();
  if (action === "set-settings-section") { state.settingsSection = target.dataset.section || "account"; return render(); }
  if (action === "toggle-setting") {
    const key = target.dataset.key;
    if (!key || !(key in state.settings)) return;
    state.settings[key] = !state.settings[key];
    const labels = { notifyMessages: "Message notifications", notifyOrders: "Order notifications", notifyDeals: "Aztec Deals", profileVisible: "Profile visibility", showCampus: "Campus on your profile" };
    showToast(`${labels[key] || "Setting"} ${state.settings[key] ? "on" : "off"}.`);
    return render();
  }
  if (action === "sign-out") { showToast("This prototype stays signed in as your student account."); return; }
  if (action === "choose-sell-kind") {
    state.sellKind = target.dataset.kind;
    if (state.sellKind !== "product") state.sellMerchandiseType = null;
    return render();
  }
  if (action === "choose-merchandise-type") { state.sellMerchandiseType = target.dataset.merchandiseType; return render(); }
  if (action === "cancel-sell") { state.sellKind = null; state.sellMerchandiseType = null; return render(); }
  if (action === "close-modal") { document.querySelector("#modal-root").innerHTML = ""; return render(); }
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  event.preventDefault();
  if (state.mode === "seller" && handleSellerSubmit(form, event)) return;
  if (form.dataset.form === "global-search") {
    const query = new FormData(form).get("query")?.toString().trim() || "";
    state.query = query;
    state.category = "All";
    return setView("search");
  }
  if (form.dataset.form === "browse-search") {
    state.query = new FormData(form).get("query")?.toString() || "";
    return render();
  }
  if (form.dataset.form === "store-search") {
    state.storeQuery = new FormData(form).get("query")?.toString() || "";
    return render();
  }
  if (form.dataset.form === "stores-search") {
    state.storesQuery = new FormData(form).get("query")?.toString() || "";
    return render();
  }
  if (form.dataset.form === "send-message") {
    const input = form.querySelector("textarea[name=message]");
    const text = input.value.trim();
    if (!text) return;
    const conversationId = state.selectedConversationId;
    state.messages[conversationId] = state.messages[conversationId] || [];
    state.messages[conversationId].push({ who: "me", text, time: "now" });
    if (typeof sellerReceiveBuyerMessage === "function") sellerReceiveBuyerMessage(conversationId, text);
    input.value = "";
    render();
    showToast("Message sent in the demo.");
    return;
  }
  if (form.dataset.form === "create-list") {
    const name = new FormData(form).get("name")?.toString().trim() || "";
    if (!name) return;
    const id = `list-${Date.now()}`;
    state.lists.push({ id, name, listingIds: [] });
    state.selectedListId = id;
    document.querySelector("#modal-root").innerHTML = "";
    showToast(`Created “${name}”.`);
    if (state.view === "lists") render();
    else setView("lists");
    return;
  }
  if (form.dataset.form === "save-account") {
    const name = new FormData(form).get("displayName")?.toString().trim() || "";
    if (!name) return;
    state.settings.displayName = name;
    showToast("Account saved for this demo session.");
    return render();
  }
  if (form.dataset.form === "support") {
    document.querySelector("#modal-root").innerHTML = "";
    showToast("Demo support case created. Someone would follow up here.");
    return;
  }
  if (form.dataset.form === "report") {
    document.querySelector("#modal-root").innerHTML = "";
    showToast("Demo report submitted for review.");
    return;
  }
  if (form.dataset.form === "publish-listing") {
    const data = new FormData(form);
    const kind = state.sellKind || "service";
    const category = data.get("category")?.toString() || (kind === "service" ? "Learn" : "Other");
    const merchandiseType = kind === "product" ? state.sellMerchandiseType || "resale" : undefined;
    const condition = kind === "product" ? data.get("condition")?.toString() || (merchandiseType === "new" ? "New" : "Good condition") : undefined;
    const newListing = { id: `your-listing-${Date.now()}`, kind, merchandiseType, category, title: data.get("title")?.toString() || "Your new listing", seller: "Katarina Cedolin", initials: "KC", sellerId: "katarina", rating: "New", reviews: 0, completed: 0, price: Number(data.get("price")) || 25, unit: kind === "service" ? data.get("duration")?.toString() || "hour" : "each", accent: kind === "service" ? "lilac" : merchandiseType === "new" ? "mint" : "butter", emoji: kind === "service" ? "✨" : merchandiseType === "new" ? "✦" : "📦", tag: kind === "service" ? "Your demo listing" : undefined, condition, certification: kind === "service" ? serviceCertificationByCategory[category] || "provider" : undefined, availability: kind === "service" ? "Set availability next" : condition === "Digital download" ? "Instant digital delivery" : "Local pickup", campus: "SDSU", verified: true, quantityAvailable: Number(data.get("quantity")) || 1, description: data.get("description")?.toString() || "A new student listing.", meeting: kind === "service" ? "Choose a campus meeting spot" : condition === "Digital download" ? "Digital delivery in the app" : "Choose a campus pickup spot", response: "soon", slots: ["Choose a time"] };
    state.userListings.push(newListing);
    state.selectedListingId = newListing.id;
    state.sellKind = null;
    state.sellMerchandiseType = null;
    showToast("Your demo listing is live in this session.");
    return setView("listing");
  }
});

document.addEventListener("input", (event) => {
  const liveSearchFields = { "browse-search-input": "query", "store-search-input": "storeQuery", "stores-search-input": "storesQuery" };
  const stateKey = liveSearchFields[event.target.id];
  if (stateKey) {
    searchCaret = { id: event.target.id, position: event.target.selectionStart };
    state[stateKey] = event.target.value;
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelector("#modal-root").innerHTML = "";
    closeNotificationsPopover();
  }
});

document.addEventListener("click", (event) => {
  if (!state.notificationsOpen) return;
  if (event.target.closest(".header-popover-anchor")) return;
  closeNotificationsPopover();
});

hydrateStaticIcons();
render();
