"use client";

import { useCallback, useRef, useState } from "react";
import { FileUp, FileText, Image as ImageIcon, X, Plus, Camera } from "lucide-react";
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
        // Avoid obvious duplicates (same name+size)
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
          acceptMany(e.dataTransfer.files);
        }}
        className={cn(
          "group block cursor-pointer select-none rounded-lg border border-dashed transition-colors",
          dragOver
            ? "border-moss bg-bone-2"
            : "border-line hover:border-moss hover:bg-bone-2",
          !empty && "bg-bone-2 border-moss",
          empty ? "p-8 md:p-12" : "p-5",
        )}
      >
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
          <div className="flex flex-col items-center gap-4 text-center">
            <span
              aria-hidden
              className="w-12 h-12 rounded-full hairline flex items-center justify-center text-moss"
            >
              <FileUp strokeWidth={1.3} />
            </span>
            <div>
              <p className="text-ink text-lg font-medium">Bluttest hochladen</p>
              <p className="text-sm text-mist mt-1">
                PDF oder Foto · mehrere Dateien möglich · Drag &amp; Drop oder antippen
              </p>
            </div>
            <div className="flex gap-3 mt-2 flex-wrap justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs text-mist hairline rounded-full px-3 py-1">
                <FileText className="w-3.5 h-3.5" strokeWidth={1.5} /> PDF
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-mist hairline rounded-full px-3 py-1">
                <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} /> JPG / PNG
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  cameraRef.current?.click();
                }}
                className="md:hidden inline-flex items-center gap-1.5 text-xs text-moss hairline rounded-full px-3 py-1"
              >
                <Camera className="w-3.5 h-3.5" strokeWidth={1.5} /> Kamera
              </button>
            </div>
          </div>
        ) : (
          <div onClick={(e) => e.preventDefault()}>
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-sm text-ink font-medium">
                {files.length} Datei{files.length === 1 ? "" : "en"} bereit
              </div>
              <div className="text-xs text-mist font-mono">
                {humanSize(files.reduce((s, f) => s + f.size, 0))} gesamt · max. {MAX_FILES}
              </div>
            </div>
            <ul className="space-y-2">
              {files.map((file, idx) => (
                <li
                  key={`${file.name}-${file.size}-${idx}`}
                  className="flex items-center gap-3 hairline rounded-md bg-bone px-3 py-2"
                >
                  <span className="shrink-0 w-8 h-8 rounded-md hairline flex items-center justify-center text-moss">
                    {file.type === "application/pdf" ? (
                      <FileText className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-ink">{file.name}</div>
                    <div className="text-xs text-mist font-mono">
                      {humanSize(file.size)} · {file.type || "Datei"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeAt(idx);
                    }}
                    className="shrink-0 text-mist hover:text-coral p-1"
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
                  onClick={(e) => {
                    e.preventDefault();
                    inputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-moss hairline rounded-md px-3 py-2 hover:bg-bone"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  Weitere Datei hinzufügen
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    cameraRef.current?.click();
                  }}
                  className="md:hidden inline-flex items-center gap-1.5 text-sm text-moss hairline rounded-md px-3 py-2 hover:bg-bone"
                >
                  <Camera className="w-4 h-4" strokeWidth={1.5} />
                  Kamera
                </button>
              </div>
            )}
          </div>
        )}
      </label>

      {error && <p className="mt-3 text-sm text-coral">{error}</p>}
    </div>
  );
}
