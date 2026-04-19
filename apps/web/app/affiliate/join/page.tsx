"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function JoinAffiliatePage() {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-8">
        {/* Header */}
        <section className="rounded-2xl border border-emerald-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Join Our Network</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold gradient-text">EHB Affiliate Program</h1>
          <p className="mt-3 text-lg text-ehb-textBody max-w-2xl mx-auto">
            Earn passive income from 3 powerful commission engines. Build your network, grow your wealth, and unlock premium benefits.
          </p>
        </section>

        {/* 3 Earning Engines */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">3 Earning Engines Explained</h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Engine 1 */}
            <div className="ehb-card-elevated p-6 border-t-4 border-emerald-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">📦</span>
                <h3 className="text-xl font-bold text-white">Order Commission</h3>
              </div>
              <p className="text-sm text-ehb-textMuted mb-4">
                Earn commission every time your referral makes a purchase across EHB categories.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-white/5 rounded">
                  <span className="text-ehb-textMuted">Electronics</span>
                  <span className="text-emerald-300 font-semibold">3-5%</span>
                </div>
                <div className="flex justify-between p-2 bg-white/5 rounded">
                  <span className="text-ehb-textMuted">Fashion</span>
                  <span className="text-emerald-300 font-semibold">8-12%</span>
                </div>
                <div className="flex justify-between p-2 bg-white/5 rounded">
                  <span className="text-ehb-textMuted">Health & Wellness</span>
                  <span className="text-emerald-300 font-semibold">6-10%</span>
                </div>
                <div className="flex justify-between p-2 bg-white/5 rounded">
                  <span className="text-ehb-textMuted">Education</span>
                  <span className="text-emerald-300 font-semibold">5-8%</span>
                </div>
                <div className="flex justify-between p-2 bg-white/5 rounded">
                  <span className="text-ehb-textMuted">Travel</span>
                  <span className="text-emerald-300 font-semibold">4-7%</span>
                </div>
              </div>
              <p className="text-xs text-emerald-400 font-medium mt-4">💡 Example: Refer someone who buys $500 in Fashion → Earn $40-$60</p>
            </div>

            {/* Engine 2 */}
            <div className="ehb-card-elevated p-6 border-t-4 border-teal-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🏢</span>
                <h3 className="text-xl font-bold text-white">Franchise Sales</h3>
              </div>
              <p className="text-sm text-ehb-textMuted mb-4">
                Earn 30% commission when your referral purchases a franchise license.
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white/5 rounded">
                  <p className="font-semibold text-white mb-2">Multi-Level Bonus Structure:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ehb-textMuted">Your L1 Referral</span>
                      <span className="text-teal-300 font-semibold">5% bonus</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ehb-textMuted">Your L2 Referral</span>
                      <span className="text-teal-300 font-semibold">3% bonus</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ehb-textMuted">Your L3 Referral</span>
                      <span className="text-teal-300 font-semibold">2% bonus</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-teal-400 font-medium mt-4">💡 Example: $10,000 franchise → Earn $500-$3,000+ from 3 levels</p>
            </div>

            {/* Engine 3 */}
            <div className="ehb-card-elevated p-6 border-t-4 border-cyan-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🛍️</span>
                <h3 className="text-xl font-bold text-white">Product Affiliate</h3>
              </div>
              <p className="text-sm text-ehb-textMuted mb-4">
                Amazon-style affiliate program with performance-based rate increases.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-white/5 rounded">
                  <span className="text-ehb-textMuted">Standard Rate</span>
                  <span className="text-cyan-300 font-semibold">4-8%</span>
                </div>
                <div className="flex justify-between p-2 bg-white/5 rounded">
                  <span className="text-ehb-textMuted">Premium Products</span>
                  <span className="text-cyan-300 font-semibold">10-15%</span>
                </div>
                <div className="flex justify-between p-2 bg-white/5 rounded">
                  <span className="text-ehb-textMuted">Performance Bonus</span>
                  <span className="text-cyan-300 font-semibold">+2-5%</span>
                </div>
              </div>
              <p className="text-xs text-cyan-400 font-medium mt-4">💡 Example: 100 referrals in Q1 → Unlock 15% base + 5% bonus rates</p>
            </div>
          </div>
        </section>

        {/* Commission Rate Table */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Commission Rate Comparison</h2>

          <div className="ehb-card-elevated p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-ehb-textMuted font-semibold uppercase text-xs">Category</th>
                  <th className="text-center py-3 px-4 text-ehb-textMuted font-semibold uppercase text-xs">Order Commission</th>
                  <th className="text-center py-3 px-4 text-ehb-textMuted font-semibold uppercase text-xs">L1 (Direct)</th>
                  <th className="text-center py-3 px-4 text-ehb-textMuted font-semibold uppercase text-xs">L2</th>
                  <th className="text-center py-3 px-4 text-ehb-textMuted font-semibold uppercase text-xs">L3</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { category: "Electronics", order: "3-5%", l1: "2.5-4%", l2: "1.5-2.4%", l3: "1-1.6%" },
                  { category: "Fashion", order: "8-12%", l1: "6-9.6%", l2: "3.6-5.76%", l3: "2.4-3.84%" },
                  { category: "Health & Wellness", order: "6-10%", l1: "4.5-7.5%", l2: "2.7-4.5%", l3: "1.8-3%" },
                  { category: "Education", order: "5-8%", l1: "3.75-6%", l2: "2.25-3.6%", l3: "1.5-2.4%" },
                  { category: "Travel", order: "4-7%", l1: "3-5.25%", l2: "1.8-3.15%", l3: "1.2-2.1%" },
                  { category: "Legal Services", order: "5-9%", l1: "3.75-6.75%", l2: "2.25-4.05%", l3: "1.5-2.7%" },
                ].map((row) => (
                  <tr key={row.category} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{row.category}</td>
                    <td className="py-3 px-4 text-center text-emerald-300 font-semibold">{row.order}</td>
                    <td className="py-3 px-4 text-center text-teal-300 font-semibold">{row.l1}</td>
                    <td className="py-3 px-4 text-center text-cyan-300 font-semibold">{row.l2}</td>
                    <td className="py-3 px-4 text-center text-blue-300 font-semibold">{row.l3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-ehb-textMuted text-center max-w-2xl mx-auto">
            Rates scale based on your referral volume and STL (Service Trust Level). Higher performers unlock bonus percentages and exclusive perks.
          </p>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">How It Works in 4 Steps</h2>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                number: "1️⃣",
                step: "Join",
                desc: "Sign up as an EHB affiliate in minutes. No fee, no hidden charges.",
              },
              {
                number: "2️⃣",
                step: "Share",
                desc: "Get your unique link and share with friends, family, and social media.",
              },
              {
                number: "3️⃣",
                step: "Earn",
                desc: "Your referrals buy → You earn commission immediately from 3 engines.",
              },
              {
                number: "4️⃣",
                step: "Grow",
                desc: "Build your network deeper, unlock higher rates, and scale to passive income.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="ehb-card-elevated p-6 text-center">
                  <span className="text-4xl mb-3 block">{item.number}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{item.step}</h3>
                  <p className="text-sm text-ehb-textMuted">{item.desc}</p>
                </div>
                {["Join", "Share"].includes(item.step) && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center">
                    <span className="text-2xl text-emerald-500">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Affiliate Benefits</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🎯", title: "Easy to Join", desc: "No experience needed. Free account, instant approval." },
              { icon: "💰", title: "Unlimited Earnings", desc: "No cap on commission. Build your network infinitely." },
              { icon: "📊", title: "Real-Time Dashboard", desc: "Track referrals, earnings, and payouts instantly." },
              { icon: "🚀", title: "3 Income Streams", desc: "Order, franchise, and product commissions combined." },
              { icon: "🌍", title: "Global Reach", desc: "Earn from 32 industries and 50+ countries." },
              { icon: "💳", title: "Fast Payouts", desc: "Weekly payouts to your bank account or EHB wallet." },
            ].map((item) => (
              <div key={item.title} className="ehb-card-elevated p-4 text-center">
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <p className="font-semibold text-white mb-1">{item.title}</p>
                <p className="text-xs text-ehb-textMuted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sign Up Form */}
        <section className="max-w-2xl mx-auto space-y-6">
          <div className="ehb-card-elevated p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Start Earning Today</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSigningUp(true);
                setTimeout(() => {
                  alert("Welcome to EHB Affiliate! Check your email for next steps.");
                  setIsSigningUp(false);
                }, 1500);
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-white block mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Ahmed"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-ehb-textMuted focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white block mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Khan"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-ehb-textMuted focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-ehb-textMuted focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+92 3XX XXXXXXX"
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-ehb-textMuted focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">Country</label>
                <select required className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                  <option value="">Select a country</option>
                  <option value="pakistan">Pakistan</option>
                  <option value="uk">United Kingdom</option>
                  <option value="usa">United States</option>
                  <option value="uae">United Arab Emirates</option>
                  <option value="saudi">Saudi Arabia</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">How will you mainly share?</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {["Social Media", "Email List", "Friends & Family", "Website/Blog"].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="method" value={option} required className="w-4 h-4" />
                      <span className="text-sm text-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" required className="w-4 h-4 mt-1" />
                <label className="text-xs text-ehb-textMuted">
                  I agree to the EHB Affiliate Terms of Service and understand that referrals are personal network only.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  isSigningUp
                    ? "bg-white/20 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/50 active:scale-95"
                }`}
              >
                {isSigningUp ? "Creating Account..." : "Start Your Affiliate Journey"}
              </button>
            </form>

            <p className="text-xs text-ehb-textMuted text-center mt-6">
              Already an affiliate?{" "}
              <Link href="/affiliate" className="text-emerald-400 font-semibold hover:text-emerald-300">
                View your dashboard
              </Link>
            </p>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Quick Questions?</h2>

          <div className="space-y-3">
            {[
              { q: "Is there a sign-up fee?", a: "No, it's completely free. No hidden fees or charges." },
              { q: "When can I start earning?", a: "Immediately after your referral signs up and makes their first purchase." },
              { q: "Can I have multiple affiliate accounts?", a: "One account per person, but you can use multiple referral links." },
              { q: "What's the minimum payout?", a: "Minimum payout is $100. Payouts are processed weekly." },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="font-semibold text-white text-sm mb-1">{item.q}</p>
                <p className="text-xs text-ehb-textMuted">{item.a}</p>
              </div>
            ))}
          </div>

          <Link href="/affiliate" className="block text-center text-emerald-400 font-semibold hover:text-emerald-300 py-4">
            View full FAQ in your dashboard →
          </Link>
        </section>

        {/* Trust Section */}
        <section className="max-w-2xl mx-auto rounded-2xl border border-emerald-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-8 text-center">
          <p className="text-emerald-300 text-sm font-semibold mb-2">✓ TRUSTED BY 10,000+ AFFILIATES</p>
          <p className="text-white text-lg font-bold mb-4">EHB is built on trust, transparency, and fair commission structures.</p>
          <p className="text-ehb-textMuted text-sm">
            Our affiliate program is powered by blockchain verification (CRB), STL-based trust levels, and automated payouts. No disputes, no delays.
          </p>
        </section>
      </div>
    </main>
  );
}
