"use client";

import { useState } from "react";

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    emoji: "🤝",
    title: "Franchise System",
    titleUr: "فرنچائز سسٹم",
    desc: "10 types of franchise plans — from Rs 10,000 to Rs 10 Crore. Earn passive income while we manage operations.",
    descUr: "گھر بیٹھے کمائیں — ہم سنبھالتے ہیں سب کچھ",
    color: "from-orange-500 to-amber-400",
    href: "/franchise",
    cta: "Franchise Lein →",
  },
  {
    emoji: "🛒",
    title: "GoSellr E-Commerce",
    titleUr: "گو سیلر",
    desc: "Sell anything online — products, services, digital goods. AI-powered store with 100M+ potential buyers.",
    descUr: "اپنی دکان آنلائن کھولیں — کروڑوں خریدار آپ کے انتظار میں",
    color: "from-blue-500 to-cyan-400",
    href: "/gosellr",
    cta: "Shop Karein →",
  },
  {
    emoji: "💼",
    title: "Jobs Portal",
    titleUr: "جابز پورٹل",
    desc: "AI matches your skills to perfect jobs. Employers find best talent. Pakistan's smartest job network.",
    descUr: "بہترین نوکری — AI آپ کا ساتھی",
    color: "from-green-500 to-emerald-400",
    href: "/jobs",
    cta: "Naukri Dhundein →",
  },
  {
    emoji: "🏥",
    title: "Health Services",
    titleUr: "صحت سروسز",
    desc: "Book doctors, order medicines, manage health records. Quality healthcare at your fingertips.",
    descUr: "گھر سے ڈاکٹر — صحت آپ کے ہاتھ میں",
    color: "from-pink-500 to-rose-400",
    href: "/health",
    cta: "Doctor Book Karein →",
  },
  {
    emoji: "🤖",
    title: "AI Marketplace",
    titleUr: "اے آئی مارکیٹ پلیس",
    desc: "100+ AI tools for writing, coding, design, and more. Pakistan's first AI superstore.",
    descUr: "AI کی طاقت آپ کے پاس — 100 سے زیادہ ٹولز",
    color: "from-violet-500 to-purple-400",
    href: "/ai-marketplace",
    cta: "AI Tools Dekhin →",
  },
  {
    emoji: "🎓",
    title: "Education Platform",
    titleUr: "تعلیم پلیٹ فارم",
    desc: "Learn skills, earn certificates, build career. Courses in Urdu + English for every background.",
    descUr: "سیکھیں اردو میں — سرٹیفکیٹ پائیں — کریئر بنائیں",
    color: "from-yellow-500 to-orange-400",
    href: "/education",
    cta: "Seekhna Shuru Karein →",
  },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { emoji: "🏭", val: "32+", label: "Industries", labelUr: "زنعتیں" },
  { emoji: "🌍", val: "50+", label: "Countries", labelUr: "ممالک" },
  { emoji: "👥", val: "1M+", label: "Users", labelUr: "صارفین" },
  { emoji: "🤖", val: "100+", label: "AI Tools", labelUr: "اے آئی ٹولز" },
  { emoji: "💰", val: "$500M+", label: "Ecosystem Value", labelUr: "قدر" },
  { emoji: "⏰", val: "24/7", label: "Support", labelUr: "سپورٹ" },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Ali Hassan",
    city: "Lahore",
    emoji: "👨‍💼",
    text: "EHB franchise ne meri life badal di — pehle mahine mein Rs 85,000 ki kamai!",
    stars: 5,
  },
  {
    name: "Fatima Malik",
    city: "Karachi",
    emoji: "👩‍💻",
    text: "GoSellr par apni dukan khooli — ab 200+ orders roz aate hain. Amazing platform!",
    stars: 5,
  },
  {
    name: "Usman Khan",
    city: "Islamabad",
    emoji: "👨‍🎓",
    text: "AI Marketplace ki wajah se mera coding project 3x fast complete hua. Bohat acha!",
    stars: 5,
  },
  {
    name: "Zara Ahmed",
    city: "Peshawar",
    emoji: "👩‍⚕️",
    text: "Health module se ghar baithe doctor se consultation liya — shukriya EHB!",
    stars: 5,
  },
];

