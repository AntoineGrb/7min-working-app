import { WorkoutType, WorkoutSession } from '@/types';
import { DEFAULT_WORKOUT } from './exercises-data';

const STORAGE_KEYS = {
  WORKOUT_TYPES: 'workout-types',
  SESSIONS: 'workout-sessions',
} as const;

// Workout Types
export function getWorkoutTypes(): WorkoutType[] {
  if (typeof window === 'undefined') return [DEFAULT_WORKOUT];
  const stored = localStorage.getItem(STORAGE_KEYS.WORKOUT_TYPES);
  if (!stored) return [DEFAULT_WORKOUT];
  const workouts = JSON.parse(stored) as WorkoutType[];
  // Ensure default workout is always present
  if (!workouts.find(w => w.id === DEFAULT_WORKOUT.id)) {
    return [DEFAULT_WORKOUT, ...workouts];
  }
  return workouts;
}

export function getWorkoutTypeById(id: string): WorkoutType | undefined {
  const workouts = getWorkoutTypes();
  return workouts.find(w => w.id === id);
}

export function saveWorkoutType(workout: WorkoutType): void {
  const workouts = getWorkoutTypes();
  const index = workouts.findIndex(w => w.id === workout.id);
  if (index >= 0) {
    workouts[index] = workout;
  } else {
    workouts.push(workout);
  }
  localStorage.setItem(STORAGE_KEYS.WORKOUT_TYPES, JSON.stringify(workouts));
}

export function deleteWorkoutType(id: string): boolean {
  const workouts = getWorkoutTypes();
  const workoutToDelete = workouts.find(w => w.id === id);

  // Cannot delete the default workout
  if (!workoutToDelete || workoutToDelete.isDefault) {
    return false;
  }

  const filtered = workouts.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WORKOUT_TYPES, JSON.stringify(filtered));
  return true;
}

// Sessions
export function getSessions(): WorkoutSession[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return stored ? (JSON.parse(stored) as WorkoutSession[]) : [];
}

export function saveSession(session: WorkoutSession): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

// Export/Import
export function exportAllData(): string {
  return JSON.stringify({
    workouts: getWorkoutTypes(),
    sessions: getSessions(),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }, null, 2);
}

export function importData(json: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(json);
    if (data.workouts) {
      localStorage.setItem(STORAGE_KEYS.WORKOUT_TYPES, JSON.stringify(data.workouts));
    }
    if (data.sessions) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data.sessions));
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Format JSON invalide' };
  }
}
