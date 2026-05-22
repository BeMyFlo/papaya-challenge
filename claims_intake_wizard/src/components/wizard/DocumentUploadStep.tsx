"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimType, DocumentFile } from "@/types/claim";
import { getDocumentRequirements } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { getDocumentLabel } from "@/lib/translations";

interface DocumentUploadStepProps {
  claimType: ClaimType;
  isMajorDental: boolean;
  onMajorDentalChange: (value: boolean) => void;
  documents: Record<string, DocumentFile>;
  onDocumentUpload: (docId: string, file: DocumentFile) => void;
  onDocumentRemove: (docId: string) => void;
  errors: string[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentUploadStep({
  claimType,
  isMajorDental,
  onMajorDentalChange,
  documents,
  onDocumentUpload,
  onDocumentRemove,
  errors,
}: DocumentUploadStepProps) {
  const { t, language } = useLanguage();
  const requirements = getDocumentRequirements(claimType, isMajorDental);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const simulateUpload = (docId: string, file: File) => {
    setUploadingDoc(docId);
    setUploadProgress(0);
    setFileErrors((prev) => {
      const n = { ...prev };
      delete n[docId];
      return n;
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          onDocumentUpload(docId, {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          });
          setUploadingDoc(null);
          setUploadProgress(0);
        }, 300);
      } else {
        setUploadProgress(Math.min(progress, 99));
      }
    }, 200);
  };

  const handleFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!allowedTypes.includes(file.type)) {
      setFileErrors((prev) => ({
        ...prev,
        [docId]: t("invalidFileType"),
      }));
      return;
    }

    // Validate size
    if (file.size > maxSize) {
      setFileErrors((prev) => ({
        ...prev,
        [docId]: `${t("fileTooLarge")} ${formatFileSize(maxSize)}`,
      }));
      return;
    }

    simulateUpload(docId, file);

    // Reset input value so same file can be re-uploaded
    e.target.value = "";
  };

  return (
    <div className="step-content space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("documentUploadTitle")}
        </h2>
        <p className="text-muted text-sm max-w-lg mx-auto">
          {t("documentUploadSubtitle")}{" "}
          <span className="font-semibold text-primary capitalize">{t(claimType)}</span>{" "}
          {t("documentUploadSubtitle2")}
        </p>
      </div>

      {/* Major Dental Toggle */}
      {claimType === "dental" && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)] animate-fade-in">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isMajorDental}
                onChange={(e) => onMajorDentalChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border rounded-full peer-checked:bg-primary transition-colors duration-200" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t("majorDentalLabel")}
              </p>
              <p className="text-xs text-muted">
                {t("majorDentalDesc")}
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Document Cards */}
      <div className="space-y-4">
        {requirements.map((req) => {
          const uploaded = documents[req.id];
          const isUploading = uploadingDoc === req.id;
          const hasError = fileErrors[req.id];
          const displayLabel = getDocumentLabel(req.id, language);

          return (
            <div
              key={req.id}
              className={cn(
                "bg-card rounded-xl border-2 p-5 transition-all duration-200 shadow-[var(--shadow-card)]",
                uploaded
                  ? "border-success/30 bg-success-light/30"
                  : hasError
                  ? "border-error/30"
                  : "border-border"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      uploaded
                        ? "bg-success-light text-success"
                        : "bg-primary-light text-primary"
                    )}
                  >
                    {uploaded ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{displayLabel}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          req.required
                            ? "bg-error-light text-error"
                            : "bg-muted-bg text-muted"
                        )}
                      >
                        {req.required ? t("requiredLabel") : t("optionalLabel")}
                      </span>
                    </div>
                  </div>
                </div>

                {uploaded && (
                  <button
                    type="button"
                    onClick={() => onDocumentRemove(req.id)}
                    className="p-2 rounded-lg text-muted hover:text-error hover:bg-error-light transition-colors"
                    aria-label={`Remove ${displayLabel}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-3 animate-fade-in">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted">{t("uploading")}</span>
                    <span className="text-xs font-semibold text-primary">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted-bg rounded-full overflow-hidden">
                    <div
                      className="upload-progress-bar h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded file info */}
              {uploaded && !isUploading && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 border border-success/20 animate-fade-in">
                  <FileText className="w-4 h-4 text-success shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">
                    {uploaded.name}
                  </span>
                  <span className="text-xs text-muted shrink-0">
                    {formatFileSize(uploaded.size)}
                  </span>
                </div>
              )}

              {/* Error */}
              {hasError && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-error-light border border-error/20 animate-fade-in mb-3">
                  <FileWarning className="w-4 h-4 text-error shrink-0" />
                  <span className="text-xs text-error">{hasError}</span>
                </div>
              )}

              {/* Upload button */}
              {!uploaded && !isUploading && (
                <div className="mt-2">
                  <input
                    ref={(el) => { fileInputRefs.current[req.id] = el; }}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(req.id, e)}
                    className="sr-only"
                    id={`file-${req.id}`}
                    aria-label={`Upload ${displayLabel}`}
                  />
                  <label
                    htmlFor={`file-${req.id}`}
                    className={cn(
                      "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border-2 border-dashed cursor-pointer",
                      "transition-all duration-200 text-sm font-medium",
                      "border-border text-muted hover:border-primary hover:text-primary hover:bg-primary-lighter"
                    )}
                  >
                    <Upload className="w-4 h-4" />
                    {t("chooseFile")}
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-error/30 bg-error-light p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-error" />
            <p className="text-sm font-semibold text-error">{t("missingDocsTitle")}</p>
          </div>
          <ul className="space-y-1">
            {errors.map((err) => (
              <li key={err} className="text-xs text-error flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-error shrink-0" />
                {t(err)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

