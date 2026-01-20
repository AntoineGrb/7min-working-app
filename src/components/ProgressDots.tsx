interface ProgressDotsProps {
  total: number;
  current: number;
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  // If there are too many exercises, show a more compact version
  const maxVisibleDots = 12;
  const showCompact = total > maxVisibleDots;

  if (showCompact) {
    return (
      <div className="flex items-center gap-2 text-white/80">
        <span className="text-lg font-medium">
          {current + 1} / {total}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index < current
              ? 'bg-white' // completed
              : index === current
              ? 'bg-white scale-125' // current
              : 'bg-white/30' // upcoming
          }`}
        />
      ))}
    </div>
  );
}
