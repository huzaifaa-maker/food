import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";
import { business, chef } from "@/lib/config";
import { buildWhatsAppUrl, whatsappOrderMessage } from "@/lib/format";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-orange-50">
      <div className="container-pad grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-xl ring-1 ring-white/20">
              <Image src={business.logoThumb} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <p className="font-display text-xl font-bold text-white">{business.name}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-orange-100">Fresh homemade food, packed and delivered in Multan.</p>
          <p className="mt-2 text-xs text-orange-200">{chef.name} · {business.kitchenArea}</p>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-white">Quick links</p>
          <nav className="mt-3 grid gap-2 text-sm" aria-label="Quick links">
            <Link href="/menu" className="w-fit rounded-md px-1 py-1 hover:text-saffron focus-visible:text-saffron">
              Menu
            </Link>
            <Link href="/reviews" className="w-fit rounded-md px-1 py-1 hover:text-saffron focus-visible:text-saffron">
              Reviews
            </Link>
            <Link href="/contact" className="hover:text-saffron">
              Contact
            </Link>
            <Link href="/order" className="w-fit rounded-md px-1 py-1 hover:text-saffron focus-visible:text-saffron">
              Order now
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-white">Contact</p>
          <div className="mt-3 grid gap-2 text-sm">
            <a href={buildWhatsAppUrl(whatsappOrderMessage)} className="w-fit rounded-md px-1 py-1 hover:text-saffron focus-visible:text-saffron">
              WhatsApp · {business.phoneDisplay}
            </a>
            <a href={`mailto:${business.email}`} className="inline-flex w-fit items-center gap-1.5 rounded-md px-1 py-1 hover:text-saffron focus-visible:text-saffron">
              <Mail size={14} aria-hidden />
              {business.email}
            </a>
            <span>{business.hours}</span>
            <span>{business.streetAddress}</span>
            <span>Plus code: {business.kitchenArea}</span>
            <Link href="/contact" className="hover:text-saffron">
              Delivery areas
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-white">Social</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={buildWhatsAppUrl(whatsappOrderMessage)}
              aria-label="Contact us on WhatsApp"
              className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-coriander"
            >
              <MessageCircle size={18} aria-hidden="true" />
            </a>
            <a
              href={business.social.facebook}
              aria-label="Visit our Facebook page"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-ember"
            >
              <Facebook size={18} aria-hidden="true" />
            </a>
            <a
              href={business.social.instagram}
              aria-label="Visit our Instagram page"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-ember"
            >
              <Instagram size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-pad py-4 text-center text-xs text-orange-200">
          © {year} {business.name}. {chef.name} · Shah Rukn E Alam Town, Multan.
        </div>
      </div>
    </footer>
  );
}
