import type { MemeFormat } from '../types/joke';

interface RenderMemeOptions {
  imageSrc: string;
  topText: string;
  bottomText: string;
  headline?: string;
  vibeTag?: string;
  format: MemeFormat;
}

/**
 * Renders the image with joke captions onto an HTML5 canvas and returns dataUrl
 */
export async function createMemeImage(options: RenderMemeOptions): Promise<string> {
  const { imageSrc, topText, bottomText, headline, vibeTag, format } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const origW = img.naturalWidth || 800;
      const origH = img.naturalHeight || 800;

      // Scale to crisp high-res canvas (max 1200px dimension)
      const maxDim = 1200;
      const scale = Math.min(1, maxDim / Math.max(origW, origH));
      const width = Math.round(origW * scale);
      const height = Math.round(origH * scale);

      if (format === 'modern') {
        renderModernSocialCard(canvas, ctx, img, width, height, headline || topText, vibeTag);
      } else if (format === 'polaroid') {
        renderPolaroidCard(canvas, ctx, img, width, height, headline || bottomText);
      } else {
        renderClassicMeme(canvas, ctx, img, width, height, topText, bottomText);
      }

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for meme export'));
    };

    img.src = imageSrc;
  });
}

function renderClassicMeme(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  topText: string,
  bottomText: string
) {
  canvas.width = width;
  canvas.height = height;

  // Draw base image
  ctx.drawImage(img, 0, 0, width, height);

  // Classic Impact font setup
  const fontSize = Math.max(24, Math.round(width * 0.075));
  ctx.font = `900 ${fontSize}px Impact, -apple-system, sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(3, Math.round(fontSize * 0.12));
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // Render Top Text
  if (topText) {
    const topLines = wrapText(ctx, topText.toUpperCase(), width * 0.9);
    topLines.forEach((line, index) => {
      const y = 20 + index * (fontSize * 1.15);
      ctx.strokeText(line, width / 2, y);
      ctx.fillText(line, width / 2, y);
    });
  }

  // Render Bottom Text
  if (bottomText) {
    const bottomLines = wrapText(ctx, bottomText.toUpperCase(), width * 0.9);
    ctx.textBaseline = 'bottom';
    bottomLines.reverse().forEach((line, index) => {
      const y = height - 20 - index * (fontSize * 1.15);
      ctx.strokeText(line, width / 2, y);
      ctx.fillText(line, width / 2, y);
    });
  }

  // Subtle watermark in corner
  drawWatermark(ctx, width, height);
}

function renderModernSocialCard(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  text: string,
  vibeTag?: string
) {
  const bannerHeight = Math.round(height * 0.28);
  canvas.width = width;
  canvas.height = height + bannerHeight;

  // Draw image
  ctx.drawImage(img, 0, 0, width, height);

  // Dark modern sleek banner background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, height, width, bannerHeight);

  // Gradient accent line
  const grad = ctx.createLinearGradient(0, height, width, height);
  grad.addColorStop(0, '#f97316');
  grad.addColorStop(0.5, '#ec4899');
  grad.addColorStop(1, '#8b5cf6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, height, width, 5);

  // Profile icon & title
  const pad = Math.round(width * 0.04);
  const avatarY = height + pad;
  const avatarR = Math.round(width * 0.035);

  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(pad + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.round(avatarR * 1.1)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🤖', pad + avatarR, avatarY + avatarR);

  // Handle & badge
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `bold ${Math.round(avatarR * 0.9)}px sans-serif`;
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('LaughLens AI', pad + avatarR * 2 + 12, avatarY);

  if (vibeTag) {
    ctx.font = `normal ${Math.round(avatarR * 0.75)}px sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`• ${vibeTag}`, pad + avatarR * 2 + 130, avatarY + 2);
  }

  // Punchline text
  const fontSize = Math.max(16, Math.round(width * 0.042));
  ctx.font = `600 ${fontSize}px sans-serif`;
  ctx.fillStyle = '#ffffff';
  const lines = wrapText(ctx, `"${text}"`, width - pad * 2);

  lines.slice(0, 3).forEach((line, idx) => {
    ctx.fillText(line, pad, avatarY + avatarR * 2 + 14 + idx * (fontSize * 1.3));
  });

  drawWatermark(ctx, width, height + bannerHeight);
}

function renderPolaroidCard(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  caption: string
) {
  const border = Math.round(width * 0.06);
  const bottomBorder = Math.round(width * 0.22);
  canvas.width = width + border * 2;
  canvas.height = height + border + bottomBorder;

  // Polaroid paper background
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle border shadow
  ctx.fillStyle = '#e2ded7';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Image placement
  ctx.drawImage(img, border, border, width, height);

  // Caption text (handwritten feel)
  const fontSize = Math.max(18, Math.round(width * 0.04));
  ctx.font = `italic bold ${fontSize}px "Comic Sans MS", "Chalkboard", cursive, sans-serif`;
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = wrapText(ctx, `"${caption}"`, width);
  const startY = height + border + bottomBorder * 0.45;
  lines.slice(0, 2).forEach((line, idx) => {
    ctx.fillText(line, canvas.width / 2, startY + idx * (fontSize * 1.3));
  });

  drawWatermark(ctx, canvas.width, canvas.height);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('⚡ Made with LaughLens AI', width - 12, height - 10);
}

/**
 * Triggers browser download of a dataURL image
 */
export function downloadImage(dataUrl: string, filename: string = 'laughlens-roast-meme.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
