import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Apple,
  BicepsFlexed,
  Brain,
  CalendarHeart,
  CircleDot,
  Compass,
  Droplets,
  Drumstick,
  FireExtinguisher,
  Flame,
  HeartPulse,
  Infinity as InfinityIcon,
  Leaf,
  Moon,
  Pill,
  Shield,
  ShieldCheck,
  Sparkles,
  Sprout,
  Stethoscope,
  Sun,
  Target,
  Thermometer,
  TrendingDown,
  Trees,
  User,
  UserRound,
  Users,
  UtensilsCrossed,
  Waves,
  Zap,
} from "lucide-react";

/** Accent color classes per biomarker category — used for dots, borders, badges. */
export const CATEGORY_STYLE: Record<
  string,
  { bg: string; text: string; dot: string; accent: string }
> = {
  Vitamine: {
    bg: "bg-brand-amber/10",
    text: "text-brand-amber",
    dot: "bg-brand-amber",
    accent: "#C4964A",
  },
  Mineralstoffe: {
    bg: "bg-sage/15",
    text: "text-sage",
    dot: "bg-sage",
    accent: "#8FA68E",
  },
  Fettstoffwechsel: {
    bg: "bg-coral/10",
    text: "text-coral",
    dot: "bg-coral",
    accent: "#D4736B",
  },
  Zuckerstoffwechsel: {
    bg: "bg-brand-amber/10",
    text: "text-brand-amber",
    dot: "bg-brand-amber",
    accent: "#C4964A",
  },
  Schilddrüse: {
    bg: "bg-moss/10",
    text: "text-moss",
    dot: "bg-moss",
    accent: "#2F3E32",
  },
  "Leber & Niere": {
    bg: "bg-sage/15",
    text: "text-sage",
    dot: "bg-sage",
    accent: "#8FA68E",
  },
  Entzündung: {
    bg: "bg-coral/10",
    text: "text-coral",
    dot: "bg-coral",
    accent: "#D4736B",
  },
  Hormone: {
    bg: "bg-coral/10",
    text: "text-coral",
    dot: "bg-coral",
    accent: "#D4736B",
  },
  Blutbild: {
    bg: "bg-coral/10",
    text: "text-coral",
    dot: "bg-coral",
    accent: "#D4736B",
  },
  Sonstige: {
    bg: "bg-mist/15",
    text: "text-mist",
    dot: "bg-mist",
    accent: "#7E8886",
  },
};

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  Vitamine: Sun,
  Mineralstoffe: Sprout,
  Fettstoffwechsel: Droplets,
  Zuckerstoffwechsel: Apple,
  Schilddrüse: Thermometer,
  "Leber & Niere": FireExtinguisher,
  Entzündung: Flame,
  Hormone: HeartPulse,
  Blutbild: Droplets,
  Sonstige: CircleDot,
};

export type GoalMeta = {
  label: string;
  icon: LucideIcon;
  hint: string;
  /** Tailwind accent — used for the icon chip in selected state. */
  accent: "moss" | "sage" | "brand-amber" | "coral";
};

export const GOAL_META: GoalMeta[] = [
  { label: "Schlaf", icon: Moon, hint: "Tiefer, erholsamer Schlaf", accent: "moss" },
  { label: "Energie", icon: Zap, hint: "Mehr Wachheit im Alltag", accent: "brand-amber" },
  { label: "Muskelaufbau", icon: BicepsFlexed, hint: "Kraft & Muskelmasse", accent: "coral" },
  { label: "Ausdauer", icon: Activity, hint: "Cardio & Kondition", accent: "sage" },
  { label: "Abnehmen", icon: TrendingDown, hint: "Gewicht reduzieren", accent: "brand-amber" },
  { label: "Stressabbau", icon: Leaf, hint: "Mentale Ruhe", accent: "sage" },
  { label: "Fokus", icon: Target, hint: "Kognitive Leistung", accent: "moss" },
  { label: "Hautbild", icon: Sparkles, hint: "Strahlende Haut", accent: "brand-amber" },
  { label: "Hormonbalance", icon: Waves, hint: "Hormon-Regulation", accent: "coral" },
  { label: "Longevity", icon: InfinityIcon, hint: "Gesunde Lebensspanne", accent: "moss" },
  { label: "Immunsystem", icon: Shield, hint: "Abwehrkräfte", accent: "sage" },
  { label: "Verdauung", icon: Sprout, hint: "Darmgesundheit", accent: "sage" },
  { label: "Libido", icon: Flame, hint: "Lust & Vitalität", accent: "coral" },
];

export function goalIconFor(label: string): LucideIcon {
  return GOAL_META.find((g) => g.label === label)?.icon ?? CircleDot;
}

export function goalAccentFor(label: string): GoalMeta["accent"] {
  return GOAL_META.find((g) => g.label === label)?.accent ?? "moss";
}

/** Lifestyle block header icons + labels (A–E). */
export const BLOCK_META = [
  { icon: UtensilsCrossed, label: "Ernährung", accent: "brand-amber" },
  { icon: Droplets, label: "Flüssigkeit", accent: "sage" },
  { icon: Moon, label: "Schlaf", accent: "moss" },
  { icon: Activity, label: "Bewegung", accent: "coral" },
  { icon: Compass, label: "Mental", accent: "sage" },
] as const;

/** Map the Sex enum to a card meta. */
export const SEX_META = [
  { value: "male" as const, label: "Mann", icon: User, accent: "sage" },
  { value: "female" as const, label: "Frau", icon: UserRound, accent: "coral" },
  { value: "diverse" as const, label: "Divers", icon: Users, accent: "moss" },
];

/** Handy extras. */
export {
  Activity,
  CalendarHeart,
  Pill,
  ShieldCheck,
  Stethoscope,
  Brain,
  Drumstick,
  Trees,
};
