import type { SeatInfo, SeatStatus, SeatTier, MovieFormat } from '../types/cinema';

export function getTierPrice(tier: SeatTier, format: MovieFormat = '3D'): number {
  if (format === '2D') {
    if (tier === 'standard') return 180;
    if (tier === 'premium') return 280;
    return 380; // recliner balcony
  }
  if (format === '3D') {
    if (tier === 'standard') return 220;
    if (tier === 'premium') return 320;
    return 450;
  }
  // IMAX format (Premium large format experience)
  if (tier === 'standard') return 300;
  if (tier === 'premium') return 460;
  return 620;
}

export interface RowConfig {
  row: string;
  section: 'Dress Circle' | 'Premium' | 'Balcony';
  tier: SeatTier;
  price: number;
  leftSeats: number[];
  rightSeats: number[];
}

// 12-Row Authentic Cinema Seating Configuration
// Top side: Balcony (Rows J-L)
// Middle side: Premium (Rows E-I)
// Bottom side: Dress Circle (Rows A-D), nearest to the screen
export const CINEMA_SEAT_CONFIG: RowConfig[] = [
  // SECTION 1: Dress Circle (₹220, Rows A-D, nearest to screen)
  {
    row: 'A',
    section: 'Dress Circle',
    tier: 'standard',
    price: 220,
    leftSeats: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    rightSeats: [22, 23, 24, 25, 26, 27, 28, 29]
  },
  {
    row: 'B',
    section: 'Dress Circle',
    tier: 'standard',
    price: 220,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    rightSeats: [20, 21, 22, 23, 24, 25, 26]
  },
  {
    row: 'C',
    section: 'Dress Circle',
    tier: 'standard',
    price: 220,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    rightSeats: [20, 21, 22, 23, 24, 25, 26]
  },
  {
    row: 'D',
    section: 'Dress Circle',
    tier: 'standard',
    price: 220,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    rightSeats: [20, 21, 22, 23, 24, 25, 26]
  },

  // SECTION 2: Premium (₹320, Rows E-I, center audio-visual sweet spot)
  {
    row: 'E',
    section: 'Premium',
    tier: 'premium',
    price: 320,
    leftSeats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    rightSeats: [17, 18, 19] // Tapered 3 seats
  },
  {
    row: 'F',
    section: 'Premium',
    tier: 'premium',
    price: 320,
    leftSeats: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    rightSeats: [19, 20, 21] // Tapered 3 seats
  },
  {
    row: 'G',
    section: 'Premium',
    tier: 'premium',
    price: 320,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    rightSeats: [21, 22, 23, 24, 25, 26, 27]
  },
  {
    row: 'H',
    section: 'Premium',
    tier: 'premium',
    price: 320,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    rightSeats: [22, 23, 24, 25, 26, 27, 28]
  },
  {
    row: 'I',
    section: 'Premium',
    tier: 'premium',
    price: 320,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    rightSeats: [20, 21, 22, 23, 24, 25]
  },

  // SECTION 3: Balcony (₹450, Rows J-L, elevated top rear tier)
  {
    row: 'J',
    section: 'Balcony',
    tier: 'recliner',
    price: 450,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    rightSeats: [22, 23, 24, 25, 26, 27, 28]
  },
  {
    row: 'K',
    section: 'Balcony',
    tier: 'recliner',
    price: 450,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    rightSeats: [22, 23, 24, 25, 26, 27, 28]
  },
  {
    row: 'L',
    section: 'Balcony',
    tier: 'recliner',
    price: 450,
    leftSeats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    rightSeats: [22, 23, 24, 25, 26, 27, 28]
  }
];

// All booking slots removed per request - all seats are 100% available!
export const DEFAULT_BOOKED_SEATS = new Set<string>();

export interface SeatRatingInfo {
  score: number;
  badge: string;
  category: 'sweetspot' | 'balcony' | 'premium' | 'standard';
  description: string;
}

