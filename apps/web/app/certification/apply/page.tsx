"use client";

/**
 * /certification/apply — Apply for Certificate
 * Multi-step wizard: Select Type → Upload Docs → Review → Submit
 */

import Link from "next/link";
import { useState, useMemo } from "react";

type CertificateType = "BUSINESS_REGISTRATION" | "TAX_ID" | "TRADE_LICENSE" | "PROFESSIONAL_LICENSE" | "SERVICE_CERT" | "PRODUCT_CERT";

interface DocumentUpload {
  id: string;
  type: string;
  file?: File;
  preview?: string;
}

interface StepProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canNext: boolean;
}

const CERT_TYPES: Array<{ code: CertificateType; label: string; icon: string; description: string }> = [
  {
    code: "BUSINESS_REGISTRATION",
    label: "Business Registration",
    icon: "📋",
    description: "Official business entity registration certificate",
  },
  {
    code: "TAX_ID",
    label: "Tax ID Certificate",
    icon: "💰",
    description: "Tax identification number and compliance proof",
  },
  {
    code: "TRADE_LICENSE",
    label: "Trade License",
    icon: "🏪",
    description: "Municipal trade license and authorization",
  },
  {
    code: "PROFESSIONAL_LICENSE",
    label: "Professional License",
    icon: "📜",
    description: "Professional qualification and membership",
  },
  {
    code: "SERVICE_CERT",
    label: "Service Certificate",
    icon: "🛠",
    description: "Service quality and competency certification",
  },
  {
    code: "PRODUCT_CERT",
    label: "Product Certificate",
    icon: "📦",
    description: "Product authenticity and standards compliance",
  },
];

const REQUIRED_DOCS: Record<CertificateType, string[]> = {
  BUSINESS_REGISTRATION: ["Business Registration Document", "Proof of Address", "Director ID"],
  TAX_ID: ["Tax Registration Certificate", "Financial Statement (Last Year)", "Bank Statement"],
  TRADE_LICENSE: ["Original License", "Business Proof", "Property Deed or Lease"],
  PROFESSIONAL_LICENSE: ["Professional Qualification", "Experience Certificate", "Liability Insurance"],
  SERVICE_CERT: ["Service Scope Document", "Quality Standards Proof", "Customer References"],
  PRODUCT_CERT: ["Product Specifications", "Manufacturing Certificate", "Quality Test Report"],
};

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full font-semibold transition-all ${
              i < current ? "bg-emerald-600 text-white" : i === current - 1 ? "bg-purple-600 text-white" : "bg-white/10 text-white/50"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && <div className={`h-1 w-8 ${i < current - 1 ? "bg-emerald-600" : "bg-white/10"}`} />}
        </div>
      ))}
    </div>
  );
}

