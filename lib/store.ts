import { categories, deliveryAreas, menuItems, reviews, seedOrders } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { DeliveryArea, MenuItem, Order, OrderInput, OrderStatus, Review } from "@/lib/types";

let demoMenuItems = [...menuItems];
let demoDeliveryAreas = [...deliveryAreas];
let demoReviews = [...reviews];
let demoOrders = [...seedOrders];

const couponRules: Record<string, { percent?: number; amount?: number; minSubtotal: number }> = {
  ZAIQA15: { percent: 15, minSubtotal: 999 },
  FIRSTORDER: { percent: 10, minSubtotal: 699 },
  FAMILY100: { amount: 100, minSubtotal: 1999 }
};

export async function listMenuItems() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, deals(*)")
      .eq("is_available", true)
      .order("sort_order", { ascending: true });

    if (!error && data) {
      return data.map(fromDbMenuItem);
    }
  }

  return demoMenuItems;
}

export async function createMenuItem(item: Partial<MenuItem>) {
  const created: MenuItem = {
    id: item.id ?? `item-${Date.now().toString(36)}`,
    categoryId: item.categoryId ?? "appetizers",
    name: item.name ?? "New menu item",
    slug: item.slug ?? (item.name ?? "new-menu-item").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: item.description ?? "Freshly prepared item from the Zaiqa kitchen.",
    price: Number(item.price ?? 0),
    image: item.image ?? "/images/menu/zinger-burger.webp",
    popular: Boolean(item.popular),
    tags: item.tags ?? ["New"],
    spiceLevel: item.spiceLevel ?? "medium",
    prepTime: Number(item.prepTime ?? 20),
    available: item.available ?? true,
    variantLabel: item.variantLabel,
    optionsHint: item.optionsHint,
    options: item.options,
    handi_quantity: item.handi_quantity,
    handi_size: item.handi_size,
    appetizer_count: item.appetizer_count,
    appetizer_types: item.appetizer_types,
    naan_quantity: item.naan_quantity,
    drink_volume_ml: item.drink_volume_ml,
    free_items: item.free_items
  };

  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("menu_items").insert(toDbMenuItem(created));
    if (created.categoryId === "deals") {
      await supabase.from("deals").insert(toDbDeal(created));
    }
  }

  demoMenuItems = [created, ...demoMenuItems];
  return created;
}

export async function listDeliveryAreas() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("delivery_areas")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (!error && data) {
      return data.map(fromDbDeliveryArea);
    }
  }

  return demoDeliveryAreas;
}

export async function createDeliveryArea(area: Partial<DeliveryArea>) {
  const created: DeliveryArea = {
    id: area.id ?? `area-${Date.now().toString(36)}`,
    name: area.name ?? "New delivery zone",
    fee: Number(area.fee ?? 0),
    eta: area.eta ?? "30-45 min",
    minimumOrder: Number(area.minimumOrder ?? 0),
    active: area.active ?? true
  };

  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("delivery_areas").insert(toDbDeliveryArea(created));
  }

  demoDeliveryAreas = [created, ...demoDeliveryAreas];
  return created;
}

export async function listReviews() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map(fromDbReview);
    }
  }

  return demoReviews.filter((review) => review.approved);
}

export async function createReview(review: Partial<Review>) {
  const created: Review = {
    id: review.id ?? `review-${Date.now().toString(36)}`,
    name: review.name ?? "Website customer",
    rating: Math.min(5, Math.max(1, Number(review.rating ?? 5))),
    quote: review.quote ?? "Fresh food and smooth direct ordering.",
    source: review.source ?? "Website",
    image: review.image,
    createdAt: new Date().toISOString(),
    approved: review.approved ?? false
  };

  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("reviews").insert(toDbReview(created));
  }

  demoReviews = [created, ...demoReviews];
  return created;
}

export async function listOrders() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map(fromDbOrder);
    }
  }

  return demoOrders;
}

