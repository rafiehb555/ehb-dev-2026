"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type FormStep = "tier-select" | "personal-info" | "business-docs" | "payment" | "review";

type ApplicationData = {
  tier: string | null;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
  };
  businessInfo: {
    businessName: string;
    businessType: string;
    yearsInBusiness: string;
    registrationDoc: File | null;
    bankStatement: File | null;
  };
  payment: {
    paymentMethod: "CARD" | "BANK" | "CRYPTO" | null;
    cardNumber: string;
    bankAccount: string;
    walletAddress: string;
  };
};

const franchiseTiers = [
  {
    id: "online",
    name: "Online Franchise",
    price: "$100 - $1,500",
    ehbgc: "500 - 7,500 EHBGC",
    icon: "🌐",
    description: "Perfect for digital-first entrepreneurs",
    color: "from-blue-500/30 to-blue-600/10",
    borderColor: "border-blue-400/30",
  },
  {
    id: "sub",
    name: "Sub Franchise",
    price: "$5,000 - $20,000",
    ehbgc: "25,000 - 100,000 EHBGC",
    icon: "📍",
    description: "Dedicated territory with team building",
    color: "from-green-500/30 to-green-600/10",
    borderColor: "border-green-400/30",
  },
  {
    id: "master",
    name: "Master Franchise",
    price: "$20,000 - $50,000",
    ehbgc: "100,000 - 250,000 EHBGC",
    icon: "👑",
    description: "Multi-regional control and authority",
    color: "from-purple-500/30 to-purple-600/10",
    borderColor: "border-purple-400/30",
  },
  {
    id: "corporate",
    name: "Corporate Franchise",
    price: "$50,000 - $200,000",
    ehbgc: "250,000 - 1,000,000 EHBGC",
    icon: "🏢",
    description: "National operations and governance",
    color: "from-amber-500/30 to-amber-600/10",
    borderColor: "border-amber-400/30",
  },
  {
    id: "country",
    name: "Country Franchise",
    price: "$200,000+",
    ehbgc: "1,000,000+ EHBGC",
    icon: "🌍",
    description: "Entire country control and expansion",
    color: "from-teal-500/30 to-cyan-600/10",
    borderColor: "border-teal-400/30",
  },
];

const stepTitles = {
  "tier-select": "Select Your Tier",
  "personal-info": "Personal Information",
  "business-docs": "Business Documentation",
  "payment": "Payment & Deposits",
  "review": "Review & Submit",
};

