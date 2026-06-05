"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardList, ChefHat, MessageSquare, Truck } from "lucide-react";

type DeliveryTrackerProps = {
  status: "pending" | "preparing" | "delivered" | string;
};

export function DeliveryTracker3D({ status }: DeliveryTrackerProps) {
  const [progress, setProgress] = useState(0.15); // fraction of road (0.0 to 1.0)
  const [smokeCount, setSmokeCount] = useState(0);
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; left: number; bottom: number }[]>([]);

  // Map the status string to a progress percentage along the 3D track
  useEffect(() => {
    let target = 0.15;
    if (status === "pending") {
      target = 0.15;
    } else if (status === "preparing") {
      target = 0.55;
    } else if (status === "delivered") {
      target = 0.90;
    }
    setProgress(target);
  }, [status]);

  // Generate exhaust smoke particles periodically to make the 3D bike feel "alive"
  useEffect(() => {
    if (status === "delivered") {
      setSmokeParticles([]);
      return;
    }

    const interval = setInterval(() => {
      setSmokeCount((prev) => prev + 1);
      const newParticle = {
        id: smokeCount,
        // Calculate exhaust pipe position in 3D relative to bike progress
        left: 10 + progress * 80 + (Math.random() * 2 - 1),
        bottom: 25 + (Math.random() * 2 - 1)
      };

      setSmokeParticles((prev) => [...prev.slice(-6), newParticle]); // keep max 6 particles
    }, 450);

    return () => clearInterval(interval);
  }, [progress, status, smokeCount]);

  // Steps configuration
  const steps = [
    { label: "Placed", desc: "Order received", icon: ClipboardList, active: true },
    { label: "Confirm", desc: "WhatsApp accept", icon: MessageSquare, active: status !== "placed" },
    { label: "Cooking", desc: "Freshly prep", icon: ChefHat, active: status === "preparing" || status === "delivered" },
    { label: "Arrived", desc: "Delivered", icon: Truck, active: status === "delivered" }
  ];

  // Map progress to absolute X/Y coordinates on our 3D isometric road
  // The road goes from left (x=10%, y=30%) to right (x=90%, y=60%)
  const bikeX = 10 + progress * 80;
  // Make the road curve slightly or go diagonally
  const bikeY = 30 + progress * 30;

  return (
    <div className="surface mt-8 overflow-hidden bg-gradient-to-br from-charcoal to-neutral-900 p-6 text-white shadow-glow">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">3D Real-time Status</p>
        <h2 className="font-display text-2xl font-bold">Direct Order Tracker</h2>
      </div>

      {/* 3D Isometric View Container */}
      <div className="relative mt-6 flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-lg bg-black/40 border border-white/5 py-4">
        {/* Decorative Grid Lines to emphasize 3D perspective */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none tracker-grid" />

        {/* 3D Scene Wrapper */}
        <div className="relative z-10 w-full max-w-[520px] aspect-[16/9] transform-3d-scene">
          {/* Isometric Road */}
          <div className="absolute left-[10%] bottom-[30%] right-[10%] h-12 bg-zinc-800 border-y-4 border-zinc-700 shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform-road">
            {/* Centerline */}
            <div className="absolute inset-x-0 top-[22px] h-1 border-t-2 border-dashed border-saffron opacity-80" />
          </div>

          {/* Road Nodes / Milestones */}
          {[0, 1, 2, 3].map((idx) => {
            const nodeX = 10 + idx * 26.6;
            const nodeY = 30 + idx * 10;
            const step = steps[idx];
            const isCompleted = idx < (status === "pending" ? 1 : status === "preparing" ? 3 : 4);
            const isCurrent = idx === (status === "pending" ? 0 : status === "preparing" ? 2 : 3);

            return (
              <div
                key={idx}
                style={{
                  left: `${nodeX}%`,
                  bottom: `${nodeY}%`
                }}
                className="absolute z-20 -translate-x-1/2 translate-y-1/2 transform-node"
              >
                {/* 3D Cylinder / Glowing Pin */}
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 shadow-md ${
                  isCurrent
                    ? "bg-ember border-saffron animate-bounce scale-110 shadow-ember/50"
                    : isCompleted
                    ? "bg-coriander border-white"
                    : "bg-zinc-800 border-zinc-600"
                }`}>
                  {isCompleted && !isCurrent ? (
                    <Check size={14} className="text-white" />
                  ) : (
                    <step.icon size={14} className="text-white" />
                  )}

                  {/* Pulsing ring for current step */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full border border-saffron animate-ping opacity-75" />
                  )}
                </div>

                {/* Node Label Card (projected vertically) */}
                <div className="absolute left-1/2 top-10 -translate-x-1/2 rounded bg-neutral-900/90 border border-white/10 px-2 py-1 text-center whitespace-nowrap text-[10px] shadow-lg transform-billboard">
                  <p className="font-extrabold text-white">{step.label}</p>
                  <p className="text-[8px] text-orange-200">{step.desc}</p>
                </div>
              </div>
            );
          })}

          {/* Animated Smoke Particles */}
          {smokeParticles.map((p) => (
            <span
              key={p.id}
              style={{
                left: `${p.left}%`,
                bottom: `${p.bottom}%`
              }}
              className="absolute z-10 h-3 w-3 rounded-full bg-white/30 blur-[1px] animate-smoke"
            />
          ))}

          {/* 3D Delivery Bike */}
          {status !== "delivered" && (
            <div
              style={{
                left: `${bikeX}%`,
                bottom: `${bikeY}%`
              }}
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-[800ms] cubic-bezier(0.25, 0.8, 0.25, 1) transform-bike"
            >
              {/* Bike 3D Model built in CSS */}
              <div className="relative h-14 w-20 transform-style-3d animate-bike-vibe">
                {/* Back Wheel */}
                <div className="absolute left-2 bottom-1 h-6 w-6 rounded-full border-[3px] border-zinc-700 bg-neutral-900 shadow-sm animate-spin-wheel" />

                {/* Front Wheel */}
                <div className="absolute right-2 bottom-1 h-6 w-6 rounded-full border-[3px] border-zinc-700 bg-neutral-900 shadow-sm animate-spin-wheel" />

                {/* Red Frame / Chassis */}
                <div className="absolute left-6 bottom-4 h-5 w-10 bg-ember rounded-sm transform-skew" />

                {/* Delivery Box (Zaiqa brand) */}
                <div className="absolute left-2 bottom-6 h-8 w-8 rounded-sm bg-neutral-800 border border-white/10 shadow-lg flex items-center justify-center">
                  <span className="text-[7px] font-black tracking-widest text-saffron rotate-[-4deg]">ZAIQA</span>
                </div>

                {/* Engine area details */}
                <div className="absolute left-10 bottom-3 h-4 w-5 bg-zinc-500 rounded-full opacity-90" />

                {/* Handlebars */}
                <div className="absolute right-4 bottom-8 h-6 w-1 bg-zinc-400 rotate-[20deg]" />
                <div className="absolute right-3 bottom-13 h-1 w-4 bg-neutral-800" />

                {/* Seat */}
                <div className="absolute left-9 bottom-7 h-2 w-5 bg-neutral-950 rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step description text cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {steps.map((step, idx) => {
          const isCompleted = idx < (status === "pending" ? 1 : status === "preparing" ? 3 : 4);
          const isCurrent = idx === (status === "pending" ? 0 : status === "preparing" ? 2 : 3);
          return (
            <div
              key={idx}
              className={`rounded-lg border p-3 text-center transition-all ${
                isCurrent
                  ? "border-ember bg-white/10 text-white font-extrabold"
                  : isCompleted
                  ? "border-white/20 bg-white/5 text-orange-100"
                  : "border-white/5 bg-transparent text-neutral-500"
              }`}
            >
              <div className="flex justify-center mb-1">
                <step.icon size={16} className={isCurrent ? "text-ember" : isCompleted ? "text-coriander" : "text-neutral-500"} />
              </div>
              <p className="text-xs font-black">{step.label}</p>
              <p className="text-[10px] opacity-80">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
