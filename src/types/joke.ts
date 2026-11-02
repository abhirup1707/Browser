export type HumorStyle =
  | 'roast'
  | 'dad'
  | 'brainrot'
  | 'detective'
  | 'pet'
  | 'standup';

export type SubjectCategory =
  | 'auto'
  | 'selfie_portrait'
  | 'pet_cat'
  | 'pet_dog'
  | 'tech_programmer'
  | 'food_chaos'
  | 'gym_fail'
  | 'diy_fail'
  | 'car_vehicle'
  | 'cluttered_chaos'
  | 'dark_moody'
  | 'scenic_nature';

export interface StyleOption {
  id: HumorStyle;
  name: string;
  tagline: string;
  icon: string;
  badge: string;
  color: string;
  defaultSpice: number;
}

export interface JokeResult {
  headline: string;
  subJokes: string[];
  observations: string[];
  memeTop: string;
  memeBottom: string;
  roastMeter: number; // 0 - 100
  vibeTag: string;
  categoryDetected: string;
  suggestedHashtags: string[];
  source: 'builtin' | 'gemini';
}

export interface ImageAnalysis {
  aspectRatio: 'portrait' | 'landscape' | 'square';
  brightness: 'dark' | 'normal' | 'bright';
  colorDominance: 'warm' | 'cool' | 'vibrant' | 'monochrome' | 'green_nature' | 'food_red';
  complexity: 'clean' | 'moderate' | 'cluttered';
  isLikelySelfieOrFace: boolean;
  width: number;
  height: number;
  suggestedCategory?: SubjectCategory;
}

export interface SampleImage {
  id: string;
  title: string;
  category: string;
  subjectCategory: SubjectCategory;
  dataUrl: string;
  hint: string;
}

export type MemeFormat = 'classic' | 'modern' | 'polaroid';
