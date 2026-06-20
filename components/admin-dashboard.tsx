"use client";

import { FormEvent, type Dispatch, type SetStateAction, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  MapPinned,
  MessageSquareText,
  Plus,
  Soup,
  Star
} from "lucide-react";
import { categories } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { DeliveryArea, MenuItem, Order, OrderStatus, Review } from "@/lib/types";

type AdminDashboardProps = {
  initialMenuItems: MenuItem[];
  initialOrders: Order[];
  initialReviews: Review[];
  initialDeliveryAreas: DeliveryArea[];
};

type Tab = "overview" | "orders" | "menu" | "reviews" | "delivery";

const tabs: Array<{ id: Tab; label: string; icon: typeof BarChart3 }> = [
  { id: "overview", label: "Analytics", icon: BarChart3 },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "menu", label: "Menu", icon: Soup },
  { id: "reviews", label: "Reviews", icon: MessageSquareText },
  { id: "delivery", label: "Delivery", icon: MapPinned }
];

const statuses: OrderStatus[] = [
  "whatsapp_pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "completed",
  "cancelled"
];

export function AdminDashboard({
  initialMenuItems,
  initialOrders,
  initialReviews,
  initialDeliveryAreas
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [orders, setOrders] = useState(initialOrders);
  const [reviews, setReviews] = useState(initialReviews);
  const [deliveryAreas, setDeliveryAreas] = useState(initialDeliveryAreas);

  const analytics = useMemo(() => {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = orders.filter((order) => order.status === "completed").length;
    const averageOrder = orders.length ? Math.round(totalSales / orders.length) : 0;
    const itemTotals = new Map<string, number>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemTotals.set(item.name, (itemTotals.get(item.name) ?? 0) + item.quantity);
      });
    });

    const topItems = Array.from(itemTotals.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return { totalSales, completedOrders, averageOrder, topItems };
  }, [orders]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
  }

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const item = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId: String(form.get("categoryId") ?? "appetizers"),
      price: Number(form.get("price") ?? 0),
      description: String(form.get("description") ?? ""),
      image: "/images/menu/zinger-burger.webp",
      popular: Boolean(form.get("popular")),
      tags: ["Admin"],
      spiceLevel: "medium",
      prepTime: 20,
      available: true
    };

    const response = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    const payload = await response.json();
    setMenuItems((current) => [payload.item as MenuItem, ...current]);
    event.currentTarget.reset();
  }

  async function createArea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const area = {
      name: String(form.get("name") ?? ""),
      fee: Number(form.get("fee") ?? 0),
      eta: String(form.get("eta") ?? ""),
      minimumOrder: Number(form.get("minimumOrder") ?? 0),
      active: true
    };

    const response = await fetch("/api/delivery-areas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(area)
    });
    const payload = await response.json();
    setDeliveryAreas((current) => [payload.deliveryArea as DeliveryArea, ...current]);
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="surface p-3">
          <div className="mb-3 rounded-md bg-cream p-3">
            <p className="text-sm font-black text-charcoal">Demo Admin</p>
            <p className="mt-1 text-xs leading-5 text-stone-600">
              Connect Supabase Auth before production access.
            </p>
          </div>
          <div className="grid gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-black transition ${
                    activeTab === tab.id ? "bg-charcoal text-white" : "text-stone-700 hover:bg-cream hover:text-chilli"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <section>
        {activeTab === "overview" ? (
          <Overview analytics={analytics} orders={orders} reviews={reviews} deliveryAreas={deliveryAreas} />
        ) : null}
        {activeTab === "orders" ? <Orders orders={orders} onStatusChange={updateStatus} /> : null}
        {activeTab === "menu" ? <MenuManager items={menuItems} onCreate={createItem} /> : null}
        {activeTab === "reviews" ? <ReviewsManager reviews={reviews} setReviews={setReviews} /> : null}
        {activeTab === "delivery" ? <DeliveryManager areas={deliveryAreas} onCreate={createArea} /> : null}
      </section>
    </div>
  );
}

