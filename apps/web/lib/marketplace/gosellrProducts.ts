export type GosellrProduct = {
  id: string;
  name: string;
  priceUsd: number;
  badge: string;
  tier: string;
  rating: number;
  image: string;
  category: string;
  short: string;
  /** Money back guarantee days — null means not offered */
  moneyBackDays?: number | null;
  /** Replacement window days — null means not offered */
  replacementDays?: number | null;
  /** Seller PSS level (1-10) */
  sellerPss?: number | null;
  /** Seller CRB level (1-10), null if N/A (e.g. digital content) */
  sellerCrb?: number | null;
  /** Seller DMO level (1-10) */
  sellerDmo?: number | null;
  /** Seller STL level (1-10) */
  sellerStl?: number;
  /** Seller trust score (0-100) */
  sellerScore?: number;
  /** Seller rule number e.g. "EHB-3847" */
  sellerRule?: string;
  /** Seller refilling count */
  sellerRefills?: number;
  /** Seller exam info e.g. "5x A+" */
  sellerExam?: string;
};

export const GOSELLR_PRODUCTS: GosellrProduct[] = [
  {
    id: "cleanmaster-ai",
    name: "CleanMaster AI",
    priceUsd: 0.99,
    badge: "VIC",
    tier: "VIP",
    rating: 5,
    image: "/images/ai-market/cleanmaster-ai.png",
    category: "AI & Automation",
    short: "Verified AI tool bundle for daily clean-up workflows.",
    moneyBackDays: 30,
    replacementDays: null,
    sellerPss: 8,
    sellerCrb: 7,
    sellerDmo: 6,
    sellerStl: 7,
    sellerScore: 88,
    sellerRule: "EHB-1042",
    sellerRefills: 2,
    sellerExam: "4x A",
  },
  {
    id: "speakease-pro",
    name: "SpeakEase Pro",
    priceUsd: 5.59,
    badge: "COM",
    tier: "PRO",
    rating: 5,
    image: "/images/ai-market/speakease-pro.png",
    category: "Communication",
    short: "Smart voice practice with trusted onboarding steps.",
    moneyBackDays: 14,
    replacementDays: 7,
    sellerPss: 7,
    sellerCrb: 6,
    sellerDmo: 7,
    sellerStl: 6,
    sellerScore: 79,
    sellerRule: "EHB-2198",
    sellerRefills: 1,
    sellerExam: "3x A+",
  },
  {
    id: "eguard-home-security",
    name: "eGuard Home Security",
    priceUsd: 5.99,
    badge: "HOME",
    tier: "Secure",
    rating: 4,
    image: "/images/ai-market/eguard-home-security.png",
    category: "Security",
    short: "Home security essentials with verified setup guidance.",
    moneyBackDays: 7,
    replacementDays: 15,
    sellerPss: 5,
    sellerCrb: 3,
    sellerDmo: 4,
    sellerStl: 4,
    sellerScore: 58,
    sellerRule: "EHB-4521",
    sellerRefills: 3,
    sellerExam: "2x B+",
  },
  {
    id: "quantumforge-laptop",
    name: "QuantumForge Laptop",
    priceUsd: 899,
    badge: "VIE",
    tier: "Creator",
    rating: 5,
    image: "/images/ai-market/quantumforge-laptop.png",
    category: "Devices",
    short: "Optimized laptop experience for EHB AI terminals.",
    moneyBackDays: 30,
    replacementDays: 30,
    sellerPss: 9,
    sellerCrb: 8,
    sellerDmo: 8,
    sellerStl: 8,
    sellerScore: 96,
    sellerRule: "EHB-0087",
    sellerRefills: 0,
    sellerExam: "5x A+",
  },
  {
    id: "brightsync-smart-light",
    name: "BrightSync Smart Light",
    priceUsd: 0,
    badge: "IOT",
    tier: "Starter",
    rating: 4,
    image: "/images/ai-market/brightsync-smart-light.png",
    category: "IoT",
    short: "Verified smart lighting with safe setup steps.",
    moneyBackDays: null,
    replacementDays: null,
    sellerPss: 2,
    sellerCrb: null,
    sellerDmo: 2,
    sellerStl: 2,
    sellerScore: 25,
    sellerRule: "EHB-8834",
    sellerRefills: 0,
    sellerExam: "1x C",
  },
];

export function getGosellrProductById(id: string): GosellrProduct | undefined {
  return GOSELLR_PRODUCTS.find((product) => product.id === id);
}
