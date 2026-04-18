import Anthropic from "@anthropic-ai/sdk";

export const CLAUDE_MODEL = "claude-sonnet-4-6";

/**
 * Mock mode bypasses the Anthropic API entirely and serves deterministic fake
 * data from the local rule engine + seed biomarkers. Useful for offline demos
 * or running the app without paying for API credits.
 *
 * Enabled in any of these cases:
 *  - SUPGREAT_MOCK explicitly set to "1" / "true"
 *  - SUPGREAT_MOCK not set AND no ANTHROPIC_API_KEY present (graceful default)
 * Explicitly disabled with SUPGREAT_MOCK=0.
 */
export function isMockMode(): boolean {
  const flag = process.env.SUPGREAT_MOCK?.toLowerCase();
  if (flag === "1" || flag === "true" || flag === "yes") return true;
  if (flag === "0" || flag === "false" || flag === "no") return false;
  return !process.env.ANTHROPIC_API_KEY;
}

let _client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY fehlt in .env.local — bitte eintragen und den Dev-Server neu starten.",
    );
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: key });
  }
  return _client;
}

/** Extract concatenated text from a Claude API non-streaming response. */
export function textFromMessage(msg: Anthropic.Messages.Message): string {
  return msg.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

/** Strip markdown code fences the model may wrap JSON in. */
export function stripFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}
