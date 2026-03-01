"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

export type ControlPlaneData = {
  onboardingCaseId: string;
  onboardingOpsChannel: string;
  onboardingStatus: string;
  identityRegistryId: string;
  identityStatus: string;
  identityLastAttestedAt: string;
  paymentsMerchantConfigId: string;
  paymentsLastValidatedAt: string;
  transactionsChannelId: string;
  transactionsEscrowAddress: string;
  transactionsLastBatchId: string;
  webhookUrl: string;
  webhookSecret: string;
  webhookStatus: string;
  telegramBotHandle: string;
};

export type ControlPlaneEditableField = keyof ControlPlaneData;

type ControlPlaneState = ControlPlaneData & {
  setField: (field: ControlPlaneEditableField, value: string) => void;
  markPaymentsValidatedNow: () => void;
  markIdentityAttestedNow: () => void;
  toggleWebhookStatus: () => void;
};

const envDefaults: Partial<ControlPlaneData> = {
  onboardingCaseId: process.env.NEXT_PUBLIC_ONBOARDING_CASE_ID,
  onboardingOpsChannel: process.env.NEXT_PUBLIC_ONBOARDING_OPS_CHANNEL,
  identityRegistryId: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ID,
  paymentsMerchantConfigId: process.env.NEXT_PUBLIC_MERCHANT_CONFIG_ID,
  paymentsLastValidatedAt: process.env.NEXT_PUBLIC_MERCHANT_LAST_VALIDATION,
  transactionsChannelId: process.env.NEXT_PUBLIC_SETTLEMENT_CHANNEL_ID,
  transactionsEscrowAddress: process.env.NEXT_PUBLIC_ESCROW_ADDRESS,
  webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL,
  webhookSecret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET,
  telegramBotHandle: process.env.NEXT_PUBLIC_TELEGRAM_BOT_HANDLE,
};

const baseState: ControlPlaneData = {
  onboardingCaseId: envDefaults.onboardingCaseId ?? "",
  onboardingOpsChannel: envDefaults.onboardingOpsChannel ?? "",
  onboardingStatus: "Awaiting identity artifacts",
  identityRegistryId: envDefaults.identityRegistryId ?? "",
  identityStatus: "ERC-8004 review pending",
  identityLastAttestedAt: "",
  paymentsMerchantConfigId: envDefaults.paymentsMerchantConfigId ?? "",
  paymentsLastValidatedAt: envDefaults.paymentsLastValidatedAt ?? "",
  transactionsChannelId: envDefaults.transactionsChannelId ?? "",
  transactionsEscrowAddress:
    envDefaults.transactionsEscrowAddress ?? "0x8e6b9ab056a3d3610f37abc1ed7b1ea15c5cface",
  transactionsLastBatchId: "batch_2026-02-27",
  webhookUrl: envDefaults.webhookUrl ?? "",
  webhookSecret: envDefaults.webhookSecret ?? "",
  webhookStatus: "Requires human confirmation",
  telegramBotHandle: envDefaults.telegramBotHandle ?? "",
};

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

export const useControlPlaneStore = create<ControlPlaneState>()(
  persist(
    (set) => ({
      ...baseState,
      setField: (field, value) =>
        set(() => ({ [field]: value }) as Partial<ControlPlaneData>),
      markPaymentsValidatedNow: () =>
        set(() => ({ paymentsLastValidatedAt: new Date().toISOString() })),
      markIdentityAttestedNow: () =>
        set(() => ({
          identityLastAttestedAt: new Date().toISOString(),
          identityStatus: "ERC-8004 attested",
        })),
      toggleWebhookStatus: () =>
        set((state) => ({
          webhookStatus:
            state.webhookStatus === "Verified (auto)"
              ? "Requires human confirmation"
              : "Verified (auto)",
        })),
    }),
    {
      name: "atlas-control-plane",
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        onboardingCaseId: state.onboardingCaseId,
        onboardingOpsChannel: state.onboardingOpsChannel,
        onboardingStatus: state.onboardingStatus,
        identityRegistryId: state.identityRegistryId,
        identityStatus: state.identityStatus,
        identityLastAttestedAt: state.identityLastAttestedAt,
        paymentsMerchantConfigId: state.paymentsMerchantConfigId,
        paymentsLastValidatedAt: state.paymentsLastValidatedAt,
        transactionsChannelId: state.transactionsChannelId,
        transactionsEscrowAddress: state.transactionsEscrowAddress,
        transactionsLastBatchId: state.transactionsLastBatchId,
        webhookUrl: state.webhookUrl,
        webhookSecret: state.webhookSecret,
        webhookStatus: state.webhookStatus,
        telegramBotHandle: state.telegramBotHandle,
      }),
    },
  ),
);