// ── How It Works ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    step: "01",
    emoji: "📝",
    title: "Register Karein",
    titleEn: "Sign Up Free",
    desc: "Apna naam, email, phone number dein — sirf 60 seconds",
    color: "from-blue-600 to-indigo-500",
  },
  {
    step: "02",
    emoji: "✅",
    title: "Verify Karein",
    titleEn: "Verify Identity",
    desc: "CNIC ya passport se apni identity verify karein — 100% secure",
    color: "from-purple-600 to-pink-500",
  },
  {
    step: "03",
    emoji: "🚀",
    title: "Shuru Karein",
    titleEn: "Start Earning",
    desc: "Franchise, shop, ya jobs — apna raasta chunein aur shuru ho jayein!",
    color: "from-orange-600 to-amber-500",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <main className="min-h-screen bg-[#05050f] text-white font-sans overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#05050f] to-blue-900/30 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["🌍", "💡", "🤖", "🚀", "💰", "🤝", "🏭", "✨"].map((e, i) => (
            <span
              key={i}
              className="absolute text-5xl opacity-[0.04] select-none animate-pulse"
              style={{
                top: `${5 + (i * 11) % 80}%`,
                left: `${3 + (i * 13) % 90}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            >
              {e}
            </span>
          ))}
          {/* Glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 rounded-full px-5 py-2 text-sm text-purple-300 mb-8">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse inline-block" />
            Pakistan&apos;s #1 Business Super-App — Now Live 🇵🇰
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-tight mb-6">
            <span className="block text-white">Pakistan Ka</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Sabse Bada
            </span>
            <span className="block text-white">Business Platform</span>
          </h1>

          <p className="text-2xl font-bold text-white/70 mb-4" dir="rtl">
            ایک جگہ — کاروبار، صحت، تعلیم، نوکری، AI زب کچھ
          </p>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-12">
            EHB connects 32+ industries, empowers 1M+ users, and runs 100+ AI tools —
            all from one world-class platform. Accessible to everyone, everywhere.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a
              href="/home"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black px-10 py-5 rounded-2xl text-xl transition-all hover:scale-105 shadow-2xl shadow-purple-500/30"
            >
              🚀 Abhi Shuru Karein
            </a>
            <a
              href="/franchise"
              className="bg-white/10 hover:bg-white/15 border-2 border-white/20 text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all hover:scale-105"
            >
              💰 Kamai Karein
            </a>
            <a
              href="/development"
              className="text-purple-400 hover:text-purple-300 font-semibold px-6 py-5 text-sm underline-offset-4 hover:underline transition-all"
            >
              📋 Progress Dekhin
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl px-3 py-4 text-center"
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-xl md:text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
                <div className="text-xs text-white/30">{s.labelUr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-white/3">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Shuru Karna Bohat Aasaan Hai
            </h2>
            <p className="text-2xl text-white/60" dir="rtl">
              صرف ۳ آسان قدم — ابھی شروع کریں
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent z-10" />
                )}
                <div className="border border-white/10 rounded-3xl p-8 text-center bg-white/3 hover:bg-white/5 transition-all hover:border-white/25 hover:-translate-y-1">
                  <div
                    className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl shadow-xl`}
                  >
                    {step.emoji}
                  </div>
                  <div className="text-xs font-bold text-white/30 tracking-widest mb-2">
                    STEP {step.step}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-white/40 mb-3">{step.titleEn}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              EHB Mein Kya Hai?
            </h2>
            <p className="text-2xl text-white/60" dir="rtl">
              ای ایچ بی میں کیا ہے؟
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <a
                key={f.title}
                href={f.href}
                className="group border border-white/10 rounded-3xl p-7 hover:border-white/25 hover:bg-white/5 transition-all hover:-translate-y-1 block"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-3xl mb-5 shadow-xl group-hover:scale-110 transition-transform`}
                >
                  {f.emoji}
                </div>
                <h3 className="text-xl font-black text-white mb-1">{f.title}</h3>
                <p className="text-sm text-white/40 mb-3">{f.titleUr}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{f.desc}</p>
                <p className="text-xs text-white/30 mb-4" dir="rtl">
                  {f.descUr}
                </p>
                <span
                  className={`text-sm font-bold bg-gradient-to-r ${f.color} bg-clip-text text-transparent group-hover:underline`}
                >
                  {f.cta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gradient-to-b from-white/3 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Hamare Users Kehte Hain
            </h2>
            <p className="text-2xl text-white/60" dir="rtl">
              ہمارے صارفین کیا کہتے ہیں
            </p>
          </div>

          {/* Active testimonial */}
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

          {/* Dots */}
          <div className="flex justify-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeTestimonial ? "bg-purple-500 w-8" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🔒", title: "100% Secure", titleUr: "مکمل محفوظ" },
              { emoji: "🇵🇰", title: "Made in Pakistan", titleUr: "پاکستان میں بنا" },
              { emoji: "📜", title: "Govt Registered", titleUr: "حکومت رجسٹرڈ" },
              { emoji: "🌍", title: "50+ Countries", titleUr: "۵۰+ ممالک" },
            ].map((t) => (
              <div
                key={t.title}
                className="flex flex-col items-center text-center border border-white/10 rounded-2xl p-6 bg-white/3"
              >
                <div className="text-4xl mb-3">{t.emoji}</div>
                <p className="font-bold text-white text-sm">{t.title}</p>
                <p className="text-xs text-white/40 mt-1">{t.titleUr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Glow */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="text-7xl mb-6 animate-bounce">🚀</div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Aaj Hi Join Karein
            </h2>
            <p className="text-3xl font-bold mb-4" dir="rtl">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                آ�, ہی شامل ہوں
              </span>
            </p>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Free registration — do not need a credit card.
              Join 1M+ users already growing with EHB.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/home"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white font-black px-12 py-5 rounded-2xl text-xl transition-all hover:scale-105 shadow-2xl shadow-purple-500/40"
              >
                🆓 Free Mein Register Karein
              </a>
              <a
                href="/franchise"
                className="bg-white/10 hover:bg-white/15 border-2 border-white/20 text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all hover:scale-105"
              >
                💼 Franchise Info Lein
              </a>
            </div>

            <p className="text-white/30 text-sm mt-8">
              ✅ Free hai • 🔒 Secure hai • 🇵🇰 Pakistan ka apna platform
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
