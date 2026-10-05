const sharp = require('sharp');
const path = require('path');

const src = 'C:/Users/vendr/.gemini/antigravity/brain/dda08aea-b0d3-41c0-8fe1-aaf3448eb919/.user_uploaded/media_1791219951741.jpg';
const outDir = 'C:/STACKLY/Courier-parcel-TS/public';

async function cropAssets() {
  const metadata = await sharp(src).metadata();
  console.log('Source image dimensions:', metadata.width, metadata.height);

  // 1. Hero banner:
  // x ~ 200, y ~ 45, width ~ 814, height ~ 146
  await sharp(src)
    .extract({ left: 200, top: 45, width: 814, height: 147 })
    .toFile(path.join(outDir, 'dash-banner.jpg'));
  console.log('Saved dash-banner.jpg');

  // 2. Globe card (Delivering a Connected World):
  // x ~ 827, y ~ 283, width ~ 186, height ~ 150
  await sharp(src)
    .extract({ left: 827, top: 283, width: 186, height: 150 })
    .toFile(path.join(outDir, 'dash-globe.jpg'));
  console.log('Saved dash-globe.jpg');

  // 3. Live Map card background:
  // x ~ 546, y ~ 283, width ~ 270, height ~ 150
  await sharp(src)
    .extract({ left: 546, top: 283, width: 270, height: 150 })
    .toFile(path.join(outDir, 'dash-map.jpg'));
  console.log('Saved dash-map.jpg');

  // 4. Sidebar Truck Promo card:
  // x ~ 10, y ~ 336, width ~ 172, height ~ 90
  await sharp(src)
    .extract({ left: 10, top: 336, width: 172, height: 90 })
    .toFile(path.join(outDir, 'dash-promo.jpg'));
  console.log('Saved dash-promo.jpg');
}

cropAssets().catch(console.error);