export async function createOrder(input: OrderInput) {
  const items = await listMenuItems();
  const areas = await listDeliveryAreas();
  const area = areas.find((candidate) => candidate.id === input.deliveryAreaId) ?? areas[0];
  const orderLines = input.items
    .map((line) => {
      const item = items.find((candidate) => candidate.id === line.menuItemId);
      if (!item && !line.name) {
        return null;
      }

      const name = line.name ?? item!.name;
      const price = line.price ?? item!.price;

      return {
        lineId: `order-line-${line.menuItemId}-${Math.random().toString(36).slice(2, 8)}`,
        menuItemId: line.menuItemId,
        name,
        basePrice: item?.price ?? price,
        price,
        quantity: Math.max(1, Number(line.quantity)),
        addons: line.addons ?? [],
        comment: line.comment
      };
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const subtotal = orderLines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const discount = calculateDiscount(input.couponCode, subtotal);
  const deliveryFee = subtotal >= area.minimumOrder ? area.fee : area.fee + 100;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const order: Order = {
    id: `ZQ-${Date.now().toString(36).toUpperCase()}`,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    address: input.address.trim(),
    deliveryAreaId: area.id,
    deliveryAreaName: area.name,
    deliveryFee,
    items: orderLines,
    subtotal,
    discount,
    total,
    couponCode: input.couponCode?.trim().toUpperCase(),
    loyaltyPointsEarned: Math.floor(total / 100),
    paymentMethod: input.paymentMethod,
    notes: input.notes?.trim(),
    status: "whatsapp_pending",
    createdAt: new Date().toISOString()
  };

  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("orders").insert(toDbOrder(order));
    await supabase.from("order_items").insert(
      order.items.map((line) => ({
        order_id: order.id,
        menu_item_id: line.menuItemId,
        name: line.name,
        price: line.price,
        quantity: line.quantity
      }))
    );
  }

  demoOrders = [order, ...demoOrders];
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("orders").update({ status }).eq("id", id);
  }

  demoOrders = demoOrders.map((order) => (order.id === id ? { ...order, status } : order));
  return demoOrders.find((order) => order.id === id) ?? null;
}

function calculateDiscount(code: string | undefined, subtotal: number) {
  const normalized = code?.trim().toUpperCase();
  if (!normalized) {
    return 0;
  }

  const rule = couponRules[normalized];
  if (!rule || subtotal < rule.minSubtotal) {
    return 0;
  }

  return rule.percent ? Math.round(subtotal * (rule.percent / 100)) : rule.amount ?? 0;
}

function fromDbMenuItem(row: Record<string, unknown>): MenuItem {
  const rawDeal = Array.isArray(row.deals)
    ? (row.deals[0] as Record<string, unknown> | undefined)
    : (row.deals as Record<string, unknown> | undefined);
  const deal = rawDeal ?? row;

  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    price: Number(row.price ?? 0),
    image: String(row.image_url ?? "/images/menu/zinger-burger.webp"),
    popular: Boolean(row.is_popular),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    mealTime: row.meal_time ? (row.meal_time as MenuItem["mealTime"]) : undefined,
    spiceLevel: (row.spice_level as MenuItem["spiceLevel"]) ?? "medium",
    prepTime: Number(row.prep_time_minutes ?? 20),
    available: Boolean(row.is_available ?? true),
    variantLabel: row.variant_label ? String(row.variant_label) : undefined,
    optionsHint: row.options_hint ? String(row.options_hint) : undefined,
    options: Array.isArray(row.options) ? (row.options as MenuItem["options"]) : undefined,
    handi_quantity: deal.handi_quantity == null ? undefined : Number(deal.handi_quantity),
    handi_size: deal.handi_size == null ? undefined : String(deal.handi_size),
    appetizer_count: deal.appetizer_count == null ? undefined : Number(deal.appetizer_count),
    appetizer_types: Array.isArray(deal.appetizer_types) ? (deal.appetizer_types as string[]) : undefined,
    naan_quantity: deal.naan_quantity == null ? undefined : Number(deal.naan_quantity),
    drink_volume_ml: deal.drink_volume_ml == null ? undefined : Number(deal.drink_volume_ml),
    free_items: Array.isArray(deal.free_items) ? (deal.free_items as string[]) : undefined
  };
}

