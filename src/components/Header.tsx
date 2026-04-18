import Link from "next/link";
import { Logo } from "./Logo";
import { ProgressBar } from "./ProgressBar";

type HeaderProps = {
  currentStep?: number;
  totalSteps?: number;
};

export function Header({ currentStep, totalSteps = 8 }: HeaderProps) {
  const showProgress = typeof currentStep === "number" && currentStep > 1;
  return (
    <header className="w-full sticky top-0 z-20 bg-bone/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-10 py-4 flex items-center justify-between">
        <Link href="/" aria-label="Zur Startseite" className="text-ink">
          <Logo className="h-5 md:h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
          <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-mist font-mono">
            Longevity Lab
          </span>
        </div>
      </div>
      {showProgress && <ProgressBar current={currentStep!} total={totalSteps} />}
    </header>
  );
}
