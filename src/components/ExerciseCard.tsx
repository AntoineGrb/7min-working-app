import Link from 'next/link';
import { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
}

function getDifficultyColor(difficulty: Exercise['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-600';
    case 'medium':
      return 'bg-yellow-600';
    case 'hard':
      return 'bg-red-600';
  }
}

function getDifficultyLabel(difficulty: Exercise['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return 'Facile';
    case 'medium':
      return 'Moyen';
    case 'hard':
      return 'Difficile';
  }
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex items-center gap-4 transition-colors"
    >
      <span className="text-4xl">{exercise.icon}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{exercise.name}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span
            className={`${getDifficultyColor(exercise.difficulty)} text-white text-xs px-2 py-0.5 rounded`}
          >
            {getDifficultyLabel(exercise.difficulty)}
          </span>
          <span className="text-gray-400 text-sm truncate">
            {exercise.muscleGroups.join(', ')}
          </span>
        </div>
      </div>
      <span className="text-gray-500">›</span>
    </Link>
  );
}
