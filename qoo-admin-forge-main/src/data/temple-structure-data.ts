import type { Temple, ChildTemple, Sacred, Zone, HallRoom, Counter } from '@/types/temple-structure';

// Dummy data for temple structure module
export const dummyTemples: Temple[] = [
  {
    id: 'temple-1',
    name: 'Sri Venkateswara Temple',
    location: 'Tirumala, Andhra Pradesh',
    description: 'Main temple dedicated to Lord Venkateswara',
    deity: 'Lord Venkateswara',
    contactPhone: '+91 877 223 1234',
    contactEmail: 'info@tirumala.org',
    contactAddress: 'Tirumala, Chittoor District, Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1621427638419-3f0cf4423509?w=800&q=80',
    status: 'active',
    isPrimary: true,
    operationalStatus: 'open',
    facilities: ['Parking', 'Prasadam', 'Accommodation', 'Library'],
    dressCode: 'Traditional attire required. Men: Dhoti/Kurta. Women: Saree/Churidar.',
    darshanTimings: {
      open: '03:00 AM',
      close: '11:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    templeHistory: 'Ancient temple with rich history...',
    gpsCoordinates: {
      latitude: 13.6775,
      longitude: 79.3458,
    },
    geoFencingRadius: 500,
    customFields: {},
    statusHistory: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const dummyChildTemples: ChildTemple[] = [
  {
    id: 'child-1',
    name: 'Sri Padmavathi Temple',
    parentTempleId: 'temple-1',
    location: 'Tiruchanur, Andhra Pradesh',
    description: 'Temple dedicated to Goddess Padmavathi',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    status: 'active',
    distance: 5.2,
    gpsCoordinates: {
      latitude: 13.6500,
      longitude: 79.3500,
    },
    customFields: {},
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const dummySacreds: Sacred[] = [
  {
    id: 'sacred-2',
    name: 'Sri Raghavendra Brindavana',
    sacredType: 'brindavana',
    associatedTempleId: 'temple-1',
    associatedTempleType: 'temple',
    description: 'Sacred Brindavana of Sri Raghavendra Swamy, a revered saint and philosopher.',
    image: 'https://images.unsplash.com/photo-1609619385076-36a873425636?w=800&q=80',
    status: 'active',
    saintName: 'Sri Raghavendra Swamy',
    saintTitle: 'Paramahamsa',
    samadhiDate: '1671-08-24',
    mathAffiliation: 'Mantralayam',
    historicalNotes: 'Sri Raghavendra Swamy entered Brindavana in 1671 at Mantralayam. He is believed to be still alive in deep meditation within the Brindavana.',
    festivals: [
      { name: 'Aradhana', date: '2024-08-24' },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sacred-3',
    name: 'Sri Vyasaraja Samadhi',
    sacredType: 'samadhi',
    associatedTempleId: 'child-1',
    associatedTempleType: 'child_temple',
    description: 'Memorial shrine of Sri Vyasaraja, the great Dvaita philosopher and saint.',
    image: 'https://images.unsplash.com/photo-1567591370504-80ae8db15e83?w=800&q=80',
    status: 'active',
    saintName: 'Sri Vyasaraja',
    saintTitle: 'Jagadguru',
    samadhiDate: '1539-03-08',
    mathAffiliation: 'Sosaale Math',
    historicalNotes: 'Sri Vyasaraja was the royal guru of the Vijayanagara Empire and authored key works on Dvaita philosophy.',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const dummyZones: Zone[] = [
  {
    id: 'zone-1',
    name: 'Main Sanctum Zone',
    zoneType: 'worship',
    associatedTempleId: 'temple-1',
    associatedTempleType: 'temple',
    capacity: 500,
    description: 'Main darshan area',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const dummyHallRooms: HallRoom[] = [
  {
    id: 'hall-1',
    name: 'Main Darshan Hall',
    type: 'marriage_hall',
    zoneId: 'zone-1',
    capacity: 350,
    description: 'Main hall for darshan and temple events',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    facilities: ['Sound System', 'Lighting', 'Stage'],
    isBookable: true,
    maintenanceSchedule: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const dummyCounters: Counter[] = [
  {
    id: 'counter-1',
    name: 'Seva Booking Counter',
    counterType: 'seva',
    hallRoomId: 'hall-1',
    associatedTempleId: 'temple-1',
    associatedTempleType: 'temple',
    description: 'Main seva booking counter located at the entrance of the darshan hall.',
    servicePricing: {
      baseRate: 100,
      currency: 'INR',
    },
    shiftTimings: [
      { day: 'Monday', openTime: '06:00', closeTime: '20:00' },
    ],
    paymentMethods: ['cash', 'card', 'upi'],
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    createdAt: '2024-01-01T00:00:00Z',
  },
];
