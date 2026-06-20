import type { Category, DeliveryArea, MenuItem, Order, Review } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "handi-karahi",
    name: "Handi & Karahi",
    slug: "handi-karahi",
    description: "Slow-cooked gravies with naan, roti, and family portions."
  },
  {
    id: "burgers",
    name: "Burgers",
    slug: "burgers",
    description: "Crispy chicken, house sauce, and fresh buns."
  },
  {
    id: "wraps",
    name: "Wraps",
    slug: "wraps",
    description: "Portable favorites for solo cravings and late-night orders."
  },
  {
    id: "appetizers",
    name: "Appetizers",
    slug: "appetizers",
    description: "Fries, nuggets, wings, dips, and crunchy sides."
  },
  {
    id: "deals",
    name: "Deals",
    slug: "deals",
    description: "Solo, buddy, family, and midnight bundles."
  },
  {
    id: "breads-drinks",
    name: "Breads & Drinks",
    slug: "breads-drinks",
    description: "Fresh roti, milky naan, chai, and add-ons."
  }
];

export const menuItems: MenuItem[] = [
  {
    id: "velvety-shahi-handi",
    categoryId: "handi-karahi",
    name: "Velvety Shahi Handi",
    slug: "velvety-shahi-handi",
    description: "Creamy homemade chicken handi with Half and Full portion options.",
    price: 1249,
    image: "/images/menu/shahi-handi.webp",
    popular: true,
    tags: ["Gravy", "Best seller", "Dinner", "Half / Full"],
    mealTime: "dinner",
    spiceLevel: "medium",
    prepTime: 35,
    available: true
  },
  {
    id: "royal-gola-kabab-half",
    categoryId: "handi-karahi",
    name: "Royal Gola Kabab Bowl Half",
    slug: "royal-gola-kabab-half",
    description: "Tender gola kabab in a rich creamy bowl, built for sharing.",
    price: 1299,
    image: "/images/whatsapp/zaiqa-18.jpg",
    popular: false,
    tags: ["Kabab", "Dinner"],
    mealTime: "dinner",
    spiceLevel: "medium",
    prepTime: 35,
    available: true
  },
  {
    id: "zaiqa-eco-crunch",
    categoryId: "burgers",
    name: "Zaiqa Eco Crunch",
    slug: "zaiqa-eco-crunch",
    description: "Juicy chicken breast with house-made sauce in a toasted bun.",
    price: 329,
    image: "/images/menu/eco-crunch.webp",
    popular: true,
    tags: ["Burger", "Crunchy", "Quick bite"],
    mealTime: "lunch",
    spiceLevel: "medium",
    prepTime: 18,
    available: true
  },
  {
    id: "zinger-booster",
    categoryId: "burgers",
    name: "Zinger Booster",
    slug: "zinger-booster",
    description: "Crispy zinger chicken, lettuce, and creamy house sauce.",
    price: 349,
    image: "/images/menu/zinger-burger.webp",
    popular: true,
    tags: ["Zinger", "Best seller"],
    mealTime: "dinner",
    spiceLevel: "hot",
    prepTime: 20,
    available: true
  },
  {
    id: "zaiqa-double-decker",
    categoryId: "burgers",
    name: "Zaiqa Double Decker",
    slug: "zaiqa-double-decker",
    description: "Two crispy layers with cheese-style sauce and crunchy lettuce.",
    price: 749,
    image: "/images/menu/double-decker.webp",
    popular: false,
    tags: ["Burger", "Loaded"],
    mealTime: "dinner",
    spiceLevel: "hot",
    prepTime: 24,
    available: true
  },
  {
    id: "zaiqa-wrap",
    categoryId: "wraps",
    name: "Zaiqa Wrap",
    slug: "zaiqa-wrap",
    description: "Soft wrap packed with crispy chicken, greens, and house sauce.",
    price: 499,
    image: "/images/whatsapp/zaiqa-19.jpg",
    popular: false,
    tags: ["Wrap", "Lunch"],
    mealTime: "lunch",
    spiceLevel: "medium",
    prepTime: 18,
    available: true
  },
  {
    id: "king-crunch-wrap",
    categoryId: "wraps",
    name: "King Crunch Wrap",
    slug: "king-crunch-wrap",
    description: "A bigger wrap with extra crunch, sauce, and late-night energy.",
    price: 699,
    image: "/images/whatsapp/zaiqa-19.jpg",
    popular: true,
    tags: ["Wrap", "Popular", "Midnight"],
    mealTime: "dinner",
    spiceLevel: "hot",
    prepTime: 22,
    available: true
  },
  {
    id: "zaiqa-chunky-chicken",
    categoryId: "appetizers",
    name: "Zaiqa Chunky Chicken",
    slug: "zaiqa-chunky-chicken",
    description: "Twelve crispy chicken chunks with a dipping sauce.",
    price: 599,
    image: "/images/whatsapp/zaiqa-12.jpg",
    popular: true,
    tags: ["Appetizer", "Shareable"],
    mealTime: "lunch",
    spiceLevel: "medium",
    prepTime: 20,
    available: true
  },
  {
    id: "golden-nuggets",
    categoryId: "appetizers",
    name: "Golden Nuggets",
    slug: "golden-nuggets",
    description: "Six golden nuggets, crisp outside and tender inside.",
    price: 499,
    image: "/images/whatsapp/zaiqa-09.jpg",
    popular: false,
    tags: ["Nuggets", "Kids"],
    mealTime: "lunch",
    spiceLevel: "mild",
    prepTime: 16,
    available: true
  },
  {
    id: "golden-hot-masala-fries",
    categoryId: "appetizers",
    name: "Golden Hot Masala Fries",
    slug: "golden-hot-masala-fries",
    description: "Crisp fries tossed in hot masala with house dip.",
    price: 499,
    image: "/images/whatsapp/zaiqa-16.jpg",
    popular: true,
    tags: ["Fries", "Spicy", "Snack"],
    mealTime: "lunch",
    spiceLevel: "hot",
    prepTime: 14,
    available: true
  },
  {
    id: "legend-loaded-fries",
    categoryId: "appetizers",
    name: "The Legend Loaded Fries",
    slug: "legend-loaded-fries",
    description: "Loaded fries layered with sauce, chicken bites, and spice.",
    price: 599,
    image: "/images/menu/loaded-fries.webp",
    popular: true,
    tags: ["Loaded", "Best seller"],
    mealTime: "lunch",
    spiceLevel: "hot",
    prepTime: 18,
    available: true
  },
  {
    id: "solo-handi-deal",
    categoryId: "deals",
    name: "Solo Handi Deal",
    slug: "solo-handi-deal",
    description: "Quarter handi, two naan, and a buddy drink.",
    price: 699,
    image: "/images/menu/shahi-handi.webp",
    popular: true,
    tags: ["Deal", "Solo"],
    mealTime: "dinner",
    spiceLevel: "medium",
    prepTime: 32,
    available: true
  },
  {
    id: "solo-zinger-deal",
    categoryId: "deals",
    name: "Solo Zinger Deal",
    slug: "solo-zinger-deal",
    description: "One Zinger Booster with half fries and drink.",
    price: 599,
    image: "/images/menu/zinger-burger.webp",
    popular: true,
    tags: ["Deal", "Burger"],
    mealTime: "dinner",
    spiceLevel: "hot",
    prepTime: 22,
    available: true
  },
  {
    id: "happy-family-deal",
    categoryId: "deals",
    name: "Happy Family Deal",
    slug: "happy-family-deal",
    description: "Half Shahi Handi, half Royal Gola Kabab, six milky naan, and 1.5L drink.",
    price: 2999,
    image: "/images/menu/shahi-handi.webp",
    popular: true,
    tags: ["Family", "Bundle"],
    mealTime: "dinner",
    spiceLevel: "medium",
    prepTime: 48,
    available: true
  },
  {
    id: "buddy-deal",
    categoryId: "deals",
    name: "Buddy Deal",
    slug: "buddy-deal",
    description: "Two Zinger Boosters, golden hot masala fries half, and buddy drinks.",
    price: 999,
    image: "/images/menu/zinger-burger.webp",
    popular: false,
    tags: ["Deal", "Two people"],
    mealTime: "dinner",
    spiceLevel: "hot",
    prepTime: 28,
    available: true
  },
  {
    id: "midnight-sharing-deal",
    categoryId: "deals",
    name: "Midnight Sharing Deal",
    slug: "midnight-sharing-deal",
    description: "Two Zaiqa wraps and two buddy drinks, available 11 PM to 1 AM.",
    price: 999,
    image: "/images/whatsapp/zaiqa-19.jpg",
    popular: false,
    tags: ["Midnight", "Shareable"],
    mealTime: "dinner",
    spiceLevel: "medium",
    prepTime: 24,
    available: true
  },
  {
    id: "milky-naan",
    categoryId: "breads-drinks",
    name: "Milky Naan",
    slug: "milky-naan",
    description: "Soft naan for pairing with handi and karahi orders.",
    price: 50,
    image: "/images/whatsapp/zaiqa-18.jpg",
    popular: false,
    tags: ["Bread", "Add-on"],
    mealTime: "dinner",
    spiceLevel: "mild",
    prepTime: 8,
    available: true
  },
  {
    id: "elaichi-chai",
    categoryId: "breads-drinks",
    name: "Elaichi Chai",
    slug: "elaichi-chai",
    description: "Warm cardamom chai for pickup or evening delivery orders.",
    price: 180,
    image: "/images/whatsapp/zaiqa-05.jpg",
    popular: false,
    tags: ["Chai", "Drink"],
    mealTime: "beverages",
    spiceLevel: "mild",
    prepTime: 10,
    available: true
  }
];

