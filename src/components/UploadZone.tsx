"use client";

import { useCallback, useRef, useState } from "react";
import {
  Camera,
  FileText,
  Image as ImageIcon,
  Plus,
  Upload,
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

function FormatChip({
  icon: Icon,
  label,
}: {
  icon: typeof FileText;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-steel bg-graphite px-3 py-1.5 text-xs text-silver">
      <Icon className="w-3.5 h-3.5 text-lime" strokeWidth={1.5} />
      {label}
    </span>
  );
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
            "group relative block cursor-pointer select-none overflow-hidden rounded-3xl border-2 border-dashed p-10 md:p-14 transition-all duration-500",
            dragOver
              ? "border-lime bg-graphite"
              : "border-steel bg-onyx hover:border-lime hover:bg-graphite",
          )}
        >
          {/* Glow sweep on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-radial-lime opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />

          <div className="relative flex flex-col items-center text-center">
            <div
              className={cn(
                "mb-6 rounded-2xl border p-4 transition-all duration-500",
                dragOver
                  ? "border-lime bg-lime/10 shadow-glow-lime"
                  : "border-steel bg-graphite group-hover:border-lime group-hover:shadow-glow-lime",
              )}
            >
              <Upload className="h-8 w-8 text-lime" strokeWidth={1.4} />
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-pearl mb-2">
              Bluttest hochladen
            </h3>
            <p className="text-silver mb-6">
              PDF oder Foto · mehrere möglich · Drag &amp; Drop oder antippen
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <FormatChip icon={FileText} label="PDF" />
              <FormatChip icon={ImageIcon} label="JPG · PNG · HEIC" />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  cameraRef.current?.click();
                }}
                className="md:hidden inline-flex items-center gap-1.5 rounded-full border border-lime bg-lime/10 px-3 py-1.5 text-xs text-lime active:scale-95 transition-transform"
              >
                <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
                Kamera
              </button>
            </div>
          </div>
        </label>
      ) : (
        <div className="rounded-3xl border border-steel bg-onyx p-4 md:p-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-sm font-medium text-pearl">
              {files.length} Datei{files.length === 1 ? "" : "en"} bereit
            </div>
            <div className="text-xs text-ash font-mono">
              {humanSize(totalBytes)} · max. {MAX_FILES}
            </div>
          </div>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li
                key={`${file.name}-${file.size}-${idx}`}
                className="flex items-center gap-3 rounded-xl border border-steel bg-graphite px-3 py-2.5"
              >
                <span className="shrink-0 w-9 h-9 rounded-lg border border-steel bg-onyx flex items-center justify-center text-lime">
                  {file.type === "application/pdf" ? (
                    <FileText className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-pearl font-medium">
                    {file.name}
                  </div>
                  <div className="text-xs text-ash font-mono">
                    {humanSize(file.size)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="shrink-0 text-ash hover:text-coral w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
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
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm text-silver hover:text-pearl rounded-xl border border-steel bg-graphite hover:border-iron px-4 py-3 transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Weitere Datei
              </button>
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="md:hidden flex-1 inline-flex items-center justify-center gap-1.5 text-sm text-lime rounded-xl border border-lime/40 bg-lime/10 px-4 py-3 active:scale-[0.98]"
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
