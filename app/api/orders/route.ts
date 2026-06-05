import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/store";
import type { OrderInput } from "@/lib/types";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const input = (await request.json()) as OrderInput;

  if (!input.customerName || !input.phone || !input.address || !input.items?.length) {
    return NextResponse.json({ error: "Missing customer, address, or cart details." }, { status: 400 });
  }

  const order = await createOrder(input);
  return NextResponse.json({ order }, { status: 201 });
}
