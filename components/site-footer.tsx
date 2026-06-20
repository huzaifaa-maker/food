import Link from "next/link";
import { Facebook, Instagram, MessageCircle, ShoppingBag } from "lucide-react";
import { business } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/format";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-orange-50">
      <div className="container-pad grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-white">{business.name}</p>
          <p className="mt-3 text-sm leading-6 text-orange-100">{business.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-white">Quick links</p>
          <nav className="mt-3 grid gap-2 text-sm">
            <a href="/#menu" className="hover:text-saffron">
              Menu
            </a>
            <a href="/#about" className="hover:text-saffron">
              About the chef
            </a>
            <a href="/#reviews" className="hover:text-saffron">
              Reviews
            </a>
            <a href="/#contact" className="hover:text-saffron">
              Contact
            </a>
            <Link href="/order" className="hover:text-saffron">
              Order now
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-white">Contact</p>
          <div className="mt-3 grid gap-2 text-sm">
            <a href={buildWhatsAppUrl(`Assalam o Alaikum ${business.name}, I want to order.`)}>
              {business.phoneDisplay}
            </a>
            <span>{business.hours}</span>
            <Link href="/contact" className="hover:text-saffron">
              Delivery areas
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-white">Social</p>
          <div className="mt-4 flex gap-2">
            <a
              href={buildWhatsAppUrl(`Assalam o Alaikum ${business.name}, I want to order.`)}
              aria-label="WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-coriander"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={business.social.facebook}
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-ember"
            >
              <Facebook size={18} />
            </a>
            <a
              href={business.social.instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-ember"
            >
              <Instagram size={18} />
            </a>
            <Link
              href="/order"
              aria-label="Order online"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-ember"
            >
              <ShoppingBag size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-pad py-4 text-center text-xs text-orange-200">
          © {year} {business.name}. Homemade food, delivered with care.
        </div>
      </div>
    </footer>
  );
}
