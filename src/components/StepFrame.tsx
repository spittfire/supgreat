import type { ReactNode } from "react";
import { Header } from "./Header";

type StepFrameProps = {
  step: number;
  label: string;
  title: ReactNode;
  sub?: ReactNode;
  children: ReactNode;
};

export function StepFrame({ step, label, title, sub, children }: StepFrameProps) {
  return (
    <>
      <Header currentStep={step} />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-4 md:px-10 pt-6 md:pt-10 pb-12 md:pb-24">
          <p className="text-[11px] tracking-[0.22em] uppercase text-brand-amber mb-3 font-mono font-semibold">
            {label}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] tracking-tight">
            {title}
          </h1>
          {sub && (
            <p className="mt-3 text-ink/70 max-w-prose text-base md:text-lg leading-relaxed">
              {sub}
            </p>
          )}
          <div className="mt-8 md:mt-12">{children}</div>
        </section>
      </main>
    </>
  );
}
