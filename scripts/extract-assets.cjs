const sharp = require('sharp');
const path = require('path');

async function extractAssets() {
  const src = path.join(__dirname, '..', 'public', 'reference_layout.png');

  // 1. Poster thumbnail: around x: 16, y: 66, width: 55, height: 82
  await sharp(src)
    .extract({ left: 16, top: 66, width: 55, height: 82 })
    .resize(300, 450, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(__dirname, '..', 'public', 'ramayana-poster.jpg'));
  console.log('Extracted poster thumbnail');

  // 2. Movie screen texture:
  // In 1024x573, screen center is around left: 368, top: 178, width: 485, height: 182
  await sharp(src)
    .extract({ left: 368, top: 178, width: 485, height: 182 })
    .resize(1920, 720, { fit: 'fill' })
    .jpeg({ quality: 95 })
    .toFile(path.join(__dirname, '..', 'public', 'ramayana-screen.jpg'));
  console.log('Extracted screen texture');

  // 3. Thumbnails at bottom:
  // The 3 thumbnails in the carousel:
  // thumb 1: left 486, top 501, width: 90, height: 52
  // thumb 2: left 584, top 501, width: 90, height: 52
  // thumb 3: left 683, top 501, width: 90, height: 52
  try {
    await sharp(src)
      .extract({ left: 486, top: 501, width: 90, height: 52 })
      .jpeg({ quality: 90 })
      .toFile(path.join(__dirname, '..', 'public', 'thumb-seat.jpg'));

    await sharp(src)
      .extract({ left: 584, top: 501, width: 90, height: 52 })
      .jpeg({ quality: 90 })
      .toFile(path.join(__dirname, '..', 'public', 'thumb-wide.jpg'));

    await sharp(src)
      .extract({ left: 683, top: 501, width: 90, height: 52 })
      .jpeg({ quality: 90 })
      .toFile(path.join(__dirname, '..', 'public', 'thumb-side.jpg'));
    console.log('Extracted thumbnails');
  } catch (err) {
    console.error('Thumbnails extract error:', err);
  }
}

extractAssets();
