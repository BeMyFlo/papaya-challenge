"use client";

import { CheckCircle2, Copy, ArrowRight, FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface SuccessScreenProps {
  referenceNumber: string;
  claimType: string;
  onNewClaim: () => void;
}

export default function SuccessScreen({ referenceNumber, claimType, onNewClaim }: SuccessScreenProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = referenceNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      {/* Decorative confetti dots */}
      <div className="relative mb-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ["#0F766E", "#14B8A6", "#0369A1", "#059669", "#0EA5E9", "#D97706"][i],
              top: `${-20 + Math.sin(i * 60 * Math.PI / 180) * 50}px`,
              left: `${Math.cos(i * 60 * Math.PI / 180) * 50}px`,
              animation: `confetti-fall 2s ease-out ${i * 0.1}s forwards`,
            }}
          />
        ))}

        {/* Success circle */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-warning" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("successTitle")}
          </h2>
          <Sparkles className="w-5 h-5 text-warning" />
        </div>
        <p className="text-muted text-sm max-w-md mx-auto">
          {t("successSubtitle")}{" "}
          <span className="font-semibold text-primary capitalize">{t(claimType)}</span>{" "}
          {t("successSubtitle2")}
        </p>
      </div>

      {/* Reference Number Card */}
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-elevated)] mb-6">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 text-center">
          {t("refLabel")}
        </p>
        <div className="flex items-center justify-center gap-3">
          <code className="text-xl md:text-2xl font-bold font-mono text-primary tracking-wider">
            {referenceNumber}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              copied
                ? "bg-success-light text-success"
                : "bg-muted-bg text-muted hover:bg-primary-light hover:text-primary"
            )}
            aria-label="Copy reference number"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        {copied && (
          <p className="text-xs text-success text-center mt-2 animate-fade-in">
            {t("copied")}
          </p>
        )}
      </div>

      {/* Next Steps */}
      <div className="w-full max-w-md bg-primary-lighter rounded-2xl border border-primary/10 p-5 mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          {t("nextStepsTitle")}
        </h3>
        <ul className="space-y-2.5">
          {[
            t("nextSteps1"),
            t("nextSteps2"),
            t("nextSteps3"),
            t("nextSteps4"),
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* New Claim Button */}
      <button
        type="button"
        onClick={onNewClaim}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-primary bg-primary-light hover:bg-primary hover:text-white transition-all duration-200"
      >
        {t("submitAnother")}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