export const BEST_SWEET_SPOT_SEATS = new Set([
  'H16', 'H17', 'H18', 'H22',
  'G16', 'G17', 'G18', 'G21',
  'F14', 'F15', 'F16',
  'I15', 'I16', 'I17',
  'J16', 'J17', 'J18', 'J22',
  'K16', 'K17'
]);

export function getSeatRating(seatId: string): SeatRatingInfo {
  const row = seatId.charAt(0);
  const col = parseInt(seatId.slice(1), 10);

  // 1. Dolby Atmos & Optical Reference Sweet Spot (Rows G & H, near central aisle 16-18)
  if ((row === 'H' || row === 'G') && (col === 16 || col === 17)) {
    return {
      score: 100,
      badge: 'Dolby Sweet Spot',
      category: 'sweetspot',
      description: 'Reference 38° optical center & balanced Dolby Atmos audio axis'
    };
  }

  if (row === 'H' || row === 'G') {
    if ((col >= 14 && col <= 19) || (col >= 20 && col <= 23)) {
      return {
        score: 97,
        badge: 'Prime Center',
        category: 'sweetspot',
        description: 'Optimal eye-level screen horizon and stereo staging'
      };
    }
  }

  // 2. VIP Balcony Recliner Center (Rows J & K)
  if (row === 'J' || row === 'K' || row === 'L') {
    if (col >= 15 && col <= 23) {
      return {
        score: 95,
        badge: 'VIP Balcony',
        category: 'balcony',
        description: 'Elevated panoramic horizon with ultra-wide recliner luxury'
      };
    }
    return {
      score: 91,
      badge: 'Balcony Recliner',
      category: 'balcony',
      description: 'Spacious elevated rear seating'
    };
  }

  // 3. Premium Rows (E & F)
  if (row === 'F' || row === 'E' || row === 'I') {
    if (col >= 13 && col <= 21) {
      return {
        score: 94,
        badge: 'Prime View',
        category: 'premium',
        description: 'Great immersion with full cinematic field-of-view'
      };
    }
    return {
      score: 89,
      badge: 'Premium Tier',
      category: 'premium',
      description: 'Comfortable mid-auditorium perspective'
    };
  }

  // 4. Dress Circle (Rows A - D)
  if (row === 'D' || row === 'C') {
    if (col >= 14 && col <= 22) {
      return {
        score: 88,
        badge: 'Front IMAX Action',
        category: 'standard',
        description: 'Large-scale immersion filling 100% of peripheral vision'
      };
    }
  }

  return {
    score: 83,
    badge: 'Standard View',
    category: 'standard',
    description: 'Good clear sightline to the curved screen'
  };
}

/**
 * 3D Cinema Coordinate Mapping with Central Aisle
 * - Screen at [0, 3.6, -10.5]
 * - Central walking aisle from x = -0.58 to x = +0.58
 * - Dress Circle: Rows A-D (closest to screen)
 * - Premium: Rows E-I (center sweet spot)
 * - Balcony: Rows J-L (elevated top tier)
 */
