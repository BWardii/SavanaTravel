"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useLanguage();
  const steps = t.steps;

  return (
    <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-1 scrollbar-none">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "h-px w-5 transition-colors duration-300",
                  isCompleted || isActive ? "bg-[#1C1917]" : "bg-[#D4CAC0]"
                )}
              />
              <span
                className={cn(
                  "text-xs tracking-wide transition-colors duration-300 whitespace-nowrap",
                  isActive
                    ? "text-[#1C1917] font-medium"
                    : isCompleted
                    ? "text-[#6B5E52]"
                    : "text-[#C4B49A]"
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-px w-8 transition-colors duration-500",
                  isCompleted ? "bg-[#1C1917]" : "bg-[#E8E2D9]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
