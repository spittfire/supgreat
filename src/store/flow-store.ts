"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Analysis,
  Health,
  Lifestyle,
  Profile,
  Recommendation,
} from "@/lib/types";

export type FlowState = {
  // Step 1 — upload (file not persisted)
  uploadedFile: File | null;
  uploadedFileMeta: { name: string; size: number; type: string } | null;
  consentGiven: boolean;

  analysis: Analysis | null;
  profile: Profile | null;
  health: Health | null;
  lifestyle: Lifestyle | null;
  recommendation: Recommendation | null;

  currentStep: number;

  setFile: (f: File | null) => void;
  setConsent: (v: boolean) => void;
  setAnalysis: (a: Analysis | null) => void;
  setProfile: (p: Profile | null) => void;
  setHealth: (h: Health | null) => void;
  setLifestyle: (l: Lifestyle | null) => void;
  setRecommendation: (r: Recommendation | null) => void;
  setStep: (n: number) => void;
  reset: () => void;
};

const initialState = {
  uploadedFile: null,
  uploadedFileMeta: null,
  consentGiven: false,
  analysis: null,
  profile: null,
  health: null,
  lifestyle: null,
  recommendation: null,
  currentStep: 1,
};

export const useFlowStore = create<FlowState>()(
  persist(
    (set) => ({
      ...initialState,
      setFile: (f) =>
        set({
          uploadedFile: f,
          uploadedFileMeta: f ? { name: f.name, size: f.size, type: f.type } : null,
        }),
      setConsent: (v) => set({ consentGiven: v }),
      setAnalysis: (a) => set({ analysis: a }),
      setProfile: (p) => set({ profile: p }),
      setHealth: (h) => set({ health: h }),
      setLifestyle: (l) => set({ lifestyle: l }),
      setRecommendation: (r) => set({ recommendation: r }),
      setStep: (n) => set({ currentStep: n }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "supgreat-flow",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : (undefined as unknown as Storage),
      ),
      partialize: (state) => ({
        uploadedFileMeta: state.uploadedFileMeta,
        consentGiven: state.consentGiven,
        analysis: state.analysis,
        profile: state.profile,
        health: state.health,
        lifestyle: state.lifestyle,
        currentStep: state.currentStep,
      }),
    },
  ),
);