function Overview({
  analytics,
  orders,
  reviews,
  deliveryAreas
}: {
  analytics: { totalSales: number; completedOrders: number; averageOrder: number; topItems: Array<{ name: string; quantity: number }> };
  orders: Order[];
  reviews: Review[];
  deliveryAreas: DeliveryArea[];
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          ["Total sales", formatCurrency(analytics.totalSales), BarChart3],
          ["Orders", String(orders.length), ClipboardList],
          ["Avg. order", formatCurrency(analytics.averageOrder), CheckCircle2],
          ["Delivery zones", String(deliveryAreas.length), MapPinned]
        ] as const).map(([label, value, Icon]) => (
          <div key={String(label)} className="surface p-5">
            <Icon size={22} className="text-ember" />
            <p className="mt-4 text-sm font-bold text-stone-600">{String(label)}</p>
            <p className="mt-1 text-3xl font-black text-charcoal">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="font-display text-2xl font-bold text-charcoal">Top items</h2>
          <div className="mt-4 grid gap-3">
            {analytics.topItems.length ? (
              analytics.topItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-md bg-cream p-3 text-sm">
                  <span className="font-bold text-charcoal">{item.name}</span>
                  <span className="font-black text-chilli">{item.quantity} sold</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-600">Top items appear as orders come in.</p>
            )}
          </div>
        </div>
        <div className="surface p-5">
          <h2 className="font-display text-2xl font-bold text-charcoal">Review health</h2>
          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between rounded-md bg-cream p-3 text-sm">
              <span className="font-bold text-charcoal">Average rating</span>
              <span className="font-black text-chilli">
                {(reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(1, reviews.length)).toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-cream p-3 text-sm">
              <span className="font-bold text-charcoal">Completed orders</span>
              <span className="font-black text-chilli">{analytics.completedOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Orders({ orders, onStatusChange }: { orders: Order[]; onStatusChange: (id: string, status: OrderStatus) => void }) {
  return (
    <div className="surface overflow-hidden">
      <div className="border-b border-stone-200 p-5">
        <h2 className="font-display text-2xl font-bold text-charcoal">Manage orders</h2>
        <p className="mt-2 text-sm text-stone-600">Update direct order status from WhatsApp pending to delivered.</p>
      </div>
      <div className="divide-y divide-stone-100">
        {orders.map((order) => (
          <article key={order.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-black text-charcoal">{order.id}</p>
                <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-black uppercase text-chilli">
                  {order.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                {order.customerName} · {order.phone} · {order.deliveryAreaName}
              </p>
              <p className="mt-2 text-sm font-bold text-charcoal">
                {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <p className="rounded-md bg-cream px-3 py-2 text-sm font-black text-chilli">{formatCurrency(order.total)}</p>
              <select
                value={order.status}
                onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}
                className={inputClass}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MenuManager({ items, onCreate }: { items: MenuItem[]; onCreate: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <form onSubmit={onCreate} className="surface grid gap-4 p-5 xl:sticky xl:top-24 xl:self-start">
        <h2 className="font-display text-2xl font-bold text-charcoal">Add menu item</h2>
        <label className="grid gap-2 text-sm font-bold text-charcoal">
          Name
          <input required name="name" className={inputClass} placeholder="New dish name" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-charcoal">
          Category
          <select name="categoryId" className={inputClass}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-charcoal">
          Price
          <input required name="price" type="number" min="0" className={inputClass} placeholder="599" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-charcoal">
          Description
          <textarea required name="description" rows={3} className={inputClass} placeholder="Short menu description" />
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-bold text-charcoal">
          <input name="popular" type="checkbox" className="h-4 w-4 accent-ember" />
          Popular badge
        </label>
        <button type="submit" className="btn-primary">
          <Plus size={18} /> Add item
        </button>
      </form>

      <div className="surface overflow-hidden">
        <div className="border-b border-stone-200 p-5">
          <h2 className="font-display text-2xl font-bold text-charcoal">Menu items</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {items.map((item) => (
            <div key={item.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-black text-charcoal">{item.name}</p>
                <p className="mt-1 text-sm text-stone-600">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.popular ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs font-black text-chilli">
                    <Star size={12} fill="currentColor" /> Popular
                  </span>
                ) : null}
                <span className="font-black text-charcoal">{formatCurrency(item.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewsManager({
  reviews,
  setReviews
}: {
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
}) {
  return (
    <div className="surface overflow-hidden">
      <div className="border-b border-stone-200 p-5">
        <h2 className="font-display text-2xl font-bold text-charcoal">Manage reviews</h2>
        <p className="mt-2 text-sm text-stone-600">Moderate review visibility and source labels.</p>
      </div>
      <div className="divide-y divide-stone-100">
        {reviews.map((review) => (
          <article key={review.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
            <div>
              <div className="flex text-saffron">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">{review.quote}</p>
              <p className="mt-3 font-black text-charcoal">
                {review.name} · {review.source}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setReviews((current) =>
                  current.map((item) => (item.id === review.id ? { ...item, approved: !item.approved } : item))
                )
              }
              className={review.approved ? "btn-primary" : "btn-secondary"}
            >
              {review.approved ? "Approved" : "Hidden"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function DeliveryManager({
  areas,
  onCreate
}: {
  areas: DeliveryArea[];
  onCreate: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <form onSubmit={onCreate} className="surface grid gap-4 p-5 xl:sticky xl:top-24 xl:self-start">
        <h2 className="font-display text-2xl font-bold text-charcoal">Add delivery zone</h2>
        <label className="grid gap-2 text-sm font-bold text-charcoal">
          Zone name
          <input required name="name" className={inputClass} placeholder="Area name" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-charcoal">
          Fee
          <input required name="fee" type="number" min="0" className={inputClass} placeholder="180" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-charcoal">
          ETA
          <input required name="eta" className={inputClass} placeholder="35-45 min" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-charcoal">
          Minimum order
          <input required name="minimumOrder" type="number" min="0" className={inputClass} placeholder="699" />
        </label>
        <button type="submit" className="btn-primary">
          <Plus size={18} /> Add zone
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {areas.map((area) => (
          <div key={area.id} className="surface p-5">
            <p className="font-black text-charcoal">{area.name}</p>
            <p className="mt-2 text-sm text-stone-600">{area.eta}</p>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Fee</span>
                <span className="font-black">{formatCurrency(area.fee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum</span>
                <span className="font-black">{formatCurrency(area.minimumOrder)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  "min-h-11 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-charcoal outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/20";
