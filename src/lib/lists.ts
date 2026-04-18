export const GOALS = [
  "Schlaf",
  "Energie",
  "Muskelaufbau",
  "Ausdauer",
  "Abnehmen",
  "Stressabbau",
  "Fokus",
  "Hautbild",
  "Hormonbalance",
  "Longevity",
  "Immunsystem",
  "Verdauung",
  "Libido",
] as const;

export type ConditionGroup = { label: string; items: string[] };

export const CONDITION_GROUPS: ConditionGroup[] = [
  {
    label: "Herz-Kreislauf",
    items: [
      "Bluthochdruck",
      "Niedriger Blutdruck",
      "Herzrhythmusstörungen",
      "Koronare Herzkrankheit",
      "Herzinfarkt in Anamnese",
      "Schlaganfall in Anamnese",
    ],
  },
  {
    label: "Stoffwechsel",
    items: [
      "Diabetes Typ 1",
      "Diabetes Typ 2",
      "Prädiabetes",
      "Schilddrüsenunterfunktion (Hashimoto)",
      "Schilddrüsenüberfunktion (Morbus Basedow)",
      "Metabolisches Syndrom",
      "Fettleber",
    ],
  },
  {
    label: "Autoimmun",
    items: [
      "Rheumatoide Arthritis",
      "Zöliakie",
      "Multiple Sklerose",
      "Lupus",
      "Morbus Crohn",
      "Colitis ulcerosa",
      "Psoriasis",
    ],
  },
  {
    label: "Hormonell (Frauen)",
    items: ["PCOS", "Endometriose", "Myome", "Schilddrüsenerkrankung", "Peri-/Menopause"],
  },
  {
    label: "Hormonell (Männer)",
    items: ["Hypogonadismus", "Prostatavergrößerung"],
  },
  {
    label: "Psyche",
    items: ["Depression", "Angststörung", "Burnout", "ADHS", "Bipolare Störung"],
  },
  {
    label: "Magen-Darm",
    items: [
      "Reizdarm",
      "Reflux",
      "Laktoseintoleranz",
      "Fruktoseintoleranz",
      "Histaminintoleranz",
      "Gluten-Sensitivität",
    ],
  },
  {
    label: "Niere & Leber",
    items: ["Chronische Niereninsuffizienz", "Leberzirrhose", "Hepatitis"],
  },
  {
    label: "Knochen & Gelenke",
    items: ["Osteoporose", "Osteopenie", "Arthrose", "Bandscheibenvorfall"],
  },
  {
    label: "Sonstige",
    items: [
      "Krebs in Remission",
      "Migräne",
      "Schlafapnoe",
      "Fibromyalgie",
      "Chronisches Fatigue-Syndrom (CFS)",
      "Long-Covid",
    ],
  },
];

export const MEDICATIONS = [
  "Blutverdünner (Marcumar, ASS, Eliquis, Xarelto)",
  "Blutdrucksenker (ACE-Hemmer, Betablocker, Sartane, Diuretika)",
  "Cholesterinsenker (Statine)",
  "Schilddrüsenhormone (L-Thyroxin)",
  "Antidepressiva (SSRI, SNRI, trizyklisch)",
  "Protonenpumpenhemmer (Omeprazol, Pantoprazol)",
  "Insulin / Metformin",
  "Hormonelle Verhütung (Pille, Spirale, Pflaster)",
  "Hormonersatztherapie (HRT)",
  "Kortison (dauerhaft)",
  "Immunsuppressiva",
  "Schmerzmittel regelmäßig (Ibuprofen, Diclofenac, Paracetamol)",
];

export const ALLERGIES = [
  "Nuss-Allergie",
  "Erdnuss-Allergie",
  "Fisch-/Meeresfrüchte-Allergie",
  "Soja-Allergie",
  "Milch/Laktose",
  "Gluten/Weizen",
  "Eier",
  "Histamin-Intoleranz",
  "Heuschnupfen/Pollen",
];

export const COMMON_SUPPLEMENTS = [
  "Multivitamin",
  "Vitamin D",
  "Vitamin B12",
  "Vitamin C",
  "Vitamin E",
  "Omega-3",
  "Magnesium",
  "Zink",
  "Eisen",
  "Kalzium",
  "Jod",
  "Kollagen",
  "Probiotika",
  "Kreatin",
  "Protein-Pulver",
  "Ashwagandha",
  "Kurkuma",
  "Ingwer",
  "Ginseng",
];

export const DIETS = [
  "Omnivor (alles)",
  "Flexitarier",
  "Vegetarisch",
  "Vegan",
  "Pescetarisch",
  "Low Carb / Keto",
  "Paleo",
  "Mediterran",
  "Intervallfasten",
  "Andere",
];

export const SPORT_TYPES = [
  "Kraftsport",
  "Ausdauer",
  "HIIT",
  "Yoga/Mobility",
  "Teamsport",
  "Nichts davon",
];

export const SYMPTOMS = [
  "Müdigkeit",
  "Kopfschmerzen",
  "Haarausfall",
  "Brüchige Nägel",
  "Hautprobleme",
  "Verdauungsbeschwerden",
  "Gelenkschmerzen",
  "Muskelkrämpfe",
  "Konzentrationsprobleme",
  "Gedächtnisprobleme",
  "Stimmungsschwankungen",
  "Libidoverlust",
  "Infektanfälligkeit",
  "Gewichtszunahme",
  "Gewichtsverlust",
];
