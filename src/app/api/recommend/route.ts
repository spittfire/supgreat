import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  CLAUDE_MODEL,
  getAnthropic,
  isMockMode,
  stripFences,
  textFromMessage,
} from "@/lib/anthropic";
import {
  BiomarkerSchema,
  HealthSchema,
  LifestyleSchema,
  ProfileSchema,
  type Recommendation,
  type SupplementRec,
} from "@/lib/types";
import { explainTriggers, recommendProducts } from "@/lib/supplement-rules";
import { interactionNote } from "@/lib/contraindications";
import { mockRecommend } from "@/lib/mock-recommend";

const InputSchema = z.object({
  biomarkers: z.array(BiomarkerSchema),
  profile: ProfileSchema,
  health: HealthSchema,
  lifestyle: LifestyleSchema,
});

const LlmOutputSchema = z.object({
  supplements: z.array(
    z.object({
      id: z.string(),
      reason_short: z.string(),
      reason_detail: z.string(),
      data_sources_used: z.array(z.string()).default([]),
    }),
  ),
  overall_assessment: z.string(),
});

const SYSTEM_PROMPT = `Du bist der SUPGREAT Longevity Coach. Für jedes empfohlene Supplement schreibst du eine personalisierte, kurze Begründung.

HARTE REGELN (HWG-konform):
- Keine Heilversprechen, keine Diagnosen, keine Krankheitsbezüge außer neutral beschreibend.
- Keine Aussagen wie "heilt", "behandelt", "lindert Krankheit X".
- Stattdessen: "unterstützt", "kann zur Regulation beitragen", "ist im Zusammenhang mit … beschrieben".
- Ton: sachlich, freundlich, kompetent, Du-Form, Deutsch.
- Jede Begründung muss sich auf MINDESTENS 2 unterschiedliche Datenquellen beziehen (z. B. Biomarker + Lifestyle, oder Biomarker + Anamnese).
- "reason_short": genau 1 prägnanter Satz (Key-Benefit, personalisiert).
- "reason_detail": 2–3 Sätze, nimmt konkrete Werte / Lebensstil-Punkte auf.

OUTPUT: AUSSCHLIESSLICH reines JSON, exakt dieses Schema, keine Markdown-Fences, kein Fließtext außerhalb:
{
  "supplements": [
    {"id":"<product.id aus der Liste>","reason_short":"…","reason_detail":"…","data_sources_used":["biomarker:Vitamin D","lifestyle:sleep_quality"]}
  ],
  "overall_assessment":"3–4 Sätze Gesamt-Einordnung, erwähnt Stärken und Verbesserungspotenziale."
}

Antworte ausschließlich in diesem Format.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Ungültige Eingabe", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const ctx = parsed.data;

    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 1200));
      return Response.json({ ...mockRecommend(ctx), _mock: true });
    }

    const ranked = recommendProducts(ctx, 8);

    if (ranked.length === 0) {
      const empty: Recommendation = {
        supplements: [],
        overall_assessment:
          "Deine Werte und Lebensstil-Signale wirken insgesamt sehr ausgewogen — aktuell sehen wir keinen akuten Supplement-Bedarf. Halte deine Routinen und kontrolliere die Werte in 6–12 Monaten erneut.",
      };
      return Response.json(empty);
    }

    const productBrief = ranked.map((r) => ({
      id: r.product.id,
      name: r.product.name,
      short_benefit: r.product.short_benefit,
      matched_reasons: explainTriggers(r.matched_triggers, ctx.biomarkers),
    }));

    const userInput = JSON.stringify(
      {
        biomarkers: ctx.biomarkers.map((b) => ({
          name: b.name,
          value: b.value,
          unit: b.unit,
          status: b.status,
          reference: { min: b.reference_min, max: b.reference_max },
          optimal: { min: b.optimal_min, max: b.optimal_max },
        })),
        profile: ctx.profile,
        health: ctx.health,
        lifestyle: ctx.lifestyle,
        products_to_explain: productBrief,
      },
      null,
      2,
    );

    const anthropic = getAnthropic();
    const msg = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userInput }],
    });

    const raw = stripFences(textFromMessage(msg));
    let llmParsed: unknown;
    try {
      llmParsed = JSON.parse(raw);
    } catch {
      console.error("[recommend] unparseable:", raw.slice(0, 500));
      return Response.json(
        { error: "Empfehlung fehlgeschlagen (Parse-Fehler)." },
        { status: 502 },
      );
    }

    const llm = LlmOutputSchema.safeParse(llmParsed);
    if (!llm.success) {
      return Response.json(
        { error: "Empfehlung fehlgeschlagen (Schema-Fehler).", details: llm.error.issues },
        { status: 502 },
      );
    }

    const byId = new Map(llm.data.supplements.map((s) => [s.id, s]));

    const supplements: SupplementRec[] = ranked.map((r) => {
      const p = r.product;
      const ai = byId.get(p.id);
      const warningText = p.interactions
        .map((i) => interactionNote(i.when, { health: ctx.health }))
        .filter((x): x is string => !!x)
        .join(" ");
      return {
        id: p.id,
        name: p.name,
        dosage: p.dosage,
        timing: p.timing,
        category_color: p.pill_color,
        pill_shape: p.pill_shape,
        reason_short: ai?.reason_short ?? p.short_benefit,
        reason_detail: ai?.reason_detail ?? p.short_benefit,
        data_sources_used: ai?.data_sources_used ?? [],
        warning: warningText ? warningText : null,
      };
    });

    const result: Recommendation = {
      supplements,
      overall_assessment: llm.data.overall_assessment,
    };
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Empfehlung fehlgeschlagen.";
    console.error("[recommend] error:", err);
    return Response.json({ error: message }, { status: 500 });
  }
}

export const maxDuration = 60;
export const runtime = "nodejs";
