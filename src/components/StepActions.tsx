import type { ReactNode } from "react";

type StepActionsProps = {
  children: ReactNode;
};

/**
 * Step-Footer: sticky am unteren Rand auf Mobile, inline auf Desktop.
 * Nutzt mobile-cta-dock für den sanften Carbon-Fade.
 */
export function StepActions({ children }: StepActionsProps) {
  return (
    <div className="mobile-cta-dock mt-10 md:mt-14 md:static md:bg-transparent md:backdrop-blur-0 md:pt-8 md:pb-0 md:border-t md:border-steel">
      <div className="flex items-center justify-between gap-3">{children}</div>
    </div>
  );
}
