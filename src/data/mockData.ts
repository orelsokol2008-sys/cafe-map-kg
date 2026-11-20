import {
  ActiveMeetup,
  Cafe,
  CampusId,
  CampusInfo,
  CrowdLevel,
  CrowdReportRow,
  CrowdStatus,
  FriendItem,
  UserStats,
} from '../types';

export const CAMPUSES: Record<CampusId, CampusInfo> = {
  KNU: {
    id: 'KNU',
    shortName: 'KNU',
    fullName: 'Kyrgyz National University',
    street: 'Chui Ave',
    cafeCount: 24,
    studentCount: 1247,
    accentColor: '#382418',
    center: [42.8758, 74.5918],
  },
  KRSU: {
    id: 'KRSU',
    shortName: 'KRSU',
    fullName: 'Kyrgyz-Russian Slavic University',
    street: 'Kievskaya',
    cafeCount: 18,
    studentCount: 984,
    accentColor: '#3D6B99',
    center: [42.8748, 74.6168],
  },
  AUCA: {
    id: 'AUCA',
    shortName: 'AUCA',
    fullName: 'American University of Central Asia',
    street: 'Abdumomunov',
    cafeCount: 21,
    studentCount: 1120,
    accentColor: '#0D7A6B',
    center: [42.8796, 74.6032],
  },
};

interface CafeMetadata {
  id: string;
  address: string;
  walkMinutes: number;
  accuracy: number;
  hasOutlets: boolean;
  iconType: Cafe['iconType'];
  thumbVariant: Cafe['thumbVariant'];
  urgencyAlert?: string;
}

export const CAFE_METADATA_BY_NAME: Record<string, CafeMetadata> = {
  Shokoladnitsa: {
    id: 'shokoladnitsa',
    address: 'Chui Ave',
    walkMinutes: 5,
    accuracy: 89,
    hasOutlets: true,
    iconType: 'coffee',
    thumbVariant: 'warm-latte',
  },
  Meridian: {
    id: 'meridian',
    address: 'Manas Ave',
    walkMinutes: 8,
    accuracy: 92,
    hasOutlets: true,
    iconType: 'croissant',
    thumbVariant: 'bakery',
  },
  Coffeemania: {
    id: 'coffeemania',
    address: 'Chui Ave 158',
    walkMinutes: 6,
    accuracy: 86,
    hasOutlets: true,
    iconType: 'coffee',
    thumbVariant: 'sunlit-corner',
  },
  'Doner Pub': {
    id: 'doner-pub',
    address: 'Kievskaya St',
    walkMinutes: 7,
    accuracy: 91,
    hasOutlets: false,
    iconType: 'utensils',
    thumbVariant: 'roastery',
    urgencyAlert: 'Doner Pub: 3 seats left!',
  },
  Nescafe: {
    id: 'nescafe',
    address: 'Toktogul St & Erkindik',
    walkMinutes: 9,
    accuracy: 84,
    hasOutlets: true,
    iconType: 'coffee',
    thumbVariant: 'warm-latte',
  },
  'Green House': {
    id: 'green-house',
    address: 'Togolok Moldo St',
    walkMinutes: 4,
    accuracy: 90,
    hasOutlets: true,
    iconType: 'leaf',
    thumbVariant: 'sunlit-corner',
  },
  'Sierra Coffee': {
    id: 'sierra-krsu',
    address: 'Kievskaya St 44',
    walkMinutes: 3,
    accuracy: 93,
    hasOutlets: true,
    iconType: 'coffee',
    thumbVariant: 'roastery',
  },
  'Adriano Coffee': {
    id: 'adriano-krsu',
    address: 'Shopokov St',
    walkMinutes: 4,
    accuracy: 87,
    hasOutlets: true,
    iconType: 'croissant',
    thumbVariant: 'bakery',
  },
  'Vanilla Sky': {
    id: 'vanilla-sky',
    address: 'Chui Ave 114',
    walkMinutes: 5,
    accuracy: 90,
    hasOutlets: false,
    iconType: 'coffee',
    thumbVariant: 'sunlit-corner',
    urgencyAlert: 'Vanilla Sky: 2 seats left!',
  },
  'Bublik Bakery': {
    id: 'bublik-krsu',
    address: 'Gogol St',
    walkMinutes: 2,
    accuracy: 91,
    hasOutlets: true,
    iconType: 'croissant',
    thumbVariant: 'bakery',
  },
  'Biscuit Cafe': {
    id: 'biscuit-auca',
    address: 'Abdumomunov St',
    walkMinutes: 3,
    accuracy: 95,
    hasOutlets: true,
    iconType: 'croissant',
    thumbVariant: 'bakery',
  },
  'Pishpek Roasters': {
    id: 'pishpek-roasters',
    address: 'Erkindik Blvd 58',
    walkMinutes: 4,
    accuracy: 90,
    hasOutlets: true,
    iconType: 'coffee',
    thumbVariant: 'roastery',
  },
  'Social Coffee': {
    id: 'social-coffee',
    address: 'Panfilov St',
    walkMinutes: 5,
    accuracy: 85,
    hasOutlets: true,
    iconType: 'leaf',
    thumbVariant: 'warm-latte',
  },
  'Capito Express': {
    id: 'capito-express',
    address: 'Abdumomunov St 220',
    walkMinutes: 2,
    accuracy: 88,
    hasOutlets: false,
    iconType: 'coffee',
    thumbVariant: 'sunlit-corner',
    urgencyAlert: 'Capito Express: 1 seat left!',
  },
};

