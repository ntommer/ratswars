const sharp = require('sharp');
const path = require('path');

const sizes = [152, 167, 180, 192, 512];
const inputImage = path.join(__dirname, 'images', 'icon.svg');
const outputDir = path.join(__dirname, 'images');

async function generateIcons() {
    for (const size of sizes) {
        const outputPath = path.join(outputDir, `icon-${size}.png`);
        await sharp(inputImage)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`Generated: icon-${size}.png`);
    }
    console.log('All icons generated!');
}

generateIcons().catch(console.error);
