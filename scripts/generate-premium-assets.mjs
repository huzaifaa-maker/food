import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import Whammy from "whammy";

const root = process.cwd();
const publicDir = path.join(root, "public");
const videoDir = path.join(publicDir, "videos");
const heroImageDir = path.join(publicDir, "images");
const menuDir = path.join(publicDir, "images", "menu");

const width = 960;
const height = 540;
const fps = 18;
const seconds = 4;
const frameCount = fps * seconds;

await fs.mkdir(videoDir, { recursive: true });
await fs.mkdir(menuDir, { recursive: true });

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (value) => 1 - Math.pow(1 - clamp(value), 3);
const easeInOut = (value) => {
  const t = clamp(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const phase = (t, start, end) => easeInOut((t - start) / (end - start));

function ingredientFloat(t, index, x, y, kind) {
  const p = phase(t, 0.02 + index * 0.035, 0.52 + index * 0.025);
  const drift = Math.sin(t * Math.PI * 2 + index) * 16;
  const yy = y + (1 - p) * 190 - p * 24;
  const opacity = clamp(1 - phase(t, 0.42, 0.68)) * clamp(phase(t, 0.01, 0.16) + 0.3);
  const rotate = -24 + p * 48 + Math.sin(t * Math.PI * 3 + index) * 7;

  const common = `opacity="${opacity.toFixed(3)}" transform="translate(${x + drift} ${yy}) rotate(${rotate})"`;
  if (kind === "lettuce") {
    return `<path ${common} d="M-54 0 C-28 -26 0 18 30 -9 C48 -24 62 6 34 24 C8 42 -28 28 -50 36 C-70 42 -80 12 -54 0Z" fill="url(#lettuce)" filter="url(#softShadow)"/>`;
  }
  if (kind === "cheese") {
    return `<path ${common} d="M-48 -28 L48 -18 L35 38 L-38 30 Z" fill="url(#cheese)" filter="url(#softShadow)"/>`;
  }
  if (kind === "tomato") {
    return `<g ${common} filter="url(#softShadow)"><ellipse rx="48" ry="21" fill="url(#tomato)"/><ellipse rx="23" ry="8" fill="none" stroke="#ffb0a0" stroke-opacity=".42" stroke-width="3"/></g>`;
  }
  if (kind === "patty") {
    return `<g ${common} filter="url(#softShadow)"><ellipse rx="60" ry="25" fill="url(#patty)"/><path d="M-38 -1 C-18 -11 10 10 34 -7" fill="none" stroke="#7b3f20" stroke-width="5" stroke-linecap="round" opacity=".45"/></g>`;
  }
  return `<g ${common} filter="url(#softShadow)"><path d="M-55 0 C-18 -18 22 18 55 0" fill="none" stroke="#f2b26a" stroke-width="14" stroke-linecap="round"/><path d="M-34 8 C-10 0 12 16 36 8" fill="none" stroke="#ffefe0" stroke-width="9" stroke-linecap="round"/></g>`;
}

function layer({ id, t, start, end, y, fromY, opacityStart, fill, w, h, extra = "" }) {
  const p = phase(t, start, end);
  const yy = fromY + (y - fromY) * p;
  const opacity = clamp((t - opacityStart) / 0.08);
  const blur = (1 - p) * 2.5;
  return `<g opacity="${opacity.toFixed(3)}" transform="translate(480 ${yy.toFixed(1)}) scale(${(0.88 + p * 0.12).toFixed(3)})" filter="url(#liftShadow)">
    <ellipse rx="${w}" ry="${h}" fill="${fill}" filter="${blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : ""}"/>
    ${extra}
  </g>`;
}

function renderFrame(index) {
  const t = index / (frameCount - 1);
  const settle = phase(t, 0.74, 0.94);
  const open = 1 - settle;
  const topY = 206 - open * 118 + Math.sin(t * Math.PI * 2) * 3;
  const bottomY = 358 + (1 - phase(t, 0.12, 0.34)) * 72;
  const plateScale = 0.92 + settle * 0.06;
  const sceneLift = -12 * settle;

  const particles = Array.from({ length: 34 }, (_, i) => {
    const x = 65 + ((i * 71) % 835);
    const base = 80 + ((i * 43) % 390);
    const y = base - ((t * 75 + i * 9) % 180);
    const r = 1.2 + (i % 4) * 0.65;
    const opacity = 0.08 + (i % 5) * 0.026;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f6c179" opacity="${opacity}"/>`;
  }).join("");

  const steam = Array.from({ length: 7 }, (_, i) => {
    const p = (t * 1.25 + i * 0.16) % 1;
    const x = 396 + i * 28 + Math.sin(p * Math.PI * 2 + i) * 18;
    const y = 242 - p * 120;
    const opacity = clamp(Math.sin(p * Math.PI)) * 0.22 * settle;
    return `<path d="M${x} ${y + 70} C${x - 28} ${y + 38}, ${x + 30} ${y + 34}, ${x + 2} ${y}" fill="none" stroke="#f8f4ed" stroke-width="${7 - i * 0.35}" stroke-linecap="round" opacity="${opacity.toFixed(3)}" filter="url(#steamBlur)"/>`;
  }).join("");

  const sauce = phase(t, 0.48, 0.68);
  const glow = 0.18 + settle * 0.34;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="stage" cx="50%" cy="44%" r="72%">
      <stop offset="0%" stop-color="#3c2112"/>
      <stop offset="42%" stop-color="#171313"/>
      <stop offset="100%" stop-color="#070707"/>
    </radialGradient>
    <linearGradient id="bun" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#ffc36b"/>
      <stop offset="50%" stop-color="#c86a23"/>
      <stop offset="100%" stop-color="#6d3318"/>
    </linearGradient>
    <linearGradient id="bunBottom" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#d88a36"/>
      <stop offset="100%" stop-color="#7b3b19"/>
    </linearGradient>
    <linearGradient id="lettuce" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#83d960"/>
      <stop offset="100%" stop-color="#2d7a39"/>
    </linearGradient>
    <linearGradient id="cheese" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#ffe66d"/>
      <stop offset="100%" stop-color="#ff9f1a"/>
    </linearGradient>
    <radialGradient id="tomato" cx="45%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#ff9b81"/>
      <stop offset="100%" stop-color="#b91419"/>
    </radialGradient>
    <linearGradient id="patty" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#7a391f"/>
      <stop offset="42%" stop-color="#3a1f16"/>
      <stop offset="100%" stop-color="#120b08"/>
    </linearGradient>
    <filter id="softShadow" x="-30%" y="-60%" width="160%" height="220%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".34"/>
    </filter>
    <filter id="liftShadow" x="-35%" y="-70%" width="170%" height="240%">
      <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#000" flood-opacity=".5"/>
    </filter>
    <filter id="steamBlur"><feGaussianBlur stdDeviation="3.2"/></filter>
  </defs>
  <rect width="960" height="540" fill="url(#stage)"/>
  <rect width="960" height="540" fill="url(#stage)"/>
  <circle cx="505" cy="286" r="270" fill="#ff7a00" opacity="${glow.toFixed(3)}" filter="url(#steamBlur)"/>
  <path d="M0 0H960V540H0Z" fill="none" stroke="#ff7a00" stroke-width="1" opacity=".08"/>
  ${particles}
  <g opacity="${(1 - settle * 0.7).toFixed(3)}">
    ${ingredientFloat(t, 0, 256, 278, "lettuce")}
    ${ingredientFloat(t, 1, 675, 262, "tomato")}
    ${ingredientFloat(t, 2, 324, 356, "cheese")}
    ${ingredientFloat(t, 3, 634, 365, "patty")}
    ${ingredientFloat(t, 4, 500, 180, "sauce")}
  </g>
  <g transform="translate(0 ${sceneLift.toFixed(1)}) scale(${plateScale.toFixed(3)}) translate(${(480 * (1 / plateScale - 1)).toFixed(1)} ${(270 * (1 / plateScale - 1)).toFixed(1)})">
    <ellipse cx="480" cy="408" rx="288" ry="48" fill="#000" opacity=".56" filter="url(#steamBlur)"/>
    ${layer({
      id: "bottom",
      t,
      start: 0.1,
      end: 0.32,
      y: bottomY,
      fromY: 470,
      opacityStart: 0.08,
      fill: "url(#bunBottom)",
      w: 218,
      h: 38,
      extra: `<ellipse rx="185" ry="20" cy="-8" fill="#efac52" opacity=".5"/>`
    })}
    ${layer({
      id: "lettuce",
      t,
      start: 0.28,
      end: 0.48,
      y: 322,
      fromY: 520,
      opacityStart: 0.25,
      fill: "url(#lettuce)",
      w: 225,
      h: 28,
      extra: `<path d="M-230 -2 C-190 -28 -155 20 -120 -4 C-78 -32 -45 22 -8 0 C32 -24 64 22 104 -1 C148 -28 178 18 226 -2" fill="none" stroke="#b9ff8b" stroke-width="13" stroke-linecap="round" opacity=".5"/>`
    })}
    ${layer({
      id: "patty",
      t,
      start: 0.36,
      end: 0.56,
      y: 306,
      fromY: 545,
      opacityStart: 0.34,
      fill: "url(#patty)",
      w: 210,
      h: 36,
      extra: `<path d="M-150 -6 C-98 -28 -30 16 25 -10 C82 -36 118 14 152 -4" fill="none" stroke="#a75a2b" stroke-width="8" opacity=".44" stroke-linecap="round"/>`
    })}
    ${layer({
      id: "cheese",
      t,
      start: 0.44,
      end: 0.62,
      y: 283,
      fromY: 508,
      opacityStart: 0.4,
      fill: "url(#cheese)",
      w: 205,
      h: 18,
      extra: `<path d="M-172 5 L-142 34 L-101 5 L-56 42 L-14 5 L28 31 L70 5 L120 40 L166 5" fill="#ffc83d" opacity=".92"/>`
    })}
    ${layer({
      id: "tomato",
      t,
      start: 0.52,
      end: 0.68,
      y: 263,
      fromY: 490,
      opacityStart: 0.48,
      fill: "url(#tomato)",
      w: 194,
      h: 18,
      extra: `<ellipse rx="70" ry="8" fill="none" stroke="#ffd0c7" stroke-width="4" opacity=".35"/>`
    })}
    <g opacity="${sauce.toFixed(3)}" transform="translate(480 ${(250 + (1 - sauce) * 115).toFixed(1)})" filter="url(#liftShadow)">
      <path d="M-178 0 C-122 -20 -84 18 -38 0 C4 -18 45 17 92 0 C128 -15 152 8 178 -1" fill="none" stroke="#ffecd4" stroke-width="20" stroke-linecap="round"/>
      <path d="M-120 3 C-96 30 -85 48 -68 57 M28 4 C42 32 48 50 68 60 M128 2 C140 22 151 36 168 48" fill="none" stroke="#ffbf83" stroke-width="13" stroke-linecap="round"/>
    </g>
    <g opacity="${clamp(phase(t, 0.12, 0.26)).toFixed(3)}" transform="translate(480 ${topY.toFixed(1)}) rotate(${(-9 + settle * 9).toFixed(2)})" filter="url(#liftShadow)">
      <path d="M-218 24 C-196 -72 -104 -110 0 -110 C108 -110 192 -66 219 24 C160 52 -149 54 -218 24Z" fill="url(#bun)"/>
      <ellipse cy="18" rx="220" ry="38" fill="#7b3718" opacity=".54"/>
      <ellipse cy="-55" rx="122" ry="34" fill="#ffe3a4" opacity=".18"/>
      ${Array.from({ length: 24 }, (_, seed) => {
        const sx = -130 + ((seed * 43) % 260);
        const sy = -88 + ((seed * 31) % 78);
        return `<ellipse cx="${sx}" cy="${sy}" rx="6" ry="2.5" fill="#fff0bc" opacity=".88" transform="rotate(${seed * 27} ${sx} ${sy})"/>`;
      }).join("")}
    </g>
  </g>
  ${steam}
  <rect width="960" height="540" fill="url(#stage)" opacity=".18"/>
  <path d="M0 0H960V540H0Z" fill="url(#stage)" opacity=".12"/>
</svg>`;
}

const dataUris = [];
let posterBuffer;

for (let i = 0; i < frameCount; i += 1) {
  const svg = Buffer.from(renderFrame(i));
  const webp = await sharp(svg).webp({ quality: 48, effort: 4 }).toBuffer();
  dataUris.push(`data:image/webp;base64,${webp.toString("base64")}`);
  if (i === frameCount - 1) {
    posterBuffer = await sharp(svg).webp({ quality: 76, effort: 5 }).toBuffer();
  }
}

const videoBytes = Whammy.fromImageArray(dataUris, fps, true);
await fs.writeFile(path.join(videoDir, "burger-assembly.webm"), Buffer.from(videoBytes));
await fs.writeFile(path.join(heroImageDir, "hero-burger-poster.webp"), posterBuffer);

const mobilePoster = await sharp(Buffer.from(renderFrame(frameCount - 1)))
  .resize({ width: 720, height: 960, fit: "cover" })
  .webp({ quality: 74, effort: 5 })
  .toBuffer();
await fs.writeFile(path.join(heroImageDir, "hero-burger-mobile.webp"), mobilePoster);

const menuAssets = [
  ["shahi-handi.webp", "images/shahi_handi.png"],
  ["eco-crunch.webp", "images/whatsapp/zaiqa-08.jpg"],
  ["zinger-burger.webp", "images/zinger_burger.png"],
  ["double-decker.webp", "images/whatsapp/zaiqa-15.jpg"],
  ["loaded-fries.webp", "images/loaded_fries.png"],
  ["wrap.webp", "images/whatsapp/zaiqa-19.jpg"],
  ["nuggets.webp", "images/whatsapp/zaiqa-09.jpg"],
  ["masala-fries.webp", "images/whatsapp/zaiqa-16.jpg"],
  ["chunky-chicken.webp", "images/whatsapp/zaiqa-12.jpg"],
  ["gola-kabab.webp", "images/whatsapp/zaiqa-18.jpg"],
  ["elaichi-chai.webp", "images/whatsapp/zaiqa-05.jpg"],
  ["milky-naan.webp", "images/whatsapp/zaiqa-18.jpg"],
  ["kitchen.webp", "images/rustic_kitchen_bg.png"],
  ["burger-plate.webp", "images/whatsapp/zaiqa-08.jpg"]
];

for (const [fileName, source] of menuAssets) {
  await sharp(path.join(publicDir, source))
    .resize({ width: 900, height: 720, fit: "cover", position: "center" })
    .webp({ quality: 78, effort: 5 })
    .toFile(path.join(menuDir, fileName));
}

const stats = await fs.stat(path.join(videoDir, "burger-assembly.webm"));
console.log(`Generated burger-assembly.webm (${Math.round(stats.size / 1024)} KB) and optimized image assets.`);
