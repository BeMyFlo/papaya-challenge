# Claims Intake Wizard — Full Project Context

> **Mục đích file này:** Cung cấp toàn bộ context về source code để bất kỳ AI agent nào đọc file này đều có thể hiểu ngay kiến trúc, logic, data flow và conventions của project mà không cần đọc từng file source code.

---

## 1. Tổng Quan Dự Án

**Claims Intake Wizard** là một ứng dụng web multi-step wizard cho phép khách hàng bảo hiểm (Papaya Insurtech) submit yêu cầu bồi thường (insurance claims). Ứng dụng hướng dẫn người dùng qua 5 bước và gửi dữ liệu lên API backend, lưu vào MongoDB.

- **URL chạy:** `http://localhost:3000`
- **Branding:** "Papaya Insurtech — Claims Intake Wizard"

---

## 2. Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | **Next.js 16.2.6** (App Router)                         |
| Language     | **TypeScript 5.x**                                      |
| UI Library   | **React 19.2.4**                                        |
| Styling      | **Tailwind CSS v4** (via `@tailwindcss/postcss`)        |
| CSS Utility  | `clsx` + `tailwind-merge` (hàm `cn()` trong `lib/utils.ts`) |
| Icons        | **Lucide React** (`lucide-react`)                       |
| Form Valid.  | **Zod v4.4.3** (schema validation per step)             |
| Database     | **MongoDB** via **Mongoose 9.6.2**                      |
| Font         | Geist Sans + Geist Mono (from `next/font/google`)       |
| UI Primitives| Radix UI (checkbox, dialog, label, popover, progress, scroll-area, separator, slot, toggle) — **chưa dùng trực tiếp** trong wizard, chỉ cài sẵn |

### Scripts

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # ESLint
```

### Environment Variables (`.env.local`)

```
MONGODB_URI=mongodb://localhost:27017/claims_wizard
```

> Nếu MongoDB không khả dụng, API vẫn trả về `success: true` + log claim ra console.

---

## 3. Cấu Trúc Thư Mục

```
claims_intake_wizard/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Geist fonts, metadata SEO)
│   │   ├── page.tsx              # Trang chính: Header + ClaimsWizard + Footer
│   │   ├── globals.css           # Design tokens, animations, base styles
│   │   └── api/
│   │       └── claims/
│   │           └── route.ts      # POST /api/claims — nhận & lưu claim
│   ├── components/
│   │   └── wizard/
│   │       ├── ClaimsWizard.tsx         # ★ Component chính: state management, navigation, submit
│   │       ├── Stepper.tsx              # Thanh progress 5 bước (desktop + mobile)
│   │       ├── ClaimTypeStep.tsx        # Step 1: Chọn loại claim
│   │       ├── MemberPolicyStep.tsx     # Step 2: Thông tin member & policy
│   │       ├── DiagnosisTreatmentStep.tsx  # Step 3: Chẩn đoán & điều trị
│   │       ├── DocumentUploadStep.tsx   # Step 4: Upload tài liệu
│   │       ├── ReviewSubmitStep.tsx     # Step 5: Review & gửi
│   │       └── SuccessScreen.tsx        # Màn hình thành công (reference number)
│   ├── lib/
│   │   ├── mongodb.ts            # Kết nối MongoDB (singleton cached)
│   │   ├── mock-data.ts          # Dữ liệu mẫu: member, dependents, ICD-10, providers, document requirements
│   │   ├── utils.ts              # Hàm cn() (clsx + tailwind-merge)
│   │   └── validation.ts         # Zod schemas cho từng step
│   ├── models/
│   │   └── Claim.ts              # Mongoose model + interface IClaimDocument
│   └── types/
│       └── claim.ts              # TypeScript interfaces/types cho claim data
├── public/                       # Static assets (SVG icons mặc định Next.js)
├── package.json
├── tsconfig.json                 # Path alias: @/* → ./src/*
├── next.config.ts                # Cấu hình Next.js (hiện trống)
├── postcss.config.mjs            # PostCSS (Tailwind plugin)
└── AGENTS.md                     # Rule cho AI agents
```

---

## 4. Data Models & Types

### 4.1 Frontend Types (`src/types/claim.ts`)

```typescript
type ClaimType = "outpatient" | "inpatient" | "dental";
type ClaimantType = "self" | "dependent";

interface MemberInfo {
  memberName: string;
  policyNumber: string;    // e.g. "POL-2024-887654"
  memberId: string;        // e.g. "MEM-10042389"
  dateOfBirth: string;     // ISO date string
  email: string;
  phone: string;
}

interface Dependent {
  name: string;
  relationship: string;   // "Spouse" | "Child"
  dateOfBirth: string;
}

