import sharp from "sharp";
import { mkdir } from "node:fs/promises";

async function roundedImage(input, width, height) {
  const image = await sharp(input).resize(width, height, { fit: "cover" }).png().toBuffer();
  const mask = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" rx="28" ry="28" fill="white"/>
    </svg>
  `);

  return sharp(image).joinChannel(mask).png().toBuffer();
}

await mkdir("public/images/order", { recursive: true });

const width = 1200;
const height = 720;
const background = await sharp("public/images/menu/kitchen.webp")
  .resize(width, height, { fit: "cover" })
  .blur(1.2)
  .modulate({ brightness: 0.62, saturation: 0.92 })
  .webp()
  .toBuffer();

const burger = await roundedImage("public/images/menu/zinger-burger.webp", 450, 290);
const handi = await roundedImage("public/images/menu/shahi-handi-clean.webp", 360, 260);
const fries = await roundedImage("public/images/menu/loaded-fries.webp", 320, 230);

const overlay = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop stop-color="#0F0F0F" stop-opacity=".72"/>
        <stop offset=".55" stop-color="#0F0F0F" stop-opacity=".34"/>
        <stop offset="1" stop-color="#FF7A00" stop-opacity=".12"/>
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#000" flood-opacity=".36"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
    <rect x="70" y="76" width="484" height="330" rx="32" fill="#000" opacity=".23" filter="url(#s)"/>
    <rect x="602" y="104" width="390" height="292" rx="32" fill="#000" opacity=".21" filter="url(#s)"/>
    <rect x="705" y="420" width="344" height="250" rx="32" fill="#000" opacity=".2" filter="url(#s)"/>
    <circle cx="1068" cy="104" r="72" fill="#FF7A00" opacity=".88"/>
    <path d="M1036 105h64M1068 73v64" stroke="#F8F4ED" stroke-width="14" stroke-linecap="round"/>
  </svg>
`);

await sharp(background)
  .composite([
    { input: overlay, left: 0, top: 0 },
    { input: burger, left: 86, top: 95 },
    { input: handi, left: 617, top: 120 },
    { input: fries, left: 717, top: 434 }
  ])
  .webp({ quality: 88 })
  .toFile("public/images/order/order-confirmation-real.webp");

console.log("created public/images/order/order-confirmation-real.webp");
