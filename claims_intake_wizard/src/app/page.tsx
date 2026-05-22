"use client";

import { Shield, Lock, Phone, Globe } from "lucide-react";
import ClaimsWizard from "@/components/wizard/ClaimsWizard";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <main className="flex-1 flex flex-col">
      {/* Header Accent Line */}
      <div className="header-accent-line h-1" />

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-[var(--shadow-card)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl header-gradient flex items-center justify-center shadow-md animate-trust-pulse">
              <Shield className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight tracking-tight">
                {t("brandTitle")}
              </h1>
              <p className="text-xs text-muted leading-tight">
                {t("brandSubtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-primary-lighter p-1 rounded-xl border border-primary/10">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  language === "en"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  language === "vi"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                VI
              </button>
            </div>
            {/* Security Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted border-l border-border pl-4">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </div>
              {t("secureConnection")}
            </div>
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-6 text-[11px] text-muted">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{language === "vi" ? "Mã hóa 256-bit SSL" : "256-bit SSL Encrypted"}</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-border" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{language === "vi" ? "Tuân thủ HIPAA" : "HIPAA Compliant"}</span>
          </div>
          <div className="hidden md:block w-px h-3 bg-border" />
          <div className="hidden md:flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{language === "vi" ? "Hỗ trợ 24/7" : "24/7 Support"}</span>
          </div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="flex-1 py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ClaimsWizard />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md header-gradient flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Papaya Insurtech. {language === "vi" ? "Mọi quyền được bảo lưu." : "All rights reserved."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted hover:text-primary cursor-pointer transition-colors">
              {t("privacyPolicy")}
            </span>
            <span className="text-xs text-muted hover:text-primary cursor-pointer transition-colors">
              {t("termsOfService")}
            </span>
            <span className="text-xs text-muted hover:text-primary cursor-pointer transition-colors">
              {t("contactSupport")}
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
