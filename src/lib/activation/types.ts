import type { ProofRecord } from "@/lib/x402/types";

export type ActivationStatus = "blocked" | "ready" | "done";

export type MerchantConfigStatus = "draft" | "submitted" | "pending" | "approved" | "active" | "rejected" | null;

export interface ActivationResolverContext {
  bootedAt: string;
  testnetMode: boolean;
  walletConfirmed: boolean;
  walletAddress: string | null;
  identityRegistrationId: string | null;
  merchantConfigId: string | null;
  merchantConfigStatus: MerchantConfigStatus;
  webhookUrl: string | null;
  webhookVerified: boolean;
  webhookVerifiedAt: string | null;
  lastHelloGoatSuccessAt: string | null;
  lastProof: ProofRecord | null;
}

export interface ActivationStatusResult {
  status: ActivationStatus;
  detail: string;
  timestamp?: string | null;
}

export interface ActivationStep {
  id: string;
  title: string;
  description: string;
  actionHint: string;
  resolver: (context: ActivationResolverContext) => ActivationStatusResult;
}
