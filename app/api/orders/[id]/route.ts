import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

const allowedStatuses: OrderStatus[] = [
  "whatsapp_pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "completed",
  "cancelled"
];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const status = body.status as OrderStatus;

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Unsupported order status." }, { status: 400 });
  }

  const order = await updateOrderStatus(id, status);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