interface DiagnosisInfo {
  diagnosisDescription: string;   // min 10 chars
  icd10Code: string;              // e.g. "J06.9"
  icd10Description: string;      // e.g. "Acute upper respiratory infection"
  providerName: string;           // Hospital/clinic name
}

interface TreatmentInfo {
  treatmentDate?: string;         // Cho outpatient/dental
  admissionDate?: string;         // Cho inpatient
  dischargeDate?: string;         // Cho inpatient
  admissionReason?: string;       // Cho inpatient
  lengthOfStay?: number;          // Auto-calculated (days)
}

interface DocumentFile {
  name: string;
  size: number;
  type: string;           // MIME type
  uploadedAt: string;     // ISO datetime
}

interface DocumentRequirement {
  id: string;             // e.g. "medical-receipt"
  label: string;          // e.g. "Medical Receipt"
  required: boolean;
  acceptedTypes: string[];// [".pdf", ".jpg", ".jpeg", ".png"]
  maxSize: number;        // 10MB = 10485760
}

interface ClaimFormData {
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

interface ClaimSubmission extends ClaimFormData {
  referenceNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ICD10Code { code: string; description: string; }
interface Provider  { name: string; type: string; }
```

### 4.2 Mongoose Model (`src/models/Claim.ts`)

- Schema mirrors `ClaimFormData` + thêm `referenceNumber`, `status`, `timestamps`
- `referenceNumber`: unique, format `CLM-{base36_timestamp}-{random_4chars}` (tạo ở API)
- `status`: default `"submitted"`
- `documents`: `Schema.Types.Mixed` (flexible key-value)
- Dùng `mongoose.models.Claim || mongoose.model(...)` để tránh recompilation trong dev

---

## 5. Wizard Flow (5 Steps)

### Step 1: Claim Type (`ClaimTypeStep.tsx`)
- Chọn 1 trong 3 loại: **Outpatient**, **Inpatient**, **Dental**
- Mỗi loại hiện mô tả + danh sách required/optional documents
- Visual: Card selection với gradient icons, animation khi chọn

### Step 2: Member & Policy (`MemberPolicyStep.tsx`)
- Form pre-filled từ `mockMemberInfo` (giả lập dữ liệu từ profile)
- 6 fields: Name, Policy Number, Member ID, DOB, Email, Phone
- Chọn claimant: "Myself" hoặc "A Dependent"
- Nếu chọn dependent → hiện danh sách `mockDependents` (3 người) để chọn

### Step 3: Diagnosis & Treatment (`DiagnosisTreatmentStep.tsx`)
- **Diagnosis Description**: textarea, min 10 chars
- **ICD-10 Code**: autocomplete dropdown, search by code hoặc description, keyboard navigation (↑↓ Enter Esc)
- **Provider/Hospital**: autocomplete dropdown từ danh sách `providers` (10 providers)
- **Treatment Dates**:
  - Outpatient/Dental → 1 field: Treatment Date
  - Inpatient → 3 fields: Admission Date, Discharge Date, Admission Reason + auto-calc Length of Stay

### Step 4: Document Upload (`DocumentUploadStep.tsx`)
- Dynamic requirements dựa vào `claimType` + `isMajorDental`:
  - **Outpatient**: Medical Receipt (required), Prescription (optional)
  - **Inpatient**: Discharge Summary, Itemized Bill, Medical Receipt (all required)
  - **Dental**: Dental Receipt (required), Treatment Plan (required nếu major dental)
- Nếu `claimType === "dental"` → hiện toggle "Major Dental Treatment"
- Upload simulated (progress bar animation), không thực sự upload lên server
- File validation: type (PDF/JPG/PNG), size (max 10MB)
- Lưu metadata `DocumentFile` vào state, KHÔNG lưu file content

### Step 5: Review & Submit (`ReviewSubmitStep.tsx`)
- Hiện tóm tắt toàn bộ dữ liệu đã nhập ở 4 bước trước
- Mỗi section có nút "Edit" → quay lại step tương ứng
- Checkbox xác nhận thông tin chính xác (bắt buộc)
- Button "Submit Claim" → gọi API

### Success Screen (`SuccessScreen.tsx`)
- Hiện sau khi submit thành công
- Hiện reference number + nút copy
- Hiện "What happens next?" (4 bước)
- Button "Submit Another Claim" → reset form

---

## 6. State Management

**Toàn bộ state nằm trong `ClaimsWizard.tsx`** (lifted state, không dùng context/store):

| State                | Type                          | Mô tả                                        |
| -------------------- | ----------------------------- | --------------------------------------------- |
| `currentStep`        | `number` (1-5)                | Step hiện tại                                 |
| `isSubmitting`       | `boolean`                     | Đang gửi API                                  |
| `isSubmitted`        | `boolean`                     | Đã gửi thành công → render SuccessScreen      |
| `referenceNumber`    | `string`                      | Mã tham chiếu từ API                          |
| `claimType`          | `ClaimType \| ""`              | Loại claim đã chọn                            |
| `claimantType`       | `ClaimantType`                | "self" hoặc "dependent"                       |
| `memberInfo`         | `MemberInfo`                  | Pre-filled từ mock                            |
| `selectedDependent`  | `Dependent \| undefined`       | Dependent đã chọn (nếu claimant=dependent)    |
| `diagnosisInfo`      | `DiagnosisInfo`               | Thông tin chẩn đoán                           |
| `treatmentInfo`      | `TreatmentInfo`               | Thông tin điều trị                            |
| `isMajorDental`      | `boolean`                     | Toggle major dental (chỉ cho dental claims)   |
| `documents`          | `Record<string, DocumentFile>`| Documents đã upload (key = document ID)       |
| `confirmationAccepted`| `boolean`                    | Checkbox xác nhận ở step 5                    |
| `errors`             | `Record<string, string>`      | Validation errors (key = field path)           |
| `documentErrors`     | `string[]`                    | Lỗi missing required documents                |

### Navigation Flow
- `goNext()`: validate current step → nếu pass → `currentStep + 1` + scroll top
- `goBack()`: clear errors → `currentStep - 1` + scroll top
- `goToStep(n)`: direct jump (dùng cho "Edit" ở step 5)
- Step 1-4 hiện nút "Back" + "Continue"
- Step 5 chỉ hiện nút "Back" (submit button nằm trong ReviewSubmitStep)

---

## 7. Validation Logic (`src/lib/validation.ts`)

Dùng **Zod schemas** để validate từng step khi user nhấn "Continue":

| Step | Schema                        | Quy tắc chính                                                                                 |
| ---- | ----------------------------- | ---------------------------------------------------------------------------------------------- |
| 1    | `claimTypeSchema`             | `claimType` phải là 1 trong 3 enum values                                                     |
| 2    | `memberPolicySchema`          | Tất cả `memberInfo` fields required + email valid. Nếu `claimantType=dependent` → phải chọn dependent |
| 3    | `diagnosisTreatmentSchema`    | Description min 10 chars, ICD-10 required, provider required. Outpatient/dental → treatmentDate required. Inpatient → admissionDate + dischargeDate + admissionReason required, discharge ≥ admission |
| 4    | `validateRequiredDocuments()`  | Check có upload đủ required docs theo claimType. Hàm riêng (không phải Zod schema)             |
| 5    | `reviewSubmitSchema`          | `confirmationAccepted === true`                                                                |

### Error handling pattern:
- Zod parse errors → flatten thành `Record<string, string>` với key = `field.path` (e.g. `"memberInfo.memberName"`)
- Mỗi input component check `errors["path"]` để hiển thị inline error
- Errors auto-clear khi user thay đổi field value

---

## 8. API Backend

### `POST /api/claims` (`src/app/api/claims/route.ts`)

**Request Body:** `ClaimFormData` (JSON)

**Logic:**
1. Generate `referenceNumber` = `CLM-{timestamp_base36}-{random_base36_4chars}`
2. Log payload to console
3. Try connect MongoDB → save Claim document
4. If MongoDB fails → still return success (graceful degradation)

**Response (201):**
```json
{
  "success": true,
  "referenceNumber": "CLM-XXXX-YYYY",
  "message": "Claim submitted successfully..."
}
```

**Response (500):**
```json
{
  "success": false,
  "message": "Failed to process claim submission",
  "error": "..."
}
```

### MongoDB Connection (`src/lib/mongodb.ts`)
- Singleton pattern: cached connection on `global.mongooseCache`
- Env var: `MONGODB_URI` (required)
- `bufferCommands: false` (fail fast if no connection)

---

## 9. Mock Data (`src/lib/mock-data.ts`)

| Export                     | Type                    | Nội dung                                           |
| -------------------------- | ----------------------- | --------------------------------------------------- |
| `mockMemberInfo`           | `MemberInfo`            | "David Nguyen", pre-filled member data              |
| `mockDependents`           | `Dependent[]` (3 items) | Sarah (Spouse), Ben (Child), Anna (Child)           |
| `providers`                | `Provider[]` (10 items) | Danh sách bệnh viện/phòng khám                     |
| `icd10Codes`               | `ICD10Code[]` (115 items)| Bảng mã ICD-10 phổ biến                            |
| `getDocumentRequirements()`| `DocumentRequirement[]` | Trả về danh sách docs cần upload theo claimType     |
| `claimTypeDescriptions`    | Object                  | Title, description, requiredDocs, optionalDocs cho 3 loại claim |

---

## 10. Design System (`src/app/globals.css`)

### Color Palette (CSS variables in `@theme inline`)

| Token              | Value     | Dùng cho                          |
| ------------------ | --------- | --------------------------------- |
| `--color-primary`  | `#4f46e5` | Indigo — brand color chính        |
| `--color-secondary`| `#6366f1` | Lighter indigo — gradients        |
| `--color-accent`   | `#818cf8` | Lightest indigo                   |
| `--color-success`  | `#059669` | Emerald — trạng thái thành công   |
| `--color-error`    | `#dc2626` | Red — lỗi, required markers      |
| `--color-warning`  | `#d97706` | Amber — cảnh báo                  |
| `--color-info`     | `#2563eb` | Blue — thông tin                  |
| `--color-foreground`| `#0f172a`| Slate 900 — text chính           |
| `--color-muted`    | `#94a3b8` | Slate 400 — text phụ             |
| `--color-background`| `#f8fafc`| Slate 50 — nền                   |

### Animations

| Class               | Effect                           |
| -------------------- | -------------------------------- |
| `.animate-fade-in`   | Fade in + slide up 8px (0.4s)   |
| `.animate-slide-in`  | Fade in + slide from right (0.35s)|
| `.animate-scale-in`  | Fade in + scale from 0.95 (0.3s)|
| `.animate-shimmer`   | Shimmer effect (infinite loop)   |
| `.step-content`      | Fade in khi chuyển step          |
| `.autocomplete-dropdown` | Scale in cho dropdown        |
| `.claim-type-card`   | Hover: translateY(-2px) + shadow |
| `.upload-progress-bar`| Smooth width transition         |

### Shadows
- `--shadow-card`: Subtle (card resting)
- `--shadow-card-hover`: Medium (card hover)
- `--shadow-elevated`: Strong (floating elements)
- `--shadow-dropdown`: Deep (dropdown menus)

---

## 11. Component Props Quick Reference

### `ClaimsWizard` (no props)
- Entry point, manages all state, renders step components

### `Stepper`
```typescript
{ currentStep: number }
```

### `ClaimTypeStep`
```typescript
{
  selectedType: ClaimType | "";
  onSelect: (type: ClaimType) => void;
  error?: string;
}
```

### `MemberPolicyStep`
```typescript
{
  memberInfo: MemberInfo;
  claimantType: ClaimantType;
  selectedDependent?: Dependent;
  onMemberInfoChange: (field: keyof MemberInfo, value: string) => void;
  onClaimantTypeChange: (type: ClaimantType) => void;
  onDependentSelect: (dependent: Dependent | undefined) => void;
  errors: Record<string, string>;
}
```

### `DiagnosisTreatmentStep`
```typescript
{
  claimType: ClaimType;
  diagnosisInfo: DiagnosisInfo;
  treatmentInfo: TreatmentInfo;
  onDiagnosisChange: (field: keyof DiagnosisInfo, value: string) => void;
  onTreatmentChange: (field: keyof TreatmentInfo, value: string | number) => void;
  errors: Record<string, string>;
}
```

### `DocumentUploadStep`
```typescript
{
  claimType: ClaimType;
  isMajorDental: boolean;
  onMajorDentalChange: (value: boolean) => void;
  documents: Record<string, DocumentFile>;
  onDocumentUpload: (docId: string, file: DocumentFile) => void;
  onDocumentRemove: (docId: string) => void;
  errors: string[];
}
```

### `ReviewSubmitStep`
```typescript
{
  formData: ClaimFormData;
  confirmationAccepted: boolean;
  onConfirmationChange: (value: boolean) => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
```

### `SuccessScreen`
```typescript
{
  referenceNumber: string;
  claimType: string;
  onNewClaim: () => void;
}
```

---

## 12. Lưu Ý Quan Trọng

1. **Document upload là giả lập** — file không thực sự được upload lên server. Chỉ lưu metadata (name, size, type) vào state. Progress bar là animation fake.

2. **Member info pre-filled từ mock data** — trong production, data này sẽ đến từ authentication/profile API.

3. **MongoDB graceful degradation** — nếu DB không chạy, API vẫn return success + log ra console. Frontend không bị ảnh hưởng.

4. **Không dùng form library** — state quản lý manual trong ClaimsWizard, validation bằng Zod. `react-hook-form` và `@hookform/resolvers` đã cài nhưng **chưa sử dụng**.

5. **Radix UI components cài sẵn** nhưng chưa dùng trong wizard — có thể dùng cho future features.

6. **Path alias** `@/*` → `./src/*` (tsconfig).

7. **Single page app** — chỉ có 1 route (`/`), không có routing khác.

8. **All wizard components là `"use client"`** — server component chỉ có `layout.tsx` và `page.tsx`.

9. **Tailwind CSS v4** — dùng `@theme inline` thay vì `tailwind.config.js`. Tất cả design tokens define trong `globals.css`.

10. **Next.js 16** — có thể có breaking changes so với Next.js 14/15. Luôn check docs trong `node_modules/next/dist/docs/` trước khi code (theo AGENTS.md rule).
