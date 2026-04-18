import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Apple,
  BicepsFlexed,
  CircleDot,
  Compass,
  Droplets,
  FireExtinguisher,
  Flame,
  HeartPulse,
  Infinity as InfinityIcon,
  Leaf,
  Moon,
  Shield,
  Sparkles,
  Sprout,
  Sun,
  Target,
  Thermometer,
  TrendingDown,
  UtensilsCrossed,
  Waves,
  Zap,
} from "lucide-react";

/** Icon per Biomarker-Kategorie — gerendert in lime auf graphite-Chips. */
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
};

export const GOAL_META: GoalMeta[] = [
  { label: "Schlaf", icon: Moon, hint: "Tiefer, erholsamer Schlaf" },
  { label: "Energie", icon: Zap, hint: "Mehr Wachheit im Alltag" },
  { label: "Muskelaufbau", icon: BicepsFlexed, hint: "Kraft & Muskelmasse" },
  { label: "Ausdauer", icon: Activity, hint: "Cardio & Kondition" },
  { label: "Abnehmen", icon: TrendingDown, hint: "Gewicht reduzieren" },
  { label: "Stressabbau", icon: Leaf, hint: "Mentale Ruhe" },
  { label: "Fokus", icon: Target, hint: "Kognitive Leistung" },
  { label: "Hautbild", icon: Sparkles, hint: "Strahlende Haut" },
  { label: "Hormonbalance", icon: Waves, hint: "Hormon-Regulation" },
  { label: "Longevity", icon: InfinityIcon, hint: "Gesunde Lebensspanne" },
  { label: "Immunsystem", icon: Shield, hint: "Abwehrkräfte" },
  { label: "Verdauung", icon: Sprout, hint: "Darmgesundheit" },
  { label: "Libido", icon: Flame, hint: "Lust & Vitalität" },
];

export function goalIconFor(label: string): LucideIcon {
  return GOAL_META.find((g) => g.label === label)?.icon ?? CircleDot;
}

/** Lifestyle-Block-Header Icons und Labels (A–E). */
export const BLOCK_META = [
  { icon: UtensilsCrossed, label: "Ernährung" },
  { icon: Droplets, label: "Flüssigkeit" },
  { icon: Moon, label: "Schlaf" },
  { icon: Activity, label: "Bewegung" },
  { icon: Compass, label: "Mental" },
] as const;
