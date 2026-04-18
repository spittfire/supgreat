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

export type FileMeta = { name: string; size: number; type: string };

export type FlowState = {
  // Step 1 — upload (raw Files not persisted; only metadata survives reload)
  uploadedFiles: File[];
  uploadedFilesMeta: FileMeta[];
  consentGiven: boolean;

  analysis: Analysis | null;
  profile: Profile | null;
  health: Health | null;
  lifestyle: Lifestyle | null;
  recommendation: Recommendation | null;

  currentStep: number;

  setFiles: (files: File[]) => void;
  addFiles: (files: File[]) => void;
  removeFileAt: (index: number) => void;
  clearFiles: () => void;

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
  uploadedFiles: [] as File[],
  uploadedFilesMeta: [] as FileMeta[],
  consentGiven: false,
  analysis: null,
  profile: null,
  health: null,
  lifestyle: null,
  recommendation: null,
  currentStep: 1,
};

const metaOf = (f: File): FileMeta => ({ name: f.name, size: f.size, type: f.type });

export const useFlowStore = create<FlowState>()(
  persist(
    (set) => ({
      ...initialState,
      setFiles: (files) =>
        set({ uploadedFiles: files, uploadedFilesMeta: files.map(metaOf) }),
      addFiles: (files) =>
        set((s) => {
          const merged = [...s.uploadedFiles, ...files];
          return { uploadedFiles: merged, uploadedFilesMeta: merged.map(metaOf) };
        }),
      removeFileAt: (index) =>
        set((s) => {
          const files = s.uploadedFiles.filter((_, i) => i !== index);
          return { uploadedFiles: files, uploadedFilesMeta: files.map(metaOf) };
        }),
      clearFiles: () => set({ uploadedFiles: [], uploadedFilesMeta: [] }),
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
        uploadedFilesMeta: state.uploadedFilesMeta,
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
