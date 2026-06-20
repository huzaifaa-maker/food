"use client";

import { useEffect, useState } from "react";

export function ExplodedBurger3D() {
  const [isOpened, setIsOpened] = useState(false);

  // Auto-loop opening and closing every 3.5 seconds if the user is not hovering
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpened((prev) => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative flex h-[350px] w-[350px] items-center justify-center cursor-pointer select-none"
      onMouseEnter={() => setIsOpened(true)}
      onMouseLeave={() => setIsOpened(false)}
      aria-label="3D Animated Exploded Burger - Hover to Open!"
    >
      {/* 3D Scene Container */}
      <div 
        className="relative h-64 w-64 transform-style-3d transition-transform duration-700"
        style={{
          transform: `perspective(1000px) rotateX(55deg) rotateY(0deg) rotateZ(${isOpened ? "-20deg" : "-35deg"})`,
        }}
      >
        {/* Layer 1: Top Bun (Highest) */}
        <div
          className="absolute inset-0 flex items-center justify-center transform-style-3d transition-all duration-700 ease-out"
          style={{
            transform: `translateZ(${isOpened ? "110px" : "32px"})`,
          }}
        >
          <div className="relative h-44 w-44 rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 border-b-8 border-amber-800 shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
            {/* Sesame Seeds */}
            {[
              { t: "20%", l: "35%", r: "10deg" },
              { t: "25%", l: "55%", r: "-15deg" },
              { t: "35%", l: "25%", r: "45deg" },
              { t: "40%", l: "45%", r: "-5deg" },
              { t: "45%", l: "70%", r: "30deg" },
              { t: "60%", l: "30%", r: "-20deg" },
              { t: "60%", l: "50%", r: "15deg" },
              { t: "70%", l: "40%", r: "40deg" },
              { t: "30%", l: "65%", r: "-35deg" },
              { t: "50%", l: "20%", r: "10deg" },
            ].map((seed, i) => (
              <span
                key={i}
                style={{
                  top: seed.t,
                  left: seed.l,
                  transform: `rotate(${seed.r})`,
                }}
                className="absolute h-2 w-1 rounded-full bg-amber-100 opacity-90 shadow-sm"
              />
            ))}
            {/* Bun Glaze highlight */}
            <div className="absolute top-2 left-6 h-10 w-24 rounded-full bg-white/20 blur-[2px]" />
          </div>
        </div>

          {/* Layer 1.5: Sauce Drips (Only visible or prominent when exploded) */}
          <div
            className="absolute inset-0 flex items-center justify-center transform-style-3d transition-all duration-700 ease-out"
            style={{
              transform: `translateZ(${isOpened ? "85px" : "24px"})`,
              opacity: isOpened ? 1 : 0,
            }}
          >
            <div className="h-36 w-36 rounded-full border-[8px] border-amber-50/10 bg-red-600/80 blur-[1px] shadow-md flex items-center justify-center">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Spicy Mayo</span>
            </div>
          </div>

        {/* Layer 2: Onion Rings & Tomatoes */}
        <div
          className="absolute inset-0 flex items-center justify-center transform-style-3d transition-all duration-700 ease-out"
          style={{
            transform: `translateZ(${isOpened ? "65px" : "16px"})`,
          }}
        >
          <div className="relative h-40 w-40 transform-style-3d">
            {/* Onion Ring 1 */}
            <div className="absolute left-1 top-2 h-24 w-24 rounded-full border-[6px] border-pink-400/90 bg-purple-100/35 shadow-md transform-style-3d" />
            {/* Onion Ring 2 */}
            <div className="absolute right-2 bottom-2 h-20 w-20 rounded-full border-[5px] border-pink-400/90 bg-purple-100/35 shadow-md transform-style-3d" />
            {/* Tomato Slice */}
            <div className="absolute right-3 top-4 h-24 w-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-4 border-red-800 shadow-md transform-style-3d flex items-center justify-center">
              <div className="h-14 w-14 rounded-full border border-dashed border-red-300/30" />
            </div>
          </div>
        </div>

        {/* Layer 3: Melting Cheese */}
        <div
          className="absolute inset-0 flex items-center justify-center transform-style-3d transition-all duration-700 ease-out"
          style={{
            transform: `translateZ(${isOpened ? "40px" : "8px"})`,
          }}
        >
          <div className="h-40 w-40 rounded-lg bg-gradient-to-br from-yellow-300 to-amber-400 shadow-[0_8px_16px_rgba(0,0,0,0.2)] rotate-12 relative">
            {/* Dripping corners */}
            <div className="absolute -left-2 top-10 h-10 w-6 bg-yellow-400 rounded-b-full shadow-md" />
            <div className="absolute -bottom-2 left-12 h-8 w-6 bg-yellow-400 rounded-b-full shadow-md" />
            <div className="absolute -right-1 top-16 h-8 w-4 bg-yellow-500 rounded-b-full shadow-md" />
          </div>
        </div>

        {/* Layer 4: Crispy Zinger Patty (Center Anchor) */}
        <div
          className="absolute inset-0 flex items-center justify-center transform-style-3d transition-all duration-700 ease-out"
          style={{
            transform: `translateZ(${isOpened ? "10px" : "0px"})`,
          }}
        >
          <div className="relative h-44 w-44 rounded-full bg-gradient-to-b from-amber-800 via-amber-900 to-yellow-950 border-4 border-amber-950 shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex items-center justify-center">
            {/* Flaky Crunch Texture overlays */}
            <div className="absolute inset-2 rounded-full border-4 border-dashed border-amber-700/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-black/10 blur-[1px]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-saffron opacity-80">CRISPY PATTY</span>
          </div>
        </div>

        {/* Layer 5: Fresh Lettuce */}
        <div
          className="absolute inset-0 flex items-center justify-center transform-style-3d transition-all duration-700 ease-out"
          style={{
            transform: `translateZ(${isOpened ? "-25px" : "-10px"})`,
          }}
        >
          {/* A wavy organic shape made of stacked green circles */}
          <div className="relative h-44 w-44 transform-style-3d">
            <div className="absolute inset-1 rounded-full bg-gradient-to-b from-emerald-500 to-green-700 border-2 border-emerald-800 shadow-md" />
            <div className="absolute -left-2 top-4 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 border border-green-800 shadow-sm" />
            <div className="absolute -right-3 bottom-6 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 border border-green-800 shadow-sm" />
            <div className="absolute -bottom-2 left-6 h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 border border-green-800 shadow-sm" />
            {/* Rib lines */}
            <div className="absolute inset-6 rounded-full border border-green-300/25" />
          </div>
        </div>

        {/* Layer 6: Bottom Bun (Lowest) */}
        <div
          className="absolute inset-0 flex items-center justify-center transform-style-3d transition-all duration-700 ease-out"
          style={{
            transform: `translateZ(${isOpened ? "-65px" : "-20px"})`,
          }}
        >
          <div className="h-44 w-44 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 border-t-[6px] border-amber-500 border-b-[10px] border-amber-900 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center">
            <span className="text-[9px] font-black text-amber-950/60 tracking-wider">TOASTED</span>
          </div>
        </div>
      </div>

      {/* Floating 3D Badge showing state */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ember px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-transform duration-300 hover:scale-105"
        style={{ transform: `translateY(${isOpened ? "-10px" : "0px"})` }}
      >
        {isOpened ? "Exploded View" : "3D Zinger Burger"}
      </div>
    </div>
  );
}
