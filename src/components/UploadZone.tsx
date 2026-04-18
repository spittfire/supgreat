"use client";

import { useCallback, useRef, useState } from "react";
import { FileUp, FileText, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED = "image/jpeg,image/png,image/heic,image/heif,application/pdf";
const MAX_SIZE_MB = 15;

type UploadZoneProps = {
  file: File | null;
  onFile: (file: File | null) => void;
};

export function UploadZone({ file, onFile }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const accept = useCallback(
    (f: File | undefined) => {
      setError(null);
      if (!f) return;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Datei zu groß (max. ${MAX_SIZE_MB} MB).`);
        return;
      }
      if (!ACCEPTED.split(",").includes(f.type)) {
        setError("Nur PDF oder Bild (JPG/PNG/HEIC).");
        return;
      }
      onFile(f);
    },
    [onFile],
  );

  return (
    <div className="w-full">
      <label
        htmlFor="supgreat-upload"
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "group block cursor-pointer select-none rounded-lg border border-dashed p-8 md:p-12 text-center transition-colors",
          dragOver ? "border-moss bg-bone-2" : "border-line hover:border-moss hover:bg-bone-2",
          file && "bg-bone-2 border-moss",
        )}
      >
        <input
          id="supgreat-upload"
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
        />

        {!file ? (
          <div className="flex flex-col items-center gap-4">
            <span
              aria-hidden
              className="w-12 h-12 rounded-full hairline flex items-center justify-center text-moss"
            >
              <FileUp strokeWidth={1.3} />
            </span>
            <div>
              <p className="text-ink text-lg font-medium">Bluttest hochladen</p>
              <p className="text-sm text-mist mt-1">
                PDF oder Foto · Drag &amp; Drop oder antippen
              </p>
            </div>
            <div className="flex gap-3 mt-2 flex-wrap justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs text-mist hairline rounded-full px-3 py-1">
                <FileText className="w-3.5 h-3.5" strokeWidth={1.3} /> PDF
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-mist hairline rounded-full px-3 py-1">
                <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.3} /> JPG / PNG
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  cameraRef.current?.click();
                }}
                className="md:hidden inline-flex items-center gap-1.5 text-xs text-moss hairline rounded-full px-3 py-1"
              >
                Kamera nutzen
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 w-10 h-10 rounded-lg hairline flex items-center justify-center text-moss">
                {file.type === "application/pdf" ? (
                  <FileText strokeWidth={1.3} className="w-5 h-5" />
                ) : (
                  <ImageIcon strokeWidth={1.3} className="w-5 h-5" />
                )}
              </span>
              <div className="min-w-0">
                <div className="truncate text-ink font-medium">{file.name}</div>
                <div className="text-xs text-mist font-mono">
                  {(file.size / 1024).toFixed(0)} KB · {file.type || "Datei"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="shrink-0 text-mist hover:text-ink p-2"
              aria-label="Datei entfernen"
            >
              <X strokeWidth={1.3} className="w-5 h-5" />
            </button>
          </div>
        )}
      </label>

      {error && <p className="mt-3 text-sm text-coral">{error}</p>}
    </div>
  );
}
