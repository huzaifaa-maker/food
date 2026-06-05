import { NextResponse } from "next/server";
import { createDeliveryArea, listDeliveryAreas } from "@/lib/store";

export async function GET() {
  const deliveryAreas = await listDeliveryAreas();
  return NextResponse.json({ deliveryAreas });
}

export async function POST(request: Request) {
  const area = await request.json();
  const created = await createDeliveryArea(area);
  return NextResponse.json({ deliveryArea: created }, { status: 201 });
}
