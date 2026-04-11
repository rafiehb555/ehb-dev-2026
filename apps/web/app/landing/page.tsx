"use client";

import { useState, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GLOBAL ECOSYSTEM — Animated Globe Component (inline)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ORBIT1 = [
  { emoji: "💻", label: "IT" },
  { emoji: "🏥", label: "Health" },
  { emoji: "🎓", label: "Education" },
  { emoji: "💰", label: "Finance" },
];
const ORBIT2 = [
  { emoji: "🏪", label: "Franchise" },
  { emoji: "🛒", label: "E-Commerce" },
  { emoji: "🤖", label: "AI" },
  { emoji: "⚖️", label: "Law" },
  { emoji: "🚚", label: "Delivery" },
  { emoji: "🏗️", label: "Construct" },
];
const ORBIT3 = [
  { emoji: "✈️", label: "Travel" },
  { emoji: "🎮", label: "Gaming" },
  { emoji: "🏭", label: "Manufacturing" },
  { emoji: "📣", label: "Marketing" },
  { emoji: "🔬", label: "Research" },
  { emoji: "⚡", label: "Energy" },
  { emoji: "🌿", label: "Environment" },
  { emoji: "💼", label: "Freelance" },
];
const LIVE_FEED = [
  "🇵🇰 Lahore — Ali joined EHB Franchise",
  "🇺🇸 New York — John hired a web dev",
  "🇬🇧 London — Sara sold 12 products",
  "🇦🇪 Dubai — Ahmed got consultation",
  "🇸🇦 Riyadh — Omar started freelancing",
  "🇩🇪 Berlin — Klaus bought AI tools",
  "🇦🇺 Sydney — Priya enrolled in course",
  "🇨🇦 Toronto — Mike opened a store",
];

const GLOBE_STYLE = `
@keyframes orbitCW  { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
@keyframes orbitCCW { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
@keyframes pulseRing {
  0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
  100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
}
@keyframes floatY {
  0%,100% { transform: translateY(0px);   }
  50%     { transform: translateY(-10px); }
}
@keyframes globeSpin { from { transform: rotateZ(0deg); } to { transform: rotateZ(360deg); } }
@keyframes twinkle  { 0%,100% { opacity: 0.1; } 50% { opacity: 0.9; } }
@keyframes feedFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes connectionPulse {
  0%,100% { stroke-dashoffset: 0;   opacity: 0.35; }
  50%     { stroke-dashoffset: -20; opacity: 0.75; }
}
@keyframes tagFloat {
  0%,100% { transform: translateY(0) scale(1);    }
  50%     { transform: translateY(-6px) scale(1.03); }
}
`;

function OrbitRing({
  size,
  duration,
  items,
  reverse = false,
}: {
  size: number;
  duration: number;
  items: { emoji: string; label: string }[];
  reverse?: boolean;
}) {
  const r = size / 2;
  return (
    <>
      {/* Ring border */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          width: size, height: size,
          borderRadius: "50%",
          border: "1px dashed rgba(255,255,255,0.10)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />
      {/* Rotating track */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          width: size, height: size,
          transform: "translate(-50%,-50%)",
          animation: `${reverse ? "orbitCCW" : "orbitCW"} ${duration}s linear infinite`,
        }}
      >
        {items.map((item, i) => {
          const angle = ((360 / items.length) * i * Math.PI) / 180;
          const x = r + r * Math.cos(angle);
          const y = r + r * Math.sin(angle);
          return (
            <div
              key={item.label}
              style={{
                position: "absolute",
                left: x, top: y,
                transform: "translate(-50%,-50%)",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}
            >
              {/* Counter-rotate so icon stays upright */}
              <div
                style={{
                  animation: `${reverse ? "orbitCW" : "orbitCCW"} ${duration}s linear infinite`,
                  display: "flex", flexDirection: "column", alignItems: "center",
                }}
              >
                <div style={{
                  width: 40, height: 40,
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}>
                  {item.emoji}
                </div>
                <span style={{
                  fontSize: 7.5, color: "rgba(255,255,255,0.5)",
                  marginTop: 3, fontWeight: 600,
                  whiteSpace: "nowrap", letterSpacing: "0.03em",
                }}>
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function GlobalEcosystem() {
  const [feedIdx, setFeedIdx] = useState(0);
  const [feedVisible, setFeedVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeedVisible(false);
      setTimeout(() => {
        setFeedIdx((p) => (p + 1) % LIVE_FEED.length);
        setFeedVisible(true);
      }, 320);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const SZ = 480; // total container size

  return (
    <div style={{ position: "relative", width: SZ, height: SZ + 120, flexShrink: 0 }}>
      <style>{GLOBE_STYLE}</style>

      {/* Live feed pill */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 100, padding: "6px 16px",
        fontSize: 11, color: "rgba(255,255,255,0.7)",
        display: "inline-flex", alignItems: "center", gap: 8,
        opacity: feedVisible ? 1 : 0,
        transform: feedVisible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(6px)",
        transition: "all 0.3s ease",
        whiteSpace: "nowrap", maxWidth: 340, zIndex: 30,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#4ade80",
          animation: "twinkle 1s ease-in-out infinite",
          flexShrink: 0,
        }} />
        <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 9, letterSpacing: "0.1em" }}>
          LIVE
        </span>
        {LIVE_FEED[feedIdx]}
      </div>

      {/* Orbit system */}
      <div style={{
        position: "absolute", top: 36, left: 0,
        width: SZ, height: SZ,
      }}>
        {/* Purple glow bg */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Country floating tags */}
        {[
          { flag: "🇵🇰", name: "Pakistan", top: "2%",  left: "5%",  delay: 0,    dur: 3.2 },
          { flag: "🇺🇸", name: "USA",      top: "6%",  right: "4%", delay: 0.5,  dur: 2.8 },
          { flag: "🇦🇪", name: "Dubai",    bottom:"9%",left: "1%",  delay: 1,    dur: 3.5 },
          { flag: "🇬🇧", name: "UK",       bottom:"7%",right:"2%",  delay: 1.5,  dur: 3   },
          { flag: "🇩🇪", name: "Germany",  top:"40%",  left:"-2%",  delay: 0.7,  dur: 4   },
          { flag: "🇸🇦", name: "KSA",      top:"36%",  right:"-2%", delay: 1.2,  dur: 2.6 },
        ].map((t) => (
          <div key={t.name} style={{
            position: "absolute",
            top: t.top, left: t.left, right: (t as any).right, bottom: (t as any).bottom,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 20, padding: "5px 11px",
            fontSize: 11, color: "rgba(255,255,255,0.8)",
            whiteSpace: "nowrap", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", gap: 5,
            fontWeight: 500,
            animation: `tagFloat ${t.dur}s ease-in-out infinite`,
            animationDelay: `${t.delay}s`,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#29ABE2", flexShrink: 0,
              animation: "twinkle 1.5s ease-in-out infinite",
            }} />
            {t.flag} {t.name}
          </div>
        ))}

        {/* SVG connection lines */}
        <svg style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none", opacity: 0.22,
        }} viewBox="0 0 480 480">
          <line x1="240" y1="240" x2="60"  y2="30"  stroke="#29ABE2" strokeWidth="0.7" strokeDasharray="6,4" style={{ animation: "connectionPulse 2.5s ease-in-out infinite" }} />
          <line x1="240" y1="240" x2="420" y2="50"  stroke="#29ABE2" strokeWidth="0.7" strokeDasharray="6,4" style={{ animation: "connectionPulse 2.5s ease-in-out infinite 0.4s" }} />
          <line x1="240" y1="240" x2="30"  y2="420" stroke="#29ABE2" strokeWidth="0.7" strokeDasharray="6,4" style={{ animation: "connectionPulse 2.5s ease-in-out infinite 0.8s" }} />
          <line x1="240" y1="240" x2="450" y2="410" stroke="#29ABE2" strokeWidth="0.7" strokeDasharray="6,4" style={{ animation: "connectionPulse 2.5s ease-in-out infinite 1.2s" }} />
          <line x1="240" y1="240" x2="10"  y2="220" stroke="#29ABE2" strokeWidth="0.7" strokeDasharray="6,4" style={{ animation: "connectionPulse 2.5s ease-in-out infinite 1.6s" }} />
          <line x1="240" y1="240" x2="470" y2="200" stroke="#29ABE2" strokeWidth="0.7" strokeDasharray="6,4" style={{ animation: "connectionPulse 2.5s ease-in-out infinite 2s" }} />
        </svg>

        {/* 3 Orbit rings */}
        <OrbitRing size={430} duration={42} items={ORBIT3} reverse={true}  />
        <OrbitRing size={300} duration={26} items={ORBIT2} reverse={false} />
        <OrbitRing size={180} duration={14} items={ORBIT1} reverse={true}  />

        {/* Globe center */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 140, height: 140,
          animation: "floatY 4s ease-in-out infinite",
          zIndex: 20,
        }}>
          {/* Pulse rings */}
          {[0, 1, 2].map((d) => (
            <div key={d} style={{
              position: "absolute", top: "50%", left: "50%",
              width: 140, height: 140, borderRadius: "50%",
              border: "1px solid rgba(41, 171, 226,0.28)",
              animation: "pulseRing 3s ease-out infinite",
              animationDelay: `${d}s`,
              pointerEvents: "none",
            }} />
          ))}

          {/* Globe sphere */}
          <div style={{
            width: "100%", height: "100%", borderRadius: "50%",
            background: "radial-gradient(circle at 32% 32%, #1a1a5e, #05050f 70%)",
            boxShadow:
              "0 0 50px rgba(41, 171, 226,0.35), 0 0 100px rgba(139,92,246,0.2), inset 0 0 40px rgba(41, 171, 226,0.12)",
            border: "1.5px solid rgba(41, 171, 226,0.5)",
            position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Wireframe SVG */}
            <svg style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              animation: "globeSpin 24s linear infinite",
              opacity: 0.32,
            }} viewBox="0 0 200 200">
              <ellipse cx="100" cy="100" rx="90" ry="12"  fill="none" stroke="#29ABE2" strokeWidth="0.8" opacity="0.85" />
              <ellipse cx="100" cy="68"  rx="70" ry="9"   fill="none" stroke="#29ABE2" strokeWidth="0.5" opacity="0.4"  />
              <ellipse cx="100" cy="132" rx="70" ry="9"   fill="none" stroke="#29ABE2" strokeWidth="0.5" opacity="0.4"  />
              <ellipse cx="100" cy="40"  rx="35" ry="6"   fill="none" stroke="#29ABE2" strokeWidth="0.4" opacity="0.28" />
              <ellipse cx="100" cy="160" rx="35" ry="6"   fill="none" stroke="#29ABE2" strokeWidth="0.4" opacity="0.28" />
              <ellipse cx="100" cy="100" rx="90" ry="90"  fill="none" stroke="#29ABE2" strokeWidth="0.6" opacity="0.5"  />
              <ellipse cx="100" cy="100" rx="50" ry="90"  fill="none" stroke="#29ABE2" strokeWidth="0.5" opacity="0.3"  />
              <ellipse cx="100" cy="100" rx="15" ry="90"  fill="none" stroke="#29ABE2" strokeWidth="0.4" opacity="0.18" />
              <ellipse cx="100" cy="100" rx="75" ry="90"  fill="none" stroke="#29ABE2" strokeWidth="0.4" opacity="0.22" />
              <circle cx="120" cy="75"  r="3" fill="#29ABE2" opacity="0.9" />
              <circle cx="120" cy="75"  r="7" fill="none" stroke="#29ABE2" strokeWidth="0.5" opacity="0.4" />
              <circle cx="75"  cy="88"  r="3" fill="#8B5CF6" opacity="0.9" />
              <circle cx="150" cy="100" r="3" fill="#29ABE2" opacity="0.9" />
              <circle cx="55"  cy="85"  r="3" fill="#F59E0B" opacity="0.9" />
              <circle cx="160" cy="125" r="3" fill="#10B981" opacity="0.9" />
              <line x1="120" y1="75"  x2="75"  y2="88"  stroke="#29ABE2" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.5" />
              <line x1="120" y1="75"  x2="150" y2="100" stroke="#29ABE2" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.5" />
              <line x1="150" y1="100" x2="160" y2="125" stroke="#10B981" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.5" />
            </svg>

            {/* Center text */}
            <div style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
              <span style={{ fontSize: 8, color: "rgba(41, 171, 226,0.9)", letterSpacing: "0.25em", fontWeight: 700, display: "block" }}>
                GLOBAL
              </span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "white", lineHeight: 1, display: "block" }}>
                EHB
              </span>
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", display: "block", marginTop: 2 }}>
                ECOSYSTEM
              </span>
            </div>

            {/* Shimmer */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)",
              pointerEvents: "none",
            }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap",
      }}>
        {[
          { icon: "🌍", val: "50+",  label: "Countries"  },
          { icon: "🏭", val: "32+",  label: "Industries" },
          { icon: "👥", val: "1M+",  label: "Users"      },
          { icon: "🤖", val: "100+", label: "AI Tools"   },
        ].map((s) => (
          <div key={s.label} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: "8px 14px",
            textAlign: "center", minWidth: 72,
          }}>
            <div style={{ fontSize: 16 }}>{s.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PAGE DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const FEATURES = [
  { emoji: "🤝", title: "Franchise System", titleUr: "Business Expansion", desc: "10 types of franchise plans — from Rs 10,000 to Rs 10 Crore. Earn passive income while we manage operations.", descUr: "Earn from anywhere while we handle the operations.", color: "from-orange-500 to-amber-400", href: "/franchise", cta: "Explore Franchise →" },
  { emoji: "🛒", title: "GoSellr E-Commerce", titleUr: "Smart Online Selling", desc: "Sell anything online — products, services, digital goods. AI-powered store with 100M+ potential buyers.", descUr: "Launch your online store and reach millions of buyers.", color: "from-blue-500 to-cyan-400", href: "/gosellr", cta: "Start Selling →" },
  { emoji: "💼", title: "Jobs Portal", titleUr: "Career Network", desc: "AI matches your skills to perfect jobs. Employers find best talent. Pakistan's smartest job network.", descUr: "Find better jobs faster with AI-powered matching.", color: "from-green-500 to-emerald-400", href: "/jobs", cta: "Find Jobs →" },
  { emoji: "🏥", title: "Health Services", titleUr: "Digital Healthcare", desc: "Book doctors, order medicines, manage health records. Quality healthcare at your fingertips.", descUr: "Consult doctors from home and manage care online.", color: "from-pink-500 to-rose-400", href: "/landing/health", cta: "Book a Doctor →" },
  { emoji: "🤖", title: "AI Marketplace", titleUr: "AI Tools Hub", desc: "100+ AI tools for writing, coding, design, and more. Pakistan's first AI superstore.", descUr: "Access 100+ AI tools for work, growth, and creativity.", color: "from-violet-500 to-purple-400", href: "/ai-marketplace", cta: "Browse AI Tools →" },
  { emoji: "🎓", title: "Education Platform", titleUr: "Learning Platform", desc: "Learn skills, earn certificates, build career. Courses in Urdu + English for every background.", descUr: "Build practical skills, earn certificates, and grow your career.", color: "from-yellow-500 to-orange-400", href: "/landing/education", cta: "Start Learning →" },
];

const STATS = [
  { emoji: "🏭", val: "32+", label: "Industries", labelUr: "Business Sectors" },
  { emoji: "🌍", val: "50+", label: "Countries", labelUr: "Global Reach" },
  { emoji: "👥", val: "1M+", label: "Users", labelUr: "Active Members" },
  { emoji: "🤖", val: "100+", label: "AI Tools", labelUr: "Automation Stack" },
  { emoji: "💰", val: "$500M+", label: "Ecosystem Value", labelUr: "Growth Value" },
  { emoji: "⏰", val: "24/7", label: "Support", labelUr: "Always Available" },
];

const TESTIMONIALS = [
  { name: "Ali Hassan", city: "Lahore", emoji: "👨‍💼", text: "The EHB franchise changed my business journey. I earned Rs 85,000 in my first month.", stars: 5 },
  { name: "Fatima Malik", city: "Karachi", emoji: "👩‍💻", text: "I launched my store on GoSellr and now receive 200+ orders every day. Amazing platform.", stars: 5 },
  { name: "Usman Khan", city: "Islamabad", emoji: "👨‍🎓", text: "The AI Marketplace helped me finish my coding project three times faster.", stars: 5 },
  { name: "Zara Ahmed", city: "Peshawar", emoji: "👩‍⚕️", text: "I booked a doctor consultation from home through the health module. Thank you, EHB.", stars: 5 },
];

const STEPS = [
  { step: "01", emoji: "📝", title: "Create Account", titleEn: "Sign Up Free", desc: "Enter your name, email, and phone number. It only takes 60 seconds.", color: "from-blue-600 to-indigo-500" },
  { step: "02", emoji: "✅", title: "Verify Identity", titleEn: "Verify Identity", desc: "Complete identity verification with your CNIC or passport in a secure flow.", color: "from-purple-600 to-pink-500" },
  { step: "03", emoji: "🚀", title: "Start Growing", titleEn: "Start Earning", desc: "Choose your path, whether franchise, commerce, or jobs, and start growing today.", color: "from-orange-600 to-amber-500" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN PAGE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <main className="min-h-screen bg-[#05050f] text-white font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          HERO — 2-column: Left text | Right animated globe
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center px-4 md:px-8 lg:px-16 py-20 overflow-hidden">

        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1f] via-[#05050f] to-[#050510] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Starfield dots */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 2, height: 2,
              top: `${Math.round(((i * 37) % 100))}%`,
              left: `${Math.round(((i * 53) % 100))}%`,
              opacity: 0.05 + (i % 5) * 0.04,
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-6">

          {/* ── LEFT: Text Content ── */}
          <div className="flex-1 text-left max-w-xl">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/15 border border-cyan-500/30 rounded-full px-4 py-1.5 text-xs text-cyan-300 mb-6 font-semibold tracking-wide">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse inline-block" />
              EARN ONLINE · EVEN IF YOU ARE NEW
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4">
              <span className="text-white">EHB – </span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Earn, Hire,
              </span>
              <br />
              <span className="text-white">and </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Grow
              </span>
              <span className="text-white"> in One</span>
              <br />
              <span className="text-white">Global Platform</span>
            </h1>

            {/* Description */}
            <p className="text-white/60 text-base leading-relaxed mb-3 max-w-md">
              A powerful AI-based platform where you can find jobs, offer services, sell
              products, and build your own business across 32 industries.
            </p>
            <p className="text-white/40 text-sm mb-8 max-w-md">
              Even if you are just getting started, EHB gives you a clear path to earn, learn, and grow.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="/#industries"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black px-8 py-4 rounded-2xl text-base transition-all hover:scale-105 shadow-2xl shadow-cyan-500/25"
              >
                🚀 Explore Industries
              </a>
              <a
                href="/dashboard"
                className="bg-white/8 hover:bg-white/14 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:scale-105"
              >
                👤 Create Profile
              </a>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                32+ Industries
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                700+ Services
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                AI Powered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Verified System
              </span>
            </div>
          </div>

          {/* ── RIGHT: Animated Globe ── */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto">
            <GlobalEcosystem />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 Steps
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Getting Started Is Easy
            </h2>
            <p className="text-2xl text-white/60">
              Just 3 simple steps to begin
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="border border-white/10 rounded-3xl p-8 text-center bg-white/3 hover:bg-white/5 transition-all hover:-translate-y-1">
                <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl shadow-xl`}>
                  {step.emoji}
                </div>
                <div className="text-xs font-bold text-white/30 tracking-widest mb-2">STEP {step.step}</div>
                <h3 className="text-2xl font-black text-white mb-1">{step.title}</h3>
                <p className="text-sm text-white/40 mb-3">{step.titleEn}</p>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">What&apos;s Inside EHB?</h2>
            <p className="text-2xl text-white/60">Explore the products and services available on the platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <a key={f.title} href={f.href} className="group border border-white/10 rounded-3xl p-7 hover:border-white/25 hover:bg-white/5 transition-all hover:-translate-y-1 block">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-3xl mb-5 shadow-xl group-hover:scale-110 transition-transform`}>
                  {f.emoji}
                </div>
                <h3 className="text-xl font-black text-white mb-1">{f.title}</h3>
                <p className="text-sm text-white/40 mb-3">{f.titleUr}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{f.desc}</p>
                <p className="text-xs text-white/30 mb-4">{f.descUr}</p>
                <span className={`text-sm font-bold bg-gradient-to-r ${f.color} bg-clip-text text-transparent group-hover:underline`}>
                  {f.cta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-white/3 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">What Our Users Say</h2>
            <p className="text-2xl text-white/60">Real stories from people growing with EHB</p>
          </div>
          <div className="border border-white/10 rounded-3xl p-8 md:p-12 bg-white/3 text-center mb-8">
            <div className="text-6xl mb-4">{TESTIMONIALS[activeTestimonial].emoji}</div>
            <div className="flex justify-center gap-1 mb-4">
              {Array(TESTIMONIALS[activeTestimonial].stars).fill("⭐").map((s, i) => (
                <span key={i} className="text-xl">{s}</span>
              ))}
            </div>
            <p className="text-xl text-white/80 italic mb-6 max-w-2xl mx-auto leading-relaxed">
              &ldquo;{TESTIMONIALS[activeTestimonial].text}&rdquo;
            </p>
            <div className="font-bold text-white">{TESTIMONIALS[activeTestimonial].name}</div>
            <div className="text-sm text-white/40">📍 {TESTIMONIALS[activeTestimonial].city}</div>
          </div>
          <div className="flex justify-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-3 rounded-full transition-all ${i === activeTestimonial ? "bg-cyan-500 w-8" : "bg-white/20 w-3"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TRUST SIGNALS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🔒", title: "100% Secure", titleUr: "Protected by trusted security standards" },
              { emoji: "🇵🇰", title: "Made in Pakistan", titleUr: "Built locally for regional and global growth" },
              { emoji: "📜", title: "Govt Registered", titleUr: "Registered and aligned with compliance needs" },
              { emoji: "🌍", title: "50+ Countries", titleUr: "Serving users across international markets" },
            ].map((t) => (
              <div key={t.title} className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-6 bg-white/3">
                <div className="text-4xl mb-3">{t.emoji}</div>
                <p className="font-bold text-white text-sm">{t.title}</p>
                <p className="text-xs text-white/40 mt-1">{t.titleUr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-600/12 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-7xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">Join Today</h2>
          <p className="text-2xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Start your journey with EHB today
            </span>
          </p>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Free registration — no credit card needed. Join 1M+ users already growing with EHB.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/dashboard" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-90 text-white font-black px-12 py-5 rounded-2xl text-xl transition-all hover:scale-105 shadow-2xl shadow-cyan-500/30">
              🆓 Register for Free
            </a>
            <a href="/franchise" className="bg-white/10 hover:bg-white/15 border-2 border-white/20 text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all hover:scale-105">
              💼 View Franchise Info
            </a>
          </div>
          <p className="text-white/30 text-sm mt-8">
            ✅ Free to join &nbsp;•&nbsp; 🔒 Secure to use &nbsp;•&nbsp; 🇵🇰 Built in Pakistan
          </p>
        </div>
      </section>

    </main>
  );
}
