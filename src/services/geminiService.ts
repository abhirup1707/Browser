import type { HumorStyle, JokeResult } from '../types/joke';

const API_KEY_STORAGE_KEY = 'laughlens_gemini_api_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

export function setStoredApiKey(key: string) {
  if (typeof window === 'undefined') return;
  if (key.trim()) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Calls Google Gemini Vision API (Multimodal) to analyze the image and generate jokes
 */
export async function generateGeminiJoke(
  base64Image: string,
  mimeType: string,
  style: HumorStyle,
  spiceLevel: number = 70,
  apiKeyOverride?: string,
  customContext?: string
): Promise<JokeResult> {
  const apiKey = apiKeyOverride || getStoredApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  // Strip prefix like data:image/png;base64,
  const cleanBase64 = base64Image.includes(',')
    ? base64Image.split(',')[1]
    : base64Image;

  const stylePrompts: Record<HumorStyle, string> = {
    roast: `Act as a savage, quick-witted stand-up comedian roasting this picture at a comedy club. Point out funny, weird, specific details in the person, pets, clothes, facial expression, background clutter, or lighting. Spice level: ${spiceLevel}/100. Be hilarious, sharp, but not hateful.`,
    dad: `Act as the ultimate corny dad. Look at the specific things, people, animals, objects, and colors in this picture and make wholesome, groaner-level dad jokes, puns, and wordplay.`,
    brainrot: `Act as a chaotic Gen-Z / TikTok meme creator. Roast this picture using modern meme slang (aura debt, bro thinks he is him, NPC behavior, skibidi energy, Ohio final boss, cooked, locking in). Target specific visual quirks in the photo.`,
    detective: `Act as an overly dramatic Sherlock Holmes / CSI Forensic Detective inspecting this picture as Exhibit A. Deduce absurd, hilarious, hyper-specific theories from tiny background clues, micro-expressions, posture, and random objects in the frame.`,
    pet: `Speak from the internal monologue perspective of a sassy cat, disappointed dog, or even an inanimate object in this picture looking at what is happening. Complain about the human's behavior, food delays, or weird photo poses.`,
    standup: `Write a live comedy club routine reacting to this picture. Open with "So I was looking at this photo..." and deliver observational comedy addressing distinct visual details.`,
  };

  const systemInstructions = `
You are a world-class comedic photo analyzer.
Analyze the user's uploaded picture carefully and generate hilarious jokes according to the requested humor persona.

${customContext ? `User context about this picture: "${customContext}". Incorporate this specific context into the roast and punchlines!` : ''}

Target style instructions:
${stylePrompts[style] || stylePrompts.roast}

CRITICAL: Return ONLY valid, raw JSON (no markdown backticks, no \`\`\`json wraps) with this EXACT structure:
{
  "headline": "A punchy, devastatingly funny main roast or joke sentence about this specific picture",
  "subJokes": [
    "Alternative joke or pun #1 based on an object or face in the photo",
    "Alternative joke or pun #2 focusing on another detail in the photo",
    "Alternative joke or pun #3 with another hilarious angle"
  ],
  "observations": [
    "Hilarious AI visual observation #1 (e.g. 'Aura level: -45,000')",
    "Hilarious AI visual observation #2 (e.g. 'Posture analysis: 94% boiled noodle')",
    "Hilarious AI visual observation #3 (e.g. 'Background object: Appears to violate 3 building codes')"
  ],
  "memeTop": "TOP TEXT IN ALL CAPS (max 7 words)",
  "memeBottom": "BOTTOM TEXT IN ALL CAPS (max 8 words)",
  "roastMeter": 85,
  "vibeTag": "Short 2-4 word punchy vibe description (e.g. 'Unfiltered Chaos', 'Candid Disaster')",
  "categoryDetected": "Short category description of what you see (e.g. 'Confused Golden Retriever', 'Dubious DIY Project')",
  "suggestedHashtags": ["#Tag1", "#Tag2", "#Tag3"]
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: systemInstructions,
          },
          {
            inline_data: {
              mime_type: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.85,
      response_mime_type: 'application/json',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }

  const json = await response.json();
  const textContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('Empty response received from Gemini.');
  }

  // Clean JSON if backticks present
  const cleaned = textContent
    .replace(/^```json/m, '')
    .replace(/^```/m, '')
    .replace(/```$/m, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  return {
    headline: parsed.headline || 'Could not find words to describe this masterpiece.',
    subJokes: Array.isArray(parsed.subJokes) ? parsed.subJokes : ['Bro is speechless.'],
    observations: Array.isArray(parsed.observations) ? parsed.observations : ['Visual anomaly detected.'],
    memeTop: parsed.memeTop || 'WHEN YOU TRY YOUR BEST',
    memeBottom: parsed.memeBottom || 'BUT THE PICTURE HAS OTHER PLANS',
    roastMeter: Number(parsed.roastMeter) || spiceLevel,
    vibeTag: parsed.vibeTag || 'Certified Moment',
    categoryDetected: parsed.categoryDetected || 'Visual Artifact',
    suggestedHashtags: Array.isArray(parsed.suggestedHashtags) ? parsed.suggestedHashtags : ['#PictureRoast'],
    source: 'gemini',
  };
}
