'use client';

import { useSyncExternalStore, useRef, useCallback } from 'react';
import Link from 'next/link';
import { WorkoutType } from '@/types';
import { getWorkoutTypes } from '@/lib/storage';
import WorkoutCard from '@/components/WorkoutCard';

// Custom hook for localStorage with proper caching
function useWorkoutTypes(): WorkoutType[] {
  const cache = useRef<{ json: string; value: WorkoutType[] } | null>(null);

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    // Also listen for custom event for same-tab updates
    window.addEventListener('workouts-updated', callback);
    return () => {
      window.removeEventListener('storage', callback);
      window.removeEventListener('workouts-updated', callback);
    };
  }, []);

  const getSnapshot = useCallback((): WorkoutType[] => {
    const workouts = getWorkoutTypes();
    const json = JSON.stringify(workouts);

    // Return cached value if data hasn't changed
    if (cache.current && cache.current.json === json) {
      return cache.current.value;
    }

    // Update cache and return new value
    cache.current = { json, value: workouts };
    return workouts;
  }, []);

  const getServerSnapshot = useCallback((): WorkoutType[] => [], []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function WorkoutsPage() {
  const workouts = useWorkoutTypes();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold flex-1">Mes séances</h1>
        <Link
          href="/workouts/new"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 transition-colors text-xl font-bold"
        >
          +
        </Link>
      </header>

      {/* Content */}
      <main className="p-4">
        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          {workouts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>Aucune séance trouvée</p>
              <Link
                href="/workouts/new"
                className="text-green-500 hover:text-green-400 mt-2 inline-block"
              >
                Créer ma première séance
              </Link>
            </div>
          ) : (
            workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
