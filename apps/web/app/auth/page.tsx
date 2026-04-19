"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

type MeUser = { id: string; email: string; name: string; role: string; createdAt?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo-seller@ehb.local");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("EhbDemo2026!");
  const [confirmPassword, setConfirmPassword] = useState("EhbDemo2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [meLoading, setMeLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [cooldownTotalSec, setCooldownTotalSec] = useState(0);
  const [me, setMe] = useState<MeUser>(null);

  const loadMe = useCallback(async () => {
    setMeLoading(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json = await res.json();
      setMe((json?.data?.user ?? null) as MeUser);
    } finally {
      setMeLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const id = window.setInterval(() => {
      setCooldownSec((s) => (s > 1 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldownSec]);

  function validateForm(): boolean {
    const next: Record<string, string> = {};
    const em = email.trim();

    if (mode === "signup" && name.trim().length < 2) {
      next.name = "Name must be at least 2 characters.";
    }
    if (!em) {
      next.email = "Email is required.";
    } else if (!EMAIL_RE.test(em)) {
      next.email = "Enter a valid email address.";
    }
    if (mode === "signup" && phone.trim().length < 5) {
      next.phone = "Enter a valid phone number.";
    }
    if (mode === "signup") {
      if (password.length < 8) next.password = "Password must be at least 8 characters.";
      if (password !== confirmPassword) next.confirmPassword = "Passwords do not match.";
      if (!agreeTerms) next.terms = "You must agree to the terms and conditions.";
    } else if (password.length < 1) {
      next.password = "Password is required.";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    setLoading(true);
    setErr(null);
    setMsg(null);
    setCooldownSec(0);
    setCooldownTotalSec(0);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: email.trim(), password }
          : {
              name: name.trim() || "Demo User",
              email: email.trim(),
              phone: phone.trim(),
              password,
              referralCode: referralCode.trim() || undefined,
              role: "USER",
            };
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (res.status === 429) {
        const cooldownFromBody = Number(json?.error?.details?.cooldownSeconds ?? "0");
        const cooldownFromHeader = Number(res.headers.get("Retry-After") ?? "0");
        const ra = Number.isFinite(cooldownFromBody) && cooldownFromBody > 0 ? cooldownFromBody : cooldownFromHeader;
        if (Number.isFinite(ra) && ra > 0) {
          const limited = Math.min(Math.max(1, Math.floor(ra)), 3600);
          setCooldownSec(limited);
          setCooldownTotalSec(limited);
        }
      }
      if (!res.ok) throw new Error(json?.error?.message ?? `Request failed: ${res.status}`);
      setMsg(mode === "login" ? "Signed in successfully." : "Account created and signed in.");
      await loadMe();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Auth request failed");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error(`Logout failed: ${res.status}`);
      setMsg("Signed out.");
      setMe(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Logout failed");
    } finally {
      setLoading(false);
    }
  }

  const handleSwitchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setFieldErrors({});
    setErr(null);
    setMsg(null);
  };

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
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B6EF6] to-[#2BBFA0] mb-4">
              <span className="text-xl font-bold">EHB</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">EHB Global</h1>
            <p className="text-sm text-[#8890B0]">Education · Health · Business</p>
          </div>

          <div style={{
            background: "rgba(19,22,42,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 14,
            padding: 24,
            boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
          }}>
            <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-full border border-white/10">
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSwitchMode(m as "login" | "signup")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: mode === m ? "600" : "400",
                    background: mode === m ? "rgba(123,110,246,0.9)" : "transparent",
                    color: mode === m ? "white" : "rgba(200,204,223,0.7)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 160ms ease-out",
                  }}
                >
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              {mode === "signup" && (
                <>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setFieldErrors((f) => {
                          const { name: _, ...rest } = f;
                          return rest;
                        });
                      }}
                      placeholder="John Doe"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${fieldErrors.name ? "rgba(240,88,88,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: "white",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        transition: "all 160ms ease-out",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.borderColor = "rgba(123,110,246,0.5)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }}
                    />
                    {fieldErrors.name && <p style={{ fontSize: "11px", color: "#FFB3B3", marginTop: "4px" }}>{fieldErrors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFieldErrors((f) => {
                            const { email: _, ...rest } = f;
                            return rest;
                          });
                        }}
                        placeholder="you@example.com"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.05)",
                          border: `1px solid ${fieldErrors.email ? "rgba(240,88,88,0.5)" : "rgba(255,255,255,0.08)"}`,
                          color: "white",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          transition: "all 160ms ease-out",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.borderColor = "rgba(123,110,246,0.5)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                      />
                      {fieldErrors.email && <p style={{ fontSize: "11px", color: "#FFB3B3", marginTop: "4px" }}>{fieldErrors.email}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setFieldErrors((f) => {
                            const { phone: _, ...rest } = f;
                            return rest;
                          });
                        }}
                        placeholder="+92 3XX XXX XXXX"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.05)",
                          border: `1px solid ${fieldErrors.phone ? "rgba(240,88,88,0.5)" : "rgba(255,255,255,0.08)"}`,
                          color: "white",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          transition: "all 160ms ease-out",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.borderColor = "rgba(123,110,246,0.5)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                      />
                      {fieldErrors.phone && <p style={{ fontSize: "11px", color: "#FFB3B3", marginTop: "4px" }}>{fieldErrors.phone}</p>}
                    </div>
                  </div>
                </>
              )}

              {mode === "login" && (
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors((f) => {
                        const { email: _, ...rest } = f;
                        return rest;
                      });
                    }}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${fieldErrors.email ? "rgba(240,88,88,0.5)" : "rgba(255,255,255,0.08)"}`,
                      color: "white",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      transition: "all 160ms ease-out",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.borderColor = "rgba(123,110,246,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                  />
                  {fieldErrors.email && <p style={{ fontSize: "11px", color: "#FFB3B3", marginTop: "4px" }}>{fieldErrors.email}</p>}
                </div>
              )}

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
                  {mode === "login" && <Link href="/forgot-password" style={{ fontSize: "11px", color: "#7B6EF6", textDecoration: "none" }}>Forgot?</Link>}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors((f) => {
                        const { password: _, ...rest } = f;
                        return rest;
                      });
                    }}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${fieldErrors.password ? "rgba(240,88,88,0.5)" : "rgba(255,255,255,0.08)"}`,
                      color: "white",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      transition: "all 160ms ease-out",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.borderColor = "rgba(123,110,246,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(200,204,223,0.6)",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && <p style={{ fontSize: "11px", color: "#FFB3B3", marginTop: "4px" }}>{fieldErrors.password}</p>}
              </div>

              {mode === "signup" && (
                <>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setFieldErrors((f) => {
                          const { confirmPassword: _, ...rest } = f;
                          return rest;
                        });
                      }}
                      placeholder="••••••••"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${fieldErrors.confirmPassword ? "rgba(240,88,88,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: "white",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        transition: "all 160ms ease-out",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.borderColor = "rgba(123,110,246,0.5)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }}
                    />
                    {fieldErrors.confirmPassword && <p style={{ fontSize: "11px", color: "#FFB3B3", marginTop: "4px" }}>{fieldErrors.confirmPassword}</p>}
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#8890B0", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Referral Code (Optional)</label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter referral code"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        transition: "all 160ms ease-out",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.borderColor = "rgba(123,110,246,0.5)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        setFieldErrors((f) => {
                          const { terms: _, ...rest } = f;
                          return rest;
                        });
                      }}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <label htmlFor="agree-terms" style={{ fontSize: "12px", color: "#8890B0", cursor: "pointer" }}>
                      I agree to the <span style={{ color: "#7B6EF6" }}>Terms & Conditions</span>
                    </label>
                  </div>
                  {fieldErrors.terms && <p style={{ fontSize: "11px", color: "#FFB3B3" }}>{fieldErrors.terms}</p>}
                </>
              )}

              {mode === "login" && (
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label htmlFor="remember-me" style={{ fontSize: "12px", color: "#8890B0", cursor: "pointer" }}>Remember me</label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || cooldownSec > 0}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  borderRadius: "8px",
                  background: cooldownSec > 0 ? "rgba(123,110,246,0.5)" : "linear-gradient(135deg, #7B6EF6 0%, #2BBFA0 100%)",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: cooldownSec > 0 || loading ? "not-allowed" : "pointer",
                  opacity: cooldownSec > 0 || loading ? 0.7 : 1,
                  transition: "all 160ms ease-out",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onHover
              >
                {cooldownSec > 0 ? (
                  `Retry in ${cooldownSec}s`
                ) : loading ? (
                  "Please wait..."
                ) : mode === "login" ? (
                  <>Sign In <ArrowRight size={14} /></>
                ) : (
                  <>Create Account <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            {msg && (
              <div style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(56,200,120,0.1)",
                border: "1px solid rgba(56,200,120,0.3)",
                fontSize: "12px",
                color: "#38C878",
              }}>
                {msg}
              </div>
            )}
            {err && (
              <div style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(240,88,88,0.1)",
                border: "1px solid rgba(240,88,88,0.3)",
                fontSize: "12px",
                color: "#FFB3B3",
              }}>
                {err}
              </div>
            )}

            {cooldownSec > 0 && (
              <div style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(240,160,48,0.1)",
                border: "1px solid rgba(240,160,48,0.3)",
                fontSize: "11px",
                color: "#F0A030",
              }}>
                Too many attempts. Please wait {cooldownSec}s before trying again.
                <div style={{
                  marginTop: "8px",
                  height: "4px",
                  background: "rgba(240,160,48,0.2)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}>
                  <div
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #F0A030, #F5BB66)",
                      width: `${Math.max(0, Math.min(100, cooldownTotalSec > 0 ? (cooldownSec / cooldownTotalSec) * 100 : 0))}%`,
                      transition: "width 1000ms linear",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                type="button"
                onClick={() => void loadMe()}
                disabled={loading || meLoading}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#8890B0",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 160ms ease-out",
                  marginBottom: "8px",
                }}
              >
                {meLoading ? "Checking Session..." : "Check Current Session"}
              </button>
              {me && (
                <button
                  type="button"
                  onClick={() => void logout()}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    background: "rgba(240,88,88,0.08)",
                    border: "1px solid rgba(240,88,88,0.2)",
                    color: "#FFB3B3",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 160ms ease-out",
                  }}
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#8890B0" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => handleSwitchMode(mode === "login" ? "signup" : "login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#7B6EF6",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontWeight: "600",
                  fontSize: "12px",
                }}
              >
                {mode === "login" ? "Sign up here" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

