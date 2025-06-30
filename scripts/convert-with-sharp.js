const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  const svgBuffer = fs.readFileSync(path.join(publicDir, 'icon-source.svg'));
  const maskableSvgBuffer = fs.readFileSync(path.join(publicDir, 'icon-maskable-source.svg'));

  try {
    // Generate regular icons
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✅ Generated icon-192.png');

    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✅ Generated icon-512.png');

    // Generate maskable icons
    await sharp(maskableSvgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-maskable-192.png'));
    console.log('✅ Generated icon-maskable-192.png');

    await sharp(maskableSvgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-maskable-512.png'));
    console.log('✅ Generated icon-maskable-512.png');

    // Generate Apple touch icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Generated apple-touch-icon.png');

    console.log('');
    console.log('🎉 All mobile PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    console.log('');
    console.log('Please install sharp: npm install sharp');
  }
}

convertIcons(); 