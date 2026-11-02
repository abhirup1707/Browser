import type { SampleImage } from '../types/joke';

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample_cat',
    title: 'Existential Crisis Cat',
    category: 'Confused Pet',
    subjectCategory: 'pet_cat',
    hint: 'Staring into the void, questioning life choices',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="100%" stop-color="#0f172a" />
          </radialGradient>
          <radialGradient id="eyeL" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="70%" stop-color="#eab308" />
            <stop offset="100%" stop-color="#ca8a04" />
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bg)"/>
        <!-- Cat Body -->
        <ellipse cx="300" cy="460" rx="170" ry="140" fill="#f97316"/>
        <ellipse cx="300" cy="460" rx="130" ry="110" fill="#ea580c"/>
        <ellipse cx="300" cy="480" rx="90" ry="80" fill="#ffedd5"/>
        <!-- Cat Head -->
        <circle cx="300" cy="270" r="140" fill="#f97316"/>
        <!-- Ears -->
        <polygon points="180,180 230,80 270,160" fill="#ea580c"/>
        <polygon points="200,165 230,105 255,155" fill="#fecdd3"/>
        <polygon points="420,180 370,80 330,160" fill="#ea580c"/>
        <polygon points="400,165 370,105 345,155" fill="#fecdd3"/>
        <!-- Cheeks -->
        <circle cx="250" cy="310" r="35" fill="#ffedd5"/>
        <circle cx="350" cy="310" r="35" fill="#ffedd5"/>
        <!-- Huge Shocked Eyes -->
        <circle cx="230" cy="240" r="45" fill="url(#eyeL)"/>
        <circle cx="370" cy="240" r="45" fill="url(#eyeL)"/>
        <!-- Tiny dilated pupils for existential dread -->
        <circle cx="230" cy="240" r="22" fill="#09090b"/>
        <circle cx="370" cy="240" r="22" fill="#09090b"/>
        <circle cx="222" cy="232" r="7" fill="#ffffff"/>
        <circle cx="362" cy="232" r="7" fill="#ffffff"/>
        <!-- Nose and shocked open mouth -->
        <polygon points="290,290 310,290 300,305" fill="#f43f5e"/>
        <ellipse cx="300" cy="335" rx="16" ry="24" fill="#881337"/>
        <!-- Whiskers -->
        <line x1="170" y1="290" x2="90" y2="280" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
        <line x1="170" y1="310" x2="80" y2="315" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
        <line x1="430" y1="290" x2="510" y2="280" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
        <line x1="430" y1="310" x2="520" y2="315" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
        <!-- Speech tag -->
        <rect x="180" y="530" width="240" height="40" rx="20" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="300" y="555" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">"What have I done with my 9 lives?"</text>
      </svg>
    `),
  },
  {
    id: 'sample_programmer',
    title: '3 AM Code Despair',
    category: 'Exhausted Dev',
    subjectCategory: 'tech_programmer',
    hint: 'Staring at 400 red terminal errors after fixing one semicolon',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#030712"/>
        <!-- Desk & Monitor glow -->
        <polygon points="0,480 600,480 600,600 0,600" fill="#111827"/>
        <rect x="100" y="100" width="400" height="260" rx="12" fill="#1e1e2e" stroke="#3b82f6" stroke-width="4"/>
        <rect x="270" y="360" width="60" height="80" fill="#374151"/>
        <rect x="220" y="440" width="160" height="15" rx="6" fill="#4b5563"/>
        <!-- Screen Errors -->
        <text x="120" y="140" font-family="monospace" font-size="14" fill="#ef4444" font-weight="bold">FATAL: Exception in thread "main" NullPointerException</text>
        <text x="120" y="170" font-family="monospace" font-size="13" fill="#f87171">  at line 404: undefined is not a function</text>
        <text x="120" y="195" font-family="monospace" font-size="13" fill="#f87171">  at memory leak in infinite loop (line 12)</text>
        <text x="120" y="230" font-family="monospace" font-size="16" fill="#fbbf24">421 Errors Found. 0 Warnings.</text>
        <text x="120" y="270" font-family="monospace" font-size="14" fill="#60a5fa">&gt; git commit -m "I have no idea what is happening"</text>
        <rect x="120" y="290" width="12" height="20" fill="#38bdf8"/>
        <!-- Programmer Silhouette with hands on face -->
        <circle cx="300" cy="460" r="60" fill="#f59e0b"/>
        <!-- Tired dark eye circles -->
        <ellipse cx="280" cy="455" rx="14" ry="9" fill="#78350f"/>
        <ellipse cx="320" cy="455" rx="14" ry="9" fill="#78350f"/>
        <circle cx="280" cy="455" r="4" fill="#000"/>
        <circle cx="320" cy="455" r="4" fill="#000"/>
        <!-- Slanted desperate mouth -->
        <path d="M 275 490 Q 300 480 325 495" stroke="#92400e" stroke-width="4" fill="none"/>
        <!-- Coffee Mug overflowing -->
        <rect x="60" y="420" width="40" height="50" rx="4" fill="#e2e8f0"/>
        <path d="M 100 430 Q 120 445 100 460" stroke="#e2e8f0" stroke-width="6" fill="none"/>
        <text x="80" y="450" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">CAFFEINE</text>
        <!-- Vibe label -->
        <rect x="150" y="530" width="300" height="40" rx="8" fill="#1f2937" stroke="#ef4444" stroke-width="2"/>
        <text x="300" y="555" font-family="sans-serif" font-size="15" font-weight="bold" fill="#ef4444" text-anchor="middle">"It worked on my machine 5 minutes ago"</text>
      </svg>
    `),
  },
  {
    id: 'sample_cooking',
    title: 'The Culinary Crime',
    category: 'Food Disaster',
    subjectCategory: 'food_chaos',
    hint: 'Burnt mystery substance in a pan with smoke alarm blaring',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#450a0a"/>
        <!-- Frying Pan -->
        <circle cx="280" cy="300" r="170" fill="#18181b" stroke="#3f3f46" stroke-width="12"/>
        <rect x="430" y="285" width="140" height="30" rx="8" fill="#27272a" transform="rotate(15 430 285)"/>
        <!-- Burnt pizza / pancake crime -->
        <circle cx="280" cy="300" r="120" fill="#1c1917"/>
        <circle cx="240" cy="270" r="30" fill="#0c0a09"/>
        <circle cx="330" cy="320" r="40" fill="#292524"/>
        <circle cx="290" cy="340" r="25" fill="#44403c"/>
        <path d="M 200 240 Q 250 280 220 330" stroke="#78350f" stroke-width="8" fill="none"/>
        <!-- Dramatic Smoke Plumes -->
        <path d="M 240 220 Q 210 140 280 80 T 260 20" stroke="#71717a" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.6"/>
        <path d="M 320 220 Q 360 130 300 70 T 340 10" stroke="#a1a1aa" stroke-width="18" stroke-linecap="round" fill="none" opacity="0.5"/>
        <!-- Flames -->
        <polygon points="260,250 280,180 300,250" fill="#f59e0b"/>
        <polygon points="275,245 290,195 305,245" fill="#ef4444"/>
        <!-- Smoke Alarm Widget -->
        <rect x="150" y="520" width="300" height="48" rx="24" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
        <text x="300" y="550" font-family="sans-serif" font-size="16" font-weight="900" fill="#fecaca" text-anchor="middle">🚨 BEEP! BEEP! BEEP! 🚨</text>
      </svg>
    `),
  },
  {
    id: 'sample_dog',
    title: 'VIP Rizz Doggo',
    category: 'Supreme Swagger',
    subjectCategory: 'pet_dog',
    hint: 'Golden retriever wearing aviator sunglasses and heavy gold chain',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <!-- Vibrant Party Background -->
        <defs>
          <linearGradient id="partyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6" />
            <stop offset="50%" stop-color="#ec4899" />
            <stop offset="100%" stop-color="#f59e0b" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#partyGrad)"/>
        <!-- Golden Dog Body -->
        <ellipse cx="300" cy="500" rx="160" ry="120" fill="#f59e0b"/>
        <!-- Dog Head -->
        <circle cx="300" cy="270" r="130" fill="#fbbf24"/>
        <!-- Floppy Ears -->
        <ellipse cx="170" cy="280" rx="45" ry="90" fill="#d97706" transform="rotate(15 170 280)"/>
        <ellipse cx="430" cy="280" rx="45" ry="90" fill="#d97706" transform="rotate(-15 430 280)"/>
        <!-- Snout -->
        <ellipse cx="300" cy="320" rx="60" ry="45" fill="#fef3c7"/>
        <polygon points="280,300 320,300 300,325" fill="#18181b"/>
        <!-- Big Sassy Tongue -->
        <path d="M 290 330 Q 300 380 320 375 Q 330 350 310 330" fill="#f43f5e"/>
        <!-- Cool Sunglasses -->
        <rect x="180" y="210" width="105" height="65" rx="14" fill="#09090b" stroke="#facc15" stroke-width="4"/>
        <rect x="315" y="210" width="105" height="65" rx="14" fill="#09090b" stroke="#facc15" stroke-width="4"/>
        <line x1="285" y1="235" x2="315" y2="235" stroke="#facc15" stroke-width="6"/>
        <!-- Sunglasses Glare -->
        <line x1="200" y1="225" x2="260" y2="225" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
        <line x1="335" y1="225" x2="395" y2="225" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
        <!-- Gold Cuban Chain -->
        <path d="M 210 430 Q 300 490 390 430" stroke="#facc15" stroke-width="16" fill="none" stroke-linecap="round" stroke-dasharray="24 10"/>
        <!-- Badge -->
        <rect x="180" y="535" width="240" height="38" rx="19" fill="#0f172a" stroke="#facc15" stroke-width="2"/>
        <text x="300" y="560" font-family="sans-serif" font-size="16" font-weight="bold" fill="#facc15" text-anchor="middle">👑 +1,000,000 AURA</text>
      </svg>
    `),
  },
  {
    id: 'sample_diy',
    title: 'The Trust Me I Am An Engineer Repair',
    category: 'Dubious DIY',
    subjectCategory: 'diy_fail',
    hint: 'Critical pipe leak repaired with 4 miles of duct tape and a zip tie',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#1e293b"/>
        <!-- Cracked Brick Wall Background -->
        <line x1="0" y1="150" x2="600" y2="150" stroke="#334155" stroke-width="2"/>
        <line x1="0" y1="300" x2="600" y2="300" stroke="#334155" stroke-width="2"/>
        <line x1="0" y1="450" x2="600" y2="450" stroke="#334155" stroke-width="2"/>
        <!-- Pipe Main Sections -->
        <rect x="60" y="240" width="160" height="60" fill="#64748b" stroke="#334155" stroke-width="4"/>
        <rect x="380" y="240" width="160" height="60" fill="#64748b" stroke="#334155" stroke-width="4"/>
        <!-- The Chaotic Tape Monstrosity in Middle -->
        <ellipse cx="300" cy="270" rx="90" ry="70" fill="#94a3b8" stroke="#cbd5e1" stroke-width="6"/>
        <!-- Cross-hatched duct tape layers -->
        <line x1="230" y1="240" x2="370" y2="300" stroke="#e2e8f0" stroke-width="12" stroke-linecap="round"/>
        <line x1="230" y1="300" x2="370" y2="240" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
        <line x1="260" y1="210" x2="340" y2="330" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>
        <!-- Neon Zip-tie -->
        <ellipse cx="270" cy="270" rx="12" ry="60" fill="none" stroke="#22c55e" stroke-width="8" transform="rotate(-15 270 270)"/>
        <!-- Leaking water drops -->
        <circle cx="300" cy="370" r="10" fill="#38bdf8"/>
        <circle cx="300" cy="410" r="8" fill="#38bdf8"/>
        <ellipse cx="300" cy="470" rx="60" ry="15" fill="#0284c7" opacity="0.8"/>
        <!-- Warning sign -->
        <polygon points="300,50 360,140 240,140" fill="#facc15" stroke="#000" stroke-width="4"/>
        <text x="300" y="125" font-family="sans-serif" font-size="40" font-weight="bold" fill="#000" text-anchor="middle">!</text>
        <rect x="160" y="525" width="280" height="42" rx="21" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
        <text x="300" y="552" font-family="sans-serif" font-size="15" font-weight="bold" fill="#4ade80" text-anchor="middle">"Holds up to 500 PSI (in theory)"</text>
      </svg>
    `),
  },
  {
    id: 'sample_gym',
    title: 'The Nuclear Intensity Workout',
    category: 'Gym Motivation Gone Wrong',
    subjectCategory: 'gym_fail',
    hint: 'Veins popping with maximum battle roar while lifting a 1-lb pink dumbbell',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <defs>
          <linearGradient id="gymG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#27272a"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#gymG)"/>
        <!-- Gym Mirror & Neon Light -->
        <line x1="50" y1="40" x2="550" y2="40" stroke="#a855f7" stroke-width="6"/>
        <text x="300" y="80" font-family="sans-serif" font-size="22" font-weight="900" fill="#a855f7" text-anchor="middle" letter-spacing="4">NO PAIN NO GAIN</text>
        <!-- Gym Bro Silhouette -->
        <circle cx="300" cy="250" r="90" fill="#fb923c"/>
        <!-- Red face from sheer exertion -->
        <circle cx="300" cy="250" r="85" fill="#f87171" opacity="0.6"/>
        <!-- Forehead bulging veins -->
        <path d="M 260 200 Q 280 215 270 230" stroke="#7f1d1d" stroke-width="5" fill="none"/>
        <path d="M 330 195 Q 315 210 325 225" stroke="#7f1d1d" stroke-width="5" fill="none"/>
        <!-- Eyes squeezed shut screaming -->
        <path d="M 240 230 L 270 240 L 240 250" stroke="#000" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 360 230 L 330 240 L 360 250" stroke="#000" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Wide open screaming mouth with teeth -->
        <ellipse cx="300" cy="290" rx="35" ry="30" fill="#450a0a"/>
        <rect x="275" y="265" width="50" height="12" fill="#ffffff" rx="4"/>
        <!-- Massive Arm Lifting Tiny Dumbbell -->
        <path d="M 210 320 C 120 340 100 240 160 200" stroke="#fb923c" stroke-width="45" stroke-linecap="round" fill="none"/>
        <!-- The Tiny 1-LB Pink Dumbbell -->
        <circle cx="160" cy="180" r="22" fill="#ec4899"/>
        <circle cx="160" cy="240" r="22" fill="#ec4899"/>
        <rect x="150" y="180" width="20" height="60" fill="#f472b6"/>
        <text x="160" y="215" font-family="sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">1 LB</text>
        <!-- Sweat droplets flying -->
        <ellipse cx="380" cy="220" rx="8" ry="12" fill="#38bdf8" transform="rotate(30 380 220)"/>
        <ellipse cx="210" cy="240" rx="7" ry="10" fill="#38bdf8" transform="rotate(-30 210 240)"/>
        <!-- Footer banner -->
        <rect x="150" y="525" width="300" height="42" rx="21" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>
        <text x="300" y="552" font-family="sans-serif" font-size="15" font-weight="bold" fill="#f472b6" text-anchor="middle">🔥 PRE-WORKOUT KICKED IN 🔥</text>
      </svg>
    `),
  },
];
