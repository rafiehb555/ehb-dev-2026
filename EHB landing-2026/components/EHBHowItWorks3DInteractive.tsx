"use client";

import React, { useEffect, useMemo, useState } from "react";

type NodeKey = "PSS" | "DMO" | "JPS" | "CRB" | "STL" | "EHW";

const NODE_DETAILS: Record<NodeKey, { title: string; standFor: string; desc: string; accent: string }> = {
  PSS: {
    title: "PSS",
    standFor: "Proof & Security System",
    desc: "Verifies identity and prevents fake users.",
    accent: "#00AEEF",
  },
  DMO: {
    title: "DMO",
    standFor: "Decentralized Management Office",
    desc: "Governance control center + EAP affiliate engine (referrals & commissions).",
    accent: "#8B5CF6",
  },
  JPS: {
    title: "JPS",
    standFor: "Job Profile & Skill",
    desc: "Connects users with jobs, opportunities, and buyers.",
    accent: "#00AEEF",
  },
  CRB: {
    title: "CRB",
    standFor: "Certification & Registry Board",
    desc: "Certification & Registry Board: certifies verified outcomes and records them.",
    accent: "#8B5CF6",
  },
  STL: {
    title: "STL",
    standFor: "Service Trust Level",
    desc: "Service Trust Level: AI trust scoring controls ranking and visibility.",
    accent: "#8B5CF6",
  },
  EHW: {
    title: "EHW",
    standFor: "EHB Wallet",
    desc: "EHB Wallet: payments, earnings, and affiliate payouts for trusted transactions.",
    accent: "#00AEEF",
  },
};

const AI_MESSAGES = [
  {
    title: "AI is analyzing opportunities for you...",
    sub: "Scanning verified listings across 32 industries.",
    chipA: "Best earning option found",
    chipB: "Matching you with verified services",
  },
  {
    title: "Best match found for your needs",
    sub: "Using AI signals + verification status.",
    chipA: "Top providers recommended",
    chipB: "Safe steps protected by STL",
  },
  {
    title: "Optimizing your growth path",
    sub: "Next best actions for jobs, services, and products.",
    chipA: "Next step: book + start",
    chipB: "Verification stays active",
  },
];

