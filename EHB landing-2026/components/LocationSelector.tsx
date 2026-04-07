"use client";

import { useEffect, useMemo } from "react";
import type { CityCode, StateCode } from "@/lib/locations";
import { COUNTRIES, getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

type LocationValue = {
  countryCode: string;
  stateCode: StateCode | string;
  cityCode: CityCode | string;
};

export function LocationSelector({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
}) {
  const country = useMemo(() => getCountryByCode(value.countryCode) ?? COUNTRIES[0], [value.countryCode]);
  const states = country?.states ?? [];

  const state = useMemo(() => getStateByCode(value.countryCode, String(value.stateCode)) ?? states[0], [
    value.countryCode,
    value.stateCode,
    states,
  ]);
  const cities = state?.cities ?? [];

  const city = useMemo(
    () => getCityByCode(value.countryCode, String(value.stateCode), String(value.cityCode)) ?? cities[0],
    [value.countryCode, value.stateCode, value.cityCode, cities]
  );

  useEffect(() => {
    // keep state/city valid when country changes
    if (!country) return;
    const nextState = state?.code ?? states[0]?.code;
    const nextCity = city?.code ?? cities[0]?.code;
    if (!nextState || !nextCity) return;

    const needsUpdate =
      String(value.stateCode) !== String(nextState) || String(value.cityCode) !== String(nextCity);
    if (needsUpdate) {
      onChange({
        countryCode: country.code,
        stateCode: nextState,
        cityCode: nextCity,
      });
    }
  }, [country, state, city, onChange, states, cities, value.cityCode, value.stateCode]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Country</span>
          <select
            value={value.countryCode}
            onChange={(e) => {
              const nextCountryCode = e.target.value;
              const nextCountry = getCountryByCode(nextCountryCode) ?? COUNTRIES[0];
              const nextState = nextCountry?.states?.[0]?.code ?? "";
              const nextCity = nextCountry?.states?.[0]?.cities?.[0]?.code ?? "";
              onChange({
                countryCode: nextCountry.code,
                stateCode: nextState,
                cityCode: nextCity,
              });
            }}
            className="w-full rounded-xl bg-transparent border border-white/10 px-3 py-2 text-sm text-white outline-none"
            aria-label="Select country"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">State</span>
          <select
            value={String(value.stateCode)}
            onChange={(e) => {
              const nextStateCode = e.target.value;
              const nextState = getStateByCode(value.countryCode, nextStateCode);
              const nextCity = nextState?.cities?.[0]?.code ?? "";
              onChange({
                countryCode: value.countryCode,
                stateCode: nextStateCode,
                cityCode: nextCity,
              });
            }}
            className="w-full rounded-xl bg-transparent border border-white/10 px-3 py-2 text-sm text-white outline-none"
            aria-label="Select state"
          >
            {states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">City</span>
          <select
            value={String(value.cityCode)}
            onChange={(e) => {
              const nextCityCode = e.target.value;
              onChange({
                countryCode: value.countryCode,
                stateCode: value.stateCode,
                cityCode: nextCityCode,
              });
            }}
            className="w-full rounded-xl bg-transparent border border-white/10 px-3 py-2 text-sm text-white outline-none"
            aria-label="Select city"
          >
            {cities.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Selected location</p>
        <p className="text-sm text-slate-200 mt-2 leading-relaxed">
          {country?.name} · {state?.name} · <span className="text-white font-semibold">{city?.name}</span>
        </p>
      </div>
    </div>
  );
}

