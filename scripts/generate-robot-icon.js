const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table for PNG chunk checksums
function makeCrcTable() {
  const cTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    cTable[n] = c;
  }
  return cTable;
}

const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const toCrc = Buffer.concat([typeBuf, data]);
  chunk.writeUInt32BE(crc32(toCrc), 8 + len);
  return chunk;
}

function generatePng(width, height) {
  // 1. PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // 2. IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // 3. Scanline data (filter byte 0 per line + width * 4 bytes RGBA)
  const rawBytes = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const rOuter = width * 0.44;

  for (let y = 0; y < height; y++) {
    rawBytes[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient: Deep dark violet (#09090b to #1e1035)
      const gradT = (x + y) / (width + height);
      let r = Math.round(9 + gradT * 25);
      let g = Math.round(9 + gradT * 10);
      let b = Math.round(15 + gradT * 45);
      let a = 255;

      // Outer Rounded Holographic Orb / Glow
      if (dist < rOuter) {
        // Vibrant Purple to Indigo gradient
        const t = Math.min(1, Math.max(0, (y - (cy - rOuter)) / (2 * rOuter)));
        r = Math.round(124 * (1 - t * 0.4) + 79 * (t * 0.4));  // ~#7c3aed to #4f46e5
        g = Math.round(58 * (1 - t) + 70 * t);
        b = Math.round(237 * (1 - t) + 229 * t);

        // Subtle specular glow at the top-left
        const specDist = Math.sqrt((x - (cx - rOuter * 0.35)) ** 2 + (y - (cy - rOuter * 0.35)) ** 2);
        if (specDist < rOuter * 0.6) {
          const specFactor = (1 - specDist / (rOuter * 0.6)) * 0.45;
          r = Math.min(255, Math.round(r + 255 * specFactor));
          g = Math.min(255, Math.round(g + 255 * specFactor));
          b = Math.min(255, Math.round(b + 255 * specFactor));
        }

        // Inner Robot / Neural Mask
        // Robot Head Shape: centered rounded box
        const hx = Math.abs(x - cx);
        const hy = Math.abs(y - cy);
        const headW = rOuter * 0.55;
        const headH = rOuter * 0.48;

        if (hx < headW && hy < headH) {
          // Dark sleek cyber visor background
          r = 18;
          g = 18;
          b = 28;

          // Cyan / Neon Blue Glowing Robot Visor Eyes
          const eyeY = cy - headH * 0.15;
          const leftEyeX = cx - headW * 0.45;
          const rightEyeX = cx + headW * 0.45;
          const eyeDistL = Math.sqrt((x - leftEyeX) ** 2 + ((y - eyeY) * 1.5) ** 2);
          const eyeDistR = Math.sqrt((x - rightEyeX) ** 2 + ((y - eyeY) * 1.5) ** 2);
          const eyeR = headW * 0.22;

          if (eyeDistL < eyeR || eyeDistR < eyeR) {
            // Neon cyan glow (#06b6d4 / #38bdf8)
            r = 56;
            g = 189;
            b = 248;
          }

          // Antenna / Neural Crown node on top
          const antDist = Math.sqrt((x - cx) ** 2 + (y - (cy - headH - 12)) ** 2);
          if (antDist < 14) {
            r = 168;
            g = 85;
            b = 247;
          }
        }
      }

      rawBytes[offset++] = r;
      rawBytes[offset++] = g;
      rawBytes[offset++] = b;
      rawBytes[offset++] = a;
    }
  }

  // 4. Compress with Deflate
  const compressed = zlib.deflateSync(rawBytes, { level: 9 });
  const idat = createChunk('IDAT', compressed);

  // 5. IEND Chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const outDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate 512x512 robot icon
const png512 = generatePng(512, 512);
fs.writeFileSync(path.join(outDir, 'robot-3d.png'), png512);
console.log('✅ Created public/robot-3d.png (512x512)');

// Generate favicon
const faviconPng = generatePng(64, 64);
fs.writeFileSync(path.join(outDir, 'favicon.ico'), faviconPng);
console.log('✅ Created public/favicon.ico (64x64)');
