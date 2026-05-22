"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Step {
  number: number;
  title: string;
  shortTitle: string;
}

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  const { t, language } = useLanguage();

  const steps: Step[] = [
    { number: 1, title: t("step1"), shortTitle: "Type" },
    { number: 2, title: t("step2"), shortTitle: "Member" },
    { number: 3, title: t("step3"), shortTitle: "Diagnosis" },
    { number: 4, title: t("step4"), shortTitle: "Docs" },
    { number: 5, title: t("step5"), shortTitle: "Review" },
  ];

  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-border mx-12" />
        {/* Active connector line */}
        <div
          className="absolute top-5 left-0 h-[2px] bg-primary mx-12 transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 6rem)",
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2",
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isCurrent
                      ? "bg-white border-primary text-primary shadow-[0_0_0_4px_rgba(15,118,110,0.12)]"
                      : "bg-white border-border text-muted"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors duration-300",
                  isCompleted || isCurrent ? "text-primary" : "text-muted"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-primary">
            {language === "vi"
              ? `Bước ${currentStep} / ${steps.length}`
              : `Step ${currentStep} of ${steps.length}`}
          </span>
          <span className="text-sm font-medium text-foreground">
            {steps[currentStep - 1].title}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-muted-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-between mt-2 px-1">
          {steps.map((step) => (
            <div
              key={step.number}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentStep >= step.number ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

