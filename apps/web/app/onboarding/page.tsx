"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Upload, Camera, CheckCircle } from "lucide-react";

type Role = "buyer" | "seller" | "rider" | "provider" | null;
type Step = 1 | 2 | 3 | 4 | 5;

const ROLES = [
  { id: "buyer", label: "Buyer", icon: "🛒", description: "Purchase goods & services" },
  { id: "seller", label: "Seller", icon: "📦", description: "Sell products online" },
  { id: "rider", label: "Rider", icon: "🏍️", description: "Delivery & logistics" },
  { id: "provider", label: "Service Provider", icon: "🔧", description: "Offer professional services" },
];

const INDUSTRIES = [
  "E-commerce",
  "Education",
  "Healthcare",
  "Legal",
  "Travel",
  "Finance",
  "Real Estate",
  "Consulting",
];

const SKILLS = [
  "Web Development",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Consulting",
  "Training",
  "Photography",
  "Social Media Management",
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    bio: "",
    industry: "",
    skills: [] as string[],
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const progressPercent = ((currentStep - 1) / 4) * 100;

  const stepTitles = [
    "Welcome to EHB",
    "Personal Information",
    "KYC Verification",
    "Profile Setup",
    "All Set!",
  ];

  const stepDescriptions = [
    "Choose your role to get started",
    "Tell us more about yourself",
    "Verify your identity for trust",
    "Complete your profile",
    "You're ready to go!",
  ];

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ehb-orb-drift-a {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(2%, 3%); }
          50% { transform: translate(1%, -2%); }
          75% { transform: translate(-1%, 1%); }
        }
        @keyframes ehb-orb-drift-b {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2%, -3%); }
          50% { transform: translate(-1%, 2%); }
          75% { transform: translate(1%, -1%); }
        }
        .ehb-orb { position: absolute; border-radius: 50%; pointer-events: none; }
        .ehb-orb-a {
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(123,110,246,0.42) 0%, transparent 70%);
          filter: blur(80px);
          animation: ehb-orb-drift-a 14s ease-in-out infinite;
          top: -120px;
          left: -100px;
        }
        .ehb-orb-b {
          width: 560px;
          height: 560px;
          background: radial-gradient(circle, rgba(43,191,160,0.36) 0%, transparent 70%);
          filter: blur(100px);
          animation: ehb-orb-drift-b 18s ease-in-out infinite;
          bottom: -140px;
          right: -80px;
        }
      `}} />

      <div className="ehb-orb ehb-orb-a" />
      <div className="ehb-orb ehb-orb-b" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div style={{
            background: "rgba(19,22,42,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 14,
            padding: 40,
            boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
            }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                  Step {currentStep} of 5
                </p>
                <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>
                  {stepTitles[currentStep - 1]}
                </h1>
                <p style={{ fontSize: "13px", color: "#8890B0" }}>
                  {stepDescriptions[currentStep - 1]}
                </p>
              </div>
            </div>

            <div style={{
              height: "4px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "2px",
              marginBottom: "32px",
              overflow: "hidden",
            }}>
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #7B6EF6, #2BBFA0)",
                  width: `${progressPercent}%`,
                  transition: "width 400ms ease-out",
                  borderRadius: "2px",
                }}
              />
            </div>

            {currentStep === 1 && (
              <div>
                <p style={{ fontSize: "13px", color: "#8890B0", marginBottom: "20px" }}>
                  Select the role that best describes you:
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "16px",
                  marginBottom: "32px",
                }}>
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id as Role)}
                      style={{
                        padding: "20px 16px",
                        borderRadius: "12px",
                        background: selectedRole === role.id ? "rgba(123,110,246,0.15)" : "rgba(255,255,255,0.05)",
                        border: selectedRole === role.id ? "1px solid rgba(123,110,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 160ms ease-out",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontSize: "32px" }}>{role.icon}</span>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                          {role.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "#8890B0" }}>
                          {role.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "white",
                      fontSize: "13px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: "13px",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: "13px",
                        fontFamily: "inherit",
                      }}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "white",
                      fontSize: "13px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Karachi"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: "13px",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Pakistan"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: "13px",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>ID Front</label>
                  <div style={{
                    padding: "20px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.03)",
                    border: "2px dashed rgba(123,110,246,0.3)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}>
                    <Upload size={24} style={{ margin: "0 auto 8px", color: "#7B6EF6" }} />
                    <p style={{ fontSize: "12px", color: "#8890B0" }}>Click to upload or drag & drop</p>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>ID Back</label>
                  <div style={{
                    padding: "20px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.03)",
                    border: "2px dashed rgba(123,110,246,0.3)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}>
                    <Upload size={24} style={{ margin: "0 auto 8px", color: "#7B6EF6" }} />
                    <p style={{ fontSize: "12px", color: "#8890B0" }}>Click to upload or drag & drop</p>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Take Selfie</label>
                  <div style={{
                    padding: "40px 20px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.03)",
                    border: "2px dashed rgba(123,110,246,0.3)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}>
                    <Camera size={32} style={{ margin: "0 auto 8px", color: "#2BBFA0" }} />
                    <p style={{ fontSize: "12px", color: "#8890B0" }}>Click to open camera</p>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Address Proof</label>
                  <div style={{
                    padding: "20px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.03)",
                    border: "2px dashed rgba(123,110,246,0.3)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}>
                    <Upload size={24} style={{ margin: "0 auto 8px", color: "#7B6EF6" }} />
                    <p style={{ fontSize: "12px", color: "#8890B0" }}>Click to upload or drag & drop</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                  <div style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7B6EF6, #2BBFA0)",
                    margin: "0 auto 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                  }}>
                    👤
                  </div>
                  <button
                    type="button"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      background: "rgba(123,110,246,0.15)",
                      border: "1px solid rgba(123,110,246,0.3)",
                      color: "#7B6EF6",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Upload Avatar
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "white",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                </div>

                {selectedRole === "provider" && (
                  <>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "white",
                          fontSize: "13px",
                          fontFamily: "inherit",
                        }}
                      >
                        <option value="">Select an industry</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Select Your Skills</label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "8px" }}>
                        {SKILLS.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "6px",
                              background: formData.skills.includes(skill) ? "rgba(43,191,160,0.2)" : "rgba(255,255,255,0.05)",
                              border: formData.skills.includes(skill) ? "1px solid rgba(43,191,160,0.4)" : "1px solid rgba(255,255,255,0.08)",
                              color: formData.skills.includes(skill) ? "#2BBFA0" : "#8890B0",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(56,200,120,0.3), rgba(43,191,160,0.3))",
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <CheckCircle size={48} color="#38C878" />
                </div>

                <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Account Setup Complete!</h2>
                <p style={{ fontSize: "13px", color: "#8890B0", marginBottom: "32px" }}>
                  Your profile is ready. Let's get you verified and up to speed.
                </p>

                <div style={{
                  padding: "20px",
                  borderRadius: "8px",
                  background: "rgba(43,191,160,0.08)",
                  border: "1px solid rgba(43,191,160,0.2)",
                  marginBottom: "24px",
                  textAlign: "left",
                }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#2BBFA0", marginBottom: "12px" }}>STL Starting Level: L1 FREE</div>
                  <div style={{ fontSize: "11px", color: "#8890B0", lineHeight: "1.6" }}>
                    You're starting at Trust Level L1. Complete verification to unlock higher levels.
                  </div>
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#8890B0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={16} color="#38C878" />
                    <span>Email verified</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#8890B0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={16} color="#38C878" />
                    <span>Profile created</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#8890B0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={16} color="#38C878" />
                    <span>KYC documents uploaded</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1 || currentStep === 5}
                style={{
                  padding: "12px 20px",
                  borderRadius: "8px",
                  background: currentStep === 1 || currentStep === 5 ? "transparent" : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#8890B0",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: (currentStep === 1 || currentStep === 5) ? "not-allowed" : "pointer",
                  opacity: (currentStep === 1 || currentStep === 5) ? 0.5 : 1,
                }}
              >
                Back
              </button>

              {currentStep === 5 ? (
                <Link
                  href="/profile"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #7B6EF6, #2BBFA0)",
                    border: "none",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                  }}
                >
                  Go to Profile <ChevronRight size={14} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !selectedRole) ||
                    (currentStep === 2 && !formData.name) ||
                    (currentStep === 4 && !formData.bio)
                  }
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    background: ((currentStep === 1 && !selectedRole) ||
                      (currentStep === 2 && !formData.name) ||
                      (currentStep === 4 && !formData.bio)) ? "rgba(123,110,246,0.5)" : "linear-gradient(135deg, #7B6EF6, #2BBFA0)",
                    border: "none",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: ((currentStep === 1 && !selectedRole) ||
                      (currentStep === 2 && !formData.name) ||
                      (currentStep === 4 && !formData.bio)) ? "not-allowed" : "pointer",
                    opacity: ((currentStep === 1 && !selectedRole) ||
                      (currentStep === 2 && !formData.name) ||
                      (currentStep === 4 && !formData.bio)) ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
