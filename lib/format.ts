import { business } from "@/lib/config";
import type { CartLine, Order } from "@/lib/types";

export function formatCurrency(value: number) {
  return `${business.currency} ${Math.round(value).toLocaleString("en-PK")}`;
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${business.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

/** Standard CTA: generic order intent from any button on the site */
export const whatsappOrderMessage = `Assalam o Alaikum ${business.name}, I'd like to place an order.`;

/** Help CTA: used on the /order page when user wants assistance */
export const whatsappHelpMessage = `Assalam o Alaikum ${business.name}, I need help placing an order.`;

function formatLineDetail(line: CartLine) {
  const total = formatCurrency(line.price * line.quantity);
  const addonText =
    line.addons.length > 0
      ? `\n   Add-ons: ${line.addons.map((addon) => addon.label).join(", ")}`
      : "";
  const commentText = line.comment ? `\n   Note: ${line.comment}` : "";
  return `${line.quantity}x ${line.name} (${total})${addonText}${commentText}`;
}

export function buildCartMessage(lines: CartLine[], total?: number) {
  const itemText = lines.map(formatLineDetail).join("\n\n");
  const totalText = typeof total === "number" ? `\n\nTotal: ${formatCurrency(total)}` : "";

  return `Assalam o Alaikum ${business.name}, I want to order:\n\n${itemText}${totalText}`;
}

export function buildOrderConfirmationMessage(order: Order) {
  const itemText = order.items.map(formatLineDetail).join("\n\n");

  return `Assalam o Alaikum ${business.name}, please confirm my website order ${order.id}.\n\n${itemText}\n\nDelivery: ${order.deliveryAreaName}\nAddress: ${order.address}\nPayment: ${order.paymentMethod.replaceAll("_", " ")}\nTotal: ${formatCurrency(order.total)}`;
}
