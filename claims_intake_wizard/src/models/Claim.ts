import mongoose, { Schema, Document } from "mongoose";

export interface IClaimDocument extends Document {
  claimType: string;
  claimantType: string;
  memberInfo: {
    memberName: string;
    policyNumber: string;
    memberId: string;
    dateOfBirth: string;
    email: string;
    phone: string;
  };
  selectedDependent?: {
    name: string;
    relationship: string;
    dateOfBirth: string;
  };
  diagnosisInfo: {
    diagnosisDescription: string;
    icd10Code: string;
    icd10Description: string;
    providerName: string;
  };
  treatmentInfo: {
    treatmentDate?: string;
    admissionDate?: string;
    dischargeDate?: string;
    admissionReason?: string;
    lengthOfStay?: number;
  };
  isMajorDental?: boolean;
  documents: Record<string, {
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
  }>;
  confirmationAccepted: boolean;
  status: string;
  referenceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema = new Schema<IClaimDocument>(
  {
    claimType: { type: String, required: true, enum: ["outpatient", "inpatient", "dental"] },
    claimantType: { type: String, required: true, enum: ["self", "dependent"] },
    memberInfo: {
      memberName: { type: String, required: true },
      policyNumber: { type: String, required: true },
      memberId: { type: String, required: true },
      dateOfBirth: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    selectedDependent: {
      name: { type: String },
      relationship: { type: String },
      dateOfBirth: { type: String },
    },
    diagnosisInfo: {
      diagnosisDescription: { type: String, required: true },
      icd10Code: { type: String, required: true },
      icd10Description: { type: String, required: true },
      providerName: { type: String, required: true },
    },
    treatmentInfo: {
      treatmentDate: { type: String },
      admissionDate: { type: String },
      dischargeDate: { type: String },
      admissionReason: { type: String },
      lengthOfStay: { type: Number },
    },
    isMajorDental: { type: Boolean, default: false },
    documents: { type: Schema.Types.Mixed, default: {} },
    confirmationAccepted: { type: Boolean, required: true },
    status: { type: String, default: "submitted" },
    referenceNumber: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in dev
export const Claim = mongoose.models.Claim || mongoose.model<IClaimDocument>("Claim", ClaimSchema);
