"use client";

import {
  GraduationCap,
  Heart,
  HeartPulse,
  Scale,
  Code2,
  Brain,
  Link,
  Landmark,
  ShieldCheck,
  Building2,
  HardHat,
  Car,
  Sprout,
  Factory,
  Truck,
  Plane,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  Film,
  Gamepad2,
  Megaphone,
  Briefcase,
  Users,
  Laptop,
  Shield,
  Radio,
  Zap,
  Leaf,
  FlaskConical,
  ShoppingCart,
  HeartHandshake,
  Building,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap,
  Heart,
  HeartPulse,
  Scale,
  Code2,
  Brain,
  Link,
  Landmark,
  ShieldCheck,
  Building2,
  HardHat,
  Car,
  Sprout,
  Factory,
  Truck,
  Plane,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  Film,
  Gamepad2,
  Megaphone,
  Briefcase,
  Users,
  Laptop,
  Shield,
  Radio,
  Zap,
  Leaf,
  FlaskConical,
  ShoppingCart,
  HeartHandshake,
  Building,
  TrendingUp,
};

interface IndustryIconProps {
  name: string;
  accentColor: string;
  size?: number;
  className?: string;
}

export function IndustryIcon({ name, accentColor, size = 24, className = "" }: IndustryIconProps) {
  const Icon = ICON_MAP[name] ?? Building;
  return (
    <Icon
      className={className}
      style={{ color: accentColor, width: size, height: size, flexShrink: 0 }}
      aria-hidden
    />
  );
}
