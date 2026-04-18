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
        <section className="mx-auto w-full max-w-4xl px-6 md:px-10 pt-10 md:pt-14 pb-16 md:pb-24">
          <p className="text-xs tracking-[0.2em] uppercase text-moss mb-6 font-mono">
            Schritt {step} · {label}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-[1.08] tracking-tight">
            {title}
          </h1>
          {sub && <p className="mt-4 text-ink/70 max-w-prose text-lg">{sub}</p>}
          <div className="mt-10 md:mt-14">{children}</div>
        </section>
      </main>
    </>
  );
}
