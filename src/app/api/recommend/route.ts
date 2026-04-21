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
  type CoreBoxRec,
  type Recommendation,
  type SupplementRec,
} from "@/lib/types";
import { explainTriggers, recommendBox } from "@/lib/supplement-rules";
import { CORE_BOX } from "@/lib/products";
import { interactionNote } from "@/lib/contraindications";
import { mockRecommend } from "@/lib/mock-recommend";

const InputSchema = z.object({
  biomarkers: z.array(BiomarkerSchema),
  profile: ProfileSchema,
  health: HealthSchema,
  lifestyle: LifestyleSchema,
});

const LlmOutputSchema = z.object({
  core_box_reason: z.string(),
  modules: z.array(
    z.object({
      id: z.string(),
      reason_short: z.string(),
      reason_detail: z.string(),
      data_sources_used: z.array(z.string()).default([]),
    }),
  ),
  overall_assessment: z.string(),
});

const SYSTEM_PROMPT = `Du bist der SUPGREAT Longevity Coach. Du begründest eine personalisierte Box, bestehend aus einer fixen Core Box (22 Wirkstoffe, 4 Tagespacks) und ergänzenden Monats-Modulen.

HARTE REGELN (HWG-konform):
- Keine Heilversprechen, keine Diagnosen, keine Krankheitsbezüge außer neutral beschreibend.
- Keine Aussagen wie "heilt", "behandelt", "lindert Krankheit X".
- Stattdessen: "unterstützt", "kann zur Regulation beitragen", "ist im Zusammenhang mit … beschrieben".
- Ton: sachlich, freundlich, kompetent, Du-Form, Deutsch.
- Jede Modul-Begründung muss sich auf MINDESTENS 2 unterschiedliche Datenquellen beziehen (z. B. Biomarker + Lifestyle, oder Biomarker + Anamnese).
- "reason_short": genau 1 prägnanter Satz (Key-Benefit, personalisiert).
- "reason_detail": 2–3 Sätze, nimmt konkrete Werte / Lebensstil-Punkte auf.
- "core_box_reason": 1–2 Sätze, erklärt warum die Core Box das Fundament für diesen Profiltyp ist.

OUTPUT: AUSSCHLIESSLICH reines JSON, exakt dieses Schema, keine Markdown-Fences, kein Fließtext außerhalb:
{
  "core_box_reason": "…",
  "modules": [
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

    const { core_box, modules: ranked } = recommendBox(ctx, 12);

    const productBrief = ranked.map((r) => ({
      id: r.product.id,
      sku: r.product.sku,
      name: r.product.name,
      short_benefit: r.product.short_benefit,
      matched_reasons: explainTriggers(r.matched_triggers, ctx.biomarkers),
    }));

    const userInput = JSON.stringify(
      {
        core_box: {
          sku: CORE_BOX.sku,
          name: CORE_BOX.name,
          ingredient_count: CORE_BOX.ingredient_count,
          episodes: CORE_BOX.episodes.map((e) => ({
            label: e.label,
            goal: e.goal,
            ingredients: e.ingredients.map((i) => i.name),
          })),
        },
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
        modules_to_explain: productBrief,
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

    const byId = new Map(llm.data.modules.map((s) => [s.id, s]));

    const supplements: SupplementRec[] = ranked.map((r) => {
      const p = r.product;
      const ai = byId.get(p.id);
      const warningText = p.interactions
        .map((i) => interactionNote(i.when, { health: ctx.health }))
        .filter((x): x is string => !!x)
        .join(" ");
      return {
        id: p.id,
        sku: p.sku,
        product_type: p.product_type,
        name: p.name,
        dosage: p.dosage,
        timing: p.timing,
        category_color: p.pill_color,
        pill_shape: p.pill_shape,
        reason_short: ai?.reason_short ?? p.short_benefit,
        reason_detail: ai?.reason_detail ?? p.short_benefit,
        data_sources_used: ai?.data_sources_used ?? [],
        warning: warningText ? warningText : null,
        price_single: p.price_single,
        price_subscription: p.price_subscription,
      };
    });

    const monthly_total =
      core_box.price_subscription +
      supplements.reduce((s, r) => s + r.price_subscription, 0);
    const onetime_total =
      core_box.price_single +
      supplements.reduce((s, r) => s + r.price_single, 0);

    const coreBoxWithReason: CoreBoxRec = {
      ...core_box,
      reason_short: llm.data.core_box_reason,
    };

    const result: Recommendation = {
      core_box: coreBoxWithReason,
      modules: supplements,
      overall_assessment: llm.data.overall_assessment,
      monthly_total: Math.round(monthly_total * 10) / 10,
      onetime_total: Math.round(onetime_total * 10) / 10,
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