const now = Date.now();
const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();

export const INITIAL_CROWD_REPORTS: CrowdReportRow[] = [
  // Latest reports per cafe (ordered desc by created_at)
  {
    id: '11111111-1111-4111-8111-111111111101',
    cafe_name: 'Shokoladnitsa',
    campus_zone: 'KNU',
    crowd_level: 'free',
    free_seats: 15,
    avg_check_kgs: 180,
    has_wifi: true,
    reporter_name: 'Arsen M.',
    lat: 42.8755,
    lng: 74.5882,
    created_at: minsAgo(2),
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    cafe_name: 'Doner Pub',
    campus_zone: 'KNU',
    crowd_level: 'full',
    free_seats: 3,
    avg_check_kgs: 280,
    has_wifi: true,
    reporter_name: 'Timur K.',
    lat: 42.876,
    lng: 74.5985,
    created_at: minsAgo(3),
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    cafe_name: 'Sierra Coffee',
    campus_zone: 'KRSU',
    crowd_level: 'free',
    free_seats: 15,
    avg_check_kgs: 240,
    has_wifi: true,
    reporter_name: 'Aizat D.',
    lat: 42.8746,
    lng: 74.6152,
    created_at: minsAgo(4),
  },
  {
    id: '11111111-1111-4111-8111-111111111104',
    cafe_name: 'Biscuit Cafe',
    campus_zone: 'AUCA',
    crowd_level: 'free',
    free_seats: 12,
    avg_check_kgs: 230,
    has_wifi: true,
    reporter_name: 'Dinara K.',
    lat: 42.8798,
    lng: 74.6042,
    created_at: minsAgo(4),
  },
  {
    id: '11111111-1111-4111-8111-111111111105',
    cafe_name: 'Coffeemania',
    campus_zone: 'KNU',
    crowd_level: 'busy',
    free_seats: 5,
    avg_check_kgs: 250,
    has_wifi: true,
    reporter_name: 'Aizat D.',
    lat: 42.8781,
    lng: 74.5934,
    created_at: minsAgo(5),
  },
  {
    id: '11111111-1111-4111-8111-111111111106',
    cafe_name: 'Meridian',
    campus_zone: 'KNU',
    crowd_level: 'free',
    free_seats: 12,
    avg_check_kgs: 220,
    has_wifi: true,
    reporter_name: 'Dinara K.',
    lat: 42.8784,
    lng: 74.5852,
    created_at: minsAgo(5),
  },
  {
    id: '11111111-1111-4111-8111-111111111107',
    cafe_name: 'Green House',
    campus_zone: 'KNU',
    crowd_level: 'free',
    free_seats: 9,
    avg_check_kgs: 190,
    has_wifi: true,
    reporter_name: 'Kamila B.',
    lat: 42.8732,
    lng: 74.589,
    created_at: minsAgo(6),
  },
  {
    id: '11111111-1111-4111-8111-111111111108',
    cafe_name: 'Vanilla Sky',
    campus_zone: 'KRSU',
    crowd_level: 'full',
    free_seats: 0,
    avg_check_kgs: 280,
    has_wifi: true,
    reporter_name: 'Anonymous',
    lat: 42.8768,
    lng: 74.6126,
    created_at: minsAgo(7),
  },
  {
    id: '11111111-1111-4111-8111-111111111109',
    cafe_name: 'Pishpek Roasters',
    campus_zone: 'AUCA',
    crowd_level: 'free',
    free_seats: 8,
    avg_check_kgs: 200,
    has_wifi: true,
    reporter_name: 'Bermet T.',
    lat: 42.8806,
    lng: 74.6068,
    created_at: minsAgo(8),
  },
  {
    id: '11111111-1111-4111-8111-111111111110',
    cafe_name: 'Adriano Coffee',
    campus_zone: 'KRSU',
    crowd_level: 'busy',
    free_seats: 4,
    avg_check_kgs: 210,
    has_wifi: true,
    reporter_name: 'Nursultan A.',
    lat: 42.8764,
    lng: 74.6194,
    created_at: minsAgo(9),
  },
  {
    id: '11111111-1111-4111-8111-111111111111',
    cafe_name: 'Capito Express',
    campus_zone: 'AUCA',
    crowd_level: 'full',
    free_seats: 0,
    avg_check_kgs: 170,
    has_wifi: true,
    reporter_name: 'Anonymous',
    lat: 42.8812,
    lng: 74.6012,
    created_at: minsAgo(10),
  },
  {
    id: '11111111-1111-4111-8111-111111111112',
    cafe_name: 'Nescafe',
    campus_zone: 'KNU',
    crowd_level: 'busy',
    free_seats: 3,
    avg_check_kgs: 150,
    has_wifi: true,
    reporter_name: 'Eldar B.',
    lat: 42.8726,
    lng: 74.5988,
    created_at: minsAgo(11),
  },
  {
    id: '11111111-1111-4111-8111-111111111113',
    cafe_name: 'Social Coffee',
    campus_zone: 'AUCA',
    crowd_level: 'busy',
    free_seats: 4,
    avg_check_kgs: 260,
    has_wifi: true,
    reporter_name: 'Sanzhar R.',
    lat: 42.8786,
    lng: 74.5994,
    created_at: minsAgo(12),
  },
  {
    id: '11111111-1111-4111-8111-111111111114',
    cafe_name: 'Bublik Bakery',
    campus_zone: 'KRSU',
    crowd_level: 'free',
    free_seats: 10,
    avg_check_kgs: 160,
    has_wifi: true,
    reporter_name: 'Alina M.',
    lat: 42.8732,
    lng: 74.6208,
    created_at: minsAgo(14),
  },
  // Historical reports so Detail view shows recent report history
  {
    id: '11111111-1111-4111-8111-111111111115',
    cafe_name: 'Shokoladnitsa',
    campus_zone: 'KNU',
    crowd_level: 'free',
    free_seats: 12,
    avg_check_kgs: 180,
    has_wifi: true,
    reporter_name: 'Dinara K.',
    lat: 42.8755,
    lng: 74.5882,
    created_at: minsAgo(18),
  },
  {
    id: '11111111-1111-4111-8111-111111111116',
    cafe_name: 'Shokoladnitsa',
    campus_zone: 'KNU',
    crowd_level: 'busy',
    free_seats: 6,
    avg_check_kgs: 180,
    has_wifi: true,
    reporter_name: 'Anonymous',
    lat: 42.8755,
    lng: 74.5882,
    created_at: minsAgo(36),
  },
  {
    id: '11111111-1111-4111-8111-111111111117',
    cafe_name: 'Meridian',
    campus_zone: 'KNU',
    crowd_level: 'free',
    free_seats: 14,
    avg_check_kgs: 220,
    has_wifi: true,
    reporter_name: 'Kamila B.',
    lat: 42.8784,
    lng: 74.5852,
    created_at: minsAgo(22),
  },
  {
    id: '11111111-1111-4111-8111-111111111118',
    cafe_name: 'Coffeemania',
    campus_zone: 'KNU',
    crowd_level: 'busy',
    free_seats: 4,
    avg_check_kgs: 250,
    has_wifi: true,
    reporter_name: 'Arsen M.',
    lat: 42.8781,
    lng: 74.5934,
    created_at: minsAgo(25),
  },
];

