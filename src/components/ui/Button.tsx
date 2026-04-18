import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** Stretches to full width — great for mobile CTAs. */
  block?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 rounded-xl";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-bone hover:bg-moss shadow-soft",
  accent:
    "bg-brand-amber text-bone hover:bg-brand-amber/90 shadow-soft",
  secondary: "bg-paper text-ink hairline hover:bg-bone-2",
  ghost: "bg-transparent text-ink hover:bg-bone-2",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", block = false, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        block && "w-full",
        className,
      )}
      {...props}
    />
  );
});