export default function FranchiseApplyPage() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get("tier") || null;

  const [currentStep, setCurrentStep] = useState<FormStep>(initialTier ? "personal-info" : "tier-select");
  const [formData, setFormData] = useState<ApplicationData>({
    tier: initialTier,
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
    },
    businessInfo: {
      businessName: "",
      businessType: "",
      yearsInBusiness: "",
      registrationDoc: null,
      bankStatement: null,
    },
    payment: {
      paymentMethod: null,
      cardNumber: "",
      bankAccount: "",
      walletAddress: "",
    },
  });

  const handleTierSelect = (tierId: string) => {
    setFormData({ ...formData, tier: tierId });
    setCurrentStep("personal-info");
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      personalInfo: { ...formData.personalInfo, [field]: value },
    });
  };

  const handleBusinessInfoChange = (field: string, value: string | File | null) => {
    setFormData({
      ...formData,
      businessInfo: { ...formData.businessInfo, [field]: value },
    });
  };

  const handlePaymentChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      payment: { ...formData.payment, [field]: value },
    });
  };

  const getStepNumber = (step: FormStep) => {
    const steps = ["tier-select", "personal-info", "business-docs", "payment", "review"] as FormStep[];
    return steps.indexOf(step) + 1;
  };

  const selectedTier = franchiseTiers.find((t) => t.id === formData.tier);

  return (
    <main className="min-h-screen text-white py-8">
      <div className="container-ehb max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <section className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Apply for Franchise</h1>
          <p className="text-white/70">Complete your application in 5 steps</p>
        </section>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          {["tier-select", "personal-info", "business-docs", "payment", "review"].map((step, idx) => {
            const isActive = step === currentStep;
            const isCompleted = ["tier-select", "personal-info", "business-docs", "payment", "review"].indexOf(step) < getStepNumber(currentStep) - 1;
            return (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500 text-white ring-2 ring-blue-300"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white/60 border border-white/20"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                {idx < 4 && (
                  <div className={`h-1 w-8 ${isCompleted || isActive ? "bg-blue-500" : "bg-white/10"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Form Area */}
        <div
          className="rounded-2xl border border-white/10 p-6 md:p-8 min-h-[400px]"
          style={{ background: "rgba(19,22,42,0.8)", backdropFilter: "blur(12px)" }}
        >
          {/* TIER SELECT STEP */}
          {currentStep === "tier-select" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Select Your Franchise Tier</h2>
                <p className="text-white/70 mt-2">Choose the tier that best fits your goals and capacity</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {franchiseTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handleTierSelect(tier.id)}
                    className={`group relative rounded-xl border-2 p-6 text-left transition-all duration-300 transform hover:scale-105 cursor-pointer ${tier.borderColor}`}
                    style={{ background: `linear-gradient(135deg, ${tier.color})`, backdropFilter: "blur(8px)" }}
                  >
                    <div className="text-4xl mb-3">{tier.icon}</div>
                    <h3 className="font-bold text-lg text-white">{tier.name}</h3>
                    <p className="text-sm text-white/80 mt-2">{tier.description}</p>
                    <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
                      <p className="text-sm font-semibold text-white">{tier.price}</p>
                      <p className="text-xs text-white/70">{tier.ehbgc}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-300 group-hover:translate-x-2 transition-transform">
                      Select <span>→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PERSONAL INFO STEP */}
          {currentStep === "personal-info" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-white/70 mt-2">Tell us about yourself</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                  className="col-span-2 px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                />
                <select
                  value={formData.personalInfo.country}
                  onChange={(e) => handlePersonalInfoChange("country", e.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                >
                  <option value="">Select Country</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="India">India</option>
                  <option value="UAE">UAE</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.personalInfo.city}
                  onChange={(e) => handlePersonalInfoChange("city", e.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                />
              </div>

              {/* Requirements Checklist */}
              {selectedTier && (
                <div
                  className="rounded-xl border border-blue-400/30 p-4"
                  style={{ background: "rgba(30,58,138,0.2)" }}
                >
                  <p className="text-sm font-semibold text-blue-300 mb-3">Requirements for {selectedTier.name}</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2 text-white/80">
                      <span className="text-blue-300 mt-0.5">✓</span>
                      <span>Valid identification document</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <span className="text-blue-300 mt-0.5">✓</span>
                      <span>Business registration or license</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <span className="text-blue-300 mt-0.5">✓</span>
                      <span>Bank account for deposits</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/80">
                      <span className="text-blue-300 mt-0.5">✓</span>
                      <span>STL Level {selectedTier.id === "online" ? "L0" : selectedTier.id === "sub" ? "L3" : selectedTier.id === "master" ? "L5" : "L7"}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* BUSINESS DOCS STEP */}
          {currentStep === "business-docs" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Business Documentation</h2>
                <p className="text-white/70 mt-2">Upload required documents for verification</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Business Name</label>
                  <input
                    type="text"
                    placeholder="Your business name"
                    value={formData.businessInfo.businessName}
                    onChange={(e) => handleBusinessInfoChange("businessName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Business Type</label>
                  <select
                    value={formData.businessInfo.businessType}
                    onChange={(e) => handleBusinessInfoChange("businessType", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-blue-400 transition-all duration-300"
                  >
                    <option value="">Select business type</option>
                    <option value="sole-proprietor">Sole Proprietor</option>
                    <option value="partnership">Partnership</option>
                    <option value="pvt-ltd">Private Limited</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Years in Business</label>
                  <select
                    value={formData.businessInfo.yearsInBusiness}
                    onChange={(e) => handleBusinessInfoChange("yearsInBusiness", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-blue-400 transition-all duration-300"
                  >
                    <option value="">Select years</option>
                    <option value="0">New business</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>

                {/* File Uploads */}
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Business Registration Document</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-300 cursor-pointer">
                    <p className="text-white/70">📄 Click to upload or drag and drop</p>
                    <p className="text-xs text-white/50 mt-1">PDF, JPG, PNG (max 5MB)</p>
                    <input
                      type="file"
                      onChange={(e) => handleBusinessInfoChange("registrationDoc", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Bank Statement (Last 3 months)</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-300 cursor-pointer">
                    <p className="text-white/70">📊 Click to upload or drag and drop</p>
                    <p className="text-xs text-white/50 mt-1">PDF (max 5MB)</p>
                    <input
                      type="file"
                      onChange={(e) => handleBusinessInfoChange("bankStatement", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT STEP */}
          {currentStep === "payment" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Payment & Deposits</h2>
                <p className="text-white/70 mt-2">Choose payment method and enter deposit information</p>
              </div>

              {selectedTier && (
                <div
                  className="rounded-xl border border-green-400/30 p-4"
                  style={{ background: "rgba(34,177,76,0.2)" }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-white/60 font-semibold">Entry Fee</p>
                      <p className="text-lg font-bold text-green-300 mt-1">{selectedTier.price}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-white/60 font-semibold">EHBGC Hold</p>
                      <p className="text-lg font-bold text-green-300 mt-1">{selectedTier.ehbgc}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-white mb-3 block">Select Payment Method</label>
                <div className="grid gap-3 md:grid-cols-3">
                  {["CARD", "BANK", "CRYPTO"].map((method) => (
                    <button
                      key={method}
                      onClick={() => handlePaymentChange("paymentMethod", method)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 text-center font-semibold ${
                        formData.payment.paymentMethod === method
                          ? "border-blue-400 bg-blue-500/20 text-white"
                          : "border-white/20 bg-white/5 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {method === "CARD" ? "💳 Card" : method === "BANK" ? "🏦 Bank Transfer" : "₿ Crypto"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              {formData.payment.paymentMethod === "CARD" && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={formData.payment.cardNumber}
                    onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {formData.payment.paymentMethod === "BANK" && (
                <input
                  type="text"
                  placeholder="Bank Account Number"
                  value={formData.payment.bankAccount}
                  onChange={(e) => handlePaymentChange("bankAccount", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                />
              )}

              {formData.payment.paymentMethod === "CRYPTO" && (
                <input
                  type="text"
                  placeholder="Crypto Wallet Address"
                  value={formData.payment.walletAddress}
                  onChange={(e) => handlePaymentChange("walletAddress", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                />
              )}

              <div className="rounded-lg border border-white/20 p-4 flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <p className="text-xs text-white/70">I agree to the EHB Franchise Terms & Conditions</p>
              </div>
            </div>
          )}

          {/* REVIEW STEP */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Review Your Application</h2>
                <p className="text-white/70 mt-2">Please review all information before submitting</p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 p-4 bg-white/5">
                  <p className="text-xs uppercase text-white/60 font-semibold mb-2">Selected Tier</p>
                  <p className="text-lg font-bold text-white">{selectedTier?.name}</p>
                  <p className="text-sm text-white/70 mt-1">{selectedTier?.price}</p>
                </div>

                <div className="rounded-lg border border-white/10 p-4 bg-white/5">
                  <p className="text-xs uppercase text-white/60 font-semibold mb-2">Personal Information</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-white">
                      {formData.personalInfo.firstName} {formData.personalInfo.lastName}
                    </p>
                    <p className="text-white/70">{formData.personalInfo.email}</p>
                    <p className="text-white/70">{formData.personalInfo.phone}</p>
                    <p className="text-white/70">
                      {formData.personalInfo.city}, {formData.personalInfo.country}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 p-4 bg-white/5">
                  <p className="text-xs uppercase text-white/60 font-semibold mb-2">Business Information</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-white">{formData.businessInfo.businessName}</p>
                    <p className="text-white/70">{formData.businessInfo.businessType}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-green-400/30 p-4 bg-green-500/10">
                  <p className="text-xs uppercase text-green-300 font-semibold mb-3">Ready to Submit</p>
                  <p className="text-sm text-white/80">
                    Your application will be reviewed by our verification team within 24-48 hours. You'll receive a confirmation email with next steps.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                const steps = ["tier-select", "personal-info", "business-docs", "payment", "review"] as FormStep[];
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1]);
                }
              }}
              disabled={currentStep === "tier-select"}
              className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              ← Back
            </button>

            {currentStep === "review" ? (
              <button
                onClick={() => {
                  alert("Application submitted! You'll receive a confirmation email shortly.");
                }}
                className="px-8 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                ✓ Submit Application
              </button>
            ) : (
              <button
                onClick={() => {
                  const steps = ["tier-select", "personal-info", "business-docs", "payment", "review"] as FormStep[];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1]);
                  }
                }}
                className="px-8 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <Link href="/franchise" className="text-sm text-white/60 hover:text-white/90 transition-colors">
            ← Back to Franchise Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
