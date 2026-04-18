"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type MultiSelectChipsProps = {
  values: string[];
  onChange: (v: string[]) => void;
  options: string[];
  searchable?: boolean;
  max?: number;
  cols?: 1 | 2 | 3;
  ariaLabel?: string;
};

export function MultiSelectChips({
  values,
  onChange,
  options,
  searchable = false,
  max,
  cols = 2,
  ariaLabel,
}: MultiSelectChipsProps) {
  const [query, setQuery] = useState("");
  const selected = useMemo(() => new Set(values), [values]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (opt: string) => {
    if (selected.has(opt)) {
      onChange(values.filter((v) => v !== opt));
      return;
    }
    if (typeof max === "number" && values.length >= max) return;
    onChange([...values, opt]);
  };

  const grid =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div aria-label={ariaLabel}>
      {searchable && (
        <div className="relative mb-3">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash"
            strokeWidth={1.5}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen …"
            className="w-full h-11 pl-9 pr-3 text-sm rounded-xl border border-steel bg-onyx text-pearl placeholder:text-ash focus:border-lime focus:outline-none"
          />
        </div>
      )}
      <div className={cn("grid gap-2", grid)}>
        {filtered.map((opt) => {
          const active = selected.has(opt);
          const disabled = !active && typeof max === "number" && values.length >= max;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => toggle(opt)}
              disabled={disabled}
              aria-pressed={active}
              className={cn(
                "text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-between gap-2 active:scale-[0.98]",
                active
                  ? "border border-lime bg-lime/10 text-lime shadow-glow-lime"
                  : disabled
                    ? "border border-steel bg-onyx text-ash opacity-60 cursor-not-allowed"
                    : "border border-steel bg-onyx text-silver hover:border-iron hover:text-pearl",
              )}
            >
              <span>{opt}</span>
              {active && <Check className="w-4 h-4 shrink-0" strokeWidth={2} />}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-ash col-span-full">Nichts gefunden.</p>
        )}
      </div>
      {typeof max === "number" && (
        <p className="mt-2 text-xs text-ash font-mono">
          {values.length} / {max}
        </p>
      )}
    </div>
  );
}
