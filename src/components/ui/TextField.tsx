"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  icon?: LucideIcon;
  unit?: string;
  error?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, icon: Icon, unit, className, id, error = false, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="block">
      {label && (
        <div
          className={cn(
            "mb-2.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium",
            error ? "text-coral" : "text-silver",
          )}
        >
          {Icon && (
            <Icon
              className={cn("w-3.5 h-3.5", error ? "text-coral" : "text-lime")}
              strokeWidth={1.5}
            />
          )}
          {label}
        </div>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error || undefined}
          className={cn(
            "w-full h-12 px-4 text-base rounded-xl border bg-onyx text-pearl placeholder:text-ash",
            "transition-all focus:bg-graphite focus:outline-none",
            error
              ? "border-coral focus:border-coral"
              : "border-steel focus:border-lime",
            unit && "pr-14",
            className,
          )}
          {...props}
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ash font-mono">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-ash">{hint}</p>}
    </label>
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  icon?: LucideIcon;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, icon: Icon, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="block">
      {label && (
        <div className="mb-2.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-silver font-medium">
          {Icon && <Icon className="w-3.5 h-3.5 text-lime" strokeWidth={1.5} />}
          {label}
        </div>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={3}
        className={cn(
          "w-full px-4 py-3 text-base rounded-xl border border-steel bg-onyx text-pearl placeholder:text-ash resize-y",
          "transition-all focus:border-lime focus:bg-graphite focus:outline-none",
          className,
        )}
        {...props}
      />
      {hint && <p className="mt-1.5 text-xs text-ash">{hint}</p>}
    </label>
  );
});
