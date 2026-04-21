import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
};

const base =
  "group inline-flex items-center justify-center gap-2.5 font-sans font-medium transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 rounded-xl";

const variants: Record<Variant, string> = {
  primary:
    "bg-lime text-ink font-medium hover:bg-lime-2 hover:shadow-glow-lime",
  secondary:
    "bg-graphite text-pearl border border-steel hover:border-iron hover:bg-onyx",
  ghost: "bg-transparent text-silver hover:text-pearl hover:bg-glass",
  destructive:
    "bg-transparent text-coral border border-coral/40 hover:bg-coral/10 hover:border-coral/70",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
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
