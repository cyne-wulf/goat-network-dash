"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { activationSteps } from "@/lib/activation/steps";
import type {
  ActivationResolverContext,
  ActivationStatus,
  MerchantConfigStatus,
} from "@/lib/activation/types";
import { useProgressStore } from "@/store/progressStore";
import { useConsoleSettings } from "@/store/consoleSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const statusStyles: Record<ActivationStatus, { label: string; className: string }> = {
  done: { label: "Done", className: "bg-emerald-100 text-emerald-700" },
  ready: { label: "Ready", className: "bg-amber-100 text-amber-700" },
  blocked: { label: "Blocked", className: "bg-rose-100 text-rose-700" },
};

const merchantStatusOptions: MerchantConfigStatus[] = [
  "draft",
  "submitted",
  "pending",
  "approved",
  "active",
  "rejected",
];

export function ActivationChecklist() {
  const bootedAt = useMemo(() => new Date().toISOString(), []);
  const progress = useProgressStore((state) => ({
    lastHelloGoatSuccessAt: state.lastHelloGoatSuccessAt,
    lastProof: state.lastProof,
    walletConfirmed: state.walletConfirmed,
    walletAddress: state.walletAddress,
    confirmWallet: state.confirmWallet,
    clearWalletConfirmation: state.clearWalletConfirmation,
    identityRegistrationId: state.identityRegistrationId,
    setIdentityRegistrationId: state.setIdentityRegistrationId,
    merchantConfigId: state.merchantConfigId,
    merchantConfigStatus: state.merchantConfigStatus,
    setMerchantConfig: state.setMerchantConfig,
    webhookUrl: state.webhookUrl,
    webhookVerified: state.webhookVerified,
    webhookVerifiedAt: state.webhookVerifiedAt,
    setWebhookVerification: state.setWebhookVerification,
  }));

  const { testnetMode, setTestnetMode } = useConsoleSettings((state) => ({
    testnetMode: state.testnetMode,
    setTestnetMode: state.setTestnetMode,
  }));

  const envWallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS ?? null;
  const envIdentity = process.env.NEXT_PUBLIC_ERC8004_ID ?? null;
  const envMerchantId = process.env.NEXT_PUBLIC_X402_MERCHANT_ID ?? null;
  const envMerchantStatus = (process.env.NEXT_PUBLIC_X402_MERCHANT_STATUS ??
    null) as MerchantConfigStatus | null;
  const envWebhookUrl = process.env.NEXT_PUBLIC_AGENT_WEBHOOK_URL ?? null;
  const envWebhookVerified = process.env.NEXT_PUBLIC_AGENT_WEBHOOK_VERIFIED === "true";
  const envWebhookVerifiedAt = process.env.NEXT_PUBLIC_AGENT_WEBHOOK_VERIFIED_AT ?? null;

  const walletAddress = progress.walletAddress ?? envWallet ?? null;
  const walletConfirmed = progress.walletConfirmed || Boolean(walletAddress);

  const identityRegistrationId = progress.identityRegistrationId ?? envIdentity ?? null;
  const merchantConfigId = progress.merchantConfigId ?? envMerchantId ?? null;
  const merchantConfigStatus = progress.merchantConfigStatus ?? envMerchantStatus ?? null;
  const webhookUrl = progress.webhookUrl ?? envWebhookUrl ?? null;
  const webhookVerified =
    progress.webhookVerified || (envWebhookVerified && Boolean(webhookUrl));
  const webhookVerifiedAt = progress.webhookVerified
    ? progress.webhookVerifiedAt
    : envWebhookVerified
      ? envWebhookVerifiedAt
      : null;

  const [walletDraft, setWalletDraft] = useState(walletAddress ?? "");
  const [identityDraft, setIdentityDraft] = useState(identityRegistrationId ?? "");
  const [merchantIdDraft, setMerchantIdDraft] = useState(merchantConfigId ?? "");
  const [merchantStatusDraft, setMerchantStatusDraft] = useState<MerchantConfigStatus>(
    merchantConfigStatus ?? "draft",
  );
  const [webhookDraft, setWebhookDraft] = useState(webhookUrl ?? "");

  const context = useMemo<ActivationResolverContext>(
    () => ({
      bootedAt,
      testnetMode,
      walletConfirmed,
      walletAddress,
      identityRegistrationId,
      merchantConfigId,
      merchantConfigStatus,
      webhookUrl,
      webhookVerified,
      webhookVerifiedAt,
      lastHelloGoatSuccessAt: progress.lastHelloGoatSuccessAt,
      lastProof: progress.lastProof,
    }),
    [
      bootedAt,
      identityRegistrationId,
      merchantConfigId,
      merchantConfigStatus,
      progress.lastHelloGoatSuccessAt,
      progress.lastProof,
      testnetMode,
      walletAddress,
      walletConfirmed,
      webhookUrl,
      webhookVerified,
      webhookVerifiedAt,
    ],
  );

  const evaluatedSteps = useMemo(
    () => activationSteps.map((step) => ({ step, result: step.resolver(context) })),
    [context],
  );

  const completed = evaluatedSteps.filter(({ result }) => result.status === "done").length;
  const percent = Math.round((completed / activationSteps.length) * 100);

  return (
    <Card className="border-zinc-200 bg-white/80">
      <CardHeader>
        <CardTitle className="text-2xl">Activation Checklist</CardTitle>
        <CardDescription>
          These five non-negotiable steps mirror the Sub-agent Beacon specification. Statuses update
          from persisted stores, env vars, and recent Hello GOAT runs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>
              {completed} / {activationSteps.length} done
            </span>
            <span>{percent}%</span>
          </div>
          <Progress value={percent} className="mt-2" />
        </div>

        <div className="space-y-4">
          {evaluatedSteps.map(({ step, result }) => (
            <div
              key={step.id}
              className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                    {step.title}
                  </p>
                  <h3 className="text-xl font-bold text-zinc-900">{result.detail}</h3>
                  <p className="mt-2 text-sm text-zinc-600">{step.description}</p>
                </div>
                <Badge className={`px-3 py-1 text-xs font-semibold ${statusStyles[result.status].className}`}>
                  {statusStyles[result.status].label}
                </Badge>
              </div>
              <p className="mt-3 text-sm font-medium text-zinc-700">{step.actionHint}</p>
              <div className="mt-4">
                <StepActions
                  stepId={step.id}
                  testnetMode={testnetMode}
                  setTestnetMode={setTestnetMode}
                  walletDraft={walletDraft}
                  setWalletDraft={setWalletDraft}
                  walletAddress={walletAddress}
                  walletConfirmed={walletConfirmed}
                  confirmWallet={progress.confirmWallet}
                  clearWalletConfirmation={progress.clearWalletConfirmation}
                  identityDraft={identityDraft}
                  setIdentityDraft={setIdentityDraft}
                  setIdentityRegistrationId={progress.setIdentityRegistrationId}
                  merchantIdDraft={merchantIdDraft}
                  setMerchantIdDraft={setMerchantIdDraft}
                  merchantStatusDraft={merchantStatusDraft}
                  setMerchantStatusDraft={setMerchantStatusDraft}
                  setMerchantConfig={progress.setMerchantConfig}
                  webhookDraft={webhookDraft}
                  setWebhookDraft={setWebhookDraft}
                  webhookVerified={webhookVerified}
                  setWebhookVerification={progress.setWebhookVerification}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type StepActionProps = {
  stepId: string;
  testnetMode: boolean;
  setTestnetMode: (value: boolean) => void;
  walletDraft: string;
  setWalletDraft: (value: string) => void;
  walletAddress: string | null;
  walletConfirmed: boolean;
  confirmWallet: (address?: string | null) => void;
  clearWalletConfirmation: () => void;
  identityDraft: string;
  setIdentityDraft: (value: string) => void;
  setIdentityRegistrationId: (id: string | null) => void;
  merchantIdDraft: string;
  setMerchantIdDraft: (value: string) => void;
  merchantStatusDraft: MerchantConfigStatus;
  setMerchantStatusDraft: (value: MerchantConfigStatus) => void;
  setMerchantConfig: (payload: { id: string | null; status: MerchantConfigStatus | null }) => void;
  webhookDraft: string;
  setWebhookDraft: (value: string) => void;
  webhookVerified: boolean;
  setWebhookVerification: (payload: { url: string | null; verified: boolean }) => void;
};

function StepActions(props: StepActionProps) {
  const {
    stepId,
    testnetMode,
    setTestnetMode,
    walletDraft,
    setWalletDraft,
    walletAddress,
    walletConfirmed,
    confirmWallet,
    clearWalletConfirmation,
    identityDraft,
    setIdentityDraft,
    setIdentityRegistrationId,
    merchantIdDraft,
    setMerchantIdDraft,
    merchantStatusDraft,
    setMerchantStatusDraft,
    setMerchantConfig,
    webhookDraft,
    setWebhookDraft,
    webhookVerified,
    setWebhookVerification,
  } = props;

  switch (stepId) {
    case "wallet-testnet":
      return (
        <div className="space-y-3">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              confirmWallet(walletDraft || walletAddress);
            }}
          >
            <input
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="0x wallet address"
              value={walletDraft}
              onChange={(event) => setWalletDraft(event.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Save wallet
              </Button>
              {walletConfirmed && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => clearWalletConfirmation()}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-zinc-200 px-3 py-2 text-sm">
            <Switch
              checked={testnetMode}
              onCheckedChange={(checked) => setTestnetMode(checked)}
              aria-label="Toggle testnet mode"
              size="sm"
            />
            <span>Testnet Mode {testnetMode ? "enabled" : "disabled"}</span>
          </div>
        </div>
      );
    case "erc8004-identity":
      return (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setIdentityRegistrationId(identityDraft || null);
          }}
        >
          <input
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            placeholder="erc8004_xxxxxx"
            value={identityDraft}
            onChange={(event) => setIdentityDraft(event.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Save ID
            </Button>
            {identityDraft && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIdentityDraft("");
                  setIdentityRegistrationId(null);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      );
    case "x402-merchant-config":
      return (
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setMerchantConfig({ id: merchantIdDraft || null, status: merchantStatusDraft });
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="merchant-config-id"
              value={merchantIdDraft}
              onChange={(event) => setMerchantIdDraft(event.target.value)}
            />
            <select
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              value={merchantStatusDraft ?? "draft"}
              onChange={(event) =>
                setMerchantStatusDraft(event.target.value as MerchantConfigStatus)
              }
            >
              {merchantStatusOptions.map((option) => (
                <option key={option ?? "none"} value={option ?? ""}>
                  {option ?? "unknown"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Save merchant config
            </Button>
            {merchantIdDraft && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setMerchantIdDraft("");
                  setMerchantConfig({ id: null, status: null });
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      );
    case "agent-webhook":
      return (
        <div className="space-y-3">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setWebhookVerification({ url: webhookDraft, verified: webhookVerified });
            }}
          >
            <input
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="https://agent.example/webhook"
              value={webhookDraft}
              onChange={(event) => setWebhookDraft(event.target.value)}
            />
            <Button type="submit" size="sm">
              Save URL
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setWebhookVerification({ url: webhookDraft, verified: true })}
            >
              Mark verified
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setWebhookVerification({ url: webhookDraft, verified: false })}
            >
              Mark unverified
            </Button>
          </div>
        </div>
      );
    case "paid-request-proof":
      return (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href="/#hello-goat">Run Hello GOAT</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/logs">Open logs</Link>
          </Button>
        </div>
      );
    default:
      return null;
  }
}
