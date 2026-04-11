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
  },
];

export function getGosellrProductById(id: string): GosellrProduct | undefined {
  return GOSELLR_PRODUCTS.find((product) => product.id === id);
}
