import { isMockMode } from "@/lib/anthropic";

export async function GET() {
  return Response.json({
    status: "ok",
    anthropic_key_present: !!process.env.ANTHROPIC_API_KEY,
    mock_mode: isMockMode(),
    time: new Date().toISOString(),
  });
}
