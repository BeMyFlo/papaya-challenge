import { z } from "zod";

// Step 1: Claim Type
export const claimTypeSchema = z.object({
  claimType: z.enum(["outpatient", "inpatient", "dental"], {
    message: "Please select a claim type",
  }),
});

// Step 2: Member & Policy Info
const memberPolicyBase = z.object({
  memberInfo: z.object({
    memberName: z.string().min(1, "Member name is required"),
    policyNumber: z.string().min(1, "Policy number is required"),
    memberId: z.string().min(1, "Member ID is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  claimantType: z.enum(["self", "dependent"], {
    message: "Please select who this claim is for",
  }),
  selectedDependent: z
    .object({
      name: z.string(),
      relationship: z.string(),
      dateOfBirth: z.string(),
    })
    .optional(),
});

export const memberPolicySchema = memberPolicyBase.refine(
  (data) => {
    if (data.claimantType === "dependent") {
      return !!data.selectedDependent;
    }
    return true;
  },
  {
    message: "Please select a dependent",
    path: ["selectedDependent"],
  }
);

// Step 3: Diagnosis & Treatment
const baseDiagnosisSchema = z.object({
  diagnosisInfo: z.object({
    diagnosisDescription: z.string().min(10, "Please provide at least 10 characters describing the diagnosis"),
    icd10Code: z.string().min(1, "ICD-10 code is required"),
    icd10Description: z.string().min(1, "ICD-10 description is required"),
    providerName: z.string().min(1, "Provider/hospital name is required"),
  }),
  claimType: z.enum(["outpatient", "inpatient", "dental"]),
  treatmentInfo: z.object({
    treatmentDate: z.string().optional(),
    admissionDate: z.string().optional(),
    dischargeDate: z.string().optional(),
    admissionReason: z.string().optional(),
    lengthOfStay: z.number().optional(),
  }),
});

export const diagnosisTreatmentSchema = baseDiagnosisSchema.superRefine((data, ctx) => {
  if (data.claimType === "outpatient" || data.claimType === "dental") {
    if (!data.treatmentInfo.treatmentDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Treatment date is required",
        path: ["treatmentInfo", "treatmentDate"],
      });
    }
  }

  if (data.claimType === "inpatient") {
    if (!data.treatmentInfo.admissionDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Admission date is required",
        path: ["treatmentInfo", "admissionDate"],
      });
    }
    if (!data.treatmentInfo.dischargeDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discharge date is required",
        path: ["treatmentInfo", "dischargeDate"],
      });
    }
    if (!data.treatmentInfo.admissionReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Admission reason is required",
        path: ["treatmentInfo", "admissionReason"],
      });
    }
    if (data.treatmentInfo.admissionDate && data.treatmentInfo.dischargeDate) {
      const admission = new Date(data.treatmentInfo.admissionDate);
      const discharge = new Date(data.treatmentInfo.dischargeDate);
      if (discharge < admission) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discharge date must be on or after admission date",
          path: ["treatmentInfo", "dischargeDate"],
        });
      }
    }
  }
});

// Step 4: Document Upload
export const documentUploadSchema = z.object({
  documents: z.record(z.string(),
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      uploadedAt: z.string(),
    })
  ),
  claimType: z.enum(["outpatient", "inpatient", "dental"]),
  isMajorDental: z.boolean().optional(),
});

export function validateRequiredDocuments(
  documents: Record<string, { name: string; size: number; type: string; uploadedAt: string }>,
  claimType: string,
  isMajorDental: boolean = false
): string[] {
  const errors: string[] = [];

  if (claimType === "outpatient") {
    if (!documents["medical-receipt"]) errors.push("Medical Receipt is required");
  } else if (claimType === "inpatient") {
    if (!documents["discharge-summary"]) errors.push("Discharge Summary is required");
    if (!documents["itemized-bill"]) errors.push("Itemized Bill is required");
    if (!documents["medical-receipt"]) errors.push("Medical Receipt is required");
  } else if (claimType === "dental") {
    if (!documents["dental-receipt"]) errors.push("Dental Receipt is required");
    if (isMajorDental && !documents["treatment-plan"]) errors.push("Treatment Plan is required for major dental treatments");
  }

  return errors;
}

// Step 5: Review & Submit
export const reviewSubmitSchema = z.object({
  confirmationAccepted: z.literal(true, {
    message: "You must confirm the information is accurate",
  }),
});
