import type { ReactNode } from "react";

type StepActionsProps = {
  children: ReactNode;
};

/**
 * Step-Footer: auf Mobile sticky am Viewport-Boden mit Full-Bleed Carbon-Fade,
 * auf Desktop ruhige Inline-Zeile mit Hairline-Separator.
 * Styling komplett in globals.css (.step-actions-dock) damit die Breakpoints
 * nicht gegen Tailwind-Utility-Overrides kämpfen.
 */
export function StepActions({ children }: StepActionsProps) {
  return (
    <div className="step-actions-dock">
      <div className="flex items-center justify-between gap-3">{children}</div>
    </div>
  );
}
