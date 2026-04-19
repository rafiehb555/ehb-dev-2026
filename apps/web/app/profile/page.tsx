"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Settings, Shield, Bell, CreditCard, Share2, LogOut, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Service Provider",
    joinedDate: "Jan 2025",
    avatar: "👤",
    stlLevel: "L3 VERIFIED",
    stlScore: 72,
    bio: "Professional service provider with 5+ years experience",
    phone: "+92 300 1234567",
  });

  const stlBreakdown = [
    { label: "PSS (Identity)", value: 95, color: "#7B6EF6" },
    { label: "CRB (Records)", value: 88, color: "#2BBFA0" },
    { label: "DMO (Activity)", value: 60, color: "#F0A030" },
    { label: "Wallet (Trust)", value: 52, color: "#38C878" },
  ];

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
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

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div style={{
            background: "rgba(19,22,42,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 14,
            padding: 24,
            boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
            marginBottom: 24,
          }}>
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #7B6EF6, #2BBFA0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                flexShrink: 0,
              }}>
                {profile.avatar}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <h1 style={{ fontSize: "24px", fontWeight: "700" }}>{profile.name}</h1>
                  <div style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    background: "rgba(123,110,246,0.2)",
                    border: "1px solid rgba(123,110,246,0.3)",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#7B6EF6",
                  }}>
                    {profile.stlLevel}
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "#8890B0", marginBottom: "12px" }}>
                  {profile.role} • Member since {profile.joinedDate}
                </p>
                <p style={{ fontSize: "12px", color: "#8890B0" }}>
                  {profile.bio}
                </p>
              </div>

              <Link
                href="/settings"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  textDecoration: "none",
                }}
              >
                <Settings size={16} /> Edit
              </Link>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "24px" }}>
            {/* STL Overview */}
            <div style={{
              background: "rgba(19,22,42,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
            }}>
              <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8890B0", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>STL Overview</h2>
              <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>{profile.stlScore}</div>
              <div style={{ fontSize: "12px", color: "#8890B0", marginBottom: "20px" }}>Trust Score (0-100)</div>

              <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginBottom: "20px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #7B6EF6, #2BBFA0)",
                    width: `${profile.stlScore}%`,
                    transition: "width 400ms ease-out",
                    borderRadius: "2px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {stlBreakdown.map((item) => (
                  <div key={item.label} style={{
                    padding: "12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#8890B0" }}>{item.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "white" }}>{item.value}%</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "1px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          background: item.color,
                          width: `${item.value}%`,
                          borderRadius: "1px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div style={{
              background: "rgba(19,22,42,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
            }}>
              <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8890B0", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Verification Status</h2>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", background: "rgba(56,200,120,0.08)", border: "1px solid rgba(56,200,120,0.2)" }}>
                  <CheckCircle size={20} color="#38C878" />
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "white" }}>PSS Verified</div>
                    <div style={{ fontSize: "11px", color: "#8890B0" }}>Identity verified</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", background: "rgba(56,200,120,0.08)", border: "1px solid rgba(56,200,120,0.2)" }}>
                  <CheckCircle size={20} color="#38C878" />
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "white" }}>CRB Registered</div>
                    <div style={{ fontSize: "11px", color: "#8890B0" }}>Central records verified</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", background: "rgba(240,160,48,0.08)", border: "1px solid rgba(240,160,48,0.2)" }}>
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(240,160,48,0.3)",
                    border: "2px solid #F0A030",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                  }}>
                    ⏳
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "white" }}>Face Match Pending</div>
                    <div style={{ fontSize: "11px", color: "#8890B0" }}>Awaiting verification</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div style={{
              background: "rgba(19,22,42,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
            }}>
              <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8890B0", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Activity Summary</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                <div style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "rgba(123,110,246,0.08)",
                  border: "1px solid rgba(123,110,246,0.2)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#7B6EF6" }}>24</div>
                  <div style={{ fontSize: "11px", color: "#8890B0" }}>Orders</div>
                </div>
                <div style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "rgba(43,191,160,0.08)",
                  border: "1px solid rgba(43,191,160,0.2)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#2BBFA0" }}>4.8</div>
                  <div style={{ fontSize: "11px", color: "#8890B0" }}>Rating (12)</div>
                </div>
                <div style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "rgba(240,160,48,0.08)",
                  border: "1px solid rgba(240,160,48,0.2)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#F0A030" }}>8</div>
                  <div style={{ fontSize: "11px", color: "#8890B0" }}>Referrals</div>
                </div>
                <div style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "rgba(56,200,120,0.08)",
                  border: "1px solid rgba(56,200,120,0.2)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#38C878" }}>PKR 42K</div>
                  <div style={{ fontSize: "11px", color: "#8890B0" }}>Earnings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: "rgba(19,22,42,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 14,
            padding: 24,
            boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
          }}>
            <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8890B0", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Links</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
              <Link
                href="/settings"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  transition: "all 160ms ease-out",
                }}
              >
                <Settings size={16} /> Edit Profile
              </Link>
              <Link
                href="/settings"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                }}
              >
                <Shield size={16} /> Security
              </Link>
              <Link
                href="/settings"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                }}
              >
                <Bell size={16} /> Notifications
              </Link>
              <Link
                href="/settings"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                }}
              >
                <CreditCard size={16} /> Payments
              </Link>
              <button
                type="button"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                }}
              >
                <Share2 size={16} /> Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