export function EHBHowItWorks3DInteractive() {
  const [activeNode, setActiveNode] = useState<NodeKey | null>(null);
  const [aiIndex, setAiIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAiIndex((p) => (p + 1) % AI_MESSAGES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const message = AI_MESSAGES[aiIndex];

  const nodePositions = useMemo(
    () => ({
      PSS: { x: 33, y: 26 },
      DMO: { x: 67, y: 26 },
      JPS: { x: 76, y: 50 },
      CRB: { x: 67, y: 74 },
      EHW: { x: 33, y: 74 },
      STL: { x: 24, y: 50 },
    }),
    [],
  );

  const highlight = (key: NodeKey) => (activeNode ? activeNode === key : false);

  return (
    <div className="relative rounded-3xl glass-card border border-sky-400/20 p-4 md:p-6 overflow-hidden">
      <style>{`
        @keyframes ehbCorePulse {
          0% { transform: translateZ(0) scale(1); filter: brightness(1); }
          50% { transform: translateZ(0) scale(1.02); filter: brightness(1.2); }
          100% { transform: translateZ(0) scale(1); filter: brightness(1); }
        }
        @keyframes ehbDataParticle {
          0% { opacity: 0; transform: translateX(-8px) translateY(0px); }
          20% { opacity: 0.65; }
          60% { opacity: 0.55; }
          100% { opacity: 0; transform: translateX(8px) translateY(0px); }
        }
        @keyframes ehbSoftFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ehbDash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -70; }
        }
      `}</style>

      {/* background layers */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(0,234,239,0.18), transparent 55%), radial-gradient(circle at 80% 0%, rgba(139,92,246,0.18), transparent 55%), radial-gradient(circle at 50% 80%, rgba(59,130,246,0.12), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.95) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.95) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative grid grid-cols-12 gap-4 items-center">
        {/* Left inputs */}
        <div className="col-span-3 space-y-3">
          {[
            { icon: "👤", title: "User", desc: "Submits request in one profile." },
            { icon: "🏢", title: "Company", desc: "Offers services/products to users." },
          ].map((it) => (
            <div
              key={it.title}
              className="rounded-2xl glass-panel border border-white/15 p-3 transition-all duration-300 hover:border-white/25"
              style={{ boxShadow: "0 0 18px rgba(0,234,239,0.10)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-lg border"
                  style={{
                    backgroundColor: "rgba(0,174,239,0.12)",
                    borderColor: "rgba(0,174,239,0.30)",
                    boxShadow: "0 0 18px rgba(0,174,239,0.22)",
                  }}
                  aria-hidden
                >
                  {it.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{it.title}</p>
                  <p className="text-[11px] text-ehb-textBody mt-0.5">{it.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Core + departments */}
        <div className="col-span-6 relative h-[360px] md:h-[390px]">
          {/* Connections */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="ehbLineCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#00AEEF" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            {/* core routes */}
            {(
              [
                ["PSS", "Core"],
                ["DMO", "Core"],
                ["JPS", "Core"],
                ["CRB", "Core"],
                ["STL", "Core"],
                ["EHW", "Core"],
              ] as const
            ).map(([key]) => {
              const pos = nodePositions[key as NodeKey];
              const isActive = activeNode === (key as NodeKey);
              return (
                <path
                  key={`conn-${key}`}
                  d={`M ${pos.x} ${pos.y} C ${pos.x} ${50} ${50} ${pos.y} ${50} ${50}`}
                  fill="none"
                  stroke="url(#ehbLineCyan)"
                  strokeWidth={isActive ? 1.8 : 1.2}
                  strokeLinecap="round"
                  style={{
                    opacity: isActive ? 0.95 : activeNode ? 0.35 : 0.75,
                    animation: "ehbDash 2.2s linear infinite",
                  }}
                  strokeDasharray="4 8"
                />
              );
            })}

            {/* outputs routes from core */}
            {[
              { out: "Verified Services", x: 78, y: 33 },
              { out: "Jobs", x: 78, y: 50 },
              { out: "Products", x: 78, y: 67 },
            ].map((o) => {
              const isActive = Boolean(activeNode);
              return (
                <path
                  key={o.out}
                  d={`M 50 50 C 62 ${o.y} ${o.x} ${o.y} ${o.x} ${o.y}`}
                  fill="none"
                  stroke="url(#ehbLineCyan)"
                  strokeWidth={isActive ? 1.6 : 1.2}
                  strokeLinecap="round"
                  style={{
                    opacity: activeNode ? 0.85 : 0.7,
                    animation: "ehbDash 2.4s linear infinite",
                  }}
                  strokeDasharray="6 10"
                />
              );
            })}
          </svg>

          {/* Core */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 160,
              height: 160,
              background:
                "radial-gradient(circle at 50% 25%, rgba(248,250,252,0.95), transparent 55%), radial-gradient(circle at 50% 70%, rgba(0,174,239,0.85), transparent 68%)",
              boxShadow:
                "0 0 52px rgba(0,174,239,0.52), 0 0 110px rgba(139,92,246,0.28)",
              animation: "ehbCorePulse 2.6s ease-in-out infinite",
            }}
          >
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-[-10px] rounded-full border border-sky-400/20 animate-spin-slow" />

            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="px-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                  EHB CORE
                </p>
                <p className="text-lg md:text-xl font-bold text-sky-50 mt-1">
                  Verified System Brain
                </p>
                <p className="text-[10px] text-white mt-0.5">
                  PSS · DMO · JPS · CRB · STL · EHW
                </p>
              </div>
            </div>
          </div>

          {/* Dept nodes */}
          {(
            ["PSS", "DMO", "JPS", "CRB", "EHW", "STL"] as NodeKey[]
          ).map((key) => {
            const pos = nodePositions[key];
            const detail = NODE_DETAILS[key];
            const isActive = highlight(key);
            return (
              <button
                key={key}
                type="button"
                onMouseEnter={() => setActiveNode(key)}
                onMouseLeave={() => setActiveNode(null)}
                onFocus={() => setActiveNode(key)}
                onBlur={() => setActiveNode(null)}
                className="absolute rounded-2xl glass-panel border px-2 py-2 text-left transition-all duration-200"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                  borderColor: isActive ? `${detail.accent}88` : "rgba(255,255,255,0.20)",
                  boxShadow: isActive
                    ? `0 0 26px ${detail.accent}55`
                    : "0 0 0 1px rgba(255,255,255,0.03) inset",
                  backgroundColor: isActive ? "rgba(2,12,27,0.95)" : "rgba(2,12,27,0.70)",
                }}
                aria-label={`Highlight ${detail.title}`}
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden className="text-lg">
                    {key === "PSS"
                      ? "🛡️"
                      : key === "DMO"
                        ? "📊"
                        : key === "JPS"
                          ? "🤝"
                          : key === "CRB"
                            ? "🧾"
                            : key === "EHW"
                              ? "💳"
                              : "⭐"}
                  </span>
                  <div className="leading-tight">
                    <p className="text-[10px] font-semibold text-white">{detail.title}</p>
                    <p className="text-[9px] text-ehb-textBody">Verified</p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-[210px] z-10">
                    <div
                      className="rounded-2xl glass-panel border px-3 py-2"
                      style={{
                        borderColor: `${detail.accent}55`,
                        backgroundColor: "rgba(2,12,27,0.92)",
                        boxShadow: `0 0 34px ${detail.accent}2a`,
                      }}
                    >
                      <p className="text-[10px] font-semibold text-white">{detail.title}</p>
                      <p className="text-[9.5px] text-ehb-textBody mt-0.5">{detail.standFor}</p>
                      <p className="text-[9.5px] text-ehb-textBody mt-0.5">{detail.desc}</p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}

          {/* Data particles */}
          <div className="pointer-events-none absolute inset-0">
            {new Array(9).fill(null).map((_, i) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  left: `${20 + i * 7}%`,
                  top: `${35 + (i % 3) * 14}%`,
                  background: i % 2 === 0 ? "rgba(0,174,239,0.95)" : "rgba(139,92,246,0.9)",
                  boxShadow: `0 0 14px ${
                    i % 2 === 0 ? "rgba(0,174,239,0.35)" : "rgba(139,92,246,0.30)"
                  }`,
                  opacity: 0.55,
                  animation: "ehbDataParticle 1.8s ease-in-out infinite",
                  animationDelay: `${i * 0.22}s`,
                }}
              />
            ))}
          </div>

          {/* Right outputs INSIDE the 3D panel (so it matches the intended structure) */}
          <div className="absolute top-1/2 right-2 -translate-y-1/2 w-[190px] pointer-events-none">
            <div className="space-y-2">
              {[
                { title: "Verified Services", desc: "Only trusted listings", icon: "✅", accent: "#00AEEF" },
                { title: "Jobs & Opportunities", desc: "Matched next steps", icon: "📌", accent: "#8B5CF6" },
                { title: "Products", desc: "Monitored availability", icon: "🛒", accent: "#00AEEF" },
              ].map((o) => (
                <div
                  key={o.title}
                  className="rounded-2xl glass-panel border px-3 py-2"
                  style={{
                    borderColor: `${o.accent}35`,
                    backgroundColor: "rgba(2,12,27,0.78)",
                    boxShadow: `0 0 24px ${o.accent}20`,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span aria-hidden className="text-lg">
                      {o.icon}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold text-white leading-tight">{o.title}</p>
                      <p className="text-[9.5px] text-ehb-textBody mt-0.5">{o.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* AI intelligence layer (inline mini card on the right of 3D) */}
        <div className="col-span-3">
          <div className="rounded-2xl glass-card border border-violet-500/20 p-4 md:p-5 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 15% 0%, rgba(139,92,246,0.22), transparent 55%), radial-gradient(circle at 100% 70%, rgba(0,174,239,0.16), transparent 50%)",
                }}
              />
            </div>
            <div className="relative space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted">AI Intelligence Layer</p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">{message.title}</p>
                <p className="text-[11px] text-ehb-textBody">{message.sub}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[message.chipA, message.chipB].map((c) => (
                  <span
                    key={c}
                    className="rounded-full px-3 py-1 text-[10px] font-medium border"
                    style={{
                      borderColor: "rgba(0,234,239,0.35)",
                      backgroundColor: "rgba(0,174,239,0.10)",
                      color: "rgba(226,232,240,0.92)",
                      boxShadow: "0 0 18px rgba(0,174,239,0.12)",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl glass-panel border border-white/10 p-3">
                <p className="text-[11px] font-semibold text-white">Verified outcome</p>
                <p className="text-[10px] text-ehb-textBody mt-1">
                  PSS + DMO + CRB + STL + EHW ensures quality, trust, and secure transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

