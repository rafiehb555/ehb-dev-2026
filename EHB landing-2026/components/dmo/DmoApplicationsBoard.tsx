"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";
import { getIndustryBySlug } from "@/lib/industry/config";

type ApplicationStatus = "New" | "In Review" | "Inspection" | "Approved" | "Rejected";

type DmoApplication = {
  id: string;
  entityType: "Provider" | "Clinic" | "Franchise";
  entityName: string;
  entityCode: string;
  industrySlug: string;
  serviceName: string;
  countryCode: string;
  stateCode: string;
  cityCode: string;
  status: ApplicationStatus;
  signals: string[];
  stlLevel: "FREE" | "BASIC" | "MEDIUM" | "HIGH" | "VIP";
  createdAt: string;
};

const STATUS_FLOW: Record<ApplicationStatus, ApplicationStatus[]> = {
  New: ["In Review", "Rejected"],
  "In Review": ["Inspection", "Rejected"],
  Inspection: ["Approved", "Rejected"],
  Approved: [],
  Rejected: [],
};

function statusPill(status: ApplicationStatus) {
  switch (status) {
    case "New":
      return { cls: "bg-cyan-500/15 border-cyan-500/30 text-cyan-200", label: "New" };
    case "In Review":
      return { cls: "bg-amber-500/15 border-amber-500/30 text-amber-200", label: "In Review" };
    case "Inspection":
      return { cls: "bg-sky-500/15 border-sky-500/30 text-sky-200", label: "Inspection" };
    case "Approved":
      return { cls: "bg-emerald-500/15 border-emerald-500/30 text-emerald-200", label: "Approved" };
    case "Rejected":
      return { cls: "bg-rose-500/15 border-rose-500/30 text-rose-200", label: "Rejected" };
  }
}

function stlPill(level: DmoApplication["stlLevel"]) {
  switch (level) {
    case "FREE":
      return { cls: "bg-slate-500/15 border-slate-500/30 text-slate-200", label: "FREE" };
    case "BASIC":
      return { cls: "bg-blue-500/15 border-blue-500/30 text-blue-200", label: "BASIC" };
    case "MEDIUM":
      return { cls: "bg-green-500/15 border-green-500/30 text-green-200", label: "MEDIUM" };
    case "HIGH":
      return { cls: "bg-amber-500/15 border-amber-500/30 text-amber-200", label: "HIGH" };
    case "VIP":
      return { cls: "bg-violet-500/15 border-violet-500/30 text-violet-200", label: "VIP" };
  }
}

