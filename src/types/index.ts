export interface Exercise {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  muscleGroups: string[];
}

export interface WorkoutType {
  id: string;
  name: string;
  isDefault: boolean;
  exerciseDuration: number;
  restDuration: number;
  countdownDuration: number;
  exerciseIds: string[];
  color?: string;
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  workoutTypeId: string;
  workoutName: string;
  completedAt: string;
  duration: number;
  exercisesCompleted: number;
  exercisesTotal: number;
}

export interface PlayerState {
  status: 'countdown' | 'exercise' | 'rest' | 'paused' | 'complete';
  currentExerciseIndex: number;
  timeRemaining: number;
  totalElapsed: number;
}
