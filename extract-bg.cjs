const fs = require('fs');
const zlib = require('zlib');
const { PNG } = require('pngjs');

function decodeAscii85(str) {
  // Strip whitespace and delimiters
  let clean = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '~' && str[i + 1] === '>') break;
    if (ch > ' ') clean += ch;
  }

  const out = [];
  let i = 0;
  while (i < clean.length) {
    if (clean[i] === 'z') {
      out.push(0, 0, 0, 0);
      i++;
      continue;
    }

    let chunk = clean.slice(i, i + 5);
    i += 5;
    const len = chunk.length;
    if (len < 2) break;

    let pad = 0;
    while (chunk.length < 5) {
      chunk += 'u';
      pad++;
    }

    let num = 0;
    for (let j = 0; j < 5; j++) {
      num = num * 85 + (chunk.charCodeAt(j) - 33);
    }

    const b0 = (num >>> 24) & 0xff;
    const b1 = (num >>> 16) & 0xff;
    const b2 = (num >>> 8) & 0xff;
    const b3 = num & 0xff;

    const bytes = [b0, b1, b2, b3];
    for (let k = 0; k < 4 - pad; k++) {
      out.push(bytes[k]);
    }
  }

  return Buffer.from(out);
}

const pdfPath = 'C:/Users/vendr/.gemini/antigravity/brain/dda08aea-b0d3-41c0-8fe1-aaf3448eb919/.user_uploaded/media_1791215765387.pdf';
const content = fs.readFileSync(pdfPath, 'latin1');

const streamIdx = content.indexOf('stream\n');
if (streamIdx === -1) {
  console.error('stream not found');
  process.exit(1);
}

const dataStart = streamIdx + 'stream\n'.length;
const sEnd = content.indexOf('endstream', dataStart);
const streamStr = content.slice(dataStart, sEnd).trim();

console.log('Stream length in ASCII85:', streamStr.length);

const a85Decoded = decodeAscii85(streamStr);
console.log('ASCII85 decoded length:', a85Decoded.length);

const rawRGB = zlib.inflateSync(a85Decoded);
console.log('Inflated raw RGB bytes:', rawRGB.length);

const width = 1536;
const height = 1024;
console.log(`Expected size for ${width}x${height} RGB:`, width * height * 3);

// Convert RGB to RGBA PNG
const png = new PNG({ width, height });
let rgbIdx = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    png.data[idx] = rawRGB[rgbIdx++];     // R
    png.data[idx + 1] = rawRGB[rgbIdx++]; // G
    png.data[idx + 2] = rawRGB[rgbIdx++]; // B
    png.data[idx + 3] = 255;              // A
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync('C:/STACKLY/Courier-parcel-TS/public/login-bg.png', buffer);
fs.writeFileSync('C:/STACKLY/Courier-parcel-TS/src/assets/login-bg.png', buffer);
console.log('Successfully saved PNG of size:', buffer.length, 'bytes to public/login-bg.png');
