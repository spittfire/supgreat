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
    <header className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 pt-8 pb-6 flex items-center justify-between">
        <Link href="/" aria-label="Zur Startseite" className="text-ink">
          <Logo className="h-6 md:h-7 w-auto" />
        </Link>
        <div className="text-xs md:text-sm tracking-wide uppercase text-mist font-mono">
          Longevity Lab
        </div>
      </div>
      {showProgress && <ProgressBar current={currentStep!} total={totalSteps} />}
    </header>
  );
}
