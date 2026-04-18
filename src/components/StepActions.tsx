import type { ReactNode } from "react";

type StepActionsProps = {
  children: ReactNode;
};

/**
 * Footer-Leiste für Step-Pages. Auf Mobile sticky am unteren Rand mit
 * Fade-Verlauf, damit die CTA ohne Scroll erreichbar ist (wie in modernen Apps).
 */
export function StepActions({ children }: StepActionsProps) {
  return (
    <div className="mobile-cta-dock mt-10 md:mt-12 md:static md:bg-transparent md:pt-6 md:pb-0">
      <div className="flex items-center justify-between gap-3">{children}</div>
    </div>
  );
}
