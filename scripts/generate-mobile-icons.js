const fs = require('fs');
const path = require('path');

// SVG content for the Dail it logo
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="#101828"/>
  <text x="256" y="340" text-anchor="middle" font-family="Cal Sans, system-ui, -apple-system, sans-serif" font-size="280" font-weight="500" fill="white">D</text>
  <circle cx="432" cy="80" r="24" fill="#7c3aed"/>
</svg>`;

// SVG content for maskable icons (with padding for safe area)
const maskableSvgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#101828"/>
  <rect x="64" y="64" width="384" height="384" rx="48" fill="#101828"/>
  <text x="256" y="300" text-anchor="middle" font-family="Cal Sans, system-ui, -apple-system, sans-serif" font-size="210" font-weight="500" fill="white">D</text>
  <circle cx="384" cy="128" r="18" fill="#7c3aed"/>
</svg>`;

// Create the icons directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Save SVG files first
fs.writeFileSync(path.join(publicDir, 'icon-source.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'icon-maskable-source.svg'), maskableSvgContent);

console.log('✅ SVG source files created successfully!');
console.log('');
console.log('To generate PNG icons, you have several options:');
console.log('');
console.log('1. Online converter (recommended for quick setup):');
console.log('   - Go to https://convertio.co/svg-png/');
console.log('   - Upload public/icon-source.svg');
console.log('   - Convert to 192x192 PNG and save as public/icon-192.png');
console.log('   - Convert to 512x512 PNG and save as public/icon-512.png');
console.log('   - Upload public/icon-maskable-source.svg');
console.log('   - Convert to 192x192 PNG and save as public/icon-maskable-192.png');
console.log('   - Convert to 512x512 PNG and save as public/icon-maskable-512.png');
console.log('   - For iOS: Convert icon-source.svg to 180x180 PNG and save as public/apple-touch-icon.png');
console.log('');
console.log('2. Using ImageMagick (if installed):');
console.log('   npm run convert-icons');
console.log('');
console.log('3. Using sharp package:');
console.log('   npm install sharp');
console.log('   npm run generate-icons-sharp');

// Create conversion scripts for package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts['convert-icons']) {
    packageJson.scripts['convert-icons'] = 'convert public/icon-source.svg -resize 192x192 public/icon-192.png && convert public/icon-source.svg -resize 512x512 public/icon-512.png && convert public/icon-maskable-source.svg -resize 192x192 public/icon-maskable-192.png && convert public/icon-maskable-source.svg -resize 512x512 public/icon-maskable-512.png && convert public/icon-source.svg -resize 180x180 public/apple-touch-icon.png';
  }
  
  if (!packageJson.scripts['generate-icons-sharp']) {
    packageJson.scripts['generate-icons-sharp'] = 'node scripts/convert-with-sharp.js';
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Added icon conversion scripts to package.json');
} 