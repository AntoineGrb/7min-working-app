import Link from 'next/link';
import { DEFAULT_EXERCISES } from '@/lib/exercises-data';
import ExerciseCard from '@/components/ExerciseCard';

export default function ExercisesPage() {
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
        <h1 className="text-xl font-bold">Exercices</h1>
        <span className="text-gray-400 text-sm">({DEFAULT_EXERCISES.length})</span>
      </header>

      {/* Liste des exercices */}
      <main className="p-4">
        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          {DEFAULT_EXERCISES.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </main>
    </div>
  );
}
