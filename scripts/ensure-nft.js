const fs = require('fs');
const path = require('path');

const distDir = path.resolve(process.cwd(), '.next');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const files = [
  'next-server.js.nft.json',
  'next-minimal-server.js.nft.json',
];

for (const f of files) {
  const p = path.join(distDir, f);
  if (!fs.existsSync(p)) {
    try {
      fs.writeFileSync(p, JSON.stringify({ version: 1, files: [] }));
    } catch {}
  }
}

// Guarantee public icons exist
const robotIcon = path.resolve(process.cwd(), 'public', 'robot-3d.png');
const favicon = path.resolve(process.cwd(), 'public', 'favicon.ico');
if (!fs.existsSync(robotIcon) || !fs.existsSync(favicon)) {
  try {
    require('./generate-robot-icon.js');
  } catch {}
}
