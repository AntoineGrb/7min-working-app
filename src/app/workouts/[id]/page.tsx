'use client';

import { useSyncExternalStore, useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WorkoutType, Exercise } from '@/types';
import { getWorkoutTypeById, deleteWorkoutType } from '@/lib/storage';
import { getExercisesByIds } from '@/lib/exercises-data';

// Subscribe function for useSyncExternalStore
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getSnapshot = useCallback((): { workout: WorkoutType | null; exercises: Exercise[] } => {
    if (typeof window === 'undefined') return { workout: null, exercises: [] };
    const loadedWorkout = getWorkoutTypeById(id);
    if (loadedWorkout) {
      return {
        workout: loadedWorkout,
        exercises: getExercisesByIds(loadedWorkout.exerciseIds),
      };
    }
    return { workout: null, exercises: [] };
  }, [id]);

  const getServerSnapshot = useCallback((): { workout: WorkoutType | null; exercises: Exercise[] } => {
    return { workout: null, exercises: [] };
  }, []);

  const { workout, exercises } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleDelete = () => {
    if (workout && !workout.isDefault) {
      const success = deleteWorkoutType(workout.id);
      if (success) {
        router.push('/workouts');
      }
    }
  };

  const formatDuration = (exerciseCount: number, exerciseDuration: number, restDuration: number): string => {
    const totalSeconds = exerciseCount * exerciseDuration + (exerciseCount - 1) * restDuration;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds > 0 ? `${minutes}min ${seconds}s` : `${minutes}min`;
  };

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Séance introuvable</p>
        <Link href="/workouts" className="text-green-500 hover:text-green-400">
          Retour aux séances
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <Link
          href="/workouts"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold flex-1 truncate">{workout.name}</h1>
        {workout.isDefault && (
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
            Par défaut
          </span>
        )}
      </header>

      {/* Content */}
      <main className="p-4 max-w-lg mx-auto">
        {/* Info card */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{exercises.length}</p>
              <p className="text-sm text-gray-400">exercices</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{workout.exerciseDuration}s</p>
              <p className="text-sm text-gray-400">par exo</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{workout.restDuration}s</p>
              <p className="text-sm text-gray-400">repos</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-gray-400">
              Durée totale : <span className="text-white font-semibold">{formatDuration(exercises.length, workout.exerciseDuration, workout.restDuration)}</span>
            </p>
          </div>
        </div>

        {/* Launch button */}
        <Link
          href={`/play/${workout.id}`}
          className="block w-full bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-4 rounded-xl text-center transition-colors mb-6"
        >
          Lancer cette séance
        </Link>

        {/* Exercises list */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">Exercices ({exercises.length})</h2>
          <ul className="space-y-3">
            {exercises.map((exercise, index) => (
              <li key={exercise.id} className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded text-sm text-gray-400">
                  {index + 1}
                </span>
                <span className="text-2xl">{exercise.icon}</span>
                <span className="flex-1 truncate">{exercise.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delete button (only for non-default workouts) */}
        {!workout.isDefault && (
          <div className="mt-8">
            {showDeleteConfirm ? (
              <div className="bg-red-900/30 border border-red-600 rounded-xl p-4">
                <p className="text-center mb-4">Supprimer cette séance ?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-red-500 hover:text-red-400 py-3 text-center transition-colors"
              >
                Supprimer cette séance
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
