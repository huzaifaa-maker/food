import { NextResponse } from "next/server";
import { categories } from "@/lib/data";
import { createMenuItem, listMenuItems } from "@/lib/store";

export async function GET() {
  const items = await listMenuItems();
  return NextResponse.json({ categories, items });
}

export async function POST(request: Request) {
  const item = await request.json();
  const created = await createMenuItem(item);
  return NextResponse.json({ item: created }, { status: 201 });
}
