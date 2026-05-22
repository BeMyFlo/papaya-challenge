"use client";

import { User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MemberInfo, Dependent, ClaimantType } from "@/types/claim";
import { mockDependents } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";

interface MemberPolicyStepProps {
  memberInfo: MemberInfo;
  claimantType: ClaimantType;
  selectedDependent?: Dependent;
  onMemberInfoChange: (field: keyof MemberInfo, value: string) => void;
  onClaimantTypeChange: (type: ClaimantType) => void;
  onDependentSelect: (dependent: Dependent | undefined) => void;
  errors: Record<string, string>;
}

export default function MemberPolicyStep({
  memberInfo,
  claimantType,
  selectedDependent,
  onMemberInfoChange,
  onClaimantTypeChange,
  onDependentSelect,
  errors,
}: MemberPolicyStepProps) {
  const { t } = useLanguage();

  return (
    <div className="step-content space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("memberPolicyTitle")}
        </h2>
        <p className="text-muted text-sm max-w-lg mx-auto">
          {t("memberPolicySubtitle")}
        </p>
      </div>

      {/* Member Info Card */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          {t("policyHolderDetails")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="memberName" className="block text-sm font-medium text-foreground mb-1.5">
              {t("fullName")} <span className="text-error">*</span>
            </label>
            <input
              id="memberName"
              type="text"
              value={memberInfo.memberName}
              onChange={(e) => onMemberInfoChange("memberName", e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                errors["memberInfo.memberName"] ? "border-error" : "border-border"
              )}
            />
            {errors["memberInfo.memberName"] && (
              <p className="mt-1 text-xs text-error">{t(errors["memberInfo.memberName"])}</p>
            )}
          </div>

          <div>
            <label htmlFor="policyNumber" className="block text-sm font-medium text-foreground mb-1.5">
              {t("policyNumber")} <span className="text-error">*</span>
            </label>
            <input
              id="policyNumber"
              type="text"
              value={memberInfo.policyNumber}
              onChange={(e) => onMemberInfoChange("policyNumber", e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-lg border bg-muted-bg text-foreground text-sm font-mono",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                errors["memberInfo.policyNumber"] ? "border-error" : "border-border"
              )}
            />
            {errors["memberInfo.policyNumber"] && (
              <p className="mt-1 text-xs text-error">{t(errors["memberInfo.policyNumber"])}</p>
            )}
          </div>

          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-foreground mb-1.5">
              {t("memberId")} <span className="text-error">*</span>
            </label>
            <input
              id="memberId"
              type="text"
              value={memberInfo.memberId}
              onChange={(e) => onMemberInfoChange("memberId", e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-lg border bg-muted-bg text-foreground text-sm font-mono",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                errors["memberInfo.memberId"] ? "border-error" : "border-border"
              )}
            />
            {errors["memberInfo.memberId"] && (
              <p className="mt-1 text-xs text-error">{t(errors["memberInfo.memberId"])}</p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-foreground mb-1.5">
              {t("dob")} <span className="text-error">*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={memberInfo.dateOfBirth}
              onChange={(e) => onMemberInfoChange("dateOfBirth", e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                errors["memberInfo.dateOfBirth"] ? "border-error" : "border-border"
              )}
            />
            {errors["memberInfo.dateOfBirth"] && (
              <p className="mt-1 text-xs text-error">{t(errors["memberInfo.dateOfBirth"])}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              {t("email")} <span className="text-error">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={memberInfo.email}
              onChange={(e) => onMemberInfoChange("email", e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                errors["memberInfo.email"] ? "border-error" : "border-border"
              )}
            />
            {errors["memberInfo.email"] && (
              <p className="mt-1 text-xs text-error">{t(errors["memberInfo.email"])}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
              {t("phone")} <span className="text-error">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={memberInfo.phone}
              onChange={(e) => onMemberInfoChange("phone", e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-lg border bg-white text-foreground text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                errors["memberInfo.phone"] ? "border-error" : "border-border"
              )}
            />
            {errors["memberInfo.phone"] && (
              <p className="mt-1 text-xs text-error">{t(errors["memberInfo.phone"])}</p>
            )}
          </div>
        </div>
      </div>

      {/* Claimant Type */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          {t("claimForTitle")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onClaimantTypeChange("self");
              onDependentSelect(undefined);
            }}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
              claimantType === "self"
                ? "border-primary bg-primary-lighter"
                : "border-border hover:border-primary/40 bg-white"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                claimantType === "self"
                  ? "bg-primary text-white"
                  : "bg-muted-bg text-muted"
              )}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{t("myself")}</p>
              <p className="text-xs text-muted">{t("myselfDesc")}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onClaimantTypeChange("dependent")}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
              claimantType === "dependent"
                ? "border-primary bg-primary-lighter"
                : "border-border hover:border-primary/40 bg-white"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                claimantType === "dependent"
                  ? "bg-primary text-white"
                  : "bg-muted-bg text-muted"
              )}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{t("dependent")}</p>
              <p className="text-xs text-muted">{t("dependentDesc")}</p>
            </div>
          </button>
        </div>
        {errors["claimantType"] && (
          <p className="mt-2 text-xs text-error">{t(errors["claimantType"])}</p>
        )}
      </div>

      {/* Dependent Selection */}
      {claimantType === "dependent" && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)] animate-fade-in">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
            {t("selectDependent")}
          </h3>
          <div className="space-y-2.5">
            {mockDependents.map((dep) => (
              <button
                key={dep.name}
                type="button"
                onClick={() => onDependentSelect(dep)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  selectedDependent?.name === dep.name
                    ? "border-primary bg-primary-lighter"
                    : "border-border hover:border-primary/40 bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                      selectedDependent?.name === dep.name
                        ? "bg-primary text-white"
                        : "bg-primary-light text-primary"
                    )}
                  >
                    {dep.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{dep.name}</p>
                    <p className="text-xs text-muted capitalize">
                      {t(dep.relationship.toLowerCase() as any)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted font-mono">{dep.dateOfBirth}</span>
              </button>
            ))}
          </div>
          {errors["selectedDependent"] && (
            <p className="mt-2 text-xs text-error">{t(errors["selectedDependent"])}</p>
          )}
        </div>
      )}
    </div>
  );
}

