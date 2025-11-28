/**
 * Script to generate favicon and app icons from SVG
 * 
 * This script requires sharp to be installed:
 * npm install --save-dev sharp
 * 
 * Run with: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp package is required. Install it with: npm install --save-dev sharp');
  process.exit(1);
}

const publicDir = path.join(__dirname, 'public');
const svgPath = path.join(publicDir, 'icon.svg');

if (!fs.existsSync(svgPath)) {
  console.error(`Error: ${svgPath} not found`);
  process.exit(1);
}

async function generateIcons() {
  console.log('Generating icons from SVG...');

  try {
    // Read SVG
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate favicon.ico (16x16, 32x32, 48x48)
    console.log('Generating favicon.ico...');
    const favicon16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
    const favicon32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
    const favicon48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
    
    // Note: Creating a multi-size ICO is complex, so we'll create PNGs
    // For favicon.ico, you may want to use an online converter or imagemagick
    fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), favicon16);
    fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), favicon32);
    console.log('✓ Generated favicon PNGs');

    // Generate logo192.png
    console.log('Generating logo192.png...');
    const logo192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
    fs.writeFileSync(path.join(publicDir, 'logo192.png'), logo192);
    console.log('✓ Generated logo192.png');

    // Generate logo512.png
    console.log('Generating logo512.png...');
    const logo512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
    fs.writeFileSync(path.join(publicDir, 'logo512.png'), logo512);
    console.log('✓ Generated logo512.png');

    console.log('\n✅ All icons generated successfully!');
    console.log('\nNote: To create favicon.ico, you can:');
    console.log('1. Use an online converter (e.g., https://favicon.io/favicon-converter/)');
    console.log('2. Use ImageMagick: convert favicon-16x16.png favicon-32x32.png favicon.ico');
    console.log('3. Or use the PNG files directly (modern browsers support PNG favicons)');
    
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

