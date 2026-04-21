import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  buildCartPermalinkDetailed,
  corePlanSku,
  isShopifyConfigured,
} from "@/lib/shopify";

const InputSchema = z.object({
  core_sku: z.string().min(1),
  module_skus: z.array(z.string().min(1)).default([]),
  plan: z.enum(["once", "subscription"]),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Ungültige Eingabe", details: parsed.error.issues },
      { status: 400 },
    );
  }
  const { core_sku, module_skus, plan } = parsed.data;

  if (!isShopifyConfigured()) {
    return Response.json(
      {
        error:
          "Shop-Integration noch nicht konfiguriert. Bitte NEXT_PUBLIC_SHOPIFY_DOMAIN und SHOPIFY_VARIANT_MAP setzen.",
      },
      { status: 501 },
    );
  }

  const coreVariantSku = corePlanSku(core_sku, plan);
  const items = [
    { sku: coreVariantSku, quantity: 1 },
    ...module_skus.map((sku) => ({ sku, quantity: 1 })),
  ];

  const result = buildCartPermalinkDetailed(items);
  if (!result.ok) {
    if (result.reason === "not_configured") {
      return Response.json(
        { error: "Shop-Integration noch nicht konfiguriert." },
        { status: 501 },
      );
    }
    return Response.json(
      {
        error: `Fehlende Shopify-Variant-IDs für: ${result.missing.join(", ")}`,
        missing: result.missing,
      },
      { status: 501 },
    );
  }

  return Response.json({
    checkout_url: result.url,
    plan,
    count: items.length,
  });
}

export const runtime = "nodejs";
