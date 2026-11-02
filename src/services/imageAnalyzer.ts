import type { ImageAnalysis, SubjectCategory } from '../types/joke';

/**
 * Analyzes uploaded image pixels client-side using an offscreen canvas
 * to extract brightness, color tones, clutter density, and aspect ratio.
 */
export async function analyzeImage(
  img: HTMLImageElement,
  filename?: string
): Promise<ImageAnalysis> {
  const width = img.naturalWidth || img.width || 600;
  const height = img.naturalHeight || img.height || 600;

  // Aspect ratio
  const ratio = width / height;
  let aspectRatio: ImageAnalysis['aspectRatio'] = 'square';
  if (ratio > 1.25) aspectRatio = 'landscape';
  else if (ratio < 0.8) aspectRatio = 'portrait';

  // Sample into 80x80 canvas for ultra-fast heuristic analysis
  const sampleSize = 80;
  const canvas = document.createElement('canvas');
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  let suggestedCategory: SubjectCategory | undefined = undefined;
  if (filename) {
    const fn = filename.toLowerCase();
    if (fn.includes('cat') || fn.includes('kitten') || fn.includes('kitty') || fn.includes('feline')) suggestedCategory = 'pet_cat';
    else if (fn.includes('dog') || fn.includes('puppy') || fn.includes('doggo') || fn.includes('canine')) suggestedCategory = 'pet_dog';
    else if (fn.includes('code') || fn.includes('dev') || fn.includes('prog') || fn.includes('screen') || fn.includes('term')) suggestedCategory = 'tech_programmer';
    else if (fn.includes('gym') || fn.includes('workout') || fn.includes('fit') || fn.includes('lift') || fn.includes('bicep')) suggestedCategory = 'gym_fail';
    else if (fn.includes('tape') || fn.includes('diy') || fn.includes('fix') || fn.includes('repair') || fn.includes('pipe')) suggestedCategory = 'diy_fail';
    else if (fn.includes('car') || fn.includes('auto') || fn.includes('vehicle') || fn.includes('drive') || fn.includes('wheel')) suggestedCategory = 'car_vehicle';
    else if (fn.includes('food') || fn.includes('cook') || fn.includes('pizza') || fn.includes('bake') || fn.includes('plate')) suggestedCategory = 'food_chaos';
    else if (fn.includes('room') || fn.includes('desk') || fn.includes('bed') || fn.includes('mess')) suggestedCategory = 'cluttered_chaos';
  }

  if (!ctx) {
    return {
      aspectRatio,
      brightness: 'normal',
      colorDominance: 'warm',
      complexity: 'moderate',
      isLikelySelfieOrFace: aspectRatio === 'portrait',
      width,
      height,
      suggestedCategory,
    };
  }

  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
  const data = imgData.data;

  let totalLum = 0;
  let warmCount = 0;
  let coolCount = 0;
  let greenCount = 0;
  let redFoodCount = 0;
  let skinToneCount = 0;
  let saturationSum = 0;

  const totalPixels = sampleSize * sampleSize;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLum += lum;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const sat = max === 0 ? 0 : delta / max;
    saturationSum += sat;

    if (g > r * 1.15 && g > b * 1.15) {
      greenCount++;
    } else if (r > 150 && g < 100 && b < 100) {
      redFoodCount++;
    } else if (r > b + 25 && g > b) {
      warmCount++;
    } else if (b > r + 20) {
      coolCount++;
    }

    if (r > 95 && g > 40 && b > 20 && max - min > 15 && Math.abs(r - g) > 15 && r > g && r > b) {
      skinToneCount++;
    }
  }

  const avgLum = totalLum / totalPixels;
  const avgSat = saturationSum / totalPixels;

  let brightness: ImageAnalysis['brightness'] = 'normal';
  if (avgLum < 75) brightness = 'dark';
  else if (avgLum > 185) brightness = 'bright';

  let colorDominance: ImageAnalysis['colorDominance'] = 'warm';
  if (greenCount / totalPixels > 0.25) {
    colorDominance = 'green_nature';
  } else if (redFoodCount / totalPixels > 0.18) {
    colorDominance = 'food_red';
  } else if (avgSat < 0.12) {
    colorDominance = 'monochrome';
  } else if (coolCount > warmCount * 1.3) {
    colorDominance = 'cool';
  } else if (avgSat > 0.5) {
    colorDominance = 'vibrant';
  }

  // Edge / Clutter detection
  let edgeSum = 0;
  for (let y = 1; y < sampleSize - 1; y += 2) {
    for (let x = 1; x < sampleSize - 1; x += 2) {
      const idx = (y * sampleSize + x) * 4;
      const rightIdx = (y * sampleSize + (x + 1)) * 4;
      const downIdx = ((y + 1) * sampleSize + x) * 4;

      const diffX = Math.abs(data[idx] - data[rightIdx]);
      const diffY = Math.abs(data[idx] - data[downIdx]);
      edgeSum += diffX + diffY;
    }
  }

  const avgEdge = edgeSum / (totalPixels / 4);
  let complexity: ImageAnalysis['complexity'] = 'moderate';
  if (avgEdge < 22) complexity = 'clean';
  else if (avgEdge > 48) complexity = 'cluttered';

  const skinRatio = skinToneCount / totalPixels;
  const isLikelySelfieOrFace = skinRatio > 0.18 && (aspectRatio === 'portrait' || aspectRatio === 'square');

  return {
    aspectRatio,
    brightness,
    colorDominance,
    complexity,
    isLikelySelfieOrFace,
    width,
    height,
    suggestedCategory,
  };
}
