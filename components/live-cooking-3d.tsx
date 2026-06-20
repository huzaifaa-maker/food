"use client";

import { useEffect, useState } from "react";
import { Flame, Power, RotateCw, Volume2 } from "lucide-react";

type CookState = "off" | "low" | "high";

export function LiveCooking3D() {
  const [heat, setHeat] = useState<CookState>("off");
  const [steam, setSteam] = useState<{ id: number; left: number; delay: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; left: number; bottom: number; size: number }[]>([]);
  const [ingredientCount, setIngredientCount] = useState(0);

  // Handle steam and sparks intervals based on heat settings
  useEffect(() => {
    if (heat === "off") {
      setSteam([]);
      setSparkles([]);
      return;
    }

    const intervalTime = heat === "low" ? 400 : 180;
    const generator = setInterval(() => {
      setIngredientCount((prev) => prev + 1);

      // Generate a rising steam bubble
      const newSteam = {
        id: ingredientCount,
        left: 25 + Math.random() * 50, // center 50%
        delay: Math.random() * 0.5
      };

      // Generate a rising fire spark underneath the pot
      const newSparkle = {
        id: ingredientCount + 1000,
        left: 20 + Math.random() * 60,
        bottom: 12 + Math.random() * 8,
        size: 4 + Math.random() * 6
      };

      setSteam((prev) => [...prev.slice(-10), newSteam]); // keep last 10
      setSparkles((prev) => [...prev.slice(-15), newSparkle]); // keep last 15
    }, intervalTime);

    return () => clearInterval(generator);
  }, [heat, ingredientCount]);

  function cycleHeat() {
    if (heat === "off") setHeat("low");
    else if (heat === "low") setHeat("high");
    else setHeat("off");
  }

  // Define ingredients to toss inside the handi pot
  // They bounce using CSS keyframe animations
  const ingredients = [
    { name: "Chicken Chunk", color: "bg-amber-700 border-amber-900", size: "w-6 h-6", anim: "animate-toss-1" },
    { name: "Chili Pod", color: "bg-red-600 border-red-800 rounded-full", size: "w-3 h-7", anim: "animate-toss-2" },
    { name: "Cardamom Pod", color: "bg-lime-600 border-lime-800 rounded-full", size: "w-4 h-5", anim: "animate-toss-3" },
    { name: "Ginger Strip", color: "bg-yellow-200 border-yellow-400", size: "w-2 h-8", anim: "animate-toss-4" },
    { name: "Cream Swirl", color: "bg-amber-100 border-white rounded-full", size: "w-5 h-5", anim: "animate-toss-5" }
  ];

  return (
    <section className="relative my-14 overflow-hidden rounded-xl border border-stone-800 bg-charcoal p-6 text-white shadow-glow sm:p-10">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none tracker-grid" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ember/25 px-3 py-1 text-xs font-black uppercase tracking-widest text-saffron">
            <Flame size={14} className="animate-pulse" /> Live Clay-Pot Kitchen
          </span>
          <h2 className="mt-4 font-display text-4xl font-black sm:text-5xl leading-tight">
            See the fresh, slow-cooked difference.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-orange-50">
            Unlike fast-food assembly lines, our signature Shahi Handi is cooked fresh on demand in authentic clay handis. 
            Use the interactive stove dial to fire up the stove and watch the ingredients sizzle and cook in 3D!
          </p>

          {/* Interactive Stove Controls */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={cycleHeat}
              className={`inline-flex min-h-12 items-center gap-2 rounded-md px-5 py-3 text-sm font-black transition-all ${
                heat === "high"
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/35"
                  : heat === "low"
                  ? "bg-ember hover:bg-chilli text-white shadow-lg shadow-ember/35"
                  : "bg-zinc-800 hover:bg-zinc-700 text-stone-300"
              }`}
            >
              <Power size={18} />
              Stove: {heat.toUpperCase()}
            </button>

            {/* Stove Dial Knob */}
            <div className="flex items-center gap-3">
              <button
                aria-label="Rotate dial"
                onClick={cycleHeat}
                className="relative h-14 w-14 rounded-full border-2 border-stone-700 bg-neutral-900 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                <div
                  className="absolute h-8 w-1.5 bg-saffron rounded-full top-1 transition-transform duration-300 origin-bottom"
                  style={{
                    transform: `rotate(${heat === "off" ? "0deg" : heat === "low" ? "120deg" : "240deg"}) translate(0, -6px)`
                  }}
                />
                <RotateCw size={14} className="text-stone-500 opacity-60" />
              </button>
              <div className="text-xs">
                <span className="block font-black text-white">Stove Dial</span>
                <span className="text-orange-200">Click to rotate knob</span>
              </div>
            </div>
          </div>

          {/* Sizzling Sound Indicator */}
          {heat !== "off" && (
            <div className="mt-5 flex items-center gap-2 text-xs text-saffron">
              <Volume2 size={16} className="animate-bounce" />
              <span>Sizzling at {heat === "high" ? "high fire (shahi style)" : "slow flame (dum handi)"}...</span>
              {/* Visual Audio Wave */}
              <div className="flex items-end gap-0.5 h-3 ml-2">
                {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => (
                  <span
                    key={idx}
                    style={{
                      height: `${val * (heat === "high" ? 100 : 50)}%`,
                      animationDelay: `${idx * 0.1}s`
                    }}
                    className="w-0.5 bg-saffron animate-audio-wave rounded-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3D Cooking Stage Canvas */}
        <div className="relative flex h-[350px] w-full items-center justify-center rounded-xl bg-black/40 border border-white/5 shadow-inner overflow-hidden">
          {/* Flame Glow Backdrop */}
          <div
            className={`absolute bottom-6 z-0 h-40 w-40 rounded-full blur-[35px] transition-all duration-500 ${
              heat === "high"
                ? "bg-red-600/50 scale-125"
                : heat === "low"
                ? "bg-amber-600/35 scale-100"
                : "bg-transparent scale-0"
            }`}
          />

          {/* 3D Scene */}
          <div className="relative h-64 w-64 transform-3d-scene">
            {/* Stove Burner Grate */}
            <div className="absolute inset-x-4 bottom-[20%] h-4 rounded-full bg-zinc-800 border-t-2 border-zinc-700 shadow-md transform-road" />

            {/* Fire Sparks particles underneath */}
            {sparkles.map((s) => (
              <span
                key={s.id}
                style={{
                  left: `${s.left}%`,
                  bottom: `${s.bottom}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  animation: `smoke-float 1s ease-out forwards`
                }}
                className="absolute z-10 rounded-full bg-gradient-to-t from-red-500 to-yellow-400 opacity-90 animate-flame-spark"
              />
            ))}

            {/* Steam Trails rising from pot */}
            {steam.map((st) => (
              <span
                key={st.id}
                style={{
                  left: `${st.left}%`,
                  bottom: "45%",
                  animation: `smoke-float ${heat === "high" ? 1.4 : 2}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                  animationDelay: `${st.delay}s`
                }}
                className="absolute z-30 h-6 w-6 rounded-full bg-white/20 blur-[2.5px]"
              />
            ))}

            {/* Bouncing Cooking Ingredients (tossing in 3D) */}
            {heat !== "off" && (
              <div className="absolute inset-x-8 bottom-[35%] h-24 z-20 transform-style-3d pointer-events-none">
                {ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className={`absolute rounded-md border shadow-md flex items-center justify-center p-1 font-bold text-[8px] text-white select-none ${ing.color} ${ing.size} ${ing.anim}`}
                    style={{
                      left: `${15 + idx * 18}%`,
                      // Fast vibration/toss for high heat, steady toss for low heat
                      animationDuration: heat === "high" ? "1.1s" : "2s",
                      animationDelay: `${idx * 0.25}s`
                    }}
                  >
                    <span className="scale-75 text-center leading-none">{ing.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 3D Clay Pot (Shahi Handi) */}
            <div
              className={`absolute left-1/2 bottom-[24%] h-32 w-36 -translate-x-1/2 transform-style-3d z-10 ${
                heat === "high" ? "animate-pot-vibe-fast" : heat === "low" ? "animate-pot-vibe-slow" : ""
              }`}
            >
              {/* Handi Pot Lid / Opening */}
              <div className="absolute inset-x-4 top-0 h-6 rounded-full bg-amber-800 border-2 border-amber-900 shadow-md z-20 transform-road flex items-center justify-center overflow-hidden">
                {/* Steaming liquid inside */}
                <div
                  className={`h-full w-full bg-gradient-to-b from-amber-600 to-amber-950 transition-all ${
                    heat !== "off" ? "animate-pulse" : ""
                  }`}
                />
              </div>

              {/* Clay Pot Bulky Body */}
              <div className="absolute inset-x-0 top-3 bottom-0 rounded-b-[40%] rounded-t-[15px] bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-x-4 border-amber-900 shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-10" />

              {/* Handi Clay handles */}
              <div className="absolute -left-2 top-8 h-4 w-4 rounded-full bg-amber-800 border border-amber-950 z-0" />
              <div className="absolute -right-2 top-8 h-4 w-4 rounded-full bg-amber-800 border border-amber-950 z-0" />

              {/* Glaze texture overlay */}
              <div className="absolute left-6 top-8 h-12 w-20 bg-white/10 rounded-full blur-[2px] z-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
