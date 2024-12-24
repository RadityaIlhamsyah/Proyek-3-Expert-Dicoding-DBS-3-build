const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const heroImageSizes = [
  { width: 320, suffix: 'small' },
  { width: 640, suffix: 'mobile' },
  { width: 768, suffix: 'medium' },
  { width: 1200, suffix: 'large' },
];

const inputDir = 'src/images/hero';
const outputDir = 'src/images/hero-responsive';

async function ensureOutputDirectory() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function generateResponsiveHeroImages() {
  try {
    await ensureOutputDirectory();
    const heroImages = await fs.readdir(inputDir);

    for (const imageFile of heroImages) {
      if (!imageFile.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

      const inputPath = path.join(inputDir, imageFile);
      const baseFileName = path.parse(imageFile).name;

      for (const size of heroImageSizes) {
        const jpegOutputFileName = `${baseFileName}-${size.suffix}.jpg`;
        const jpegOutputPath = path.join(outputDir, jpegOutputFileName);
        const webpOutputFileName = `${baseFileName}-${size.suffix}.webp`;
        const webpOutputPath = path.join(outputDir, webpOutputFileName);

        try {
          await sharp(inputPath)
            .resize(size.width, null, {
              fit: 'contain',
              withoutEnlargement: true,
            })
            .toFormat('jpeg', {
              quality: size.width <= 640 ? 60 : 80,
              mozjpeg: true,
            })
            .toFile(jpegOutputPath);

          await sharp(inputPath)
            .resize(size.width, null, {
              fit: 'contain',
              withoutEnlargement: true,
            })
            .toFormat('webp', {
              quality: size.width <= 640 ? 60 : 80,
            })
            .toFile(webpOutputPath);

          console.log(`Generated: ${jpegOutputFileName} and ${webpOutputFileName}`);
        } catch (resizeError) {
          console.error(`Error processing ${imageFile} at ${size.width}px:`, resizeError);
        }
      }
    }

    console.log('Responsive hero images generated successfully!');
  } catch (error) {
    console.error('Error generating responsive hero images:', error);
  }
}

generateResponsiveHeroImages();