export const deliveryAreas: DeliveryArea[] = [
  {
    id: "nearby",
    name: "Nearby Home Delivery Zone",
    fee: 120,
    eta: "25-35 min",
    minimumOrder: 499,
    active: true
  },
  {
    id: "gulshan",
    name: "Gulshan / Johar",
    fee: 180,
    eta: "35-45 min",
    minimumOrder: 699,
    active: true
  },
  {
    id: "north",
    name: "North Nazimabad / Buffer Zone",
    fee: 220,
    eta: "40-55 min",
    minimumOrder: 899,
    active: true
  },
  {
    id: "pickup",
    name: "Pickup from Kitchen",
    fee: 0,
    eta: "Ready in 20-30 min",
    minimumOrder: 0,
    active: true
  }
];

export const reviews: Review[] = [
  {
    id: "review-1",
    name: "Areeba K.",
    rating: 5,
    quote: "The Shahi Handi tasted homemade but packed like a premium order. Naan arrived soft and warm.",
    source: "WhatsApp",
    image: "/images/menu/shahi-handi.webp",
    createdAt: "2026-05-29T18:45:00.000Z",
    approved: true
  },
  {
    id: "review-2",
    name: "Hamza M.",
    rating: 5,
    quote: "Zinger Booster and loaded fries were better than my usual delivery app order. Direct WhatsApp confirmation was fast.",
    source: "Website",
    image: "/images/whatsapp/zaiqa-15.jpg",
    createdAt: "2026-05-31T21:10:00.000Z",
    approved: true
  },
  {
    id: "review-3",
    name: "Nimra S.",
    rating: 5,
    quote: "Family deal was enough for everyone and the gravy had that fresh kitchen flavor.",
    source: "Foodpanda",
    image: "/images/menu/shahi-handi.webp",
    createdAt: "2026-06-02T20:18:00.000Z",
    approved: true
  },
  {
    id: "review-4",
    name: "Bilal R.",
    rating: 4,
    quote: "Masala fries were crisp, spicy, and still hot when delivered. Will order again.",
    source: "Instagram",
    image: "/images/whatsapp/zaiqa-16.jpg",
    createdAt: "2026-06-03T23:35:00.000Z",
    approved: true
  }
];

export const seedOrders: Order[] = [
  {
    id: "ZQ-DEMO-101",
    customerName: "Demo Customer",
    phone: "0312-0000000",
    address: "Demo address, nearby delivery zone",
    deliveryAreaId: "nearby",
    deliveryAreaName: "Nearby Home Delivery Zone",
    deliveryFee: 120,
    items: [
      { menuItemId: "zinger-booster", name: "Zinger Booster", price: 349, quantity: 2 },
      { menuItemId: "legend-loaded-fries", name: "The Legend Loaded Fries", price: 599, quantity: 1 }
    ],
    subtotal: 1297,
    discount: 0,
    total: 1417,
    loyaltyPointsEarned: 14,
    paymentMethod: "cash_on_delivery",
    status: "preparing",
    createdAt: "2026-06-05T17:45:00.000Z"
  }
];
