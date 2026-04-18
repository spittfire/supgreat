import type { ReactNode } from "react";
import { Header } from "./Header";
import { Eyebrow } from "./ui/Eyebrow";

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
      <main className="flex-1 relative">
        <section className="mx-auto w-full max-w-4xl px-4 md:px-10 pt-8 md:pt-16 pb-12 md:pb-24">
          <Eyebrow>{label}</Eyebrow>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl leading-[0.98] tracking-tight text-pearl">
            {title}
          </h1>
          {sub && (
            <p className="mt-5 md:mt-6 text-silver max-w-2xl text-base md:text-lg leading-relaxed">
              {sub}
            </p>
          )}
          <div className="mt-10 md:mt-14">{children}</div>
        </section>
      </main>
    </>
  );
}
