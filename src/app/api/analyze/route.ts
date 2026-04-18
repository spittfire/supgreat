import type { NextRequest } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import {
  CLAUDE_MODEL,
  getAnthropic,
  isMockMode,
  stripFences,
  textFromMessage,
} from "@/lib/anthropic";
import {
  computeLongevityScore,
  scoreExtracted,
} from "@/lib/optimal-ranges";
import { mockAnalyze } from "@/lib/mock-analysis";
import type { Analysis, Biomarker, Sex } from "@/lib/types";

const SYSTEM_PROMPT = `Du bist ein spezialisierter Extraktor für deutsche Laborbefunde (Bluttests).
Deine einzige Aufgabe: Alle lesbaren Biomarker-Messwerte aus dem Dokument als strukturiertes JSON zurückgeben.

ANTWORTFORMAT (hart):
- Gib AUSSCHLIESSLICH ein JSON-Array zurück. KEIN Fließtext, KEINE Markdown-Fences, KEINE Erklärung.
- Jedes Element: { "name": string, "value": number, "unit": string }.
- "value" ist immer eine Zahl mit Dezimalpunkt (NICHT Komma), ohne Einheit im Wert selbst.
- Übernimm Bezeichnung und Einheit wie im Dokument gedruckt.
- Zeilen ohne eindeutigen numerischen Wert auslassen.
- Referenzbereiche nicht extrahieren.

BEISPIEL-AUSGABE (nur illustrativ):
[
  {"name":"Vitamin D","value":22.5,"unit":"ng/ml"},
  {"name":"Ferritin","value":45,"unit":"µg/l"},
  {"name":"HbA1c","value":5.4,"unit":"%"}
]`;

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB hard cap

type ExtractedMarker = { name: string; value: number; unit: string };

function isImageType(mime: string): mime is
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp" {
  return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mime);
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const sexRaw = form.get("sex");
    const sex = (typeof sexRaw === "string" ? sexRaw : null) as Sex | null;

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "Keine Datei empfangen." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: "Datei überschreitet 20 MB." }, { status: 413 });
    }

    // Mock mode: skip Claude, return seeded biomarkers with a small artificial delay
    // so the loading UI stays meaningful.
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 1800));
      const analysis = mockAnalyze(sex ?? undefined);
      return Response.json({ ...analysis, _mock: true });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const b64 = buf.toString("base64");
    const isPdf = file.type === "application/pdf";

    let content: Anthropic.Messages.ContentBlockParam[];
    if (isPdf) {
      content = [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: b64,
          },
        },
        {
          type: "text",
          text: "Extrahiere alle Biomarker aus diesem Bluttest-Dokument als JSON-Array.",
        },
      ];
    } else if (isImageType(file.type)) {
      content = [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: file.type,
            data: b64,
          },
        },
        {
          type: "text",
          text: "Extrahiere alle Biomarker aus diesem Bluttest-Foto als JSON-Array.",
        },
      ];
    } else {
      return Response.json(
        { error: `Dateityp nicht unterstützt: ${file.type || "unbekannt"}` },
        { status: 415 },
      );
    }

    const anthropic = getAnthropic();
    const msg = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const raw = stripFences(textFromMessage(msg));
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("[analyze] unparseable response:", raw.slice(0, 500));
      return Response.json(
        { error: "Extraktion fehlgeschlagen (konnte Antwort nicht parsen)." },
        { status: 502 },
      );
    }

    if (!Array.isArray(parsed)) {
      return Response.json(
        { error: "Extraktion fehlgeschlagen (unerwartetes Format)." },
        { status: 502 },
      );
    }

    const biomarkers: Biomarker[] = [];
    for (const item of parsed as ExtractedMarker[]) {
      if (!item || typeof item.name !== "string") continue;
      const value =
        typeof item.value === "number"
          ? item.value
          : typeof item.value === "string"
            ? Number(String(item.value).replace(",", "."))
            : Number.NaN;
      if (!Number.isFinite(value)) continue;
      const unit = typeof item.unit === "string" ? item.unit : "";
      const scored = scoreExtracted(item.name, value, unit, sex ?? undefined);
      if (scored) biomarkers.push(scored);
    }

    const analysis: Analysis = {
      biomarkers,
      longevity_score: computeLongevityScore(biomarkers),
      lab_name: null,
      collected_at: null,
    };

    return Response.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analyse fehlgeschlagen.";
    console.error("[analyze] error:", err);
    return Response.json({ error: message }, { status: 500 });
  }
}

export const maxDuration = 60;
export const runtime = "nodejs";
