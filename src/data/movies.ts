import type { Movie, Theatre } from '../types/cinema';

export const MOVIES: Movie[] = [
  {
    id: 'ramayana-2026',
    title: 'Ramayana (2026)',
    year: 2026,
    certificate: 'UA',
    language: 'Hindi',
    formats: ['2D', '3D', 'IMAX'],
    duration: '3h 15m',
    genre: ['Mythological', 'Action', 'Epic'],
    rating: 9.6,
    basePrice: 220,
    tagline: 'The timeless epic reborn in next-generation 3D IMAX',
    poster: '/ramayana-poster.jpg',
    screenImage: '/ramayana-screen.jpg',
    backdrop: '/ramayana-screen.jpg',
    synopsis: 'An epic cinematic reimagining of the timeless legend of Prince Rama, Sita, and the triumph of righteousness over darkness, presented with state-of-the-art visual effects and custom Dolby Atmos mix.',
    director: 'Nitesh Tiwari',
    cast: ['Ranbir Kapoor', 'Sai Pallavi', 'Yash', 'Sunny Deol'],
    category: 'movie'
  },
  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    year: 2024,
    certificate: 'UA 16+',
    language: 'English',
    formats: ['2D', '3D', 'IMAX'],
    duration: '2h 46m',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 9.0,
    basePrice: 200,
    tagline: 'Long live the fighters. An awe-inspiring desert spectacle',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    screenImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, confronting a choice between love and the fate of the universe.',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    category: 'movie'
  },
  {
    id: 'avatar-fire-ash',
    title: 'Avatar: Fire and Ash',
    year: 2025,
    certificate: 'UA',
    language: 'English',
    formats: ['3D', 'IMAX'],
    duration: '3h 10m',
    genre: ['Action', 'Sci-Fi', 'Fantasy'],
    rating: 9.3,
    basePrice: 260,
    tagline: 'Return to Pandora to meet the Ash People in ultra-high frame rate 3D',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    screenImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    synopsis: 'The journey across Pandora expands into the volcanic badlands as the Sully family encounters the aggressive Ash People, pushing the boundaries of immersive 3D technology.',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Oona Chaplin'],
    category: 'movie'
  },
  {
    id: 'interstellar-imax',
    title: 'Interstellar (10th Anniversary IMAX)',
    year: 2024,
    certificate: 'UA',
    language: 'English',
    formats: ['2D', 'IMAX'],
    duration: '2h 49m',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 9.5,
    basePrice: 240,
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    screenImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    synopsis: 'A team of explorers travel through a newly discovered wormhole in space to ensure humanity’s survival in Christopher Nolan’s cinematic tour de force, remastered in 1.43:1 full-height IMAX.',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    category: 'movie'
  },
  {
    id: 'coldplay-live-concert',
    title: 'Coldplay: Music of the Spheres (Live Broadcast)',
    year: 2026,
    certificate: 'U',
    language: 'English',
    formats: ['2D', 'IMAX'],
    duration: '2h 30m',
    genre: ['Live Concert', 'Music', 'Spectacle'],
    rating: 9.7,
    basePrice: 350,
    tagline: 'Experience the world-record stadium tour live with IMAX sound',
    eventDate: 'Sat, 25 Jul · 8:00 PM',
    poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    screenImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
    backdrop: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
    synopsis: 'Join millions of fans worldwide for an electrifying global concert stream direct from River Plate Stadium, featuring lasers, fireworks, and spatial Dolby Atmos audio.',
    director: 'Paul Dugdale',
    cast: ['Chris Martin', 'Jonny Buckland', 'Guy Berryman', 'Will Champion'],
    category: 'concert'
  },
  {
    id: 'champions-league-final',
    title: 'UEFA Champions League Final: Cinema Stadium Broadcast',
    year: 2026,
    certificate: 'U',
    language: 'English / Hindi',
    formats: ['2D', 'IMAX'],
    duration: '3h 00m',
    genre: ['Live Sports', 'Football', 'Championship'],
    rating: 9.8,
    basePrice: 300,
    tagline: 'European football supremacy on the nation’s largest IMAX screens',
    eventDate: 'Sun, 31 May · 11:30 PM',
    poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    screenImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80',
    backdrop: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80',
    synopsis: 'Feel the roar of 80,000 fans in Munich as the continent’s two finest clubs battle for European glory, streamed live in ultra-crisp 4K with stadium acoustics.',
    director: 'UEFA Broadcast Productions',
    cast: ['Top European Finalists', 'Live Commentary Panel'],
    category: 'sports'
  },
  {
    id: 'demon-slayer-midnight',
    title: 'Demon Slayer: Infinity Castle — Midnight IMAX Fan Fest',
    year: 2026,
    certificate: 'UA 16+',
    language: 'Japanese (English Subtitles)',
    formats: ['2D', '3D', 'IMAX'],
    duration: '2h 15m',
    genre: ['Anime', 'Action', 'Dark Fantasy'],
    rating: 9.4,
    basePrice: 280,
    tagline: 'The ultimate battle begins. Exclusive midnight premiere with fan merchandise',
    eventDate: 'Fri, 14 Aug · 11:59 PM',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    screenImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=80',
    backdrop: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=80',
    synopsis: 'Tanjiro and the Demon Slayer Corps plunge into the ever-shifting Infinity Castle for their climactic showdown against Muzan Kibutsuji, rendered in groundbreaking ufotable animation for IMAX.',
    director: 'Haruo Sotozaki',
    cast: ['Natsuki Hanae', 'Akari Kito', 'Hiro Shimono', 'Yoshitsugu Matsuoka'],
    category: 'premiere'
  }
];

