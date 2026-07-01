"use client";

import { FormEvent, useId, useState } from "react";
import { CheckCircle2, Send, Star } from "lucide-react";

export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  const nameId = useId();
  const quoteId = useId();
  const ratingGroupId = useId();

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);

    // Honeypot: if filled, silently drop
    if (form.get("website")) {
      setLoading(false);
      setSent(true);
      return;
    }

    const name = String(form.get("name") ?? "Website customer");

    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
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
        <CheckCircle2 size={40} className="mx-auto text-coriander" />
        <p className="mt-3 font-display text-2xl font-bold text-charcoal">Review received</p>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Thank you! Your review has been submitted and is awaiting approval.
        </p>
      </div>
    );
  }

  const displayRating = hovered || rating;

  return (
    <form onSubmit={submitReview} className="surface grid gap-4 p-5" noValidate>
      {/* Accessible star rating */}
      <fieldset>
        <legend className="text-sm font-black text-charcoal">
          Rating <span className="text-chilli" aria-hidden="true">*</span>
        </legend>
        <div
          id={ratingGroupId}
          role="radiogroup"
          aria-label="Star rating"
          className="mt-2 flex gap-1"
          onMouseLeave={() => setHovered(0)}
        >
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            return (
              <label
                key={index}
                className="relative cursor-pointer"
                onMouseEnter={() => setHovered(value)}
              >
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  className="sr-only"
                  aria-label={`${value} out of 5 stars`}
                />
                <span
                  className="grid h-10 w-10 place-items-center rounded-md bg-cream text-saffron transition"
                  aria-hidden="true"
                >
                  <Star size={20} fill={index < displayRating ? "currentColor" : "none"} />
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-stone-500" aria-live="polite">
          {displayRating} out of 5 stars selected
        </p>
      </fieldset>

      {/* Honeypot — hidden from real users, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-field">Website</label>
        <input id="website-field" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label htmlFor={nameId} className="text-sm font-bold text-charcoal">
          Name <span className="text-chilli" aria-hidden="true">*</span>
        </label>
        <input
          id={nameId}
          required
          aria-required="true"
          name="name"
          className={inputClass}
          placeholder="Your name"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor={quoteId} className="flex items-center justify-between text-sm font-bold text-charcoal">
          Review <span className="text-chilli" aria-hidden="true">*</span>
          <span className={`text-xs font-normal ${charCount > MAX_CHARS * 0.9 ? "text-chilli" : "text-stone-500"}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </label>
        <textarea
          id={quoteId}
          required
          aria-required="true"
          name="quote"
          rows={4}
          maxLength={MAX_CHARS}
          className={inputClass}
          placeholder="Tell us what you ordered..."
          onChange={(e) => setCharCount(e.target.value.length)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Sending..." : "Submit Review"}
        <Send size={18} />
      </button>
    </form>
  );
}

const inputClass =
  "min-h-12 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-charcoal outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/20";
