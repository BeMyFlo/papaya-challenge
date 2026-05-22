import { Dependent, ICD10Code, MemberInfo, Provider, DocumentRequirement } from "@/types/claim";

export const mockMemberInfo: MemberInfo = {
  memberName: "David Nguyen",
  policyNumber: "POL-2024-887654",
  memberId: "MEM-10042389",
  dateOfBirth: "1990-06-15",
  email: "david.nguyen@email.com",
  phone: "+84 912 345 678",
};

export const mockDependents: Dependent[] = [
  { name: "Sarah Nguyen", relationship: "Spouse", dateOfBirth: "1993-04-12" },
  { name: "Ben Nguyen", relationship: "Child", dateOfBirth: "2018-09-03" },
  { name: "Anna Nguyen", relationship: "Child", dateOfBirth: "2021-01-19" },
];

export const providers: Provider[] = [
  { name: "Papaya International Hospital", type: "Hospital" },
  { name: "CityCare Medical Center", type: "Medical Center" },
  { name: "Lotus Dental Clinic", type: "Dental Clinic" },
  { name: "Sunrise General Hospital", type: "Hospital" },
  { name: "Family Health Clinic", type: "Clinic" },
  { name: "Saigon Medical Group", type: "Medical Group" },
  { name: "Hanoi International Clinic", type: "Clinic" },
  { name: "GreenCare Hospital", type: "Hospital" },
  { name: "SmilePro Dental Center", type: "Dental Center" },
  { name: "Mekong Health Center", type: "Health Center" },
];

