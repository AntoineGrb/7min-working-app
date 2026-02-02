'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import SettingsPanel from "@/components/SettingsPanel";
import { getWorkoutTypes } from '@/lib/storage';
import { WorkoutType } from '@/types';

export default function Home() {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('default-7min');
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);

  useEffect(() => {
    setWorkouts(getWorkoutTypes());
  }, []);

  const selectedWorkout = workouts.find(w => w.id === selectedWorkoutId) || workouts[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      {/* Header */}
      <header className="text-center py-8 relative">
        <div className="absolute right-0 top-8">
          <SettingsPanel />
        </div>
        <h1 className="text-3xl font-bold">7min Workout</h1>
        <p className="text-gray-400 mt-2">Votre séance rapide quotidienne</p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col gap-6 max-w-md mx-auto w-full">
        {/* Sélecteur de séance */}
        <div className="bg-gray-800 rounded-xl p-4">
          <label htmlFor="workout-select" className="block text-sm text-gray-400 mb-2">
            Séance à lancer
          </label>
          <select
            id="workout-select"
            value={selectedWorkoutId}
            onChange={(e) => setSelectedWorkoutId(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.name} ({workout.exerciseIds.length} exercices)
              </option>
            ))}
          </select>
        </div>

        {/* Bouton principal */}
        <Link
          href={selectedWorkout ? `/play/${selectedWorkout.id}` : '/play/default-7min'}
          className="bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-6 px-8 rounded-xl text-center transition-colors"
        >
          Lancer la séance
        </Link>

        {/* Cartes de navigation */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Link
            href="/workouts"
            className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-colors"
          >
            <span className="text-3xl block mb-2">📋</span>
            <span className="font-medium">Mes séances</span>
          </Link>

          <Link
            href="/exercises"
            className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-colors"
          >
            <span className="text-3xl block mb-2">💪</span>
            <span className="font-medium">Exercices</span>
          </Link>

          <Link
            href="/history"
            className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-colors"
          >
            <span className="text-3xl block mb-2">📅</span>
            <span className="font-medium">Historique</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        7min Workout v1.0
      </footer>
    </div>
  );
}