export function DmoApplicationsBoard({
  initialCountryCode,
  initialStateCode,
  initialCityCode,
  initialIndustrySlug,
  createdId,
}: {
  initialCountryCode?: string;
  initialStateCode?: string;
  initialCityCode?: string;
  initialIndustrySlug?: string;
  createdId?: string;
}) {
  const [statusFilter, setStatusFilter] = useState<"All" | ApplicationStatus>("All");
  const [query, setQuery] = useState("");
  const [lastAction, setLastAction] = useState<string>("");

  const defaultCountry = initialCountryCode ?? "PK";
  const defaultState = initialStateCode ?? "punjab";
  const defaultCity = initialCityCode ?? "rawalpindi";
  const defaultIndustry = initialIndustrySlug ?? "it";

  const locationLabel = useMemo(() => {
    const c = getCountryByCode(defaultCountry);
    const s = getStateByCode(defaultCountry, defaultState);
    const city = getCityByCode(defaultCountry, defaultState, defaultCity);
    return city?.name || s?.name || c?.name || "";
  }, [defaultCountry, defaultState, defaultCity]);

  const accent = useMemo(() => {
    const c = getCountryByCode(defaultCountry);
    return c?.accent ?? "#00AEEF";
  }, [defaultCountry]);

  const baseApplications: DmoApplication[] = useMemo(
    () => [
      {
        id: "APP_7001",
        entityType: "Provider",
        entityName: "CleanMaster AI Provider",
        entityCode: "prov_cleanmaster",
        industrySlug: "it",
        serviceName: "Website Development",
        countryCode: "PK",
        stateCode: "punjab",
        cityCode: "rawalpindi",
        status: "New",
        signals: ["Duplicate doc checksum", "Recent location update"],
        stlLevel: "HIGH",
        createdAt: "2026-03-19 09:10",
      },
      {
        id: "APP_7002",
        entityType: "Clinic",
        entityName: "eGuard Home Security Clinic",
        entityCode: "clinic_eguard",
        industrySlug: "health",
        serviceName: "Clinic Visit",
        countryCode: "PK",
        stateCode: "punjab",
        cityCode: "lahore",
        status: "In Review",
        signals: ["Mismatch between submitted certificates and registry"],
        stlLevel: "MEDIUM",
        createdAt: "2026-03-19 08:48",
      },
      {
        id: "APP_7003",
        entityType: "Provider",
        entityName: "SpeakEase Pro Provider",
        entityCode: "prov_speakease",
        industrySlug: "it",
        serviceName: "Mobile App Development",
        countryCode: "PK",
        stateCode: "islamabad",
        cityCode: "islamabad",
        status: "Inspection",
        signals: ["On-site audit scheduled", "Audio sample verification pending"],
        stlLevel: "BASIC",
        createdAt: "2026-03-19 08:10",
      },
      {
        id: "APP_7004",
        entityType: "Franchise",
        entityName: "Rawalpindi Franchise Intake",
        entityCode: "frch_rawalpindi",
        industrySlug: "logistics",
        serviceName: "Same Day Delivery",
        countryCode: "PK",
        stateCode: "punjab",
        cityCode: "rawalpindi",
        status: "Approved",
        signals: ["STL threshold met", "Fraud risk low after checks"],
        stlLevel: "VIP",
        createdAt: "2026-03-18 21:35",
      },
      {
        id: "APP_7005",
        entityType: "Provider",
        entityName: "BrightSync Smart Light Listing",
        entityCode: "lst_brightsync",
        industrySlug: "ai",
        serviceName: "AI Chatbot Development",
        countryCode: "PK",
        stateCode: "sindh",
        cityCode: "karachi",
        status: "Rejected",
        signals: ["Abnormal listing cadence", "Media edit frequency high"],
        stlLevel: "FREE",
        createdAt: "2026-03-18 19:02",
      },
    ],
    []
  );

  const createdApplication: DmoApplication | null = useMemo(() => {
    if (!createdId) return null;
    const industry = getIndustryBySlug(defaultIndustry);
    const industryName = industry?.name ?? defaultIndustry;
    return {
      id: createdId,
      entityType: "Provider",
      entityName: "New service submission (demo)",
      entityCode: `prov_${createdId.toLowerCase()}`,
      industrySlug: defaultIndustry,
      serviceName: `${industryName} Service (demo draft)`,
      countryCode: defaultCountry,
      stateCode: defaultState,
      cityCode: defaultCity,
      status: "New",
      signals: ["Draft submitted by provider", "Awaiting DMO workflow"],
      stlLevel: "MEDIUM",
      createdAt: new Date().toLocaleString(),
    };
  }, [createdId, defaultCity, defaultCountry, defaultIndustry, defaultState]);

  const [apps, setApps] = useState<DmoApplication[]>(() => {
    const merged = createdApplication ? [createdApplication, ...baseApplications] : baseApplications;
    return merged;
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      const statusOk = statusFilter === "All" ? true : a.status === statusFilter;
      const locationOk =
        a.countryCode.toLowerCase() === defaultCountry.toLowerCase() &&
        a.stateCode.toLowerCase() === defaultState.toLowerCase() &&
        a.cityCode.toLowerCase() === defaultCity.toLowerCase();

      // Keep location filter strict to match "near you" experience in UI.
      if (!locationOk) return false;

      if (!q) return statusOk;
      const haystack = [
        a.id,
        a.entityName,
        a.entityCode,
        a.entityType,
        a.industrySlug,
        a.serviceName,
        a.signals.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return statusOk && haystack.includes(q);
    });
  }, [apps, defaultCity, defaultCountry, defaultIndustry, defaultState, query, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<ApplicationStatus, number> = {
      New: 0,
      "In Review": 0,
      Inspection: 0,
      Approved: 0,
      Rejected: 0,
    };
    for (const a of apps) {
      if (
        a.countryCode.toLowerCase() === defaultCountry.toLowerCase() &&
        a.stateCode.toLowerCase() === defaultState.toLowerCase() &&
        a.cityCode.toLowerCase() === defaultCity.toLowerCase()
      ) {
        c[a.status] += 1;
      }
    }
    return c;
  }, [apps, defaultCity, defaultCountry, defaultState]);

  const industry = getIndustryBySlug(defaultIndustry);

  const moveStatus = (id: string, to: ApplicationStatus) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: to } : a)));
    setLastAction(`Application ${id} moved to: ${to} (mock)`);
  };

  const canMove = (s: ApplicationStatus, to: ApplicationStatus) => STATUS_FLOW[s].includes(to);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div
          className="inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] text-slate-200 border border-white/10"
          style={{ borderColor: `${accent}55`, boxShadow: `0 0 28px ${accent}22` }}
        >
          <span aria-hidden>📍</span>
          <span>
            Location context: <span className="text-white font-semibold">{locationLabel}</span>
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-panel card-hover p-3 sm:p-3.5">
            <div className="text-[10px] xs:text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">Queue</div>
            <div className="text-base sm:text-lg font-semibold text-white">{filtered.length}</div>
            <div className="mt-0.5 text-[10px] xs:text-[11px] text-slate-400">Filtered by location + query</div>
          </div>
          <div className="glass-panel card-hover p-3 sm:p-3.5">
            <div className="text-[10px] xs:text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">New</div>
            <div className="text-base sm:text-lg font-semibold text-white">{counts.New}</div>
            <div className="mt-0.5 text-[10px] xs:text-[11px] text-slate-400">Awaiting first review</div>
          </div>
          <div className="glass-panel card-hover p-3 sm:p-3.5">
            <div className="text-[10px] xs:text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">In Review</div>
            <div className="text-base sm:text-lg font-semibold text-white">{counts["In Review"]}</div>
            <div className="mt-0.5 text-[10px] xs:text-[11px] text-slate-400">Officer verification</div>
          </div>
          <div className="glass-panel card-hover p-3 sm:p-3.5">
            <div className="text-[10px] xs:text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">Inspection</div>
            <div className="text-base sm:text-lg font-semibold text-white">{counts.Inspection}</div>
            <div className="mt-0.5 text-[10px] xs:text-[11px] text-slate-400">On-site / CRB demo</div>
          </div>
        </div>
      </section>

      <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">Applications & Approvals (Workflow Queue)</h2>
            <p className="text-[10px] text-slate-400">
              New → In Review → Inspection → Approved/Rejected. (Mock UI; transitions are local-only)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[10px] text-slate-400">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-slate-100 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Inspection">Inspection</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entity, id, signals..."
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none min-w-[260px]"
            />
          </div>
        </div>

        {lastAction ? (
          <div className="rounded-xl glass-panel border border-white/10 p-3 text-[10px] text-slate-300">
            {lastAction}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <div className="min-w-[920px] space-y-2">
            <div className="grid grid-cols-12 text-[10px] text-slate-400 px-2">
              <div className="col-span-2">App</div>
              <div className="col-span-3">Entity</div>
              <div className="col-span-2">Service</div>
              <div className="col-span-1">STL</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl glass-card border p-5 text-[11px] text-slate-400 text-center">
                No applications match your filter for this location.
              </div>
            ) : null}

            {filtered.map((a) => {
              const stl = stlPill(a.stlLevel);
              const sp = statusPill(a.status);
              const nextOptions = STATUS_FLOW[a.status];
              return (
                <div key={a.id} className="grid grid-cols-12 items-center rounded-2xl glass-card border p-3 card-hover">
                  <div className="col-span-2 min-w-0">
                    <div className="text-[11px] font-semibold text-white truncate">{a.id}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{a.createdAt}</div>
                  </div>

                  <div className="col-span-3 min-w-0">
                    <div className="text-[11px] font-semibold text-white truncate">{a.entityName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{a.entityType} · {a.entityCode}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{a.signals[0] ?? "—"}</div>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <div className="text-[11px] font-semibold text-white truncate">{a.serviceName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{getIndustryBySlug(a.industrySlug)?.name ?? a.industrySlug}</div>
                  </div>

                  <div className="col-span-1">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] border ${stl.cls}`}>
                      {stl.label}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] border ${sp.cls}`}>
                      {sp.label}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-2">
                    {nextOptions.includes("In Review") && a.status === "New" ? (
                      <button
                        type="button"
                        className="h-9 rounded-xl glass-panel border border-amber-500/30 bg-amber-500/15 px-3 text-[11px] text-amber-200 hover:bg-amber-500/20 transition-all"
                        onClick={() => moveStatus(a.id, "In Review")}
                      >
                        Review
                      </button>
                    ) : null}

                    {nextOptions.includes("Inspection") && a.status === "In Review" ? (
                      <button
                        type="button"
                        className="h-9 rounded-xl glass-panel border border-sky-500/30 bg-sky-500/15 px-3 text-[11px] text-sky-200 hover:bg-sky-500/20 transition-all"
                        onClick={() => moveStatus(a.id, "Inspection")}
                      >
                        Inspect
                      </button>
                    ) : null}

                    {nextOptions.includes("Approved") && a.status === "Inspection" ? (
                      <button
                        type="button"
                        className="h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 text-[11px] text-emerald-200 hover:bg-emerald-500/20 transition-all"
                        onClick={() => moveStatus(a.id, "Approved")}
                      >
                        Approve
                      </button>
                    ) : null}

                    {nextOptions.includes("Rejected") && (a.status === "New" || a.status === "In Review" || a.status === "Inspection") ? (
                      <button
                        type="button"
                        className="h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3 text-[11px] text-rose-200 hover:bg-rose-500/20 transition-all"
                        onClick={() => moveStatus(a.id, "Rejected")}
                      >
                        Reject
                      </button>
                    ) : null}

                    <button
                      type="button"
                      className="h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-[11px] text-slate-200 hover:bg-white/10 transition-all"
                      onClick={() => setLastAction(`Opened details for ${a.id} (mock)`)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 text-[10px] text-slate-400">
          Tip: To test full flow, go to <Link href="/dashboard/services/new" className="text-[#00eaff] hover:underline">Create new service</Link> and submit; it will open the queue with your draft marked as <span className="text-slate-200 font-semibold">New</span>.
        </div>
      </section>

      {industry ? (
        <section className="glass-panel card-hover p-4 space-y-2 border border-white/5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">DMO STL + Workflow Context</h3>
              <p className="text-[10px] text-slate-400">
                Industry context: <span className="text-slate-200 font-semibold">{industry.name}</span>. Approved items will later reflect STL trust badges and registry updates.
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