export const getDocumentRequirements = (
  claimType: string,
  isMajorDental: boolean = false
): DocumentRequirement[] => {
  const acceptedTypes = [".pdf", ".jpg", ".jpeg", ".png"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  switch (claimType) {
    case "outpatient":
      return [
        { id: "medical-receipt", label: "Medical Receipt", required: true, acceptedTypes, maxSize },
        { id: "prescription", label: "Prescription", required: false, acceptedTypes, maxSize },
      ];
    case "inpatient":
      return [
        { id: "discharge-summary", label: "Discharge Summary", required: true, acceptedTypes, maxSize },
        { id: "itemized-bill", label: "Itemized Bill", required: true, acceptedTypes, maxSize },
        { id: "medical-receipt", label: "Medical Receipt", required: true, acceptedTypes, maxSize },
      ];
    case "dental":
      return [
        { id: "dental-receipt", label: "Dental Receipt", required: true, acceptedTypes, maxSize },
        { id: "treatment-plan", label: "Treatment Plan", required: isMajorDental, acceptedTypes, maxSize },
      ];
    default:
      return [];
  }
};

export const icd10Codes: ICD10Code[] = [
  { code: "A09", description: "Infectious gastroenteritis and colitis" },
  { code: "A15.0", description: "Tuberculosis of lung" },
  { code: "A41.9", description: "Sepsis, unspecified" },
  { code: "B34.9", description: "Viral infection, unspecified" },
  { code: "B97.29", description: "Other coronavirus as cause of disease" },
  { code: "C34.1", description: "Malignant neoplasm of upper lobe, bronchus or lung" },
  { code: "C50.9", description: "Malignant neoplasm of breast, unspecified" },
  { code: "D50.9", description: "Iron deficiency anemia, unspecified" },
  { code: "D64.9", description: "Anemia, unspecified" },
  { code: "E03.9", description: "Hypothyroidism, unspecified" },
  { code: "E05.9", description: "Thyrotoxicosis, unspecified" },
  { code: "E10.9", description: "Type 1 diabetes mellitus without complications" },
  { code: "E11.65", description: "Type 2 diabetes mellitus with hyperglycemia" },
  { code: "E11.9", description: "Type 2 diabetes mellitus without complications" },
  { code: "E13.9", description: "Other specified diabetes mellitus without complications" },
  { code: "E55.9", description: "Vitamin D deficiency, unspecified" },
  { code: "E66.01", description: "Morbid obesity due to excess calories" },
  { code: "E66.9", description: "Obesity, unspecified" },
  { code: "E78.0", description: "Pure hypercholesterolemia" },
  { code: "E78.5", description: "Hyperlipidemia, unspecified" },
  { code: "E87.6", description: "Hypokalemia" },
  { code: "F10.20", description: "Alcohol dependence, uncomplicated" },
  { code: "F17.210", description: "Nicotine dependence, cigarettes, uncomplicated" },
  { code: "F32.1", description: "Major depressive disorder, single episode, moderate" },
  { code: "F32.9", description: "Major depressive disorder, single episode, unspecified" },
  { code: "F33.0", description: "Major depressive disorder, recurrent, mild" },
  { code: "F41.0", description: "Panic disorder" },
  { code: "F41.1", description: "Generalized anxiety disorder" },
  { code: "F41.9", description: "Anxiety disorder, unspecified" },
  { code: "F43.10", description: "Post-traumatic stress disorder, unspecified" },
  { code: "G20", description: "Parkinson disease" },
  { code: "G30.9", description: "Alzheimer disease, unspecified" },
  { code: "G40.909", description: "Epilepsy, unspecified, without status epilepticus" },
  { code: "G43.909", description: "Migraine, unspecified, not intractable" },
  { code: "G47.00", description: "Insomnia, unspecified" },
  { code: "G47.33", description: "Obstructive sleep apnea" },
  { code: "H10.9", description: "Unspecified conjunctivitis" },
  { code: "H26.9", description: "Unspecified cataract" },
  { code: "H40.9", description: "Unspecified glaucoma" },
  { code: "H66.90", description: "Otitis media, unspecified" },
  { code: "I10", description: "Essential (primary) hypertension" },
  { code: "I20.0", description: "Unstable angina" },
  { code: "I20.9", description: "Angina pectoris, unspecified" },
  { code: "I21.9", description: "Acute myocardial infarction, unspecified" },
  { code: "I25.10", description: "Atherosclerotic heart disease without angina" },
  { code: "I48.91", description: "Unspecified atrial fibrillation" },
  { code: "I50.9", description: "Heart failure, unspecified" },
  { code: "I63.9", description: "Cerebral infarction, unspecified" },
  { code: "I73.9", description: "Peripheral vascular disease, unspecified" },
  { code: "J02.9", description: "Acute pharyngitis, unspecified" },
  { code: "J06.9", description: "Acute upper respiratory infection, unspecified" },
  { code: "J10.1", description: "Influenza with other respiratory manifestations" },
  { code: "J18.9", description: "Pneumonia, unspecified" },
  { code: "J20.9", description: "Acute bronchitis, unspecified" },
  { code: "J30.1", description: "Allergic rhinitis due to pollen" },
  { code: "J44.1", description: "COPD with acute exacerbation" },
  { code: "J45.20", description: "Mild intermittent asthma, uncomplicated" },
  { code: "J45.909", description: "Unspecified asthma, uncomplicated" },
  { code: "K02.9", description: "Dental caries, unspecified" },
  { code: "K04.7", description: "Periapical abscess without sinus" },
  { code: "K05.1", description: "Chronic gingivitis" },
  { code: "K08.1", description: "Complete loss of teeth" },
  { code: "K21.0", description: "Gastro-esophageal reflux with esophagitis" },
  { code: "K25.9", description: "Gastric ulcer, unspecified" },
  { code: "K29.70", description: "Gastritis, unspecified, without bleeding" },
  { code: "K35.80", description: "Unspecified acute appendicitis" },
  { code: "K40.90", description: "Inguinal hernia without obstruction or gangrene" },
  { code: "K57.30", description: "Diverticulosis of large intestine without bleeding" },
  { code: "K58.9", description: "Irritable bowel syndrome without diarrhea" },
  { code: "K76.0", description: "Fatty liver, not elsewhere classified" },
  { code: "K80.20", description: "Calculus of gallbladder without cholecystitis" },
  { code: "L20.9", description: "Atopic dermatitis, unspecified" },
  { code: "L30.9", description: "Dermatitis, unspecified" },
  { code: "L40.0", description: "Psoriasis vulgaris" },
  { code: "L50.9", description: "Urticaria, unspecified" },
  { code: "L70.0", description: "Acne vulgaris" },
  { code: "M06.9", description: "Rheumatoid arthritis, unspecified" },
  { code: "M17.9", description: "Osteoarthritis of knee, unspecified" },
  { code: "M19.90", description: "Unspecified osteoarthritis, unspecified site" },
  { code: "M25.50", description: "Pain in unspecified joint" },
  { code: "M47.812", description: "Spondylosis without myelopathy, cervical region" },
  { code: "M51.16", description: "Intervertebral disc disorders with radiculopathy, lumbar" },
  { code: "M54.2", description: "Cervicalgia" },
  { code: "M54.5", description: "Low back pain" },
  { code: "M79.3", description: "Panniculitis, unspecified" },
  { code: "M81.0", description: "Age-related osteoporosis without pathological fracture" },
  { code: "N18.3", description: "Chronic kidney disease, stage 3" },
  { code: "N18.9", description: "Chronic kidney disease, unspecified" },
  { code: "N39.0", description: "Urinary tract infection, site not specified" },
  { code: "N40.0", description: "Benign prostatic hyperplasia without obstruction" },
  { code: "N76.0", description: "Acute vaginitis" },
  { code: "O80", description: "Encounter for full-term uncomplicated delivery" },
  { code: "O99.89", description: "Other specified diseases complicating pregnancy" },
  { code: "R00.0", description: "Tachycardia, unspecified" },
  { code: "R05.9", description: "Cough, unspecified" },
  { code: "R06.00", description: "Dyspnea, unspecified" },
  { code: "R07.9", description: "Chest pain, unspecified" },
  { code: "R10.9", description: "Unspecified abdominal pain" },
  { code: "R11.2", description: "Nausea with vomiting, unspecified" },
  { code: "R42", description: "Dizziness and giddiness" },
  { code: "R50.9", description: "Fever, unspecified" },
  { code: "R51.9", description: "Headache, unspecified" },
  { code: "S06.0X0A", description: "Concussion without loss of consciousness, initial encounter" },
  { code: "S52.501A", description: "Unspecified fracture of lower end of radius, initial encounter" },
  { code: "S62.90XA", description: "Unspecified fracture of wrist and hand, initial encounter" },
  { code: "S82.90XA", description: "Unspecified fracture of lower leg, initial encounter" },
  { code: "S93.401A", description: "Sprain of unspecified ligament of ankle, initial encounter" },
  { code: "T78.40XA", description: "Allergy, unspecified, initial encounter" },
  { code: "T81.4XXA", description: "Infection following a procedure, initial encounter" },
  { code: "Z00.00", description: "Encounter for general adult medical examination" },
  { code: "Z12.31", description: "Encounter for screening mammogram" },
  { code: "Z23", description: "Encounter for immunization" },
  { code: "Z87.891", description: "Personal history of nicotine dependence" },
];

export const claimTypeDescriptions = {
  outpatient: {
    title: "Outpatient",
    description: "Doctor visits, consultations, lab tests, and procedures where you don't stay overnight.",
    requiredDocs: ["Medical Receipt"],
    optionalDocs: ["Prescription"],
  },
  inpatient: {
    title: "Inpatient",
    description: "Hospital admissions requiring overnight stay, surgeries, and extended treatments.",
    requiredDocs: ["Discharge Summary", "Itemized Bill", "Medical Receipt"],
    optionalDocs: [],
  },
  dental: {
    title: "Dental",
    description: "Dental checkups, cleanings, fillings, extractions, and specialized dental procedures.",
    requiredDocs: ["Dental Receipt"],
    optionalDocs: ["Treatment Plan"],
  },
};
