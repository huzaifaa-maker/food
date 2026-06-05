import { business } from "@/lib/config";
import type { CartLine, Order } from "@/lib/types";

export function formatCurrency(value: number) {
  return `${business.currency} ${Math.round(value).toLocaleString("en-PK")}`;
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${business.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

export function buildCartMessage(lines: CartLine[], total?: number) {
  const itemText = lines
    .map((line) => `${line.quantity}x ${line.name} (${formatCurrency(line.price * line.quantity)})`)
    .join("\n");
  const totalText = typeof total === "number" ? `\nTotal: ${formatCurrency(total)}` : "";

  return `Assalam o Alaikum Zaiqa Junction, I want to order:\n${itemText}${totalText}`;
}

export function buildOrderConfirmationMessage(order: Order) {
  const itemText = order.items
    .map((line) => `${line.quantity}x ${line.name} - ${formatCurrency(line.price * line.quantity)}`)
    .join("\n");

  return `Assalam o Alaikum Zaiqa Junction, please confirm my website order ${order.id}.\n\n${itemText}\n\nDelivery: ${order.deliveryAreaName}\nAddress: ${order.address}\nPayment: ${order.paymentMethod.replaceAll("_", " ")}\nTotal: ${formatCurrency(order.total)}`;
}
