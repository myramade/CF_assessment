import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {current} of {total}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(percentage)}% Complete
          </span>
        </div>
        <Progress value={percentage} className="h-2" data-testid="progress-bar" />
      </div>
    </div>
  );
}
