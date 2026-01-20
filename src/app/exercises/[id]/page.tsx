import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExerciseById, DEFAULT_EXERCISES } from '@/lib/exercises-data';

function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-600';
    case 'medium':
      return 'bg-yellow-600';
    case 'hard':
      return 'bg-red-600';
  }
}

function getDifficultyLabel(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return 'Facile';
    case 'medium':
      return 'Moyen';
    case 'hard':
      return 'Difficile';
  }
}

export function generateStaticParams() {
  return DEFAULT_EXERCISES.map((exercise) => ({
    id: exercise.id,
  }));
}

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = await params;
  const exercise = getExerciseById(id);

  if (!exercise) {
    notFound();
  }

  const descriptionLines = exercise.description.split('\n');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <Link
          href="/exercises"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold truncate">{exercise.name}</h1>
      </header>

      {/* Content */}
      <main className="p-4 max-w-lg mx-auto">
        {/* Icon */}
        <div className="text-center py-8">
          <span className="text-8xl">{exercise.icon}</span>
        </div>

        {/* Info */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h2 className="text-2xl font-bold mb-3">{exercise.name}</h2>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`${getDifficultyColor(exercise.difficulty)} text-white text-sm px-3 py-1 rounded-full`}
            >
              {getDifficultyLabel(exercise.difficulty)}
            </span>
            {exercise.muscleGroups.map((group) => (
              <span
                key={group}
                className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full"
              >
                {group}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Instructions</h3>
          <ul className="space-y-2">
            {descriptionLines.map((line, index) => (
              <li key={index} className="text-gray-300 leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
