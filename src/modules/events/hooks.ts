import { useSyncExternalStore } from "react";
import type { TempleEvent } from "@/data/eventData";
import { createEvent, getEventById, getEvents, subscribe, updateEvent } from "./eventStore";

export function useEvents(): TempleEvent[] {
  return useSyncExternalStore(subscribe, getEvents, getEvents);
}

export function useEventById(id: string): TempleEvent | undefined {
  // Simple selector: component re-renders when events change.
  useEvents();
  return getEventById(id);
}

export const eventActions = {
  createEvent,
  updateEvent,
};

