export type CampusId = 'KNU' | 'KRSU' | 'AUCA';

export type CrowdLevel = 'free' | 'busy' | 'full';

export type CrowdStatus = 'FREE' | 'BUSY' | 'FULL';

export type TabId = 'map' | 'report' | 'friends' | 'profile';

export type NoiseLevel = 'Quiet' | 'Moderate' | 'Loud';

export type SeatBucket = '0' | '1–5' | '6–10' | '11–20' | '20+';

/** Exact schema for public.crowd_reports */
export interface CrowdReportRow {
  id: string;
  cafe_name: string;
  campus_zone: CampusId;
  crowd_level: CrowdLevel;
  free_seats: number;
  avg_check_kgs: number;
  has_wifi: boolean;
  reporter_name: string;
  lat: number;
  lng: number;
  created_at: string;
}

export type CrowdReportInsert = Omit<CrowdReportRow, 'id' | 'created_at'>;

export interface CampusInfo {
  id: CampusId;
  shortName: string;
  fullName: string;
  street: string;
  cafeCount: number;
  studentCount: number;
  accentColor: string;
  center: [number, number];
}

export interface Cafe {
  id: string;
  name: string;
  campus: CampusId;
  address: string;
  walkMinutes: number;
  avgCheckKgs: number;
  priceAvg: string;
  priceRange: string;
  crowdLevel: CrowdLevel;
  status: CrowdStatus;
  freeSeats: number;
  seatEstimate: string;
  accuracy: number;
  confirmedCount: number;
  confirmedAgo: string;
  updatedAgo: string;
  hasWifi: boolean;
  hasOutlets: boolean;
  noiseLevel: NoiseLevel;
  reporterName: string;
  coords: [number, number];
  iconType: 'coffee' | 'croissant' | 'leaf' | 'utensils';
  thumbVariant: 'warm-latte' | 'sunlit-corner' | 'roastery' | 'bakery';
  urgencyAlert?: string;
  recentReports: CrowdReportRow[];
}

export interface FriendItem {
  id: string;
  name: string;
  campus: CampusId;
  cafeId: string;
  cafeName: string;
  status: CrowdStatus;
  checkedInAgo: string;
  justArrived?: boolean;
  avatarId: 'arsen' | 'aizat' | 'dinara' | 'kamila';
  joined?: boolean;
}

export interface ActiveMeetup {
  id: string;
  title: string;
  cafeId: string;
  cafeName: string;
  status: CrowdStatus;
  timeLabel: string;
  joined: boolean;
}

export interface UserStats {
  name: string;
  campus: CampusId;
  since: string;
  xp: number;
  totalReports: number;
  accuracyRate: number;
  dayStreak: number;
  cafesFound: number;
}
