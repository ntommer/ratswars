const sharp = require('sharp');
const path = require('path');

const sourcePath = path.join(__dirname, 'images', 'gallery', 'Bombing Mission.png');
const outputDir = path.join(__dirname, 'images');

const sizes = [
  { size: 152, name: 'icon-152.png' },
  { size: 167, name: 'icon-167.png' },
  { size: 180, name: 'icon-180.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

async function generateIcons() {
  console.log('Generating app icons from Bombing Mission image...');

  // Get image metadata to calculate center crop
  const metadata = await sharp(sourcePath).metadata();
  console.log(`Source image: ${metadata.width}x${metadata.height}`);

  // Calculate square crop (centered, using the smaller dimension)
  const cropSize = Math.min(metadata.width, metadata.height);
  const left = Math.floor((metadata.width - cropSize) / 2);
  const top = Math.floor((metadata.height - cropSize) / 2);

  console.log(`Cropping to ${cropSize}x${cropSize} square from position (${left}, ${top})`);

  for (const { size, name } of sizes) {
    const outputPath = path.join(outputDir, name);

    try {
      await sharp(sourcePath)
        .extract({ left, top, width: cropSize, height: cropSize })
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`Error generating ${name}:`, error.message);
    }
  }

  console.log('Done generating icons!');
}

generateIcons();