export function calculateSeat3DPosition(
  rowIndex: number,
  side: 'left' | 'right',
  seatIndexInSide: number,
  totalInSide: number
): {
  position: [number, number, number];
  rotationY: number;
} {
  let rowZ: number;
  let rowY: number;

  if (rowIndex < 4) {
    // Dress Circle (Rows A-D)
    rowZ = -4.0 + rowIndex * 1.35;
    rowY = 0.35 + rowIndex * 0.32;
  } else if (rowIndex < 9) {
    // Premium (Rows E-I, with walkway gap from Dress Circle)
    const premierIndex = rowIndex - 4;
    rowZ = 1.9 + premierIndex * 1.38;
    rowY = 1.85 + premierIndex * 0.35;
  } else {
    // Balcony (Rows J-L, elevated top tier)
    const balconyIndex = rowIndex - 9;
    rowZ = 9.2 + balconyIndex * 1.42;
    rowY = 3.8 + balconyIndex * 0.42;
  }

  // Realistic seat geometry: 0.58m aisle gap, 0.49m seat width
  const aisleHalfWidth = 0.58;
  const seatWidth = 0.49;

  let x: number;
  if (side === 'left') {
    const indexFromAisle = totalInSide - 1 - seatIndexInSide;
    x = -aisleHalfWidth - (indexFromAisle + 0.5) * seatWidth;
  } else {
    const indexFromAisle = seatIndexInSide;
    x = aisleHalfWidth + (indexFromAisle + 0.5) * seatWidth;
  }

  // Gentle amphitheater arc offset
  const normX = x / 7.5;
  const arcOffset = Math.pow(normX, 2) * 0.32;
  const z = rowZ + arcOffset;
  const rotationY = -normX * 0.05;

  return {
    position: [x, rowY, z],
    rotationY
  };
}

// Calculate realistic cinema booking order (Sweet spots & Balcony fill first, wings & front fill last)
export function getRankedSeatIds(): string[] {
  const allSeatScores: { id: string; score: number }[] = [];

  const rowWeights: Record<string, number> = {
    H: 100,
    G: 97,
    I: 94,
    F: 91,
    J: 89,
    K: 87,
    E: 83,
    L: 80,
    D: 72,
    C: 62,
    B: 50,
    A: 38
  };

  CINEMA_SEAT_CONFIG.forEach((rowConfig) => {
    const { row, leftSeats, rightSeats } = rowConfig;
    const baseRowScore = rowWeights[row] || 70;

    // Left seats: closest to aisle is last item (leftSeats.length - 1)
    leftSeats.forEach((seatNum, idx) => {
      const distFromAisle = leftSeats.length - 1 - idx;
      const centralityScore = Math.max(0, 35 - distFromAisle * 2.8);
      // Couple cluster grouping (pair every 2 seats)
      const pairOffset = idx % 2 === 0 ? 0.8 : -0.8;
      const score = baseRowScore + centralityScore + pairOffset;
      allSeatScores.push({ id: `${row}${seatNum}`, score });
    });

    // Right seats: closest to aisle is first item (idx = 0)
    rightSeats.forEach((seatNum, idx) => {
      const distFromAisle = idx;
      const centralityScore = Math.max(0, 35 - distFromAisle * 2.8);
      const pairOffset = idx % 2 === 0 ? 0.8 : -0.8;
      const score = baseRowScore + centralityScore + pairOffset;
      allSeatScores.push({ id: `${row}${seatNum}`, score });
    });
  });

  return allSeatScores.sort((a, b) => b.score - a.score).map((s) => s.id);
}

// Function to apply an audience density percentage (0 - 100)
export function applyDensityToSeats(
  currentSeats: SeatInfo[],
  densityPercentage: number,
  selectedSeatIds: string[] = [],
  activeViewingSeatId: string = ''
): SeatInfo[] {
  const clampedDensity = Math.max(0, Math.min(100, densityPercentage));
  const rankedIds = getRankedSeatIds();
  const targetCount = Math.round((clampedDensity / 100) * rankedIds.length);

  // Pick top N ranked seats to be booked, skipping any user-selected seat
  const bookedSet = new Set<string>();
  for (const id of rankedIds) {
    if (bookedSet.size >= targetCount) break;
    if (selectedSeatIds.includes(id)) continue;
    if (id === activeViewingSeatId && clampedDensity < 95) continue;
    bookedSet.add(id);
  }

  return currentSeats.map((seat) => {
    if (selectedSeatIds.includes(seat.id)) {
      return { ...seat, status: 'selected' as SeatStatus };
    }
    if (bookedSet.has(seat.id)) {
      return { ...seat, status: 'booked' as SeatStatus };
    }
    return { ...seat, status: 'available' as SeatStatus };
  });
}

