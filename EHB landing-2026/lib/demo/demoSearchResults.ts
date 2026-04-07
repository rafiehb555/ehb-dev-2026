/** Matches `SearchResult` in app/api/search/route.ts (kept inline to avoid circular imports). */
export type DemoSearchRow = {
  kind: "SERVICE_PROVIDER" | "PRODUCT";
  id: string;
  title: string;
  subtitle: string;
  industry: { id: string; name: string; slug: string } | null;
  entityId: string;
  sellerUserId: string | null;
  stlScore: number | null;
  stlLevel: number | null;
  stlSource: "USER" | "PRODUCT" | null;
  rating: number | null;
  availability: boolean;
  location: { label: string | null; lat: number | null; lng: number | null };
  verifiedIndustries: Array<{ industryId: string; slug: string; name: string }>;
  distanceKm: number | null;
  rankScore: number;
  breakdown: {
    stl: number;
    distance: number;
    reviews: number;
    industries: number;
    availability: number;
  };
  labels: string[];
};

const indTech = { id: "demo-ind-tech", name: "Technology", slug: "technology" };
const indHealth = { id: "demo-ind-health", name: "Health", slug: "health" };

export const DEMO_SEARCH_RESULTS: DemoSearchRow[] = [
  {
    kind: "SERVICE_PROVIDER",
    id: "demo-ps-1",
    title: "Ali Khan",
    subtitle: "Certified electrician — home & solar",
    industry: indTech,
    entityId: "demo-ps-1",
    sellerUserId: "demo-user-1",
    stlScore: 78.4,
    stlLevel: 4,
    stlSource: "USER",
    rating: 4.7,
    availability: true,
    location: { label: "Lahore", lat: 31.52, lng: 74.35 },
    verifiedIndustries: [{ industryId: indTech.id, slug: indTech.slug, name: indTech.name }],
    distanceKm: 3.8,
    rankScore: 91.2,
    breakdown: { stl: 0.78, distance: 0.85, reviews: 0.94, industries: 0.45, availability: 1 },
    labels: ["Demo", "Top Verified"],
  },
  {
    kind: "SERVICE_PROVIDER",
    id: "demo-ps-2",
    title: "Sara Malik",
    subtitle: "Telehealth consultation — general practice",
    industry: indHealth,
    entityId: "demo-ps-2",
    sellerUserId: "demo-user-2",
    stlScore: 85.0,
    stlLevel: 4,
    stlSource: "USER",
    rating: 4.9,
    availability: true,
    location: { label: "Karachi", lat: 24.86, lng: 67.0 },
    verifiedIndustries: [{ industryId: indHealth.id, slug: indHealth.slug, name: indHealth.name }],
    distanceKm: null,
    rankScore: 89.5,
    breakdown: { stl: 0.85, distance: 0.5, reviews: 0.98, industries: 0.5, availability: 1 },
    labels: ["Demo", "Multi‑Industry Verified"],
  },
  {
    kind: "PRODUCT",
    id: "demo-pr-1",
    title: "CleanMaster AI Toolkit",
    subtitle: "Seller: Demo Electronics",
    industry: indTech,
    entityId: "demo-pr-1",
    sellerUserId: "demo-seller-1",
    stlScore: 82.0,
    stlLevel: 4,
    stlSource: "PRODUCT",
    rating: 4.8,
    availability: true,
    location: { label: null, lat: null, lng: null },
    verifiedIndustries: [{ industryId: indTech.id, slug: indTech.slug, name: indTech.name }],
    distanceKm: null,
    rankScore: 87.0,
    breakdown: { stl: 0.82, distance: 0.5, reviews: 0.96, industries: 0.45, availability: 1 },
    labels: ["Demo", "In Stock"],
  },
];
