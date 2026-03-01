import { formatDistanceToNow } from "date-fns";
import type { ActivationStep, MerchantConfigStatus } from "@/lib/activation/types";

export const describeTimestamp = (timestamp: string | null | undefined) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  return formatDistanceToNow(date, { addSuffix: true });
};

const shorten = (value: string, head = 6, tail = 4) =>
  value.length <= head + tail ? value : `${value.slice(0, head)}…${value.slice(-tail)}`;

const isMerchantActive = (status: MerchantConfigStatus) => {
  if (!status) return false;
  const normalized = status.toLowerCase();
  return normalized === "active" || normalized === "approved";
};

export const activationSteps: ActivationStep[] = [
  {
    id: "wallet-testnet",
    title: "Wallet + Testnet Ready",
    description: "Operator wallet connected on the sandbox network.",
    actionHint: "Connect the wallet used for the beacon and flip Testnet Mode before moving on.",
    resolver: (context) => {
      // Done means: operator wallet is confirmed AND Testnet Mode is enabled.
      const hasWallet = context.walletConfirmed && Boolean(context.walletAddress);
      const onTestnet = context.testnetMode;
      if (hasWallet && onTestnet) {
        return {
          status: "done",
          detail: context.walletAddress
            ? `Wallet ${shorten(context.walletAddress)} on sandbox`
            : "Wallet confirmed",
          timestamp: context.bootedAt,
        };
      }
      if (hasWallet || onTestnet) {
        return {
          status: "ready",
          detail: hasWallet ? "Enable Testnet Mode" : "Connect the operator wallet",
        };
      }
      return {
        status: "blocked",
        detail: "Waiting for wallet confirmation + Testnet toggle",
      };
    },
  },
  {
    id: "erc8004-identity",
    title: "Identity (ERC-8004) Registered",
    description: "ERC-8004 entity ID recorded for the beacon operator.",
    actionHint: "Paste the registration ID once the identity contract emits it.",
    resolver: (context) => {
      // Done means: an ERC-8004 registration ID is stored (from env or persisted input).
      const walletReady = context.walletConfirmed && context.testnetMode;
      if (context.identityRegistrationId) {
        return {
          status: "done",
          detail: `Registered as ${context.identityRegistrationId}`,
        };
      }
      if (walletReady) {
        return {
          status: "ready",
          detail: "Paste the ERC-8004 registration ID",
        };
      }
      return {
        status: "blocked",
        detail: "Wallet/Testnet gate must be satisfied first",
      };
    },
  },
  {
    id: "x402-merchant-config",
    title: "x402 Merchant Config",
    description: "Merchant configuration approved for Hello GOAT invoicing.",
    actionHint: "Store the config ID + mark status once the Atlas team approves it.",
    resolver: (context) => {
      // Done means: merchant config ID exists AND status is active/approved.
      const active = isMerchantActive(context.merchantConfigStatus);
      if (active && context.merchantConfigId) {
        return {
          status: "done",
          detail: `Config ${context.merchantConfigId} marked ${context.merchantConfigStatus}`,
        };
      }
      if (context.merchantConfigId) {
        return {
          status: "ready",
          detail: context.merchantConfigStatus
            ? `Status: ${context.merchantConfigStatus} (needs approval)`
            : "Status unknown – update once approved",
        };
      }
      if (context.identityRegistrationId) {
        return {
          status: "ready",
          detail: "Submit the merchant config ID",
        };
      }
      return {
        status: "blocked",
        detail: "Register an ERC-8004 identity before requesting merchant config",
      };
    },
  },
  {
    id: "agent-webhook",
    title: "Agent Surface Webhook Verified",
    description: "Callback URL responding with 2xx during the verification ping.",
    actionHint: "Paste the webhook URL and mark it verified after hitting the test endpoint.",
    resolver: (context) => {
      // Done means: webhook URL stored AND verification flag recorded.
      if (context.webhookVerified && context.webhookUrl) {
        return {
          status: "done",
          detail: `Webhook verified${context.webhookVerifiedAt ? ` ${describeTimestamp(context.webhookVerifiedAt)}` : ""}`,
          timestamp: context.webhookVerifiedAt ?? undefined,
        };
      }
      if (context.webhookUrl) {
        return {
          status: "ready",
          detail: "Awaiting verification ping",
        };
      }
      if (isMerchantActive(context.merchantConfigStatus)) {
        return {
          status: "ready",
          detail: "Provide the webhook URL for verification",
        };
      }
      return {
        status: "blocked",
        detail: "Merchant config must exist before wiring webhook",
      };
    },
  },
  {
    id: "paid-request-proof",
    title: "First Paid Request Proof",
    description: "Hello GOAT request settled with proof stored for auditing.",
    actionHint: "Use the Hello GOAT panel to send a paid request and persist the proof.",
    resolver: (context) => {
      // Done means: stored proof contains a tx hash & settled timestamp.
      if (context.lastProof) {
        return {
          status: "done",
          detail: `Proof ${shorten(context.lastProof.txHash)}`,
          timestamp: context.lastProof.settledAt,
        };
      }
      if (context.webhookVerified && isMerchantActive(context.merchantConfigStatus)) {
        if (context.lastHelloGoatSuccessAt) {
          return {
            status: "ready",
            detail: "Proof missing for last Hello GOAT run",
          };
        }
        return {
          status: "ready",
          detail: "Trigger Hello GOAT flow to capture proof",
        };
      }
      return {
        status: "blocked",
        detail: "Complete webhook + merchant steps before paying an invoice",
      };
    },
  },
];