export function generateInitialSeats(densityPercentage: number = 35): SeatInfo[] {
  const seats: SeatInfo[] = [];

  CINEMA_SEAT_CONFIG.forEach((rowConfig, rowIndex) => {
    const { row, tier, price, leftSeats, rightSeats } = rowConfig;

    leftSeats.forEach((seatNum, idx) => {
      const id = `${row}${seatNum}`;
      const { position, rotationY } = calculateSeat3DPosition(
        rowIndex,
        'left',
        idx,
        leftSeats.length
      );

      // All seats are available for user exploration and selection
      const status: SeatStatus = 'available';

      seats.push({
        id,
        row,
        col: seatNum,
        rowIndex,
        colIndex: idx,
        status,
        tier,
        price,
        position3D: position,
        rotationY
      });
    });

    rightSeats.forEach((seatNum, idx) => {
      const id = `${row}${seatNum}`;
      const { position, rotationY } = calculateSeat3DPosition(
        rowIndex,
        'right',
        idx,
        rightSeats.length
      );

      // All seats are available for user exploration and selection
      const status: SeatStatus = 'available';

      seats.push({
        id,
        row,
        col: seatNum,
        rowIndex,
        colIndex: idx + leftSeats.length,
        status,
        tier,
        price,
        position3D: position,
        rotationY
      });
    });
  });

  return applyDensityToSeats(seats, densityPercentage, [], 'H17');
}

export function getSeatCameraView(seatId: string): {
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  fov: number;
} {
  const rowLetter = seatId.charAt(0);
  const rowConfigIndex = CINEMA_SEAT_CONFIG.findIndex((r) => r.row === rowLetter);

  if (rowConfigIndex === -1) {
    return getSeatCameraView('H17');
  }

  const rowConfig = CINEMA_SEAT_CONFIG[rowConfigIndex];
  const seatNum = parseInt(seatId.slice(1), 10);

  let side: 'left' | 'right' = 'left';
  let seatIndex = rowConfig.leftSeats.indexOf(seatNum);
  let totalInSide = rowConfig.leftSeats.length;

  if (seatIndex === -1) {
    side = 'right';
    seatIndex = rowConfig.rightSeats.indexOf(seatNum);
    totalInSide = rowConfig.rightSeats.length;
  }

  if (seatIndex === -1) {
    seatIndex = 0;
  }

  const { position } = calculateSeat3DPosition(
    rowConfigIndex,
    side,
    seatIndex,
    totalInSide
  );

  // Guard clamp ensuring eyeX is always comfortably within auditorium interior (-7.4m to +7.4m)
  // Left wall is at -8.8m, so camera never clips through or goes outside the hall!
  const rawEyeX = position[0];
  const eyeX = Math.max(-7.4, Math.min(7.4, rawEyeX));
  const eyeY = position[1] + 0.88;
  const eyeZ = position[2] - 0.05;

  const targetX = 0;
  const targetY = 4.3;
  const targetZ = -10.7;

  const fov = 54 + (11 - rowConfigIndex) * 1.1;

  return {
    cameraPosition: [eyeX, eyeY, eyeZ],
    targetPosition: [targetX, targetY, targetZ],
    fov
  };
}

export const CAMERA_PRESETS = {
  theatreOverview: {
    cameraPosition: [0, 8.8, 15.2] as [number, number, number],
    targetPosition: [0, 3.2, -2.5] as [number, number, number],
    fov: 62
  },
  wideRear: {
    cameraPosition: [0, 6.0, 12.5] as [number, number, number],
    targetPosition: [0, 4.3, -10.7] as [number, number, number],
    fov: 60
  },
  sideAngle: {
    cameraPosition: [7.5, 5.8, 7.8] as [number, number, number],
    targetPosition: [-1.0, 4.1, -8.5] as [number, number, number],
    fov: 58
  }
};