function Step1SelectType({
  selectedType,
  onTypeChange,
  onNext,
}: {
  selectedType: CertificateType | null;
  onTypeChange: (type: CertificateType) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Select Certificate Type</h2>
        <p className="mt-1 text-sm text-white/60">Choose the type of certification you want to apply for.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CERT_TYPES.map((type) => (
          <button
            key={type.code}
            onClick={() => onTypeChange(type.code)}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              selectedType === type.code
                ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <div className="text-2xl">{type.icon}</div>
            <div className="mt-2 font-semibold text-white">{type.label}</div>
            <div className="mt-1 text-xs text-white/60">{type.description}</div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedType}
        className="w-full rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700"
      >
        Continue to Documents
      </button>
    </div>
  );
}

function Step2UploadDocuments({
  certType,
  documents,
  onDocumentsChange,
  onNext,
}: {
  certType: CertificateType;
  documents: DocumentUpload[];
  onDocumentsChange: (docs: DocumentUpload[]) => void;
  onNext: () => void;
}) {
  const requiredDocs = REQUIRED_DOCS[certType];

  const handleDocumentChange = (index: number, file: File | null) => {
    const newDocs = [...documents];
    newDocs[index] = { ...newDocs[index], file, preview: file ? URL.createObjectURL(file) : undefined };
    onDocumentsChange(newDocs);
  };

  const allDocumentsProvided = documents.every((d) => d.file);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Upload Required Documents</h2>
        <p className="mt-1 text-sm text-white/60">Please provide all required documents for verification.</p>
      </div>

      <div className="space-y-4">
        {requiredDocs.map((docName, idx) => (
          <div key={docName} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{docName}</span>
                {documents[idx]?.file && <span className="text-[10px] text-emerald-400">✓ Uploaded</span>}
              </div>
              <div className="relative">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleDocumentChange(idx, e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <div
                  onClick={(e) => (e.currentTarget.previousElementSibling as HTMLInputElement).click()}
                  className="cursor-pointer rounded-lg border-2 border-dashed border-white/20 p-4 text-center transition-all hover:border-white/40"
                >
                  {documents[idx]?.file ? (
                    <>
                      <div className="text-2xl">📄</div>
                      <div className="mt-1 text-sm font-semibold text-white">{documents[idx].file!.name}</div>
                      <div className="text-[10px] text-white/50">{(documents[idx].file!.size / 1024 / 1024).toFixed(2)} MB</div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl">📤</div>
                      <div className="mt-1 text-sm font-semibold text-white">Click to upload</div>
                      <div className="text-[10px] text-white/50">PDF, Image, or Document</div>
                    </>
                  )}
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!allDocumentsProvided}
        className="w-full rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700"
      >
        Review Application
      </button>
    </div>
  );
}

function Step3Review({
  certType,
  documents,
  onSubmit,
  isSubmitting,
}: {
  certType: CertificateType;
  documents: DocumentUpload[];
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const cert = CERT_TYPES.find((c) => c.code === certType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Review & Submit</h2>
        <p className="mt-1 text-sm text-white/60">Verify your application details before submission.</p>
      </div>

      {/* Certificate Summary */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#13162A] to-[#1A1D33] p-6">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Certificate Type</h3>
        <div className="mt-3 flex items-start gap-3">
          <div className="text-3xl">{cert?.icon}</div>
          <div>
            <div className="text-lg font-bold text-white">{cert?.label}</div>
            <p className="mt-1 text-sm text-white/60">{cert?.description}</p>
          </div>
        </div>
      </div>

      {/* Documents Summary */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Uploaded Documents</h3>
        <div className="mt-4 space-y-2">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-lg bg-white/5 p-3">
              <div className="text-lg">📄</div>
              <div className="flex-1 text-sm text-white">{doc.file?.name}</div>
              <div className="text-xs text-emerald-400">✓ Ready</div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/30 accent-purple-600" defaultChecked />
          <span className="text-xs text-white/70">
            I confirm that all information provided is accurate and complete. I understand that false information may result in certificate revocation and legal action.
          </span>
        </label>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-teal-600 px-6 py-3 font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/20"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>

      <p className="text-center text-[10px] text-white/50">
        Your application will be reviewed within 5-7 business days. You'll receive status updates via email.
      </p>
    </div>
  );
}

export default function ApplyCertificationPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<CertificateType | null>(null);
  const [documents, setDocuments] = useState<DocumentUpload[]>(
    REQUIRED_DOCS.BUSINESS_REGISTRATION.map((_, idx) => ({ id: `doc-${idx}`, type: "file" }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTypeChange = (type: CertificateType) => {
    setSelectedType(type);
    setDocuments(REQUIRED_DOCS[type].map((_, idx) => ({ id: `doc-${idx}`, type: "file" })));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#0C0E1A] text-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-12 text-center backdrop-blur">
            <div className="text-6xl">✨</div>
            <h1 className="mt-6 text-2xl font-bold text-white">Application Submitted</h1>
            <p className="mt-3 text-white/70">
              Your CRB certification application has been submitted successfully. We'll review it within 5-7 business days and send you updates via email.
            </p>

            <div className="mt-8 space-y-3 rounded-xl bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Application ID</span>
                <span className="font-mono text-sm font-semibold text-white">CRB-2026-004821</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-sm text-white/70">Status</span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-semibold text-blue-300">SUBMITTED</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                href="/certification"
                className="flex-1 rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition-all hover:bg-purple-700"
              >
                View My Certificates
              </Link>
              <Link
                href="/"
                className="flex-1 rounded-lg border border-white/20 px-6 py-2 font-semibold text-white transition-all hover:bg-white/5"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <Link href="/certification" className="text-[11px] font-semibold uppercase tracking-widest text-purple-400 hover:text-purple-300">
            ← Back to Certificates
          </Link>
          <h1 className="text-3xl font-bold">Apply for Certificate</h1>
          <p className="text-sm text-white/60">Complete this form to request a new CRB certification.</p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator current={step} total={3} />
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-[#13162A] to-[#1A1D33] p-8">
          {step === 1 && selectedType !== null && (
            <Step1SelectType
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
              onNext={() => setStep(2)}
            />
          )}

          {step === 1 && selectedType === null && (
            <Step1SelectType
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && selectedType && (
            <Step2UploadDocuments
              certType={selectedType}
              documents={documents}
              onDocumentsChange={setDocuments}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && selectedType && (
            <Step3Review
              certType={selectedType}
              documents={documents}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Navigation */}
        {step > 1 && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 rounded-lg border border-white/20 px-6 py-2 font-semibold text-white transition-all hover:bg-white/5"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
