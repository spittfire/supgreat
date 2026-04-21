/**
 * Shopify cart-permalink helpers. The app uses cart permalinks
 * (https://{shop}/cart/{variant_id}:{qty},...) which do not require any
 * Storefront-API call from the browser — the `SHOPIFY_STOREFRONT_TOKEN`
 * is kept only for future features (product lookups, inventory) and is
 * NOT needed here.
 */

export type CartItem = { sku: string; quantity: number };

let cachedMap: Record<string, string> | null | undefined;

function loadVariantMap(): Record<string, string> | null {
  if (cachedMap !== undefined) return cachedMap;
  const raw = process.env.SHOPIFY_VARIANT_MAP;
  if (!raw || raw.trim() === "") {
    cachedMap = null;
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      cachedMap = null;
      return null;
    }
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "string" && v.length > 0) out[k] = v;
    }
    cachedMap = out;
    return out;
  } catch {
    cachedMap = null;
    return null;
  }
}

export function getShopDomain(): string | null {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  return domain && domain.trim() !== "" ? domain.trim() : null;
}

export function isShopifyConfigured(): boolean {
  return getShopDomain() !== null && loadVariantMap() !== null;
}

/**
 * Look up the Shopify Variant-ID for a given SKU. SKUs with plan suffixes
 * (`-ONCE` / `-ABO`) are resolved as-is. Unknown SKUs return null.
 */
export function getVariantId(sku: string): string | null {
  const map = loadVariantMap();
  if (!map) return null;
  return map[sku] ?? null;
}

/**
 * Build a Shopify cart permalink. Returns null if Shopify is not configured
 * or any SKU is unmapped. The caller can report which SKUs were missing via
 * the second return tuple entry when called via `buildCartPermalinkDetailed`.
 */
export function buildCartPermalink(items: CartItem[]): string | null {
  const result = buildCartPermalinkDetailed(items);
  return result.ok ? result.url : null;
}

export type BuildCartResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not_configured" | "missing_variants"; missing: string[] };

export function buildCartPermalinkDetailed(items: CartItem[]): BuildCartResult {
  const domain = getShopDomain();
  const map = loadVariantMap();
  if (!domain || !map) {
    return { ok: false, reason: "not_configured", missing: [] };
  }

  const segments: string[] = [];
  const missing: string[] = [];
  for (const item of items) {
    const qty = Math.max(1, Math.floor(item.quantity));
    const variantId = map[item.sku];
    if (!variantId) {
      console.warn(`[shopify] unmapped SKU: ${item.sku}`);
      missing.push(item.sku);
      continue;
    }
    segments.push(`${variantId}:${qty}`);
  }

  if (missing.length > 0) {
    return { ok: false, reason: "missing_variants", missing };
  }

  return { ok: true, url: `https://${domain}/cart/${segments.join(",")}` };
}

/**
 * Append the plan suffix the Core Box uses in Shopify
 * (`-ONCE` for one-time, `-ABO` for subscription). Other SKUs are returned as-is.
 */
export function corePlanSku(baseSku: string, plan: "once" | "subscription"): string {
  return `${baseSku}-${plan === "subscription" ? "ABO" : "ONCE"}`;
}
