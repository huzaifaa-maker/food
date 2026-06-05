"use client";

import { FormEvent, useState } from "react";
import { Send, Star } from "lucide-react";

export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);

    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? "Website customer"),
        quote: String(form.get("quote") ?? ""),
        rating,
        source: "Website",
        approved: false
      })
    });

    setLoading(false);
    setSent(true);
    event.currentTarget.reset();
  }

  if (sent) {
    return (
      <div className="surface p-6 text-center">
        <p className="font-display text-2xl font-bold text-charcoal">Review received</p>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Thank you. The review will appear after admin approval.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submitReview} className="surface grid gap-4 p-5">
      <div>
        <p className="text-sm font-black text-charcoal">Rating</p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1} stars`}
              onClick={() => setRating(index + 1)}
              className="grid h-10 w-10 place-items-center rounded-md bg-cream text-saffron"
            >
              <Star size={20} fill={index < rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>
      <label className="grid gap-2 text-sm font-bold text-charcoal">
        Name
        <input required name="name" className={inputClass} placeholder="Your name" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-charcoal">
        Review
        <textarea required name="quote" rows={4} className={inputClass} placeholder="Tell us what you ordered..." />
      </label>
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Sending..." : "Submit Review"}
        <Send size={18} />
      </button>
    </form>
  );
}

const inputClass =
  "min-h-12 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-charcoal outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/20";