// Anonymized Generic Mall / Venue Names (No official names)
export const THEATRES: Theatre[] = [
  {
    id: 'mall-a',
    name: 'Mall A (Central IMAX Arena)',
    city: 'Metro Central',
    location: 'Mall A, Sector 4, Boulevard Avenue',
    screens: ['Audi 1 (Grand IMAX 3D)', 'Audi 2 (4DX Motion)', 'Audi 3 (Dolby Atmos Prime)'],
    facilities: ['IMAX Laser Dual 4K', 'Dolby Atmos 128ch', 'Recliner Loungers', 'Gourmet Lounge'],
    distance: '2.4 km away'
  },
  {
    id: 'mall-b',
    name: 'Mall B (Grand Galleria Cityplex)',
    city: 'Metro Galleria',
    location: 'Mall B, Skyway Plaza, East Corridor',
    screens: ['Audi 1 (IMAX Laser)', 'Audi 2 (Luxury VIP)', 'Audi 3 (3D RealD)'],
    facilities: ['Insignia Recliners', 'Butler on Call', 'Dolby Atmos', 'Valet Parking'],
    distance: '4.6 km away'
  },
  {
    id: 'mall-c',
    name: 'Mall C (West Horizon Mall)',
    city: 'Metro West',
    location: 'Mall C, Promenade Way, Lakeview District',
    screens: ['Audi 1 (Giant Scope Screen)', 'Audi 2 (Dolby 7.1)', 'Audi 3 (Family 2D)'],
    facilities: ['Giant Curved Screen', 'Dolby Sound', 'Spacious Seating', 'Café Lounge'],
    distance: '6.1 km away'
  },
  {
    id: 'mall-d',
    name: 'Mall D (North Promenade Multiplex)',
    city: 'Metro North',
    location: 'Mall D, Apex Commercial Hub, North Sector',
    screens: ['Audi 1 (IMAX 3D Experience)', 'Audi 2 (Prime 2D)'],
    facilities: ['IMAX Sound System', 'Pushback Velvet Seats', 'Parking Arcade'],
    distance: '7.8 km away'
  },
  {
    id: 'mall-e',
    name: 'Mall E (Metropolis Plaza)',
    city: 'Metro Uptown',
    location: 'Mall E, Crescent Heights, Financial Center',
    screens: ['Audi 1 (VIP Recliner IMAX)', 'Audi 2 (Atmos 3D)'],
    facilities: ['Private Box Suites', 'Dolby Spatial Audio', 'VIP Concierge'],
    distance: '9.2 km away'
  }
];

export const SHOWTIMES = [
  { id: 'st-1', time: '10:30 AM', type: 'Morning Show', discount: '₹40 Off Morning Special' },
  { id: 'st-2', time: '1:45 PM', type: 'Matinee', discount: '' },
  { id: 'st-3', time: '4:30 PM', type: 'Evening', discount: '' },
  { id: 'st-4', time: '7:30 PM', type: 'Prime Time', discount: 'Fast Filling' },
  { id: 'st-5', time: '10:15 PM', type: 'Late Night Screening', discount: 'Late Night Special' }
];

export const DATES = [
  { day: 'Today', date: '16 Jul', weekday: 'Thu' },
  { day: 'Tomorrow', date: '17 Jul', weekday: 'Fri', isDefault: true },
  { day: 'Weekend', date: '18 Jul', weekday: 'Sat' },
  { day: 'Weekend', date: '19 Jul', weekday: 'Sun' },
  { day: '', date: '20 Jul', weekday: 'Mon' },
  { day: '', date: '21 Jul', weekday: 'Tue' }
];
