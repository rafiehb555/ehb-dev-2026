"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

type MeUser = { id: string; email: string; name: string; role: string; createdAt?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo-seller@ehb.local");
  const [password, setPassword] = useState("EhbDemo2026!");
  const [showPassword, setShowPassword] = useState(false);
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
    if (mode === "register" && name.trim().length < 2) {
      next.name = "Name must be at least 2 characters.";
    }
    if (!em) {
      next.email = "Email is required.";
    } else if (!EMAIL_RE.test(em)) {
      next.email = "Enter a valid email address.";
    }
    if (mode === "register") {
      if (password.length < 8) next.password = "Password must be at least 8 characters.";
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
          : { name: name.trim() || "Demo User", email: email.trim(), password, role: "USER" };
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

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-10 grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7 rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-[#0a1628] via-[#0d1017] to-[#051a24] p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">Access</p>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold gradient-text">Auth Control Center</h1>
          <p className="mt-2 text-sm text-ehb-textBody leading-relaxed">
            Login/register yahan se karein. Is se `profile`, `dashboard`, aur STL me endpoint test karna easy ho jata hai.
          </p>

          <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setFieldErrors({});
                setErr(null);
              }}
              className={`rounded-full px-4 py-1.5 text-xs ${mode === "login" ? "bg-cyan-400 text-slate-950 font-semibold" : "text-ehb-textBody"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setFieldErrors({});
                setErr(null);
              }}
              className={`rounded-full px-4 py-1.5 text-xs ${mode === "register" ? "bg-cyan-400 text-slate-950 font-semibold" : "text-ehb-textBody"}`}
            >
              Register
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {mode === "register" ? (
              <div>
                <input
                  className={`w-full rounded-xl border bg-white/5 px-3 py-2 text-sm ${fieldErrors.name ? "border-rose-400/50" : "border-white/15"}`}
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((f) => {
                      const { name: _, ...rest } = f;
                      return rest;
                    });
                  }}
                  aria-invalid={Boolean(fieldErrors.name)}
                  autoComplete="name"
                />
                {fieldErrors.name ? <p className="mt-1 text-[11px] text-rose-200">{fieldErrors.name}</p> : null}
              </div>
            ) : null}
            <div>
              <input
                className={`w-full rounded-xl border bg-white/5 px-3 py-2 text-sm ${fieldErrors.email ? "border-rose-400/50" : "border-white/15"}`}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((f) => {
                    const { email: _, ...rest } = f;
                    return rest;
                  });
                }}
                aria-invalid={Boolean(fieldErrors.email)}
                autoComplete="email"
              />
              {fieldErrors.email ? <p className="mt-1 text-[11px] text-rose-200">{fieldErrors.email}</p> : null}
            </div>
            <div>
              <div className="relative">
                <input
                  className={`w-full rounded-xl border bg-white/5 py-2 pl-3 pr-11 text-sm ${fieldErrors.password ? "border-rose-400/50" : "border-white/15"}`}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((f) => {
                      const { password: _, ...rest } = f;
                      return rest;
                    });
                  }}
                  aria-invalid={Boolean(fieldErrors.password)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ehb-textMuted hover:bg-white/10 hover:text-white"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password ? <p className="mt-1 text-[11px] text-rose-200">{fieldErrors.password}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={submit}
                disabled={loading || cooldownSec > 0}
                className="rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 px-5 py-2 text-sm font-semibold text-slate-950"
              >
                {cooldownSec > 0
                  ? `Retry in ${cooldownSec}s`
                  : loading
                    ? "Please wait..."
                    : mode === "login"
                      ? "Sign In"
                      : "Create Account"}
              </button>
              <button
                type="button"
                onClick={() => void loadMe()}
                disabled={loading || meLoading}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-ehb-textBody"
              >
                {meLoading ? "Checking..." : "Check Session"}
              </button>
              <button
                type="button"
                onClick={logout}
                disabled={loading}
                className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-100"
              >
                Logout
              </button>
            </div>
          </div>

          {msg ? <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">{msg}</div> : null}
          {err ? (
            <div
              data-testid="auth-error"
              className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100"
            >
              {err}
            </div>
          ) : null}
          {cooldownSec > 0 ? (
            <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-100">
              Too many attempts. Please wait {cooldownSec}s before trying again.
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/25">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-[width] duration-1000 ease-linear"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, cooldownTotalSec > 0 ? (cooldownSec / cooldownTotalSec) * 100 : 0)
                    )}%`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="lg:col-span-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Current Session</h2>
          {meLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 w-40 rounded bg-white/10" />
              <div className="h-4 w-52 rounded bg-white/10" />
              <div className="h-4 w-28 rounded bg-white/10" />
            </div>
          ) : me ? (
            <div className="space-y-2 text-sm text-ehb-textBody">
              <div><span className="text-white">Name:</span> {me.name}</div>
              <div><span className="text-white">Email:</span> {me.email}</div>
              <div><span className="text-white">Role:</span> {me.role}</div>
            </div>
          ) : (
            <div className="text-sm text-ehb-textMuted">No active session yet.</div>
          )}

          <div className="pt-2 space-y-2">
            <Link href="/profile" className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              Open profile
            </Link>
            <Link href="/dashboard" className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              Open dashboard
            </Link>
            <Link href="/local-demo" className="block rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/20">
              Local demo guide
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

