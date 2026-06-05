"use client";

import { useEffect, useState } from "react";

type ParticleType = "chili" | "mint" | "cardamom" | "star-anise" | "onion-ring";

type Particle = {
  id: number;
  type: ParticleType;
  x: number; // percentage width
  y: number; // percentage height
  size: number; // in pixels
  parallaxSpeed: number; // scroll factor
  rotationDirection: number; // 1 or -1
  rotationOffset: number; // initial degrees
  floatDelay: string; // CSS animation delay
  floatDuration: string; // CSS animation duration
};

export function FloatingParticles3D() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate 12 floating particles across the vertical height of the site
    const types: ParticleType[] = ["chili", "mint", "cardamom", "star-anise", "onion-ring"];
    const generated: Particle[] = Array.from({ length: 12 }, (_, index) => {
      const type = types[index % types.length];
      return {
        id: index,
        type,
        // Distribute nicely along the height of the document page
        x: 5 + Math.random() * 90, // 5% to 95%
        y: 8 + (index * 80) / 12 + Math.random() * 8, // staggered down the page
        size: 30 + Math.random() * 35, // 30px to 65px
        parallaxSpeed: 0.15 + Math.random() * 0.25, // parallax movement factor
        rotationDirection: Math.random() > 0.5 ? 1 : -1,
        rotationOffset: Math.random() * 360,
        floatDelay: `${(Math.random() * 3).toFixed(1)}s`,
        floatDuration: `${(12 + Math.random() * 10).toFixed(1)}s`
      };
    });
    setParticles(generated);

    // Passive scroll listener
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Passive mouse listener
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 40; // max shift 20px
      const y = (event.clientY / window.innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const renderSvgContent = (type: ParticleType) => {
    switch (type) {
      case "chili":
        // A stylized red hot chili pepper with a 3D shading feel
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-3d-red">
            <defs>
              <linearGradient id="chiliGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="60%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
              <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            {/* Pepper Body */}
            <path
              d="M75,20 C65,18 45,28 35,42 C25,56 20,72 25,82 C27,85 30,85 32,82 C42,70 58,60 68,52 C78,44 85,34 85,26 C85,22 80,21 75,20 Z"
              fill="url(#chiliGrad)"
            />
            {/* Pepper Highlight */}
            <path
              d="M65,26 C58,28 45,38 38,48 C32,56 29,66 31,71 C30,70 30,62 36,53 C43,43 56,33 65,26 Z"
              fill="#FCA5A5"
              opacity="0.4"
            />
            {/* Green Stem */}
            <path
              d="M78,16 C76,19 72,21 68,22 C69,18 72,13 77,10 C78,9 80,11 79,13 C79,14 79,15 78,16 Z"
              fill="url(#stemGrad)"
            />
            <path
              d="M68,22 C64,23 58,20 56,18 C60,19 65,20 68,22 Z"
              fill="#065F46"
            />
          </svg>
        );

      case "mint":
        // A fresh green mint leaf with organic ribs and 3D volume
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-3d-green">
            <defs>
              <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>
            </defs>
            {/* Leaf Base */}
            <path
              d="M50,15 C20,35 15,65 50,85 C85,65 80,35 50,15 Z"
              fill="url(#mintGrad)"
            />
            {/* Center Rib */}
            <path
              d="M50,15 L50,85"
              stroke="#A7F3D0"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Leaf Ribs */}
            <path
              d="M50,30 Q35,35 25,40 M50,45 Q32,52 20,62 M50,60 Q38,68 30,76"
              stroke="#A7F3D0"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M50,30 Q65,35 75,40 M50,45 Q68,52 80,62 M50,60 Q62,68 70,76"
              stroke="#A7F3D0"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
        );

      case "cardamom":
        // Green cardamom pod, ribbed shell with a 3D warm-green hue
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-3d-gold">
            <defs>
              <linearGradient id="cardamomGrad" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="50%" stopColor="#84CC16" />
                <stop offset="100%" stopColor="#4F7A04" />
              </linearGradient>
            </defs>
            {/* Cardamom pod body (oval with pointed ends) */}
            <path
              d="M50,10 C32,25 28,60 50,90 C72,60 68,25 50,10 Z"
              fill="url(#cardamomGrad)"
            />
            {/* Pod shell texture/stripes */}
            <path
              d="M50,10 C42,30 40,58 50,90"
              stroke="#CCFBF1"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M50,10 C58,30 60,58 50,90"
              stroke="#CCFBF1"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M50,10 C35,28 32,58 50,90"
              stroke="#D9F99D"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M50,10 C65,28 68,58 50,90"
              stroke="#D9F99D"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Tiny dark tip */}
            <path
              d="M49,8 C49.5,6 50.5,6 51,8 L50,11 Z"
              fill="#3F6212"
            />
          </svg>
        );

      case "star-anise":
        // Star Anise (brown 8-pointed star) with dimensional petals
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-3d-brown">
            <defs>
              <linearGradient id="aniseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>
            {/* Center seed hub */}
            <circle cx="50" cy="50" r="8" fill="#451A03" />
            {/* 8 Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 50 50)`}>
                {/* Petal base shape */}
                <path
                  d="M50,50 L44,22 C44,22 47,14 50,14 C53,14 56,22 56,22 Z"
                  fill="url(#aniseGrad)"
                />
                {/* Petal center seam / highlight */}
                <path
                  d="M50,50 L50,16"
                  stroke="#F59E0B"
                  strokeWidth="1"
                  opacity="0.35"
                />
                {/* Little seed inside petal */}
                <ellipse cx="50" cy="28" rx="2" ry="4" fill="#F59E0B" opacity="0.6" />
              </g>
            ))}
          </svg>
        );

      case "onion-ring":
        // Translucent onion ring with 3D bevel shading
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-3d-pink">
            <defs>
              <linearGradient id="onionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="50%" stopColor="#DB2777" />
                <stop offset="100%" stopColor="#BE185D" />
              </linearGradient>
            </defs>
            {/* Outer ring */}
            <path
              d="M50,12 C29,12 12,29 12,50 C12,71 29,88 50,88 C71,88 88,71 88,50 C88,29 71,12 50,12 Z M50,22 C65.4,22 78,34.6 78,50 C78,65.4 65.4,78 50,78 C34.6,78 22,65.4 22,50 C22,34.6 34.6,22 50,22 Z"
              fill="url(#onionGrad)"
              fillRule="evenodd"
            />
            {/* Shine highlight ring */}
            <path
              d="M50,15 C30.7,15 15,30.7 15,50"
              stroke="#FCE7F3"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => {
        // Calculate vertical position including scroll-linked parallax offset
        const parallaxOffset = scrollY * p.parallaxSpeed;
        const transformStyle = {
          left: `${p.x}%`,
          top: `calc(${p.y}vh - ${parallaxOffset}px)`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          animation: `float-slow ${p.floatDuration} ease-in-out infinite`,
          animationDelay: p.floatDelay,
          // Apply cursor interactive drift + initial 3D rotation
          transform: `translate3d(${mousePos.x * p.parallaxSpeed}px, ${mousePos.y * p.parallaxSpeed}px, 0) rotateX(15deg) rotateY(${
            p.rotationOffset + scrollY * 0.05 * p.rotationDirection
          }deg) rotateZ(${scrollY * 0.03 * p.rotationDirection}deg)`,
          transition: "transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)",
          position: "absolute" as const,
          opacity: 0.16 // soft transparency so it doesn't distract from core content
        };

        return (
          <div key={p.id} style={transformStyle} className="floating-particle-item">
            {renderSvgContent(p.type)}
          </div>
        );
      })}
    </div>
  );
}
