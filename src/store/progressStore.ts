"use client";

import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import type { MerchantConfigStatus } from "@/lib/activation/types";
import type { HelloGoatResponse, ProofRecord } from "@/lib/x402/types";

export interface ProgressState {
  lastHelloGoatSuccessAt: string | null;
  lastProof: ProofRecord | null;
  proofs: ProofRecord[];
  walletConfirmed: boolean;
  walletAddress: string | null;
  identityRegistrationId: string | null;
  merchantConfigId: string | null;
  merchantConfigStatus: MerchantConfigStatus | null;
  webhookUrl: string | null;
  webhookVerified: boolean;
  webhookVerifiedAt: string | null;
  recordHelloGoatSuccess: (payload: HelloGoatResponse) => void;
  recordProof: (proof: ProofRecord) => void;
  confirmWallet: (address?: string | null) => void;
  clearWalletConfirmation: () => void;
  setIdentityRegistrationId: (id: string | null) => void;
  setMerchantConfig: (payload: {
    id: string | null;
    status: MerchantConfigStatus | null;
  }) => void;
  setWebhookVerification: (payload: { url: string | null; verified: boolean }) => void;
}

const safeStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(name);
  },
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      lastHelloGoatSuccessAt: null,
      lastProof: null,
      proofs: [],
      walletConfirmed: false,
      walletAddress: null,
      identityRegistrationId: null,
      merchantConfigId: null,
      merchantConfigStatus: null,
      webhookUrl: null,
      webhookVerified: false,
      webhookVerifiedAt: null,
      recordHelloGoatSuccess: (payload) =>
        set((state) => ({
          lastHelloGoatSuccessAt: payload.receipt.paidAt,
          lastProof: payload.proof,
          proofs: [payload.proof, ...state.proofs].slice(0, 5),
        })),
      recordProof: (proof) =>
        set((state) => ({
          lastProof: proof,
          proofs: [proof, ...state.proofs].slice(0, 5),
        })),
      confirmWallet: (address) =>
        set(() => ({
          walletConfirmed: true,
          walletAddress: address?.trim() ? address.trim() : null,
        })),
      clearWalletConfirmation: () =>
        set(() => ({
          walletConfirmed: false,
          walletAddress: null,
        })),
      setIdentityRegistrationId: (id) =>
        set(() => ({
          identityRegistrationId: id?.trim() ? id.trim() : null,
        })),
      setMerchantConfig: ({ id, status }) =>
        set(() => ({
          merchantConfigId: id?.trim() ? id.trim() : null,
          merchantConfigStatus: status ?? null,
        })),
      setWebhookVerification: ({ url, verified }) =>
        set(() => ({
          webhookUrl: url?.trim() ? url.trim() : null,
          webhookVerified: verified,
          webhookVerifiedAt: verified ? new Date().toISOString() : null,
        })),
    }),
    {
      name: "activation-progress",
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        lastHelloGoatSuccessAt: state.lastHelloGoatSuccessAt,
        lastProof: state.lastProof,
        proofs: state.proofs,
        walletConfirmed: state.walletConfirmed,
        walletAddress: state.walletAddress,
        identityRegistrationId: state.identityRegistrationId,
        merchantConfigId: state.merchantConfigId,
        merchantConfigStatus: state.merchantConfigStatus,
        webhookUrl: state.webhookUrl,
        webhookVerified: state.webhookVerified,
        webhookVerifiedAt: state.webhookVerifiedAt,
      }),
    }
  )
);
