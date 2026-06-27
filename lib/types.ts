export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type MealTime = "breakfast" | "lunch" | "dinner" | "desserts" | "beverages";

export type MenuOption = {
  id: string;
  label: string;
  /** Absolute price for this option */
  price: number;
  /** Optional helper badge (e.g. "3 pcs") */
  hintLabel?: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  /** Base price used on main card (should be the lowest option price when options exist) */
  price: number;
  image: string;
  popular?: boolean;
  tags: string[];
  mealTime?: MealTime;
  spiceLevel: "mild" | "medium" | "hot";
  prepTime: number;
  available: boolean;
  variantLabel?: string;

  /** Badge text shown on main page (e.g. "3-6-12 pcs" or "Half / Full" or "4-8 pcs") */
  optionsHint?: string;
  /** When set, modal shows these options and updates price dynamically */
  options?: MenuOption[];

  /** Deal-only fields */
  handi_quantity?: number;
  handi_size?: string;
  appetizer_count?: number;
  appetizer_types?: string[];
  naan_quantity?: number;
  drink_volume_liters?: number;
  free_items?: string[];
};


export type DeliveryArea = {
  id: string;
  name: string;
  fee: number;
  eta: string;
  minimumOrder: number;
  active: boolean;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  quote: string;
  source: "Website" | "WhatsApp" | "Foodpanda" | "Instagram";
  image?: string;
  createdAt: string;
  approved: boolean;
};

export type CartAddon = {
  id: string;
  label: string;
  price: number;
};

export type CartLine = {
  lineId: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  price: number;
  quantity: number;
  addons: CartAddon[];
  comment?: string;
};

export type OrderStatus =
  | "whatsapp_pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash_on_delivery" | "bank_transfer" | "easypaisa_jazzcash";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryAreaId: string;
  deliveryAreaName: string;
  deliveryFee: number;
  items: CartLine[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  loyaltyPointsEarned: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
};

export type OrderInput = {
  customerName: string;
  phone: string;
  address: string;
  deliveryAreaId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    name?: string;
    price?: number;
    addons?: CartAddon[];
    comment?: string;
  }>;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
};
