export type StateCode = "punjab" | "sindh" | "islamabad" | "dubai";
export type CityCode = "rawalpindi" | "lahore" | "karachi" | "islamabad" | "dubai";

export type LocationCity = { code: CityCode; name: string };
export type LocationState = { code: StateCode; name: string; cities: LocationCity[] };
export type LocationCountry = { code: string; name: string; accent: string; states: LocationState[] };

export const COUNTRIES: LocationCountry[] = [
  {
    code: "PK",
    name: "Pakistan",
    accent: "#22C55E",
    states: [
      {
        code: "punjab",
        name: "Punjab",
        cities: [
          { code: "lahore", name: "Lahore" },
          { code: "rawalpindi", name: "Rawalpindi" },
        ],
      },
      {
        code: "sindh",
        name: "Sindh",
        cities: [{ code: "karachi", name: "Karachi" }],
      },
      {
        code: "islamabad",
        name: "Islamabad Capital Territory",
        cities: [{ code: "islamabad", name: "Islamabad" }],
      },
    ],
  },
  {
    code: "UAE",
    name: "United Arab Emirates",
    accent: "#00AEEF",
    states: [
      {
        code: "dubai",
        name: "Dubai",
        cities: [{ code: "dubai", name: "Dubai" }],
      },
    ],
  },
];

export function getCountryByCode(countryCode: string): LocationCountry | undefined {
  return COUNTRIES.find((c) => c.code === countryCode);
}

export function getStateByCode(countryCode: string, stateCode: string): LocationState | undefined {
  return getCountryByCode(countryCode)?.states.find((s) => s.code === stateCode);
}

export function getCityByCode(countryCode: string, stateCode: string, cityCode: string): LocationCity | undefined {
  return getStateByCode(countryCode, stateCode)?.cities.find((c) => c.code === cityCode);
}

