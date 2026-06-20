import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assetsDir = path.join("C:\\Users\\Zbook\\.cursor\\projects\\h-FOOD\\assets");
const menuDir = path.join(root, "public", "images", "menu");
const brandDir = path.join(root, "public", "images", "brand");

const mappings = [
  ["c__Users_Zbook_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-20_at_10.57.03_PM__1_-c84d76cc-f342-41e9-b8ed-dcc85bb1c97e.png", "eco-crunch.webp"],
  ["c__Users_Zbook_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-20_at_10.57.03_PM__2_-2c140eda-666e-45f0-839a-395aca0c0975.png", "double-decker.webp"],
  ["c__Users_Zbook_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-20_at_10.57.04_PM__1_-693837b7-e6bb-4efa-a4ed-929ea6d25165.png", "nuggets.webp"],
  ["c__Users_Zbook_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-20_at_10.57.01_PM-8450db5e-a314-4650-9206-ce19d6b91e0a.png", "baked-wings.webp"],
  ["c__Users_Zbook_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-20_at_10.57.02_PM__1_-16f62444-0468-4abb-ab92-ffdc66a24f82.png", "elaichi-chai.webp"],
  ["c__Users_Zbook_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-20_at_10.57.04_PM-c6397482-2180-421e-b67c-1c4fc5103df7.png", "chunky-chicken.webp"],
  ["c__Users_Zbook_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-20_at_10.57.15_PM-7dbaa58b-1bcf-4fb5-88c0-a7413dfa9cbe.png", "full-menu-front.webp"],
  ["c__Users_Zbook_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-20_at_10.57.16_PM-823352e4-3212-4d54-b2dd-dd4ee305b74d.png", "full-menu-back.webp"]
];

const whatsappMappings = [
  ["zaiqa-15.jpg", "zinger-burger.webp"],
  ["zaiqa-17.jpg", "shahi-handi.webp"],
  ["zaiqa-18.jpg", "gola-kabab.webp"],
  ["zaiqa-01.jpg", "loaded-fries.webp"],
  ["zaiqa-16.jpg", "masala-fries.webp"],
  ["zaiqa-19.jpg", "wrap.webp"]
];

async function toWebp(input, output, width = 960) {
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);
  console.log("wrote", path.basename(output));
}

await fs.mkdir(menuDir, { recursive: true });
await fs.mkdir(brandDir, { recursive: true });

for (const [file, out] of mappings) {
  const input = path.join(assetsDir, file);
  await toWebp(input, path.join(menuDir, out), out.startsWith("full-menu") ? 1400 : 960);
}

for (const [file, out] of whatsappMappings) {
  const input = path.join(root, "public", "images", "whatsapp", file);
  await toWebp(input, path.join(menuDir, out));
}

const menuFront = path.join(assetsDir, mappings[6][0]);
await sharp(menuFront)
  .extract({ left: 24, top: 18, width: 150, height: 150 })
  .resize(128, 128)
  .webp({ quality: 90 })
  .toFile(path.join(brandDir, "logo-thumb.webp"));

console.log("logo thumb created");
