interface ProgressBarProps {
  current: number;
  total: number;
  completed?: boolean;
  showLabel?: boolean;
  height?: string;
}

export default function ProgressBar({ 
  current, 
  total, 
  completed = false, 
  showLabel = true,
  height = 'h-2'
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-300 ${
            completed 
              ? 'bg-green-500' 
              : percentage > 0 
                ? 'bg-blue-500' 
                : 'bg-gray-300'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1 text-xs text-gray-600">
          <span>
            {completed ? (
              <span className="text-green-600 font-semibold">✓ 完了</span>
            ) : (
              <span>{current} / {total} ページ</span>
            )}
          </span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
    </div>
  );
}
