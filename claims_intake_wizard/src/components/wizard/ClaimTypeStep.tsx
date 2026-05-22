"use client";

import { Stethoscope, Building2, SmilePlus, FileCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimType } from "@/types/claim";
import { getClaimTypeInfo } from "@/lib/translations";
import { useLanguage } from "@/context/LanguageContext";

interface ClaimTypeStepProps {
  selectedType: ClaimType | "";
  onSelect: (type: ClaimType) => void;
  error?: string;
}

const icons: Record<ClaimType, React.ReactNode> = {
  outpatient: <Stethoscope className="w-7 h-7" />,
  inpatient: <Building2 className="w-7 h-7" />,
  dental: <SmilePlus className="w-7 h-7" />,
};

const gradients: Record<ClaimType, string> = {
  outpatient: "from-teal-500 to-teal-700",
  inpatient: "from-teal-600 to-teal-800",
  dental: "from-teal-400 to-emerald-600",
};

export default function ClaimTypeStep({ selectedType, onSelect, error }: ClaimTypeStepProps) {
  const { t, language } = useLanguage();
  const types: ClaimType[] = ["outpatient", "inpatient", "dental"];

  return (
    <div className="step-content space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("claimTypeTitle")}
        </h2>
        <p className="text-muted text-sm max-w-lg mx-auto">
          {t("claimTypeSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {types.map((type) => {
          const info = getClaimTypeInfo(type, language);
          const isSelected = selectedType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={cn(
                "claim-type-card group relative p-6 rounded-xl border-2 text-left cursor-pointer bg-card",
                "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
                isSelected
                  ? "selected border-primary bg-primary-lighter"
                  : "border-border hover:border-primary/40"
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-scale-in">
                  <FileCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                  isSelected
                    ? `bg-gradient-to-br ${gradients[type]} text-white shadow-lg`
                    : "bg-primary-light text-primary group-hover:bg-primary group-hover:text-white"
                )}
              >
                {icons[type]}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-foreground mb-1.5">
                {info.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {info.description}
              </p>

              {/* Required documents preview */}
              <div className="pt-3 border-t border-border/60">
                <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">
                  {t("requiredDocuments")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {info.requiredDocs.map((doc) => (
                    <span
                      key={doc}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-light text-primary"
                    >
                      {doc}
                    </span>
                  ))}
                  {info.optionalDocs.map((doc) => (
                    <span
                      key={doc}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted-bg text-muted"
                    >
                      {doc}
                      <span className="ml-1 text-[10px] opacity-70">{t("optional")}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover arrow */}
              <ChevronRight
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300",
                  isSelected
                    ? "opacity-0"
                    : "opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 text-muted"
                )}
              />
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-center text-sm text-error font-medium animate-fade-in" role="alert">
          {t(error)}
        </p>
      )}
    </div>
  );
}

