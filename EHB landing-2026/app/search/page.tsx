"use client";

import { useEffect, useMemo, useState } from "react";

type Industry = { id: string; name: string; slug: string };
type Result = {
  kind: "SERVICE_PROVIDER" | "PRODUCT";
  id: string;
  title: string;
  subtitle: string;
  industry: Industry | null;
  sellerUserId: string | null;
  stlScore: number | null;
  stlLevel: number | null;
  rating: number | null;
  availability: boolean;
  verifiedIndustries: Array<{ industryId: string; slug: string; name: string }>;
  distanceKm: number | null;
  rankScore: number;
  labels: string[];
};

type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: { message: string } };
type SearchSuggestResponse = {
  suggestions: Array<{ type: "service"; id: string; label: string }>;
  detectedIndustry: string | null;
  related: string[];
};

function Badge(props: { tone?: "cyan" | "emerald" | "amber" | "rose" | "slate" | "violet"; children: React.ReactNode }) {
  const tone = props.tone ?? "slate";
  const styles =
    tone === "cyan"
      ? "border-[#00eaff]/40 text-[#00eaff]"
      : tone === "emerald"
        ? "border-emerald-400/40 text-emerald-300"
        : tone === "rose"
          ? "border-rose-400/40 text-rose-200"
          : tone === "amber"
            ? "border-amber-400/40 text-amber-200"
            : tone === "violet"
              ? "border-violet-400/40 text-violet-200"
              : "border-white/15 text-slate-200";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full glass-panel border px-2.5 py-1 text-[10px] font-semibold ${styles}`}>
      {props.children}
    </span>
  );
}

export default function SearchPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"ALL" | "SERVICES" | "PRODUCTS">("ALL");
  const [industry, setIndustry] = useState<string>(""); // slug
  const [verifiedIndustry, setVerifiedIndustry] = useState<string>(""); // slug
  const [location, setLocation] = useState("");
  const [useGeo, setUseGeo] = useState(false);
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [minStlLevel, setMinStlLevel] = useState(0);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<Result[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestResponse | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    p.set("type", type);
    if (industry) p.set("industry", industry);
    if (verifiedIndustry) p.set("verifiedIndustry", verifiedIndustry);
    if (location.trim()) p.set("location", location.trim());
    if (useGeo && geo) {
      p.set("lat", String(geo.lat));
      p.set("lng", String(geo.lng));
      p.set("radiusKm", String(radiusKm));
    }
    if (minRating > 0) p.set("minRating", String(minRating));
    if (minStlLevel > 0) p.set("minStlLevel", String(minStlLevel));
    p.set("take", "24");
    p.set("skip", "0");
    return p.toString();
  }, [q, type, industry, verifiedIndustry, location, useGeo, geo, radiusKm, minRating, minStlLevel]);

  async function loadIndustries() {
    const res = await fetch("/api/industries?take=200&skip=0", { cache: "no-store" });
    const json = (await res.json()) as ApiOk<{ items: Industry[] }> | ApiErr;
    if (!res.ok || json.ok === false) return;
    setIndustries(json.data.items);
  }

  async function captureGeo() {
    setErr(null);
    if (!navigator.geolocation) {
      setErr("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (e) => setErr(e.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function search() {
    setLoading(true);
    setErr(null);
    try {
      await fetch("/api/events/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "SEARCH",
          metadata: { query: q.trim(), industry, verifiedIndustry, location },
        }),
      }).catch(() => {});

      const res = await fetch(`/api/search?${qs}`, { cache: "no-store" });
      const json = (await res.json()) as ApiOk<{ items: Result[] }> | ApiErr;
      if (!res.ok || json.ok === false) throw new Error((json as any)?.error?.message ?? "Search failed");
      setItems(json.data.items);
    } catch (e: any) {
      setErr(e?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadIndustries();
  }, []);

  useEffect(() => {
    void search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    const value = q.trim();
    if (value.length < 2) {
      setSuggestions(null);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(value)}`, { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && json.success) {
          setSuggestions(json.data as SearchSuggestResponse);
        }
      } catch {
        if (!cancelled) setSuggestions(null);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [q]);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">AI Marketplace Search</h1>
          <p className="text-slate-400 text-sm">
            Ranked by STL (40%), Distance (20%), Reviews (15%), Industry Verification (15%), Availability (10%).
          </p>
        </div>

        <section className="glass-panel p-4 space-y-3">
          {err ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{err}</div> : null}

          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="text-xs text-slate-300 mb-1">Search</div>
              <input
                className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Keyword, service, seller..."
              />
              {suggestions && (suggestions.suggestions.length > 0 || suggestions.related.length > 0 || suggestions.detectedIndustry) ? (
                <div className="mt-2 rounded-2xl border border-white/10 bg-slate-950/40 p-3 space-y-2">
                  {suggestions.detectedIndustry ? (
                    <div className="text-[11px] text-cyan-300">
                      Detected industry: <span className="font-semibold">{suggestions.detectedIndustry}</span>
                    </div>
                  ) : null}
                  {suggestions.suggestions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {suggestions.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => setQ(suggestion.label)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {suggestions.related.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {suggestions.related.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQ(term)}
                          className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-500/20"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="lg:col-span-2">
              <div className="text-xs text-slate-300 mb-1">Type</div>
              <select
                className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="ALL">All</option>
                <option value="SERVICES">Services</option>
                <option value="PRODUCTS">Products</option>
              </select>
            </div>
            <div className="lg:col-span-3">
              <div className="text-xs text-slate-300 mb-1">Industry</div>
              <select
                className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Any</option>
                {industries.map((i) => (
                  <option key={i.id} value={i.slug}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <div className="text-xs text-slate-300 mb-1">Min STL</div>
              <select
                className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                value={String(minStlLevel)}
                onChange={(e) => setMinStlLevel(Number(e.target.value))}
              >
                <option value="0">Any</option>
                <option value="2">L2+</option>
                <option value="3">L3+</option>
                <option value="4">L4+</option>
                <option value="5">L5</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="text-xs text-slate-300 mb-1">Verified Industry</div>
              <select
                className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                value={verifiedIndustry}
                onChange={(e) => setVerifiedIndustry(e.target.value)}
              >
                <option value="">Any</option>
                {industries.map((i) => (
                  <option key={i.id} value={i.slug}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-3">
              <div className="text-xs text-slate-300 mb-1">Location (text)</div>
              <input
                className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Lahore, Karachi..."
              />
            </div>
            <div className="lg:col-span-2">
              <div className="text-xs text-slate-300 mb-1">Min rating</div>
              <select
                className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                value={String(minRating)}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value="0">Any</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <div className="text-xs text-slate-300 mb-1">Distance</div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-200">
                  <input type="checkbox" checked={useGeo} onChange={(e) => setUseGeo(e.target.checked)} />
                  Use GPS
                </label>
                <button
                  type="button"
                  className="text-xs rounded-full glass-panel px-3 py-1 hover:shadow-neon-blue transition-all"
                  onClick={captureGeo}
                  disabled={!useGeo}
                >
                  Capture
                </button>
              </div>
              <input
                className="mt-2 w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                value={String(radiusKm)}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                disabled={!useGeo}
                placeholder="radius km"
              />
            </div>
            <div className="lg:col-span-2 flex items-end">
              <button
                className="w-full rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-4 py-2 text-sm font-semibold text-slate-950 btn-glow"
                onClick={search}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Best Matches</h2>
            <div className="text-[11px] text-slate-400">{items.length} results</div>
          </div>

          {items.length === 0 && !loading ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-6 text-sm text-slate-300">
              No results. Try removing filters or expanding radius.
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <div key={r.id} className="rounded-2xl glass-card card-interactive p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white leading-tight">{r.title}</div>
                    <div className="text-[12px] text-slate-300">{r.subtitle}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {r.industry ? r.industry.name : "—"} {r.kind === "PRODUCT" ? "· Product" : "· Service"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Rank</div>
                    <div className="text-lg font-semibold text-cyan-200">{r.rankScore.toFixed(1)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge tone="violet">STL {r.stlScore ?? "—"}</Badge>
                  {r.rating !== null ? <Badge tone="amber">★ {r.rating.toFixed(1)}</Badge> : <Badge tone="slate">No rating</Badge>}
                  {r.distanceKm !== null ? <Badge tone="cyan">{r.distanceKm.toFixed(1)} km</Badge> : <Badge tone="slate">Distance n/a</Badge>}
                  {r.availability ? <Badge tone="emerald">Available</Badge> : <Badge tone="rose">Limited</Badge>}
                </div>

                {r.verifiedIndustries.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {r.verifiedIndustries.slice(0, 4).map((b) => (
                      <Badge key={b.industryId} tone="emerald">
                        {b.slug} ✔
                      </Badge>
                    ))}
                    {r.verifiedIndustries.length > 4 ? <Badge tone="slate">+{r.verifiedIndustries.length - 4}</Badge> : null}
                  </div>
                ) : (
                  <div className="text-[12px] text-slate-400">No verified industries yet.</div>
                )}

                {r.labels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {r.labels.map((l) => (
                      <Badge key={l} tone="cyan">
                        {l}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    void fetch("/api/events/track", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        eventType: "CLICK",
                        entityId: r.id,
                        entityType: r.kind,
                        metadata: { query: q.trim(), industry: r.industry?.slug ?? null },
                      }),
                    });
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                >
                  Track interest
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

