"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Search, X, Calendar, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaimType, DiagnosisInfo, TreatmentInfo } from "@/types/claim";
import { icd10Codes, providers } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";

interface DiagnosisTreatmentStepProps {
  claimType: ClaimType;
  diagnosisInfo: DiagnosisInfo;
  treatmentInfo: TreatmentInfo;
  onDiagnosisChange: (field: keyof DiagnosisInfo, value: string) => void;
  onTreatmentChange: (field: keyof TreatmentInfo, value: string | number) => void;
  errors: Record<string, string>;
}

export default function DiagnosisTreatmentStep({
  claimType,
  diagnosisInfo,
  treatmentInfo,
  onDiagnosisChange,
  onTreatmentChange,
  errors,
}: DiagnosisTreatmentStepProps) {
  const { t, language } = useLanguage();
  const [icdSearch, setIcdSearch] = useState("");
  const [showIcdDropdown, setShowIcdDropdown] = useState(false);
  const [icdHighlightIndex, setIcdHighlightIndex] = useState(0);
  const [providerSearch, setProviderSearch] = useState(diagnosisInfo.providerName || "");
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [providerHighlightIndex, setProviderHighlightIndex] = useState(0);
  const icdDropdownRef = useRef<HTMLDivElement>(null);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const icdInputRef = useRef<HTMLInputElement>(null);
  const providerInputRef = useRef<HTMLInputElement>(null);

  // Filter ICD-10 codes
  const filteredIcd = useMemo(() => {
    if (!icdSearch) return icd10Codes.slice(0, 15);
    const search = icdSearch.toLowerCase();
    return icd10Codes
      .filter(
        (c) =>
          c.code.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search)
      )
      .slice(0, 15);
  }, [icdSearch]);

  // Filter providers
  const filteredProviders = useMemo(() => {
    if (!providerSearch) return providers;
    const search = providerSearch.toLowerCase();
    return providers.filter((p) => p.name.toLowerCase().includes(search));
  }, [providerSearch]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (icdDropdownRef.current && !icdDropdownRef.current.contains(e.target as Node)) {
        setShowIcdDropdown(false);
      }
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(e.target as Node)) {
        setShowProviderDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Calculate length of stay
  useEffect(() => {
    if (claimType === "inpatient" && treatmentInfo.admissionDate && treatmentInfo.dischargeDate) {
      const admission = new Date(treatmentInfo.admissionDate);
      const discharge = new Date(treatmentInfo.dischargeDate);
      const diff = Math.max(0, Math.ceil((discharge.getTime() - admission.getTime()) / (1000 * 60 * 60 * 24)));
      onTreatmentChange("lengthOfStay", diff);
    }
  }, [claimType, treatmentInfo.admissionDate, treatmentInfo.dischargeDate, onTreatmentChange]);

  // ICD-10 keyboard nav
  const handleIcdKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showIcdDropdown) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          e.preventDefault();
          setShowIcdDropdown(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setIcdHighlightIndex((prev) => Math.min(prev + 1, filteredIcd.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setIcdHighlightIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredIcd[icdHighlightIndex]) {
            const code = filteredIcd[icdHighlightIndex];
            onDiagnosisChange("icd10Code", code.code);
            onDiagnosisChange("icd10Description", code.description);
            setIcdSearch("");
            setShowIcdDropdown(false);
          }
          break;
        case "Escape":
          setShowIcdDropdown(false);
          break;
      }
    },
    [showIcdDropdown, filteredIcd, icdHighlightIndex, onDiagnosisChange]
  );

  // Provider keyboard nav
  const handleProviderKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showProviderDropdown) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          e.preventDefault();
          setShowProviderDropdown(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setProviderHighlightIndex((prev) => Math.min(prev + 1, filteredProviders.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setProviderHighlightIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredProviders[providerHighlightIndex]) {
            onDiagnosisChange("providerName", filteredProviders[providerHighlightIndex].name);
            setProviderSearch(filteredProviders[providerHighlightIndex].name);
            setShowProviderDropdown(false);
          }
          break;
        case "Escape":
          setShowProviderDropdown(false);
          break;
      }
    },
    [showProviderDropdown, filteredProviders, providerHighlightIndex, onDiagnosisChange]
  );

  return (
    <div className="step-content space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("diagnosisTreatmentTitle")}
        </h2>
        <p className="text-muted text-sm max-w-lg mx-auto">
          {t("diagnosisTreatmentSubtitle")}{" "}
          <span className="font-semibold text-primary capitalize">
            {t(claimType)}
          </span>{" "}
          {t("claimSuffix")}.
        </p>
      </div>

      {/* Diagnosis Info */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          {t("diagnosisDetailsTitle")}
        </h3>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="diagnosisDescription" className="block text-sm font-medium text-foreground mb-1.5">
            {t("diagnosisDescLabel")} <span className="text-error">*</span>
          </label>
          <textarea
            id="diagnosisDescription"
            rows={3}
            value={diagnosisInfo.diagnosisDescription}
            onChange={(e) => onDiagnosisChange("diagnosisDescription", e.target.value)}
            placeholder={t("diagnosisDescPlaceholder")}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm resize-none",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "placeholder:text-muted/50",
              errors["diagnosisInfo.diagnosisDescription"] ? "border-error" : "border-border"
            )}
          />
          <div className="flex justify-between mt-1">
            {errors["diagnosisInfo.diagnosisDescription"] ? (
              <p className="text-xs text-error">{t(errors["diagnosisInfo.diagnosisDescription"])}</p>
            ) : (
              <p className="text-xs text-muted">{t("minCharacters")}</p>
            )}
            <p className={cn("text-xs", diagnosisInfo.diagnosisDescription.length < 10 ? "text-muted" : "text-success")}>
              {diagnosisInfo.diagnosisDescription.length}/10+
            </p>
          </div>
        </div>

        {/* ICD-10 Autocomplete */}
        <div className="mb-4 relative" ref={icdDropdownRef}>
          <label htmlFor="icd10Search" className="block text-sm font-medium text-foreground mb-1.5">
            {t("icd10Label")} <span className="text-error">*</span>
          </label>

          {diagnosisInfo.icd10Code ? (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-primary bg-primary-lighter">
              <span className="font-mono text-sm font-bold text-primary">
                {diagnosisInfo.icd10Code}
              </span>
              <span className="text-sm text-foreground">—</span>
              <span className="text-sm text-foreground flex-1 truncate">
                {diagnosisInfo.icd10Description}
              </span>
              <button
                type="button"
                onClick={() => {
                  onDiagnosisChange("icd10Code", "");
                  onDiagnosisChange("icd10Description", "");
                  setIcdSearch("");
                  setTimeout(() => icdInputRef.current?.focus(), 50);
                }}
                className="p-1 rounded-md hover:bg-primary-light text-muted hover:text-foreground transition-colors"
                aria-label="Clear ICD-10 code"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  ref={icdInputRef}
                  id="icd10Search"
                  type="text"
                  value={icdSearch}
                  onChange={(e) => {
                    setIcdSearch(e.target.value);
                    setShowIcdDropdown(true);
                    setIcdHighlightIndex(0);
                  }}
                  onFocus={() => setShowIcdDropdown(true)}
                  onKeyDown={handleIcdKeyDown}
                  placeholder={t("icd10Placeholder")}
                  className={cn(
                    "w-full pl-10 pr-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    "placeholder:text-muted/50",
                    errors["diagnosisInfo.icd10Code"] ? "border-error" : "border-border"
                  )}
                  role="combobox"
                  aria-expanded={showIcdDropdown}
                  aria-autocomplete="list"
                />
              </div>

              {showIcdDropdown && filteredIcd.length > 0 && (
                <div className="autocomplete-dropdown absolute z-50 mt-1 w-full bg-white border border-border rounded-xl shadow-[var(--shadow-dropdown)] max-h-60 overflow-y-auto">
                  {filteredIcd.map((code, idx) => (
                    <button
                      key={code.code}
                      type="button"
                      onClick={() => {
                        onDiagnosisChange("icd10Code", code.code);
                        onDiagnosisChange("icd10Description", code.description);
                        setIcdSearch("");
                        setShowIcdDropdown(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        idx === icdHighlightIndex
                          ? "bg-primary-lighter"
                          : "hover:bg-muted-bg",
                        idx === 0 && "rounded-t-xl",
                        idx === filteredIcd.length - 1 && "rounded-b-xl"
                      )}
                    >
                      <span className="font-mono text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md shrink-0">
                        {code.code}
                      </span>
                      <span className="text-sm text-foreground truncate">{code.description}</span>
                    </button>
                  ))}
                </div>
              )}

              {showIcdDropdown && filteredIcd.length === 0 && icdSearch && (
                <div className="autocomplete-dropdown absolute z-50 mt-1 w-full bg-white border border-border rounded-xl shadow-[var(--shadow-dropdown)] p-4 text-center text-sm text-muted">
                  {t("icd10NotFound")}
                </div>
              )}
            </>
          )}
          {errors["diagnosisInfo.icd10Code"] && !diagnosisInfo.icd10Code && (
            <p className="mt-1 text-xs text-error">{t(errors["diagnosisInfo.icd10Code"])}</p>
          )}
        </div>

        {/* Provider Autocomplete */}
        <div className="relative" ref={providerDropdownRef}>
          <label htmlFor="providerSearch" className="block text-sm font-medium text-foreground mb-1.5">
            {t("providerLabel")} <span className="text-error">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              ref={providerInputRef}
              id="providerSearch"
              type="text"
              value={providerSearch}
              onChange={(e) => {
                setProviderSearch(e.target.value);
                onDiagnosisChange("providerName", e.target.value);
                setShowProviderDropdown(true);
                setProviderHighlightIndex(0);
              }}
              onFocus={() => setShowProviderDropdown(true)}
              onKeyDown={handleProviderKeyDown}
              placeholder={t("providerPlaceholder")}
              className={cn(
                "w-full pl-10 pr-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "placeholder:text-muted/50",
                errors["diagnosisInfo.providerName"] ? "border-error" : "border-border"
              )}
              role="combobox"
              aria-expanded={showProviderDropdown}
              aria-autocomplete="list"
            />
          </div>

          {showProviderDropdown && filteredProviders.length > 0 && (
            <div className="autocomplete-dropdown absolute z-50 mt-1 w-full bg-white border border-border rounded-xl shadow-[var(--shadow-dropdown)] max-h-48 overflow-y-auto">
              {filteredProviders.map((provider, idx) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() => {
                    onDiagnosisChange("providerName", provider.name);
                    setProviderSearch(provider.name);
                    setShowProviderDropdown(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors",
                    idx === providerHighlightIndex
                      ? "bg-primary-lighter"
                      : "hover:bg-muted-bg",
                    idx === 0 && "rounded-t-xl",
                    idx === filteredProviders.length - 1 && "rounded-b-xl"
                  )}
                >
                  <span className="text-sm text-foreground">{provider.name}</span>
                  <span className="text-xs text-muted bg-muted-bg px-2 py-0.5 rounded-full">
                    {provider.type}
                  </span>
                </button>
              ))}
            </div>
          )}
          {errors["diagnosisInfo.providerName"] && (
            <p className="mt-1 text-xs text-error">{t(errors["diagnosisInfo.providerName"])}</p>
          )}
        </div>
      </div>

      {/* Treatment Info */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          {t("treatmentDatesTitle")}
        </h3>

        {(claimType === "outpatient" || claimType === "dental") && (
          <div>
            <label htmlFor="treatmentDate" className="block text-sm font-medium text-foreground mb-1.5">
              {t("treatmentDateLabel")} <span className="text-error">*</span>
            </label>
            <input
              id="treatmentDate"
              type="date"
              value={treatmentInfo.treatmentDate || ""}
              onChange={(e) => onTreatmentChange("treatmentDate", e.target.value)}
              className={cn(
                "w-full md:w-64 px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                errors["treatmentInfo.treatmentDate"] ? "border-error" : "border-border"
              )}
            />
            {errors["treatmentInfo.treatmentDate"] && (
              <p className="mt-1 text-xs text-error">{t(errors["treatmentInfo.treatmentDate"])}</p>
            )}
          </div>
        )}

        {claimType === "inpatient" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="admissionDate" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("admissionDateLabel")} <span className="text-error">*</span>
                </label>
                <input
                  id="admissionDate"
                  type="date"
                  value={treatmentInfo.admissionDate || ""}
                  onChange={(e) => onTreatmentChange("admissionDate", e.target.value)}
                  className={cn(
                    "w-full px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    errors["treatmentInfo.admissionDate"] ? "border-error" : "border-border"
                  )}
                />
                {errors["treatmentInfo.admissionDate"] && (
                  <p className="mt-1 text-xs text-error">{t(errors["treatmentInfo.admissionDate"])}</p>
                )}
              </div>

              <div>
                <label htmlFor="dischargeDate" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("dischargeDateLabel")} <span className="text-error">*</span>
                </label>
                <input
                  id="dischargeDate"
                  type="date"
                  value={treatmentInfo.dischargeDate || ""}
                  onChange={(e) => onTreatmentChange("dischargeDate", e.target.value)}
                  className={cn(
                    "w-full px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    errors["treatmentInfo.dischargeDate"] ? "border-error" : "border-border"
                  )}
                />
                {errors["treatmentInfo.dischargeDate"] && (
                  <p className="mt-1 text-xs text-error">{t(errors["treatmentInfo.dischargeDate"])}</p>
                )}
              </div>
            </div>

            {/* Length of stay */}
            {treatmentInfo.lengthOfStay !== undefined && treatmentInfo.admissionDate && treatmentInfo.dischargeDate && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-info-light border border-info/20 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-info" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {language === "vi"
                      ? `${t("lengthOfStayLabel")}: ${treatmentInfo.lengthOfStay} ngày`
                      : `${t("lengthOfStayLabel")}: ${treatmentInfo.lengthOfStay} day${treatmentInfo.lengthOfStay !== 1 ? "s" : ""}`}
                  </p>
                  <p className="text-xs text-muted">{t("lengthOfStayDesc")}</p>
                </div>
              </div>
            )}

            {/* Admission Reason */}
            <div>
              <label htmlFor="admissionReason" className="block text-sm font-medium text-foreground mb-1.5">
                {t("admissionReasonLabel")} <span className="text-error">*</span>
              </label>
              <textarea
                id="admissionReason"
                rows={2}
                value={treatmentInfo.admissionReason || ""}
                onChange={(e) => onTreatmentChange("admissionReason", e.target.value)}
                placeholder={t("admissionReasonPlaceholder")}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm resize-none",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  "placeholder:text-muted/50",
                  errors["treatmentInfo.admissionReason"] ? "border-error" : "border-border"
                )}
              />
              {errors["treatmentInfo.admissionReason"] && (
                <p className="mt-1 text-xs text-error">{t(errors["treatmentInfo.admissionReason"])}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

