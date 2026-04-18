import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-paper hairline shadow-soft rounded-2xl p-5 md:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
