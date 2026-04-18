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
  const { uploadedFile, setFile, consentGiven, setConsent } = useFlowStore();
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = !!uploadedFile && consentGiven && !submitting;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    router.push("/analyze");
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-8">
      <UploadZone file={uploadedFile} onFile={setFile} />

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
