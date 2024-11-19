import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="overflow-hidden h-2 flex rounded-full bg-secondary">
          <div
            className="transition-all duration-500 ease-in-out h-full bg-primary"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                currentStep > index
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}