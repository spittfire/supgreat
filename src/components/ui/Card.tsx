import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bone-2/60 hairline rounded-lg p-5 md:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
