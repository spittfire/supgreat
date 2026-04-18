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
      {label && <div className="text-sm text-ink/80 mb-2 font-medium">{label}</div>}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full h-12 px-4 text-base bg-paper hairline shadow-soft rounded-xl focus:border-moss placeholder:text-mist/70",
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
      {label && <div className="text-sm text-ink/80 mb-2 font-medium">{label}</div>}
      <textarea
        ref={ref}
        id={inputId}
        rows={3}
        className={cn(
          "w-full px-4 py-3 text-base bg-paper hairline shadow-soft rounded-xl focus:border-moss resize-y placeholder:text-mist/70",
          className,
        )}
        {...props}
      />
      {hint && <p className="mt-1 text-xs text-mist">{hint}</p>}
    </label>
  );
});
