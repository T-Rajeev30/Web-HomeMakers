export const languages = [
  { code: "en", glyph: "A", name: "English" },
  { code: "hi", glyph: "अ", name: "हिन्दी" },
  { code: "kn", glyph: "ಅ", name: "ಕನ್ನಡ" },
  { code: "ta", glyph: "அ", name: "தமிழ்" },
  { code: "te", glyph: "అ", name: "తెలుగు" },
  { code: "ml", glyph: "അ", name: "മലയാളം" },
  { code: "mr", glyph: "अ", name: "मराठी" },
  { code: "bn", glyph: "অ", name: "বাংলা" },
];

export const recentActivity = [
  {
    icon: "shopping_basket",
    title: "Order #4432 Ready",
    sub: "Paneer Tikka Meal x 2",
    time: "2m ago",
  },
  {
    icon: "star",
    fill: true,
    title: "New 5-star Review",
    sub: '"Best home cooked food ever!"',
    time: "1h ago",
  },
];

export const orders = [
  {
    id: "#ZG-9421",
    customer: "Priya Sharma",
    status: "pending",
    items: [
      { name: "2x Idli Sambar", price: "₹120" },
      { name: "1x Medu Vada (2pc)", price: "₹80" },
    ],
    total: "₹200.00",
  },
  {
    id: "#ZG-9418",
    customer: "Anish Kapoor",
    status: "active",
    items: [
      { name: "1x Thali Combo", price: "₹180" },
      { name: "2x Butter Roti", price: "₹40" },
    ],
    total: "₹220.00",
  },
  {
    id: "#ZG-9410",
    customer: "Meera Nair",
    status: "active",
    items: [{ name: "3x Masala Dosa", price: "₹270" }],
    total: "₹270.00",
  },
];

export const dishes = [
  {
    name: "Butter Chicken Deluxe",
    price: "₹250",
    desc: "Authentic north-indian creamy butter chicken with buttered garlic naan.",
    tag: "Best Seller",
    available: true,
  },
  {
    name: "Paneer Tikka Meal",
    price: "₹180",
    desc: "Char-grilled cottage cheese with mint chutney, salad and roti.",
    tag: null,
    available: true,
  },
  {
    name: "Veg Thali Combo",
    price: "₹150",
    desc: "Dal, sabzi, rice, 2 roti, salad and a sweet of the day.",
    tag: null,
    available: false,
  },
];

export const documents = [
  {
    id: "aadhaar-front",
    icon: "badge",
    title: "Aadhaar Card (Front)",
    sub: "Proof of Identity",
  },
  {
    id: "aadhaar-back",
    icon: "badge",
    title: "Aadhaar Card (Back)",
    sub: "Proof of Address",
  },
  {
    id: "fssai",
    icon: "description",
    title: "FSSAI License",
    sub: "Food safety registration",
  },
  {
    id: "kitchen",
    icon: "photo_camera",
    title: "Kitchen Photo",
    sub: "Workspace verification",
  },
];

export const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "₹99",
    period: "7 days",
    used: 5,
    total: 5,
    progress: 90,
    status: "active",
    note: "Expires in 2 days",
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "₹299",
    period: "30 days",
    used: 2,
    total: 30,
    progress: 60,
    status: "inactive",
    note: "12 days left",
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₹499",
    period: "30 days",
    used: 1,
    total: 30,
    progress: 0,
    status: "inactive",
    note: "Inactive",
  },
];

export const profile = {
  kitchenName: "Sunita's Kitchen",
  email: "sunita@example.com",
  phone: "+91 98765 43210",
  cuisine: "North Indian",
  experience: "5+ Years",
  version: "1.0.0",
};

export const reuploadDocs = [
  {
    id: "aadhaar-front",
    icon: "badge",
    title: "Aadhaar Card (Front)",
    flagged: true,
  },
  {
    id: "aadhaar-back",
    icon: "badge",
    title: "Aadhaar Card (Back)",
    flagged: false,
  },
  { id: "fssai", icon: "description", title: "FSSAI License", flagged: true },
  {
    id: "kitchen",
    icon: "photo_camera",
    title: "Kitchen Photo",
    flagged: false,
  },
];

export const rejectionReasons = [
  "Aadhaar Card image is blurry and unreadable",
  "FSSAI License has expired",
];

export const categories = [
  "North Indian",
  "South Indian",
  "Beverages",
  "Desserts",
  "Snacks",
];

export const contactInfo = {
  email: "support@zingro.in",
  phone: "+91 98765 43210",
  address: "WeWork Latitude, Bengaluru, Karnataka 560024",
};

export const faqs = [
  {
    q: "How do I start receiving orders?",
    a: "Complete your onboarding and document verification. Once approved, your kitchen goes live and customers can order.",
  },
  {
    q: "When will I get paid?",
    a: "Earnings are settled to your registered bank account weekly, every Monday for the previous week's orders.",
  },
  {
    q: "How do I add or edit dishes?",
    a: "Go to the Menu tab, tap the + button to add a dish, or tap Edit on any dish card to update it.",
  },
  {
    q: "What if my documents are rejected?",
    a: "You'll see the rejection reason on your dashboard. Re-upload the flagged documents and resubmit for verification.",
  },
];