export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60_000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function levelToStatus(level: CrowdLevel): CrowdStatus {
  if (level === 'free') return 'FREE';
  if (level === 'busy') return 'BUSY';
  return 'FULL';
}

export function slugifyCafeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function estimateWalkMinutes(campus: CampusId, lat: number, lng: number): number {
  const center = CAMPUSES[campus].center;
  const distKm = Math.hypot((lat - center[0]) * 111, (lng - center[1]) * 81);
  return Math.max(2, Math.min(18, Math.round(distKm * 12)));
}

/**
 * Reduce ordered-desc public.crowd_reports rows into the latest state per cafe_name
 * while keeping the recent report rows attached for Detail view.
 */
export function reduceReportsToCafes(reports: CrowdReportRow[]): Cafe[] {
  const sorted = [...reports].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const grouped = new Map<string, CrowdReportRow[]>();
  for (const row of sorted) {
    const key = row.cafe_name.trim();
    const list = grouped.get(key) || [];
    list.push(row);
    grouped.set(key, list);
  }

  const cafes: Cafe[] = [];

  for (const [cafeName, rows] of grouped.entries()) {
    const latest = rows[0];
    const meta = CAFE_METADATA_BY_NAME[cafeName];
    const status = levelToStatus(latest.crowd_level);
    const updatedAgo = formatRelativeTime(latest.created_at);

    const seatEstimate =
      latest.crowd_level === 'free'
        ? `Est. ${latest.free_seats} seats available`
        : latest.crowd_level === 'busy'
        ? `Est. ${latest.free_seats} seats left`
        : latest.free_seats > 0
        ? `${latest.free_seats} seats left — wait ~10 min`
        : 'No seats — wait ~10–15 min';

    const noiseLevel =
      latest.crowd_level === 'free'
        ? 'Quiet'
        : latest.crowd_level === 'busy'
        ? 'Moderate'
        : 'Loud';

    const walkMinutes =
      meta?.walkMinutes ?? estimateWalkMinutes(latest.campus_zone, latest.lat, latest.lng);

    const lowPrice = Math.max(100, latest.avg_check_kgs);
    const highPrice = lowPrice + 250;

    cafes.push({
      id: meta?.id ?? slugifyCafeName(cafeName),
      name: cafeName,
      campus: latest.campus_zone,
      address: meta?.address ?? `${latest.campus_zone} Zone`,
      walkMinutes,
      avgCheckKgs: latest.avg_check_kgs,
      priceAvg: `${latest.avg_check_kgs} KGS`,
      priceRange: `${lowPrice}–${highPrice} KGS`,
      crowdLevel: latest.crowd_level,
      status,
      freeSeats: latest.free_seats,
      seatEstimate,
      accuracy: meta?.accuracy ?? 90,
      confirmedCount: Math.max(4, rows.length * 4 + 6),
      confirmedAgo: updatedAgo,
      updatedAgo,
      hasWifi: latest.has_wifi,
      hasOutlets: meta?.hasOutlets ?? true,
      noiseLevel,
      reporterName: latest.reporter_name || 'Anonymous',
      coords: [latest.lat, latest.lng],
      iconType: meta?.iconType ?? 'coffee',
      thumbVariant: meta?.thumbVariant ?? 'warm-latte',
      urgencyAlert:
        latest.crowd_level === 'full' && latest.free_seats > 0
          ? `${cafeName}: ${latest.free_seats} seats left!`
          : meta?.urgencyAlert,
      recentReports: rows.slice(0, 4),
    });
  }

  return cafes;
}

