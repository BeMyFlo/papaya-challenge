"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimType, ClaimantType, MemberInfo, Dependent, DiagnosisInfo, TreatmentInfo, DocumentFile, ClaimFormData } from "@/types/claim";
import { mockMemberInfo } from "@/lib/mock-data";
import {
  claimTypeSchema,
  memberPolicySchema,
  diagnosisTreatmentSchema,
  validateRequiredDocuments,
} from "@/lib/validation";
import Stepper from "./Stepper";
import ClaimTypeStep from "./ClaimTypeStep";
import MemberPolicyStep from "./MemberPolicyStep";
import DiagnosisTreatmentStep from "./DiagnosisTreatmentStep";
import DocumentUploadStep from "./DocumentUploadStep";
import ReviewSubmitStep from "./ReviewSubmitStep";
import SuccessScreen from "./SuccessScreen";
import { useLanguage } from "@/context/LanguageContext";

const TOTAL_STEPS = 5;

export default function ClaimsWizard() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  // Form state
  const [claimType, setClaimType] = useState<ClaimType | "">("");
  const [claimantType, setClaimantType] = useState<ClaimantType>("self");
  const [memberInfo, setMemberInfo] = useState<MemberInfo>({ ...mockMemberInfo });
  const [selectedDependent, setSelectedDependent] = useState<Dependent | undefined>();
  const [diagnosisInfo, setDiagnosisInfo] = useState<DiagnosisInfo>({
    diagnosisDescription: "",
    icd10Code: "",
    icd10Description: "",
    providerName: "",
  });
  const [treatmentInfo, setTreatmentInfo] = useState<TreatmentInfo>({});
  const [isMajorDental, setIsMajorDental] = useState(false);
  const [documents, setDocuments] = useState<Record<string, DocumentFile>>({});
  const [confirmationAccepted, setConfirmationAccepted] = useState(false);

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [documentErrors, setDocumentErrors] = useState<string[]>([]);

  // Handlers
  const handleMemberInfoChange = useCallback((field: keyof MemberInfo, value: string) => {
    setMemberInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`memberInfo.${field}`];
      return next;
    });
  }, []);

  const handleDiagnosisChange = useCallback((field: keyof DiagnosisInfo, value: string) => {
    setDiagnosisInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`diagnosisInfo.${field}`];
      return next;
    });
  }, []);

  const handleTreatmentChange = useCallback((field: keyof TreatmentInfo, value: string | number) => {
    setTreatmentInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`treatmentInfo.${field}`];
      return next;
    });
  }, []);

  const handleDocumentUpload = useCallback((docId: string, file: DocumentFile) => {
    setDocuments((prev) => ({ ...prev, [docId]: file }));
    setDocumentErrors([]);
  }, []);

  const handleDocumentRemove = useCallback((docId: string) => {
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  }, []);

  // Validation per step
  const validateStep = (step: number): boolean => {
    setErrors({});
    setDocumentErrors([]);

    switch (step) {
      case 1: {
        const result = claimTypeSchema.safeParse({ claimType });
        if (!result.success) {
          const newErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            newErrors[issue.path.join(".")] = issue.message;
          });
          setErrors(newErrors);
          return false;
        }
        return true;
      }
      case 2: {
        const result = memberPolicySchema.safeParse({
          memberInfo,
          claimantType,
          selectedDependent,
        });
        if (!result.success) {
          const newErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            newErrors[issue.path.join(".")] = issue.message;
          });
          setErrors(newErrors);
          return false;
        }
        return true;
      }
      case 3: {
        const result = diagnosisTreatmentSchema.safeParse({
          diagnosisInfo,
          claimType,
          treatmentInfo,
        });
        if (!result.success) {
          const newErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            newErrors[issue.path.join(".")] = issue.message;
          });
          setErrors(newErrors);
          return false;
        }
        return true;
      }
      case 4: {
        const docErrors = validateRequiredDocuments(documents, claimType, isMajorDental);
        if (docErrors.length > 0) {
          setDocumentErrors(docErrors);
          return false;
        }
        return true;
      }
      case 5: {
        if (!confirmationAccepted) {
          setErrors({ confirmationAccepted: "You must confirm the information is accurate" });
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setErrors({});
    setDocumentErrors([]);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (step: number) => {
    setErrors({});
    setDocumentErrors([]);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    const formData: ClaimFormData = {
      claimType: claimType as ClaimType,
      claimantType,
      memberInfo,
      selectedDependent: claimantType === "dependent" ? selectedDependent : undefined,
      diagnosisInfo,
      treatmentInfo,
      isMajorDental: claimType === "dental" ? isMajorDental : undefined,
      documents,
      confirmationAccepted,
    };

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setReferenceNumber(data.referenceNumber);
        setIsSubmitted(true);
        console.log("Claim submitted successfully:", data);
      } else {
        setErrors({ submit: data.message || "Failed to submit claim" });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewClaim = () => {
    setCurrentStep(1);
    setClaimType("");
    setClaimantType("self");
    setMemberInfo({ ...mockMemberInfo });
    setSelectedDependent(undefined);
    setDiagnosisInfo({
      diagnosisDescription: "",
      icd10Code: "",
      icd10Description: "",
      providerName: "",
    });
    setTreatmentInfo({});
    setIsMajorDental(false);
    setDocuments({});
    setConfirmationAccepted(false);
    setIsSubmitted(false);
    setReferenceNumber("");
    setErrors({});
    setDocumentErrors([]);
  };

  // Success screen
  if (isSubmitted) {
    return (
      <SuccessScreen
        referenceNumber={referenceNumber}
        claimType={claimType}
        onNewClaim={handleNewClaim}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="mb-8">
        <Stepper currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <ClaimTypeStep
            selectedType={claimType}
            onSelect={(type) => {
              setClaimType(type);
              setErrors({});
            }}
            error={errors["claimType"]}
          />
        )}
        {currentStep === 2 && (
          <MemberPolicyStep
            memberInfo={memberInfo}
            claimantType={claimantType}
            selectedDependent={selectedDependent}
            onMemberInfoChange={handleMemberInfoChange}
            onClaimantTypeChange={setClaimantType}
            onDependentSelect={setSelectedDependent}
            errors={errors}
          />
        )}
        {currentStep === 3 && claimType && (
          <DiagnosisTreatmentStep
            claimType={claimType as ClaimType}
            diagnosisInfo={diagnosisInfo}
            treatmentInfo={treatmentInfo}
            onDiagnosisChange={handleDiagnosisChange}
            onTreatmentChange={handleTreatmentChange}
            errors={errors}
          />
        )}
        {currentStep === 4 && claimType && (
          <DocumentUploadStep
            claimType={claimType as ClaimType}
            isMajorDental={isMajorDental}
            onMajorDentalChange={setIsMajorDental}
            documents={documents}
            onDocumentUpload={handleDocumentUpload}
            onDocumentRemove={handleDocumentRemove}
            errors={documentErrors}
          />
        )}
        {currentStep === 5 && claimType && (
          <ReviewSubmitStep
            formData={{
              claimType: claimType as ClaimType,
              claimantType,
              memberInfo,
              selectedDependent: claimantType === "dependent" ? selectedDependent : undefined,
              diagnosisInfo,
              treatmentInfo,
              isMajorDental: claimType === "dental" ? isMajorDental : undefined,
              documents,
              confirmationAccepted,
            }}
            confirmationAccepted={confirmationAccepted}
            onConfirmationChange={setConfirmationAccepted}
            onEditStep={goToStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        )}
      </div>

      {/* Submit error */}
      {errors["submit"] && (
        <div className="mt-4 p-4 rounded-xl bg-error-light border border-error/20 text-sm text-error text-center animate-fade-in">
          {t(errors["submit"])}
        </div>
      )}

      {/* Navigation Buttons (not shown on step 5 — it has its own submit) */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 1}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
              currentStep === 1
                ? "text-muted cursor-not-allowed"
                : "text-foreground hover:bg-muted-bg active:scale-[0.97]"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </button>

          <button
            type="button"
            onClick={goNext}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold",
              "bg-primary text-white hover:bg-primary-hover transition-all duration-200",
              "shadow-md hover:shadow-lg active:scale-[0.97]",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
            )}
          >
            {t("continue")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 5 navigation (Back only) */}
      {currentStep === 5 && (
        <div className="flex items-center mt-8 pt-6 border-t border-border">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-muted-bg transition-all duration-200 active:scale-[0.97]"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </button>
        </div>
      )}
    </div>
  );
}

