"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { UploadZone } from "./UploadZone";
import { Button } from "./ui/Button";
import { useFlowStore } from "@/store/flow-store";
import { cn } from "@/lib/utils";

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
    <form onSubmit={onSubmit} className="w-full space-y-8">
      <UploadZone files={files} onChange={setFiles} />

      <label
        className={cn(
          "flex items-start gap-3 cursor-pointer select-none",
          "text-sm leading-relaxed text-ink/80",
        )}
      >
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-moss"
        />
        <span>
          Ich stimme der Verarbeitung meines Bluttests zur Analyse zu. Die Daten werden
          nicht an Dritte weitergegeben und können jederzeit gelöscht werden.{" "}
          <a href="/datenschutz" className="underline hover:text-moss">
            Datenschutz
          </a>
          .
        </span>
      </label>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={!canSubmit}>
          Analyse starten
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  );
}
