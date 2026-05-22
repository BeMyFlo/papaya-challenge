"use client";

import {
  ClipboardList,
  User,
  Stethoscope,
  FileText,
  Edit3,
  Check,
  Calendar,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimFormData } from "@/types/claim";
import { useLanguage } from "@/context/LanguageContext";
import { getDocumentLabel } from "@/lib/translations";

interface ReviewSubmitStepProps {
  formData: ClaimFormData;
  confirmationAccepted: boolean;
  onConfirmationChange: (value: boolean) => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ReviewSubmitStep({
  formData,
  confirmationAccepted,
  onConfirmationChange,
  onEditStep,
  onSubmit,
  isSubmitting,
  errors,
}: ReviewSubmitStepProps) {
  const { t, language } = useLanguage();

  const sections = [
    {
      title: t("step1"),
      icon: <ClipboardList className="w-4 h-4" />,
      step: 1,
      content: (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-light text-primary capitalize">
            {t(formData.claimType)}
          </span>
        </div>
      ),
    },
    {
      title: t("memberPolicyTitle"),
      icon: <User className="w-4 h-4" />,
      step: 2,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ReviewField label={t("reviewFieldNameName")} value={formData.memberInfo.memberName} />
          <ReviewField label={t("reviewFieldPolicyNumber")} value={formData.memberInfo.policyNumber} mono />
          <ReviewField label={t("reviewFieldMemberId")} value={formData.memberInfo.memberId} mono />
          <ReviewField label={t("reviewFieldDOB")} value={formData.memberInfo.dateOfBirth} />
          <ReviewField label={t("reviewFieldEmail")} value={formData.memberInfo.email} />
          <ReviewField label={t("reviewFieldPhone")} value={formData.memberInfo.phone} />
          <ReviewField
            label={t("reviewFieldClaimant")}
            value={formData.claimantType === "self" ? t("reviewFieldClaimantSelf") : t("reviewFieldClaimantDependent")}
          />
          {formData.selectedDependent && (
            <>
              <ReviewField label={t("reviewFieldDependentName")} value={formData.selectedDependent.name} />
              <ReviewField
                label={t("reviewFieldRelationship")}
                value={t(formData.selectedDependent.relationship.toLowerCase() as any)}
              />
              <ReviewField label={t("reviewFieldDependentDOB")} value={formData.selectedDependent.dateOfBirth} />
            </>
          )}
        </div>
      ),
    },
    {
      title: t("diagnosisTreatmentTitle"),
      icon: <Stethoscope className="w-4 h-4" />,
      step: 3,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ReviewField
              label={t("reviewFieldICD10")}
              value={`${formData.diagnosisInfo.icd10Code} — ${formData.diagnosisInfo.icd10Description}`}
            />
            <ReviewField label={t("reviewFieldProvider")} value={formData.diagnosisInfo.providerName} icon={<Building2 className="w-3 h-3" />} />
          </div>
          <ReviewField label={t("reviewFieldDiagnosisDesc")} value={formData.diagnosisInfo.diagnosisDescription} full />

          {(formData.claimType === "outpatient" || formData.claimType === "dental") && (
            <ReviewField
              label={t("reviewFieldTreatmentDate")}
              value={formData.treatmentInfo.treatmentDate || "—"}
              icon={<Calendar className="w-3 h-3" />}
            />
          )}
          {formData.claimType === "inpatient" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ReviewField
                label={t("reviewFieldAdmissionDate")}
                value={formData.treatmentInfo.admissionDate || "—"}
                icon={<Calendar className="w-3 h-3" />}
              />
              <ReviewField
                label={t("reviewFieldDischargeDate")}
                value={formData.treatmentInfo.dischargeDate || "—"}
                icon={<Calendar className="w-3 h-3" />}
              />
              <ReviewField
                label={t("reviewFieldLengthOfStay")}
                value={
                  formData.treatmentInfo.lengthOfStay !== undefined
                    ? language === "vi"
                      ? `${formData.treatmentInfo.lengthOfStay} ${t("day")}`
                      : `${formData.treatmentInfo.lengthOfStay} ${formData.treatmentInfo.lengthOfStay !== 1 ? t("days") : t("day")}`
                    : "—"
                }
              />
            </div>
          )}
          {formData.claimType === "inpatient" && formData.treatmentInfo.admissionReason && (
            <ReviewField label={t("reviewFieldAdmissionReason")} value={formData.treatmentInfo.admissionReason} full />
          )}
        </div>
      ),
    },
    {
      title: t("reviewFieldUploadedDocs"),
      icon: <FileText className="w-4 h-4" />,
      step: 4,
      content: (
        <div className="space-y-2">
          {Object.entries(formData.documents).length > 0 ? (
            Object.entries(formData.documents).map(([id, doc]) => (
              <div
                key={id}
                className="flex items-center gap-3 p-3 rounded-lg bg-success-light/50 border border-success/20"
              >
                <Check className="w-4 h-4 text-success shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted">
                    {formatFileSize(doc.size)} • {getDocumentLabel(id, language)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">{t("reviewFieldNoDocs")}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="step-content space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("reviewSubmitTitle")}
        </h2>
        <p className="text-muted text-sm max-w-lg mx-auto">
          {t("reviewSubmitSubtitle")}
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary-light flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                {section.title}
              </h3>
              <button
                type="button"
                onClick={() => onEditStep(section.step)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary-light transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                {t("edit")}
              </button>
            </div>
            {section.content}
          </div>
        ))}
      </div>

      {/* Confirmation Checkbox */}
      <div className="bg-card rounded-xl border-2 border-border p-5 shadow-[var(--shadow-card)]">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={confirmationAccepted}
              onChange={(e) => onConfirmationChange(e.target.checked)}
              className="sr-only peer"
              id="confirmation-checkbox"
            />
            <div
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                confirmationAccepted
                  ? "bg-primary border-primary"
                  : "bg-white border-border"
              )}
            >
              {confirmationAccepted && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {t("confirmTitle")}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {t("confirmDesc")}
            </p>
          </div>
        </label>
        {errors["confirmationAccepted"] && (
          <p className="mt-2 text-xs text-error">{t(errors["confirmationAccepted"])}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !confirmationAccepted}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
            confirmationAccepted && !isSubmitting
              ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              : "bg-muted-bg text-muted cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t("submitting")}
            </>
          ) : (
            <>
              <ClipboardList className="w-4 h-4" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Helper component for review fields
function ReviewField({
  label,
  value,
  mono,
  full,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  full?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={cn(full && "col-span-full")}>
      <p className="text-xs text-muted mb-0.5 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p
        className={cn(
          "text-sm text-foreground",
          mono && "font-mono",
          full && "leading-relaxed"
        )}
      >
        {value}
      </p>
    </div>
  );
}

