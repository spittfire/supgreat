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
Der Nutzer reicht eine oder mehrere Seiten (PDF/Foto) eines Bluttests ein. Extrahiere ALLE lesbaren Biomarker-Messwerte aus ALLEN übergebenen Dokumenten. Wenn derselbe Marker in mehreren Seiten erscheint, verwende den plausibelsten Wert (z. B. das nicht-verschwommene Foto).

ANTWORTFORMAT (hart):
- Gib AUSSCHLIESSLICH ein JSON-Array zurück. KEIN Fließtext, KEINE Markdown-Fences, KEINE Erklärung.
- Jedes Element: { "name": string, "value": number, "unit": string }.
- "value" immer als Zahl mit Dezimalpunkt (NICHT Komma), ohne Einheit.
- Übernimm Bezeichnung und Einheit wie im Dokument gedruckt.
- Zeilen ohne eindeutigen numerischen Wert auslassen. Keine Schätzwerte.
- Wenn die Bilder keinen lesbaren Bluttest enthalten: gib [] zurück (leeres Array), keinen Text.`;

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;
const MAX_FILES = 6;

type ExtractedMarker = { name: string; value: number; unit: string };
type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

function isImageType(mime: string): mime is ImageMediaType {
  return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mime);
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const collected = form.getAll("file");
    const files = collected.filter((v): v is File => v instanceof File);
    const sexRaw = form.get("sex");
    const sex = (typeof sexRaw === "string" ? sexRaw : null) as Sex | null;

    if (files.length === 0) {
      return Response.json({ error: "Keine Datei empfangen." }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return Response.json(
        { error: `Zu viele Dateien (max. ${MAX_FILES}).` },
        { status: 413 },
      );
    }

    let total = 0;
    for (const f of files) {
      if (f.size > MAX_FILE_BYTES) {
        return Response.json(
          { error: `„${f.name}" überschreitet ${MAX_FILE_BYTES / 1024 / 1024} MB.` },
          { status: 413 },
        );
      }
      total += f.size;
    }
    if (total > MAX_TOTAL_BYTES) {
      return Response.json(
        { error: `Gesamt-Upload überschreitet ${MAX_TOTAL_BYTES / 1024 / 1024} MB.` },
        { status: 413 },
      );
    }

    // Mock mode returns the same seeded set regardless of input — keeps the flow clickable.
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 1500 + 400 * files.length));
      const analysis = mockAnalyze(sex ?? undefined);
      return Response.json({ ...analysis, _mock: true, file_count: files.length });
    }

    // Build content blocks: one image/document per file, plus a single trailing text instruction.
    const content: Anthropic.Messages.ContentBlockParam[] = [];
    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer());
      const b64 = buf.toString("base64");
      if (file.type === "application/pdf") {
        content.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: b64 },
        });
      } else if (isImageType(file.type)) {
        content.push({
          type: "image",
          source: { type: "base64", media_type: file.type, data: b64 },
        });
      } else {
        return Response.json(
          { error: `Dateityp nicht unterstützt: ${file.name} (${file.type || "unbekannt"})` },
          { status: 415 },
        );
      }
    }
    content.push({
      type: "text",
      text:
        files.length === 1
          ? "Extrahiere alle Biomarker aus diesem Bluttest-Dokument als JSON-Array."
          : `Hier sind ${files.length} Seiten/Fotos desselben Bluttests. Extrahiere alle Biomarker kombiniert, dedupliziert, als JSON-Array.`,
    });

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
        {
          error:
            "Extraktion fehlgeschlagen — Claude hat kein valides JSON geliefert. Versuch ein schärferes Foto oder das PDF.",
        },
        { status: 502 },
      );
    }

    if (!Array.isArray(parsed)) {
      return Response.json(
        { error: "Extraktion fehlgeschlagen (unerwartetes Format)." },
        { status: 502 },
      );
    }

    // Dedupe by marker key, keeping the first scored result per key.
    const byKey = new Map<string, Biomarker>();
    let extractedAny = false;
    for (const item of parsed as ExtractedMarker[]) {
      if (!item || typeof item.name !== "string") continue;
      const rawValue = (item as { value: unknown }).value;
      const value =
        typeof rawValue === "number"
          ? rawValue
          : typeof rawValue === "string"
            ? Number(String(rawValue).replace(",", "."))
            : Number.NaN;
      if (!Number.isFinite(value)) continue;
      const unit = typeof item.unit === "string" ? item.unit : "";
      extractedAny = true;
      const scored = scoreExtracted(item.name, value, unit, sex ?? undefined);
      if (!scored) continue;
      if (!byKey.has(scored.key)) byKey.set(scored.key, scored);
    }

    const biomarkers = Array.from(byKey.values());

    const analysis: Analysis = {
      biomarkers,
      longevity_score: computeLongevityScore(biomarkers),
      lab_name: null,
      collected_at: null,
    };

    return Response.json({
      ...analysis,
      raw_found: extractedAny,
      file_count: files.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analyse fehlgeschlagen.";
    console.error("[analyze] error:", err);
    return Response.json({ error: message }, { status: 500 });
  }
}

export const maxDuration = 60;
export const runtime = "nodejs";