function toDbMenuItem(item: MenuItem) {
  return {
    id: item.id,
    category_id: item.categoryId,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price: item.price,
    image_url: item.image,
    is_popular: item.popular,
    tags: item.tags,
    meal_time: item.mealTime ?? null,
    spice_level: item.spiceLevel,
    prep_time_minutes: item.prepTime,
    is_available: item.available,
    variant_label: item.variantLabel ?? null,
    options_hint: item.optionsHint ?? null,
    options: item.options ?? null
  };
}

function toDbDeal(item: MenuItem) {
  return {
    menu_item_id: item.id,
    handi_quantity: item.handi_quantity ?? 0,
    handi_size: item.handi_size ?? "",
    appetizer_count: item.appetizer_count ?? 0,
    appetizer_types: item.appetizer_types ?? [],
    naan_quantity: item.naan_quantity ?? 0,
    drink_volume_ml: item.drink_volume_ml ?? 0,
    free_items: item.free_items ?? []
  };
}

function fromDbDeliveryArea(row: Record<string, unknown>): DeliveryArea {
  return {
    id: String(row.id),
    name: String(row.name),
    fee: Number(row.fee ?? 0),
    eta: String(row.eta ?? "30-45 min"),
    minimumOrder: Number(row.minimum_order ?? 0),
    active: Boolean(row.active ?? true)
  };
}

function toDbDeliveryArea(area: DeliveryArea) {
  return {
    id: area.id,
    name: area.name,
    fee: area.fee,
    eta: area.eta,
    minimum_order: area.minimumOrder,
    active: area.active
  };
}

function fromDbReview(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    name: String(row.name),
    rating: Number(row.rating ?? 5),
    quote: String(row.quote),
    source: (row.source as Review["source"]) ?? "Website",
    image: row.image_url ? String(row.image_url) : undefined,
    createdAt: String(row.created_at),
    approved: Boolean(row.approved)
  };
}

function toDbReview(review: Review) {
  return {
    id: review.id,
    name: review.name,
    rating: review.rating,
    quote: review.quote,
    source: review.source,
    image_url: review.image,
    approved: review.approved,
    created_at: review.createdAt
  };
}

function fromDbOrder(row: Record<string, unknown>): Order {
  const rawItems = Array.isArray(row.order_items) ? (row.order_items as Record<string, unknown>[]) : [];

  return {
    id: String(row.id),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    address: String(row.address),
    deliveryAreaId: String(row.delivery_area_id),
    deliveryAreaName: String(row.delivery_area_name ?? ""),
    deliveryFee: Number(row.delivery_fee ?? 0),
    items: rawItems.map((item, index) => ({
      lineId: `db-${String(row.id)}-${index}`,
      menuItemId: String(item.menu_item_id),
      name: String(item.name),
      basePrice: Number(item.price),
      price: Number(item.price),
      quantity: Number(item.quantity),
      addons: []
    })),
    subtotal: Number(row.subtotal ?? 0),
    discount: Number(row.discount ?? 0),
    total: Number(row.total ?? 0),
    couponCode: row.coupon_code ? String(row.coupon_code) : undefined,
    loyaltyPointsEarned: Number(row.loyalty_points_earned ?? 0),
    paymentMethod: (row.payment_method as Order["paymentMethod"]) ?? "cash_on_delivery",
    notes: row.notes ? String(row.notes) : undefined,
    status: (row.status as OrderStatus) ?? "whatsapp_pending",
    createdAt: String(row.created_at)
  };
}

function toDbOrder(order: Order) {
  return {
    id: order.id,
    customer_name: order.customerName,
    phone: order.phone,
    address: order.address,
    delivery_area_id: order.deliveryAreaId,
    delivery_area_name: order.deliveryAreaName,
    delivery_fee: order.deliveryFee,
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    coupon_code: order.couponCode,
    loyalty_points_earned: order.loyaltyPointsEarned,
    payment_method: order.paymentMethod,
    notes: order.notes,
    status: order.status,
    created_at: order.createdAt
  };
}
