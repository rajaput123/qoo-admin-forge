export type VipInfo = {
  status: "Active" | "Expired" | "Inactive";
  category: string;
  level: string;
  validFrom: string;
  validTill: string;
  sensitive: boolean;
  approvedBy?: string;
  notes?: string;
};

export type Devotee = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  dob: string;
  gender: string;
  preferredLanguage: string;
  pincode: string;
  address: string;
  tags: string[];
  source: string;
  notes: string;
  totalBookings: number;
  totalDonations: number;
  isVolunteer: boolean;
  volunteerStatus: string;
  lastVisit: string;
  status: string;
  bookings: { id: string; offering: string; type: string; date: string; status: string; amount: number }[];
  donations: { date: string; amount: number; structure: string; purpose: string; receipt: string }[];
  visits: { date: string; type: string; duration: string }[];
  experiencePosts: { date: string; content: string; rating: number; status: string }[];
  commLogs: { date: string; channel: string; subject: string; status: string }[];
  volunteerData?: { skills: string[]; events: number; hours: number; availability: string; department: string };
  customFields: Record<string, string>;
  vip?: VipInfo;
};

export const devoteesData: Devotee[] = [
  {
    id: "DEV-0001",
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    email: "ramesh@email.com",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    dob: "1985-03-15",
    gender: "Male",
    preferredLanguage: "Kannada",
    pincode: "560001",
    address: "12, MG Road",
    tags: ["Donor"], // VIP will be derived from vip overlay
    source: "Walk-in",
    notes: "Regular participant in major festivals",
    totalBookings: 28,
    totalDonations: 125000,
    isVolunteer: false,
    volunteerStatus: "Not Converted",
    lastVisit: "2026-02-09",
    status: "Active",
    bookings: [
      { id: "BK-0001", offering: "Suprabhatam", type: "Ritual", date: "2026-02-09", status: "Confirmed", amount: 1000 },
      { id: "BK-0021", offering: "VIP Darshan", type: "Darshan", date: "2026-02-05", status: "Completed", amount: 300 },
    ],
    donations: [
      { date: "2026-02-05", amount: 25000, structure: "Main Temple", purpose: "Annadanam", receipt: "RCP-2026-0045" },
      { date: "2026-01-10", amount: 50000, structure: "Main Temple", purpose: "Temple Renovation", receipt: "RCP-2026-0012" },
    ],
    visits: [
      { date: "2026-02-09", type: "Darshan", duration: "1h 30m" },
      { date: "2026-02-05", type: "Seva", duration: "2h" },
    ],
    experiencePosts: [
      { date: "2026-02-06", content: "Beautiful morning archana experience", rating: 5, status: "Approved" },
    ],
    commLogs: [
      { date: "2026-02-08", channel: "SMS", subject: "Festival reminder", status: "Delivered" },
    ],
    customFields: {},
    vip: {
      status: "Active",
      category: "High Donor",
      level: "Platinum",
      validFrom: "2025-03-01",
      validTill: "2026-02-28",
      sensitive: false,
      approvedBy: "Temple Admin",
      notes: "Founding donor tier",
    },
  },
  {
    id: "DEV-0002",
    name: "Lakshmi Devi",
    phone: "+91 87654 32109",
    email: "lakshmi@email.com",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    dob: "1978-08-22",
    gender: "Female",
    preferredLanguage: "Tamil",
    pincode: "600001",
    address: "45, Anna Salai",
    tags: ["Donor", "Festival Participant"], // VIP derived from vip overlay
    source: "Online",
    notes: "Very dedicated volunteer",
    totalBookings: 42,
    totalDonations: 85000,
    isVolunteer: true,
    volunteerStatus: "Active",
    lastVisit: "2026-02-08",
    status: "Active",
    bookings: [
      { id: "BK-0002", offering: "Archana", type: "Ritual", date: "2026-02-08", status: "Completed", amount: 100 },
    ],
    donations: [
      { date: "2026-01-28", amount: 15000, structure: "Padmavathi Shrine", purpose: "Flower Donation", receipt: "RCP-2026-0038" },
    ],
    visits: [
      { date: "2026-02-08", type: "Volunteer Duty", duration: "6h" },
    ],
    experiencePosts: [],
    commLogs: [
      { date: "2026-02-07", channel: "WhatsApp", subject: "Volunteer schedule", status: "Read" },
    ],
    volunteerData: {
      skills: ["Cooking", "Admin"],
      events: 12,
      hours: 96,
      availability: "Weekends",
      department: "Annadanam",
    },
    customFields: {},
    vip: {
      status: "Active",
      category: "Volunteer Donor",
      level: "Gold",
      validFrom: "2025-05-01",
      validTill: "2026-03-05",
      sensitive: true,
      approvedBy: "Trustee Board",
      notes: "Handles sensitive donor communications",
    },
  },
  {
    id: "DEV-0003",
    name: "Suresh Reddy",
    phone: "+91 76543 21098",
    email: "suresh@email.com",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    dob: "1990-11-05",
    gender: "Male",
    preferredLanguage: "Telugu",
    pincode: "500001",
    address: "78, Banjara Hills",
    tags: ["Regular Devotee", "Donor"],
    source: "Festival",
    notes: "",
    totalBookings: 18,
    totalDonations: 65000,
    isVolunteer: false,
    volunteerStatus: "Not Converted",
    lastVisit: "2026-02-01",
    status: "Active",
    bookings: [
      { id: "BK-0003", offering: "Abhishekam", type: "Ritual", date: "2026-02-01", status: "Completed", amount: 2000 },
    ],
    donations: [
      { date: "2026-02-01", amount: 10000, structure: "Main Temple", purpose: "General", receipt: "RCP-2026-0041" },
    ],
    visits: [
      { date: "2026-02-01", type: "Darshan", duration: "45m" },
    ],
    experiencePosts: [],
    commLogs: [],
    customFields: {},
  },
  // Remaining devotees copied from DevoteesList without vip overlay
  {
    id: "DEV-0004",
    name: "Priya Sharma",
    phone: "+91 65432 10987",
    email: "priya@email.com",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    dob: "1995-01-20",
    gender: "Female",
    preferredLanguage: "Hindi",
    pincode: "400001",
    address: "23, Marine Drive",
    tags: ["Regular Devotee"],
    source: "Referral",
    notes: "",
    totalBookings: 12,
    totalDonations: 52000,
    isVolunteer: false,
    volunteerStatus: "Not Converted",
    lastVisit: "2026-01-15",
    status: "Active",
    bookings: [
      { id: "BK-0004", offering: "Morning Darshan", type: "Darshan", date: "2026-01-15", status: "Completed", amount: 0 },
    ],
    donations: [
      { date: "2026-01-15", amount: 5000, structure: "Varadaraja Shrine", purpose: "Seva Sponsorship", receipt: "RCP-2026-0025" },
    ],
    visits: [],
    experiencePosts: [],
    commLogs: [],
    customFields: {},
  },
  {
    id: "DEV-0005",
    name: "Anand Verma",
    phone: "+91 54321 09876",
    email: "",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    dob: "1982-06-30",
    gender: "Male",
    preferredLanguage: "Marathi",
    pincode: "411001",
    address: "56, FC Road",
    tags: ["Donor", "Festival Participant"],
    source: "Festival",
    notes: "Helps during major festivals",
    totalBookings: 22,
    totalDonations: 48000,
    isVolunteer: true,
    volunteerStatus: "Active",
    lastVisit: "2026-02-08",
    status: "Active",
    bookings: [
      { id: "BK-0005", offering: "VIP Darshan", type: "Darshan", date: "2026-02-08", status: "Confirmed", amount: 600 },
    ],
    donations: [
      { date: "2026-02-08", amount: 20000, structure: "Main Temple", purpose: "Festival Contribution", receipt: "RCP-2026-0052" },
    ],
    visits: [
      { date: "2026-02-08", type: "Festival", duration: "4h" },
    ],
    experiencePosts: [
      { date: "2026-02-09", content: "Amazing festival arrangement this year!", rating: 4, status: "Pending" },
    ],
    commLogs: [
      { date: "2026-02-06", channel: "Email", subject: "Festival invite", status: "Delivered" },
    ],
    volunteerData: {
      skills: ["Crowd Control", "Ritual Support"],
      events: 8,
      hours: 64,
      availability: "Festival Only",
      department: "Operations",
    },
    customFields: {},
  },
  {
    id: "DEV-0006",
    name: "Meena Iyer",
    phone: "+91 43210 98765",
    email: "meena@email.com",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    dob: "1988-12-10",
    gender: "Female",
    preferredLanguage: "Kannada",
    pincode: "560002",
    address: "90, Indiranagar",
    tags: ["Regular Devotee", "Festival Participant"],
    source: "Online",
    notes: "",
    totalBookings: 45,
    totalDonations: 32000,
    isVolunteer: false,
    volunteerStatus: "Not Converted",
    lastVisit: "2026-02-09",
    status: "Active",
    bookings: [
      { id: "BK-0006", offering: "Sahasranama", type: "Ritual", date: "2026-02-09", status: "Pending Payment", amount: 1500 },
    ],
    donations: [
      { date: "2026-01-20", amount: 8000, structure: "Main Temple", purpose: "Education Fund", receipt: "RCP-2026-0030" },
    ],
    visits: [
      { date: "2026-02-09", type: "Darshan", duration: "1h" },
    ],
    experiencePosts: [],
    commLogs: [],
    customFields: {},
  },
  {
    id: "DEV-0007",
    name: "Vijay Nair",
    phone: "+91 32109 87654",
    email: "vijay@email.com",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    dob: "1975-04-18",
    gender: "Male",
    preferredLanguage: "Malayalam",
    pincode: "682001",
    address: "34, MG Road Kochi",
    tags: ["Regular Devotee"],
    source: "Walk-in",
    notes: "Very reliable volunteer",
    totalBookings: 38,
    totalDonations: 18000,
    isVolunteer: true,
    volunteerStatus: "Active",
    lastVisit: "2026-02-08",
    status: "Active",
    bookings: [],
    donations: [
      { date: "2026-01-05", amount: 5000, structure: "Main Temple", purpose: "General", receipt: "RCP-2026-0008" },
    ],
    visits: [
      { date: "2026-02-08", type: "Volunteer Duty", duration: "4h" },
    ],
    experiencePosts: [],
    commLogs: [],
    volunteerData: {
      skills: ["Admin", "Crowd Control"],
      events: 15,
      hours: 120,
      availability: "Weekdays",
      department: "Administration",
    },
    customFields: {},
  },
  {
    id: "DEV-0008",
    name: "Kavita Rao",
    phone: "+91 21098 76543",
    email: "kavita@email.com",
    city: "Mysore",
    state: "Karnataka",
    country: "India",
    dob: "1992-07-25",
    gender: "Female",
    preferredLanguage: "Kannada",
    pincode: "570001",
    address: "67, Sayyaji Rao Road",
    tags: ["Regular Devotee"],
    source: "Walk-in",
    notes: "",
    totalBookings: 31,
    totalDonations: 12000,
    isVolunteer: false,
    volunteerStatus: "Not Converted",
    lastVisit: "2026-02-07",
    status: "Active",
    bookings: [],
    donations: [
      { date: "2026-02-07", amount: 3000, structure: "Main Temple", purpose: "Annadanam", receipt: "RCP-2026-0048" },
    ],
    visits: [
      { date: "2026-02-07", type: "Darshan", duration: "30m" },
    ],
    experiencePosts: [],
    commLogs: [],
    customFields: {},
  },
  {
    id: "DEV-0009",
    name: "Ganesh Pillai",
    phone: "+91 10987 65432",
    email: "",
    city: "Trivandrum",
    state: "Kerala",
    country: "India",
    dob: "1980-09-12",
    gender: "Male",
    preferredLanguage: "Malayalam",
    pincode: "695001",
    address: "12, Statue Junction",
    tags: [],
    source: "Walk-in",
    notes: "",
    totalBookings: 5,
    totalDonations: 2000,
    isVolunteer: false,
    volunteerStatus: "Not Converted",
    lastVisit: "2025-12-20",
    status: "Inactive",
    bookings: [],
    donations: [],
    visits: [],
    experiencePosts: [],
    commLogs: [],
    customFields: {},
  },
  {
    id: "DEV-0010",
    name: "Arjun Menon",
    phone: "+91 09876 54321",
    email: "arjun@email.com",
    city: "Calicut",
    state: "Kerala",
    country: "India",
    dob: "1998-02-28",
    gender: "Male",
    preferredLanguage: "Malayalam",
    pincode: "673001",
    address: "89, Beach Road",
    tags: [],
    source: "Online",
    notes: "",
    totalBookings: 2,
    totalDonations: 1000,
    isVolunteer: false,
    volunteerStatus: "Not Converted",
    lastVisit: "2025-10-05",
    status: "Inactive",
    bookings: [],
    donations: [],
    visits: [],
    experiencePosts: [],
    commLogs: [],
    customFields: {},
  },
];

