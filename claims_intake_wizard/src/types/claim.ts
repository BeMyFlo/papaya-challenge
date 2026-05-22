export type ClaimType = "outpatient" | "inpatient" | "dental";

export type ClaimantType = "self" | "dependent";

export interface Dependent {
  name: string;
  relationship: string;
  dateOfBirth: string;
}

export interface MemberInfo {
  memberName: string;
  policyNumber: string;
  memberId: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

export interface DocumentFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface DocumentRequirement {
  id: string;
  label: string;
  required: boolean;
  acceptedTypes: string[];
  maxSize: number;
}

export interface DiagnosisInfo {
  diagnosisDescription: string;
  icd10Code: string;
  icd10Description: string;
  providerName: string;
}

export interface TreatmentInfo {
  treatmentDate?: string;
  admissionDate?: string;
  dischargeDate?: string;
  admissionReason?: string;
  lengthOfStay?: number;
}

export interface ClaimFormData {
  claimType: ClaimType;
  claimantType: ClaimantType;
  memberInfo: MemberInfo;
  selectedDependent?: Dependent;
  diagnosisInfo: DiagnosisInfo;
  treatmentInfo: TreatmentInfo;
  isMajorDental?: boolean;
  documents: Record<string, DocumentFile>;
  confirmationAccepted: boolean;
}

export interface ClaimSubmission extends ClaimFormData {
  referenceNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICD10Code {
  code: string;
  description: string;
}

export interface Provider {
  name: string;
  type: string;
}
