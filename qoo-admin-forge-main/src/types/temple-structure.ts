// Temple Structure Types

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

export interface DarshanTimings {
  open: string;
  close: string;
  days: string[];
}

export interface StatusHistoryEntry {
  date: string;
  status: string;
  changedBy: string;
  reason?: string;
}

export interface Temple {
  id: string;
  name: string;
  location: string;
  description?: string;
  deity?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  image?: string;
  status: 'active' | 'inactive';
  isPrimary: boolean;
  operationalStatus?: 'open' | 'closed' | 'maintenance';
  facilities?: string[];
  dressCode?: string;
  darshanTimings?: DarshanTimings;
  templeHistory?: string;
  gpsCoordinates?: GPSCoordinates;
  geoFencingRadius?: number;
  customFields?: Record<string, string>;
  statusHistory?: StatusHistoryEntry[];
  createdAt: string;
}

export interface ChildTemple {
  id: string;
  name: string;
  parentTempleId: string;
  location: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
  distance?: number;
  gpsCoordinates?: GPSCoordinates;
  customFields?: Record<string, string>;
  createdAt: string;
  [key: string]: any;
}

export type SacredType = 'deity' | 'samadhi' | 'brindavana' | 'adhisthana' | 'memorial' | 'other';
export const sacredTypeLabels: Record<SacredType, string> = {
  deity: 'Deity',
  samadhi: 'Samadhi',
  brindavana: 'Brindavana',
  adhisthana: 'Adhisthana',
  memorial: 'Memorial Shrine',
  other: 'Other',
};

export interface Sacred {
  id: string;
  name: string;
  sacredType: SacredType;
  associatedTempleId: string;
  associatedTempleType: 'temple' | 'child_temple';
  description?: string;
  image?: string;
  images?: string[];
  status: 'active' | 'inactive';
  festivals?: Array<Record<string, any>>;
  abhishekamSchedule?: Array<{ day: string; time: string; type: string }>;
  // Saint / Jagadguru fields
  saintName?: string;
  saintTitle?: string;
  samadhiDate?: string;
  mathAffiliation?: string;
  historicalNotes?: string;
  saintImage?: string;
  createdAt: string;
  [key: string]: any;
}

export type ZoneType = 'worship' | 'queue' | 'dining' | 'accommodation' | 'ritual' | 'public_courtyard' | 'parking' | 'administrative' | 'garden' | 'other';
export const zoneTypeLabels: Record<ZoneType, string> = {
  worship: 'Worship Zone',
  queue: 'Queue Area',
  dining: 'Dining Zone',
  accommodation: 'Accommodation Block',
  ritual: 'Ritual Area',
  public_courtyard: 'Public Courtyard',
  parking: 'Parking Area',
  administrative: 'Administrative Zone',
  garden: 'Garden / Green Area',
  other: 'Other',
};

export interface Zone {
  id: string;
  name: string;
  zoneType: ZoneType;
  associatedTempleId: string;
  associatedTempleType: 'temple' | 'child_temple';
  capacity?: number;
  description?: string;
  mapReference?: string;
  status: 'active' | 'inactive';
  image?: string;
  images?: string[];
  createdAt: string;
  [key: string]: any;
}

export type HallRoomType = 'marriage_hall' | 'dining_hall' | 'guest_room' | 'office' | 'storage' | 'meditation_hall' | 'lecture_hall' | 'other';
export const hallRoomTypeLabels: Record<HallRoomType, string> = {
  marriage_hall: 'Marriage Hall',
  dining_hall: 'Dining Hall',
  guest_room: 'Guest Room',
  office: 'Office',
  storage: 'Storage Room',
  meditation_hall: 'Meditation Hall',
  lecture_hall: 'Lecture Hall',
  other: 'Other',
};

export interface HallRoom {
  id: string;
  name: string;
  type: HallRoomType;
  zoneId: string;
  capacity?: number;
  description?: string;
  status: 'active' | 'inactive';
  image?: string;
  images?: string[];
  facilities?: string[];
  floorNumber?: number;
  isBookable?: boolean;
  bookingRates?: { hourly: number; daily: number; special: number };
  hasAC?: boolean;
  roomType?: string;
  maintenanceStatus?: string;
  maintenanceSchedule?: Array<Record<string, any>>;
  createdAt: string;
  [key: string]: any;
}

export type CounterType = 'seva' | 'donation' | 'information' | 'ticket' | 'prasadam' | 'booking' | 'other';
export const counterTypeLabels: Record<CounterType, string> = {
  seva: 'Seva Counter',
  donation: 'Donation Counter',
  information: 'Information Desk',
  ticket: 'Ticket Counter',
  prasadam: 'Prasadam Counter',
  booking: 'Booking Counter',
  other: 'Other',
};

export interface ServicePricing {
  baseRate: number;
  currency: string;
  specialRate?: number;
}

export interface ShiftTiming {
  day: string;
  openTime: string;
  closeTime: string;
}

export interface StaffAllocation {
  staffId: string;
  shift: string;
}

export interface PerformanceMetrics {
  transactions: number;
  revenue: number;
  avgWaitTime: number;
}

export interface Counter {
  id: string;
  name: string;
  counterType: CounterType;
  hallRoomId: string;
  associatedTempleId?: string;
  associatedTempleType?: 'temple' | 'child_temple';
  description?: string;
  servicePricing?: ServicePricing;
  shiftTimings?: ShiftTiming[];
  staffAllocation?: StaffAllocation[];
  paymentMethods?: string[];
  analyticsEnabled?: boolean;
  performanceMetrics?: PerformanceMetrics;
  status: 'active' | 'inactive';
  image?: string;
  images?: string[];
  createdAt: string;
  [key: string]: any;
}
