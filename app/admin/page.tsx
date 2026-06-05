import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";
import { listDeliveryAreas, listMenuItems, listOrders, listReviews } from "@/lib/store";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage Zaiqa Junction menu items, orders, reviews, delivery zones, and sales analytics."
};

export default async function AdminPage() {
  const [menuItems, orders, reviews, deliveryAreas] = await Promise.all([
    listMenuItems(),
    listOrders(),
    listReviews(),
    listDeliveryAreas()
  ]);

  return (
    <>
      <section className="bg-charcoal text-white">
        <div className="container-pad py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Admin dashboard</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">Operate the direct-order channel.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base">
            Manage menu items, order statuses, reviews, delivery zones, and sales analytics from one responsive admin
            surface.
          </p>
        </div>
      </section>
      <section className="bg-cream py-12 sm:py-16">
        <div className="container-pad">
          <AdminDashboard
            initialMenuItems={menuItems}
            initialOrders={orders}
            initialReviews={reviews}
            initialDeliveryAreas={deliveryAreas}
          />
        </div>
      </section>
    </>
  );
}
