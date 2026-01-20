'use client';

import { useState, useEffect, useCallback, useRef, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerState, WorkoutType } from '@/types';
import { getWorkoutTypeById } from '@/lib/storage';
import { getExercisesByIds } from '@/lib/exercises-data';
import { audioManager } from '@/lib/audio';
import { requestWakeLock, releaseWakeLock } from '@/lib/wake-lock';
import Timer from '@/components/Timer';
import ProgressDots from '@/components/ProgressDots';

type PlayerStatus = PlayerState['status'];

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

function createInitialState(workout: WorkoutType): PlayerState {
  return {
    status: 'countdown',
    currentExerciseIndex: 0,
    timeRemaining: workout.countdownDuration,
    totalElapsed: 0,
  };
}

export default function PlayPage({ params }: PlayPageProps) {
  const { id: workoutId } = use(params);
  const router = useRouter();

  const workout = getWorkoutTypeById(workoutId);
  const exercises = useMemo(
    () => (workout ? getExercisesByIds(workout.exerciseIds) : []),
    [workout]
  );

  const [state, setState] = useState<PlayerState>(() =>
    workout
      ? createInitialState(workout)
      : { status: 'countdown', currentExerciseIndex: 0, timeRemaining: 10, totalElapsed: 0 }
  );
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<PlayerStatus>('countdown');
  const audioInitialized = useRef(false);
  const startTimeInitialized = useRef(false);
  const startTime = useRef<number>(0);

  // Initialize audio, wake lock, and start time
  useEffect(() => {
    if (!audioInitialized.current) {
      audioManager.preloadAll();
      audioInitialized.current = true;
    }

    if (!startTimeInitialized.current) {
      startTime.current = Date.now();
      startTimeInitialized.current = true;
    }

    requestWakeLock();

    return () => {
      releaseWakeLock();
    };
  }, []);

  // Handle transition between states
  const handleTransition = useCallback(
    (currentState: PlayerState): PlayerState => {
      if (!workout) return currentState;

      const { status, currentExerciseIndex } = currentState;

      switch (status) {
        case 'countdown':
          // Countdown finished -> Start first exercise
          audioManager.play('beep-start');
          return {
            ...currentState,
            status: 'exercise',
            timeRemaining: workout.exerciseDuration,
          };

        case 'exercise':
          // Exercise finished
          audioManager.play('beep-end');
          const isLastExercise = currentExerciseIndex >= exercises.length - 1;

          if (isLastExercise) {
            // Last exercise -> Complete
            audioManager.play('complete');
            return {
              ...currentState,
              status: 'complete',
              timeRemaining: 0,
              totalElapsed: Math.floor((Date.now() - startTime.current) / 1000),
            };
          }

          // Not last exercise -> Rest
          return {
            ...currentState,
            status: 'rest',
            timeRemaining: workout.restDuration,
          };

        case 'rest':
          // Rest finished -> Next exercise
          audioManager.play('beep-start');
          return {
            ...currentState,
            status: 'exercise',
            currentExerciseIndex: currentExerciseIndex + 1,
            timeRemaining: workout.exerciseDuration,
          };

        default:
          return currentState;
      }
    },
    [workout, exercises.length]
  );

  // Timer effect
  useEffect(() => {
    if (state.status === 'paused' || state.status === 'complete') return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          return handleTransition(prev);
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
          totalElapsed: Math.floor((Date.now() - startTime.current) / 1000),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status, handleTransition]);

  // Unlock audio on first tap
  const handleUserInteraction = useCallback(() => {
    audioManager.unlock();
  }, []);

  const handlePause = useCallback(() => {
    handleUserInteraction();
    setPreviousStatus(state.status);
    setState((prev) => ({ ...prev, status: 'paused' }));
  }, [state.status, handleUserInteraction]);

  const handleResume = useCallback(() => {
    handleUserInteraction();
    setState((prev) => ({ ...prev, status: previousStatus }));
  }, [previousStatus, handleUserInteraction]);

  const handleQuitRequest = useCallback(() => {
    handleUserInteraction();
    setPreviousStatus(state.status);
    setState((prev) => ({ ...prev, status: 'paused' }));
    setShowQuitConfirm(true);
  }, [state.status, handleUserInteraction]);

  const handleQuitConfirm = useCallback(() => {
    releaseWakeLock();
    router.push('/');
  }, [router]);

  const handleQuitCancel = useCallback(() => {
    setShowQuitConfirm(false);
    setState((prev) => ({ ...prev, status: previousStatus }));
  }, [previousStatus]);

  const handleRestart = useCallback(() => {
    if (!workout) return;
    handleUserInteraction();
    startTime.current = Date.now();
    startTimeInitialized.current = true;
    setState(createInitialState(workout));
  }, [workout, handleUserInteraction]);

  const handleGoHome = useCallback(() => {
    releaseWakeLock();
    router.push('/');
  }, [router]);

  // Loading/error state for missing workout
  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-xl">Séance introuvable</div>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-gray-700 rounded-xl text-lg font-semibold"
        >
          Retour
        </button>
      </div>
    );
  }

  // Error state
  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-xl">Aucun exercice dans cette séance</div>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-gray-700 rounded-xl text-lg font-semibold"
        >
          Retour
        </button>
      </div>
    );
  }

  const currentExercise = exercises[state.currentExerciseIndex];
  const nextExercise =
    state.currentExerciseIndex < exercises.length - 1
      ? exercises[state.currentExerciseIndex + 1]
      : null;

  // Get background color based on state
  const getBgColor = (): string => {
    switch (state.status) {
      case 'countdown':
        return 'bg-green-600';
      case 'exercise':
        return 'bg-red-600';
      case 'rest':
        return 'bg-blue-600';
      case 'paused':
        return 'bg-gray-800';
      case 'complete':
        return 'bg-gradient-to-b from-green-600 to-green-800';
      default:
        return 'bg-gray-900';
    }
  };

  // Get total duration for current phase
  const getTotalDuration = (): number => {
    switch (state.status) {
      case 'countdown':
        return workout.countdownDuration;
      case 'exercise':
        return workout.exerciseDuration;
      case 'rest':
        return workout.restDuration;
      default:
        return 0;
    }
  };

  // Format elapsed time as MM:SS
  const formatElapsedTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render quit confirmation overlay
  if (showQuitConfirm) {
    return (
      <div className="min-h-screen bg-gray-900/95 text-white flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Quitter la séance ?</h2>
          <p className="text-gray-400 mb-8">
            Votre progression ne sera pas sauvegardée.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleQuitConfirm}
              className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl text-lg font-semibold transition-colors"
            >
              Oui, quitter
            </button>
            <button
              onClick={handleQuitCancel}
              className="w-full py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-lg font-semibold transition-colors"
            >
              Non, continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render complete screen
  if (state.status === 'complete') {
    return (
      <div
        className={`min-h-screen ${getBgColor()} text-white flex flex-col items-center justify-center p-6`}
      >
        <div className="text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold mb-2">Bravo !</h1>
          <p className="text-xl text-white/80 mb-8">Séance terminée</p>

          <div className="bg-white/10 rounded-2xl p-6 mb-8 w-full max-w-xs">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">
                  {formatElapsedTime(state.totalElapsed)}
                </div>
                <div className="text-sm text-white/70">Durée totale</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{exercises.length}</div>
                <div className="text-sm text-white/70">Exercices</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={handleRestart}
              className="w-full py-4 bg-white text-green-700 rounded-xl text-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Refaire
            </button>
            <button
              onClick={handleGoHome}
              className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-xl text-lg font-semibold transition-colors"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render paused screen
  if (state.status === 'paused') {
    return (
      <div className={`min-h-screen ${getBgColor()} text-white flex flex-col`}>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-6xl mb-6">⏸️</div>
          <h1 className="text-4xl font-bold mb-8">En pause</h1>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={handleResume}
              className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold transition-colors"
            >
              Reprendre
            </button>
            <button
              onClick={() => setShowQuitConfirm(true)}
              className="w-full py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-lg font-semibold transition-colors"
            >
              Quitter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main player UI (countdown, exercise, rest)
  return (
    <div
      className={`min-h-screen ${getBgColor()} text-white flex flex-col transition-colors duration-300`}
      onClick={handleUserInteraction}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={handleQuitRequest}
          className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          aria-label="Quitter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <ProgressDots total={exercises.length} current={state.currentExerciseIndex} />

        <button
          onClick={handlePause}
          className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          aria-label="Pause"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25v13.5m-7.5-13.5v13.5"
            />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Status label */}
        <div className="text-lg font-medium text-white/70 uppercase tracking-wider mb-4">
          {state.status === 'countdown' && 'Préparez-vous'}
          {state.status === 'exercise' && 'Exercice'}
          {state.status === 'rest' && 'Repos'}
        </div>

        {/* Exercise name/icon for countdown and exercise */}
        {(state.status === 'countdown' || state.status === 'exercise') && (
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{currentExercise.icon}</div>
            <h1 className="text-2xl md:text-3xl font-bold">{currentExercise.name}</h1>
          </div>
        )}

        {/* "Next up" for rest */}
        {state.status === 'rest' && nextExercise && (
          <div className="text-center mb-6">
            <p className="text-lg text-white/70 mb-2">Prochain exercice</p>
            <div className="text-5xl mb-2">{nextExercise.icon}</div>
            <h2 className="text-xl font-semibold">{nextExercise.name}</h2>
          </div>
        )}

        {/* Timer */}
        <Timer
          seconds={state.timeRemaining}
          totalSeconds={getTotalDuration()}
          showProgress
        />

        {/* Exercise index */}
        <div className="mt-6 text-lg text-white/70">
          {state.status !== 'countdown' && (
            <>
              Exercice {state.currentExerciseIndex + 1} / {exercises.length}
            </>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="p-4 text-center text-white/50 text-sm">
        Tapez n&apos;importe où pour activer le son
      </div>
    </div>
  );
}
