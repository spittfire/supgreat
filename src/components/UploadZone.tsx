"use client";

import { useCallback, useRef, useState } from "react";
import {
  Camera,
  FileText,
  Image as ImageIcon,
  ImagePlus,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_MB = 15;
const MAX_FILES = 6;
const MAX_TOTAL_MB = 40;

type UploadZoneProps = {
  files: File[];
  onChange: (files: File[]) => void;
};

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadZone({ files, onChange }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const acceptMany = useCallback(
    (incoming: FileList | File[] | null | undefined) => {
      setError(null);
      if (!incoming || ("length" in incoming && incoming.length === 0)) return;

      const valid: File[] = [];
      const errors: string[] = [];
      const current = [...files];
      const currentBytes = current.reduce((s, f) => s + f.size, 0);
      let runningBytes = currentBytes;

      for (const file of Array.from(incoming)) {
        if (current.length + valid.length >= MAX_FILES) {
          errors.push(`Max. ${MAX_FILES} Dateien.`);
          break;
        }
        if (!ACCEPTED.includes(file.type)) {
          errors.push(`„${file.name}" ist kein PDF/Bild.`);
          continue;
        }
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
          errors.push(`„${file.name}" > ${MAX_FILE_MB} MB.`);
          continue;
        }
        if (runningBytes + file.size > MAX_TOTAL_MB * 1024 * 1024) {
          errors.push(`Gesamt-Upload > ${MAX_TOTAL_MB} MB.`);
          break;
        }
        const dupe = current.some((c) => c.name === file.name && c.size === file.size);
        if (dupe) continue;
        valid.push(file);
        runningBytes += file.size;
      }

      if (valid.length > 0) onChange([...current, ...valid]);
      if (errors.length > 0) setError(errors.join(" "));
    },
    [files, onChange],
  );

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  };

  const empty = files.length === 0;
  const totalBytes = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="w-full">
      {/* Hidden inputs, shared between empty-state and non-empty-state */}
      <input
        id="supgreat-upload"
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="sr-only"
        onChange={(e) => {
          acceptMany(e.target.files);
          if (e.target) e.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          acceptMany(e.target.files);
          if (e.target) e.target.value = "";
        }}
      />

      {empty ? (
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
            acceptMany(e.dataTransfer.files);
          }}
          className={cn(
            "group block cursor-pointer select-none rounded-2xl p-8 md:p-10 transition-all shadow-soft",
            dragOver
              ? "ring-4 ring-brand-amber/40 bg-brand-amber/20"
              : "bg-brand-amber/12 hover:bg-brand-amber/20 hover:shadow-pop",
          )}
          style={{
            backgroundImage:
              "radial-gradient(110% 120% at 0% 0%, rgba(196,150,74,0.25) 0%, rgba(196,150,74,0.06) 55%, rgba(255,255,255,0) 100%)",
          }}
        >
          <div className="flex flex-col items-center text-center gap-5">
            <span
              aria-hidden
              className="w-20 h-20 rounded-3xl bg-brand-amber text-bone flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform"
            >
              <ImagePlus className="w-9 h-9" strokeWidth={1.4} />
            </span>
            <div>
              <p className="text-ink text-xl md:text-2xl font-semibold tracking-tight">
                Bluttest hochladen
              </p>
              <p className="text-sm text-ink/60 mt-1.5">
                PDF oder Fotos · mehrere möglich · tippe oder ziehe hierher
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs text-ink/70 bg-bone px-3 py-1.5 rounded-full shadow-soft">
                <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                PDF
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-ink/70 bg-bone px-3 py-1.5 rounded-full shadow-soft">
                <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                JPG · PNG · HEIC
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  cameraRef.current?.click();
                }}
                className="md:hidden inline-flex items-center gap-1.5 text-xs text-bone bg-ink px-3 py-1.5 rounded-full shadow-soft active:scale-95 transition-transform"
              >
                <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
                Kamera öffnen
              </button>
            </div>
          </div>
        </label>
      ) : (
        <div className="rounded-2xl bg-paper shadow-soft hairline p-4 md:p-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-sm font-medium text-ink">
              {files.length} Datei{files.length === 1 ? "" : "en"} bereit
            </div>
            <div className="text-xs text-mist font-mono">
              {humanSize(totalBytes)} · max. {MAX_FILES}
            </div>
          </div>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li
                key={`${file.name}-${file.size}-${idx}`}
                className="flex items-center gap-3 bg-bone rounded-xl hairline px-3 py-2.5"
              >
                <span className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-brand-amber/15 text-brand-amber">
                  {file.type === "application/pdf" ? (
                    <FileText className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-ink font-medium">{file.name}</div>
                  <div className="text-xs text-mist font-mono">
                    {humanSize(file.size)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="shrink-0 text-mist hover:text-coral w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                  aria-label={`„${file.name}" entfernen`}
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>

          {files.length < MAX_FILES && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm text-ink bg-bone hairline rounded-xl px-4 py-3 hover:bg-bone-2 transition-colors active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Weitere Datei
              </button>
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="md:hidden flex-1 inline-flex items-center justify-center gap-1.5 text-sm text-bone bg-ink rounded-xl px-4 py-3 active:scale-[0.98] shadow-soft"
              >
                <Camera className="w-4 h-4" strokeWidth={1.5} />
                Kamera
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-coral">{error}</p>}
    </div>
  );
}
