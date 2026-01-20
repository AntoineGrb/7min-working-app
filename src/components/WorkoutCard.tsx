import Link from 'next/link';
import { WorkoutType } from '@/types';

interface WorkoutCardProps {
  workout: WorkoutType;
}

function formatDuration(exerciseCount: number, exerciseDuration: number, restDuration: number): string {
  const totalSeconds = exerciseCount * exerciseDuration + (exerciseCount - 1) * restDuration;
  const minutes = Math.floor(totalSeconds / 60);
  return `~${minutes} min`;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const exerciseCount = workout.exerciseIds.length;
  const duration = formatDuration(exerciseCount, workout.exerciseDuration, workout.restDuration);

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex items-center gap-4 transition-colors"
    >
      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl">
        💪
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white truncate">{workout.name}</h3>
          {workout.isDefault && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
              Par défaut
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
          <span>{exerciseCount} exercices</span>
          <span>•</span>
          <span>{duration}</span>
          <span>•</span>
          <span>{workout.exerciseDuration}s / {workout.restDuration}s repos</span>
        </div>
      </div>
      <span className="text-gray-500">›</span>
    </Link>
  );
}
