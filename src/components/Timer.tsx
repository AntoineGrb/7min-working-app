interface TimerProps {
  seconds: number;
  totalSeconds?: number;
  showProgress?: boolean;
}

export default function Timer({ seconds, totalSeconds, showProgress = false }: TimerProps) {
  const displaySeconds = Math.max(0, seconds);

  // Format as MM:SS if over 60 seconds, otherwise just show seconds
  const formatTime = (secs: number): string => {
    if (secs >= 60) {
      const mins = Math.floor(secs / 60);
      const remainingSecs = secs % 60;
      return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    return secs.toString();
  };

  const progressPercentage = totalSeconds ? ((totalSeconds - displaySeconds) / totalSeconds) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-8xl md:text-9xl font-bold tabular-nums tracking-tight">
        {formatTime(displaySeconds)}
      </div>

      {showProgress && totalSeconds && (
        <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 transition-all duration-300 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