export const INITIAL_FRIENDS: FriendItem[] = [
  {
    id: 'f1',
    name: 'Arsen M.',
    campus: 'KNU',
    cafeId: 'shokoladnitsa',
    cafeName: 'Shokoladnitsa',
    status: 'FREE',
    checkedInAgo: '8 min ago',
    avatarId: 'arsen',
    joined: false,
  },
  {
    id: 'f2',
    name: 'Aizat D.',
    campus: 'KRSU',
    cafeId: 'coffeemania',
    cafeName: 'Coffeemania',
    status: 'BUSY',
    checkedInAgo: '12 min ago',
    avatarId: 'aizat',
    joined: false,
  },
  {
    id: 'f3',
    name: 'Dinara K.',
    campus: 'AUCA',
    cafeId: 'meridian',
    cafeName: 'Meridian',
    status: 'FREE',
    checkedInAgo: '5 min ago — just arrived!',
    justArrived: true,
    avatarId: 'dinara',
    joined: false,
  },
  {
    id: 'f4',
    name: 'Kamila B.',
    campus: 'KNU',
    cafeId: 'green-house',
    cafeName: 'Green House',
    status: 'BUSY',
    checkedInAgo: '22 min ago',
    avatarId: 'kamila',
    joined: false,
  },
];

export const INITIAL_MEETUPS: ActiveMeetup[] = [
  {
    id: 'm1',
    title: "Aizat's Meetup",
    cafeId: 'coffeemania',
    cafeName: 'Coffeemania',
    status: 'BUSY',
    timeLabel: 'Today 15:30',
    joined: false,
  },
];

export const INITIAL_USER: UserStats = {
  name: 'Aizat Dzhaksybekov',
  campus: 'KNU',
  since: 'September 2025',
  xp: 1240,
  totalReports: 128,
  accuracyRate: 94,
  dayStreak: 14,
  cafesFound: 37,
};
