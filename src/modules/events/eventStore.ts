import type { TempleEvent } from "@/data/eventData";
import { templeEvents as seedTempleEvents } from "@/data/eventData";

const LS_EVENTS_KEY = "qoo.events.events.v1";

type Listener = () => void;

let listeners = new Set<Listener>();
let eventsCache: TempleEvent[] | null = null;

function notify() {
  for (const l of listeners) l();
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function persist() {
  if (eventsCache) localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(eventsCache));
}

function loadEvents(): TempleEvent[] {
  if (eventsCache) return eventsCache;
  const fromLs = safeJsonParse<TempleEvent[]>(localStorage.getItem(LS_EVENTS_KEY));
  eventsCache = fromLs && Array.isArray(fromLs) ? fromLs : seedTempleEvents;
  // If we seeded from code, persist so edits/creates become consistent app-wide
  if (!fromLs) persist();
  return eventsCache;
}

function setEvents(next: TempleEvent[]) {
  eventsCache = next;
  persist();
  notify();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getEvents(): TempleEvent[] {
  return loadEvents();
}

export function getEventById(id: string): TempleEvent | undefined {
  return loadEvents().find((e) => e.id === id);
}

function nextEventId(events: TempleEvent[]): string {
  const max = events.reduce((acc, e) => {
    const m = /^EVT-(\d+)$/.exec(e.id);
    if (!m) return acc;
    const n = Number(m[1]);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return `EVT-${String(max + 1).padStart(3, "0")}`;
}

export function createEvent(input: Omit<TempleEvent, "id" | "createdAt" | "createdBy"> & { createdBy?: string }) {
  const events = loadEvents();
  const id = nextEventId(events);
  const event: TempleEvent = {
    id,
    createdAt: new Date().toISOString().slice(0, 10),
    createdBy: input.createdBy ?? "Temple Admin",
    ...input,
  };
  setEvents([event, ...events]);
  return event;
}

export function updateEvent(id: string, patch: Partial<TempleEvent>) {
  const events = loadEvents();
  const next = events.map((e) => (e.id === id ? { ...e, ...patch } : e));
  setEvents(next);
}

