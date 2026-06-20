import { Clock, MessageCircle, ShoppingBag, Truck } from "lucide-react";

const items = [
  { title: "Direct orders", text: "Lower fees, faster repeat ordering", icon: ShoppingBag },
  { title: "6 PM – 1 AM", text: "Evening and late-night delivery", icon: Clock },
  { title: "WhatsApp confirm", text: "Instant order proof on your phone", icon: MessageCircle },
  { title: "Local delivery", text: "Delivery and pickup options", icon: Truck }
] as const;

export function TrustBar() {
  return (
    <section className="bg-charcoal py-6 text-white">
      <div className="container-pad grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ title, text, icon: Icon }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.08] p-4"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-ember">
              <Icon size={20} />
            </span>
            <span>
              <span className="block font-black">{title}</span>
              <span className="mt-1 block text-sm text-orange-100">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
