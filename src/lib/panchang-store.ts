// Panchang Store - localStorage based manual panchang entries

export interface PanchangEntry {
  id: string;
  date: string; // yyyy-MM-dd
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  paksha: 'Shukla' | 'Krishna';
  masa: string;
  samvatsara: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahukalam: string;
  yamagandam: string;
  gulikakalam: string;
  abhijitMuhurta: string;
  amritKalam: string;
  isAuspicious: boolean;
  specialDay: string;
  festivals: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'panchang_entries';

export function getPanchangEntries(): PanchangEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getPanchangByDate(date: string): PanchangEntry | undefined {
  return getPanchangEntries().find(e => e.date === date);
}

export function savePanchangEntry(entry: PanchangEntry): void {
  const entries = getPanchangEntries();
  const idx = entries.findIndex(e => e.id === entry.id);
  if (idx !== -1) {
    entries[idx] = { ...entry, updatedAt: new Date().toISOString() };
  } else {
    entries.push({ ...entry, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deletePanchangEntry(id: string): void {
  const entries = getPanchangEntries().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
