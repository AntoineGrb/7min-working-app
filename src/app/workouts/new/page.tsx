'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DEFAULT_EXERCISES } from '@/lib/exercises-data';
import { saveWorkoutType } from '@/lib/storage';
import { WorkoutType } from '@/types';

export default function NewWorkoutPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [restDuration, setRestDuration] = useState(10);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  const isValid = name.trim().length > 0 && selectedExerciseIds.length > 0;

  const toggleExercise = (exerciseId: string) => {
    setSelectedExerciseIds(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const selectAll = () => {
    setSelectedExerciseIds(DEFAULT_EXERCISES.map(e => e.id));
  };

  const deselectAll = () => {
    setSelectedExerciseIds([]);
  };

  const handleCreate = () => {
    if (!isValid) return;

    const workout: WorkoutType = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      isDefault: false,
      exerciseDuration,
      restDuration,
      countdownDuration: 10,
      exerciseIds: selectedExerciseIds,
      createdAt: new Date().toISOString(),
    };

    saveWorkoutType(workout);
    router.push('/workouts');
  };

  // Calculate total duration
  const totalDuration = selectedExerciseIds.length > 0
    ? selectedExerciseIds.length * exerciseDuration + (selectedExerciseIds.length - 1) * restDuration
    : 0;
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalSeconds = totalDuration % 60;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link
            href="/workouts"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold">Nouvelle séance</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>
      </header>

      <div className="p-4 space-y-6 pb-32">
        {/* Workout Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            Nom de la séance
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ma séance personnalisée"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        {/* Duration Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="exerciseDuration" className="block text-sm font-medium text-gray-400 mb-2">
              Durée exercice (s)
            </label>
            <input
              type="number"
              id="exerciseDuration"
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(Math.max(5, parseInt(e.target.value) || 5))}
              min={5}
              max={120}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="restDuration" className="block text-sm font-medium text-gray-400 mb-2">
              Durée repos (s)
            </label>
            <input
              type="number"
              id="restDuration"
              value={restDuration}
              onChange={(e) => setRestDuration(Math.max(0, parseInt(e.target.value) || 0))}
              min={0}
              max={60}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Exercise Selection Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              Exercices ({selectedExerciseIds.length}/{DEFAULT_EXERCISES.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-sm text-green-500 hover:text-green-400 transition-colors"
              >
                Tout
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={deselectAll}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Aucun
              </button>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-2">
            {DEFAULT_EXERCISES.map((exercise) => {
              const isSelected = selectedExerciseIds.includes(exercise.id);
              const selectionIndex = selectedExerciseIds.indexOf(exercise.id);

              return (
                <button
                  key={exercise.id}
                  onClick={() => toggleExercise(exercise.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-green-600/20 border-2 border-green-600'
                      : 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-green-600' : 'bg-gray-700'
                  }`}>
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Exercise Icon */}
                  <span className="text-2xl">{exercise.icon}</span>

                  {/* Exercise Info */}
                  <div className="flex-1 text-left">
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-xs text-gray-400">
                      {exercise.muscleGroups.join(' • ')}
                    </p>
                  </div>

                  {/* Selection Order */}
                  {isSelected && (
                    <span className="text-sm text-green-500 font-medium">
                      #{selectionIndex + 1}
                    </span>
                  )}

                  {/* Difficulty Badge */}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    exercise.difficulty === 'easy' ? 'bg-green-900/50 text-green-400' :
                    exercise.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {exercise.difficulty === 'easy' ? 'Facile' :
                     exercise.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer with Summary and Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 space-y-3">
        {/* Summary */}
        {selectedExerciseIds.length > 0 && (
          <div className="text-center text-sm text-gray-400">
            Durée totale : {totalMinutes > 0 ? `${totalMinutes}min ` : ''}{totalSeconds > 0 ? `${totalSeconds}s` : totalMinutes > 0 ? '' : '0s'}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            href="/workouts"
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl text-center transition-colors"
          >
            Annuler
          </Link>
          <button
            onClick={handleCreate}
            disabled={!isValid}
            className={`flex-1 font-medium py-3 px-6 rounded-xl transition-colors ${
              isValid
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}
