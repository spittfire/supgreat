"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { ProgressBar } from "./ProgressBar";
import { ThemeSwitch } from "./ThemeSwitch";

type HeaderProps = {
  currentStep?: number;
  totalSteps?: number;
};

const STEP_ROUTES: Record<number, string> = {
  1: "/",
  2: "/analyze",
  3: "/profile",
  4: "/health",
  5: "/lifestyle",
  6: "/results",
  7: "/box",
  8: "/checkout",
};

export function Header({ currentStep, totalSteps = 8 }: HeaderProps) {
  const router = useRouter();
  const showProgress = typeof currentStep === "number";

  const handleStepClick = (step: number) => {
    const route = STEP_ROUTES[step];
    if (route) router.push(route);
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-carbon/70 border-b border-steel">
      <div className="mx-auto max-w-6xl px-4 md:px-10 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Zur Startseite"
          className="text-lime transition-transform hover:scale-[1.03]"
        >
          <Logo className="h-5 md:h-6 w-auto" />
        </Link>

        {showProgress && (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <ProgressBar
              current={currentStep!}
              total={totalSteps}
              onStepClick={handleStepClick}
            />
          </div>
        )}

        <div className="flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-silver font-mono">
          {showProgress ? (
            <span className="text-pearl">
              <span className="text-lime">{String(currentStep).padStart(2, "0")}</span>
              <span className="text-ash"> / {String(totalSteps).padStart(2, "0")}</span>
            </span>
          ) : (
            <span className="hidden sm:inline">Longevity Lab</span>
          )}
          <ThemeSwitch />
        </div>
      </div>

      {showProgress && (
        <div className="md:hidden px-4 pb-2 flex justify-center">
          <ProgressBar
            current={currentStep!}
            total={totalSteps}
            onStepClick={handleStepClick}
          />
        </div>
      )}
    </header>
  );
}
