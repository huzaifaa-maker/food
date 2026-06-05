import { NextResponse } from "next/server";
import { createReview, listReviews } from "@/lib/store";

export async function GET() {
  const reviews = await listReviews();
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const review = await request.json();
  const created = await createReview(review);
  return NextResponse.json({ review: created }, { status: 201 });
}
