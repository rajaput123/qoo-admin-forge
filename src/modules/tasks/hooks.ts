import { useEffect, useSyncExternalStore } from "react";
import type { CurrentUser } from "./types";
import {
  canCompleteTask,
  canViewTask,
  createTask,
  deleteTemplate,
  generateTasksFromTemplates,
  getCurrentUser,
  getTasks,
  getTemplates,
  getViewSourcePath,
  isDueToday,
  isTaskOverdue,
  runEventIntegrations,
  setCurrentUserRole,
  subscribe,
  updateTaskStatus,
  upsertTemplate,
} from "./taskEngineStore";

export function useTasks() {
  return useSyncExternalStore(subscribe, getTasks, getTasks);
}

export function useTemplates() {
  return useSyncExternalStore(subscribe, getTemplates, getTemplates);
}

export function useCurrentUser(): CurrentUser {
  return useSyncExternalStore(subscribe, getCurrentUser, getCurrentUser);
}

export function useTaskEngineBootstrap() {
  useEffect(() => {
    // On first paint for any module that uses tasks, ensure recurring templates materialize into real tasks.
    generateTasksFromTemplates(new Date());
    runEventIntegrations(new Date());
  }, []);
}

export const taskActions = {
  createTask,
  updateTaskStatus,
  upsertTemplate,
  deleteTemplate,
  setCurrentUserRole,
};

export const taskSelectors = {
  isTaskOverdue,
  isDueToday,
  getViewSourcePath,
  canViewTask,
  canCompleteTask,
};

