export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type MealTime = "breakfast" | "lunch" | "dinner" | "desserts" | "beverages";

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
  tags: string[];
  mealTime?: MealTime;
  spiceLevel: "mild" | "medium" | "hot";
  prepTime: number;
  available: boolean;
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
