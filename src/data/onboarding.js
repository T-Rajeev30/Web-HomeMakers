// Onboarding: 9 sequential steps (batch KYC at final submit)
export const TOTAL_STEPS = 9;

export const STEPS = {
  personal: {
    step: 1,
    label: "Personal Information",
    next: "/address-details",
  },
  address: { step: 2, label: "Address Details", next: "/tax-details" },
  tax: { step: 3, label: "Tax Details", next: "/bank-details" },
  bank: { step: 4, label: "Bank Details", next: "/fssai-details" },
  fssai: { step: 5, label: "FSSAI License", next: "/about-food" },
  food: { step: 6, label: "About Your Food", next: "/subscription" },
  subscription: { step: 7, label: "Subscription", next: "/kitchen-photos" },
  photos: { step: 8, label: "Kitchen Photos", next: "/review-submit" },
  review: {
    step: 9,
    label: "Review & Submit",
    next: "/verification-submitted",
  },
};

export const durations = ["7 days", "15 days", "30 days", "90 days"];

export const banks = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra",
  "Other",
];
export const cuisines = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Continental",
  "Bengali",
  "Gujarati",
];
export const foodCategories = ["Vegetarian", "Non-Vegetarian", "Both", "Vegan"];
export const serviceRadii = ["1 km", "2 km", "3 km", "5 km", "10 km"];

export const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "₹0",
    period: "month",
    tag: "Free to start",
    features: ["Up to 20 orders/day", "Standard listing", "Email support"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹499",
    period: "month",
    tag: "Most popular",
    features: [
      "Unlimited orders",
      "Priority listing",
      "Analytics",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹1,499",
    period: "month",
    tag: "For large kitchens",
    features: [
      "Everything in Premium",
      "Dedicated manager",
      "Multi-kitchen",
      "Custom branding",
    ],
  },
];
