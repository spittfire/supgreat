"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { UploadZone } from "./UploadZone";
import { Button } from "./ui/Button";
import { useFlowStore } from "@/store/flow-store";

export function LandingForm() {
  const router = useRouter();
  const files = useFlowStore((s) => s.uploadedFiles);
  const setFiles = useFlowStore((s) => s.setFiles);
  const consentGiven = useFlowStore((s) => s.consentGiven);
  const setConsent = useFlowStore((s) => s.setConsent);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = files.length > 0 && consentGiven && !submitting;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    router.push("/analyze");
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5">
      <UploadZone files={files} onChange={setFiles} />

      <label className="flex items-start gap-3 cursor-pointer select-none text-sm leading-relaxed text-silver rounded-xl border border-steel bg-onyx px-4 py-3 hover:border-iron transition-colors">
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-lime"
        />
        <span>
          Ich stimme der Verarbeitung meines Bluttests zur Analyse zu.{" "}
          <a href="/datenschutz" className="text-lime hover:underline">
            Datenschutz
          </a>
          .
        </span>
      </label>

      <Button type="submit" size="lg" disabled={!canSubmit} block>
        Analyse starten
        <ArrowRight
          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.6}
        />
      </Button>
    </form>
  );
}
