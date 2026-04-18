"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="block">
      {label && <div className="text-sm text-ink/80 mb-1.5">{label}</div>}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full h-11 px-3 text-base hairline rounded-lg focus:border-moss",
          className,
        )}
        {...props}
      />
      {hint && <p className="mt-1 text-xs text-mist">{hint}</p>}
    </label>
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="block">
      {label && <div className="text-sm text-ink/80 mb-1.5">{label}</div>}
      <textarea
        ref={ref}
        id={inputId}
        rows={3}
        className={cn(
          "w-full px-3 py-2.5 text-base hairline rounded-lg focus:border-moss resize-y",
          className,
        )}
        {...props}
      />
      {hint && <p className="mt-1 text-xs text-mist">{hint}</p>}
    </label>
  );
});
