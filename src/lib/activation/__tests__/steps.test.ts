import { afterEach, describe, expect, it, vi } from "vitest";
import { activationSteps, describeTimestamp } from "@/lib/activation/steps";
import type { ActivationResolverContext, ActivationStep } from "@/lib/activation/types";

const baseContext: ActivationResolverContext = {
  bootedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  testnetMode: false,
  walletConfirmed: false,
  walletAddress: null,
  identityRegistrationId: null,
  merchantConfigId: null,
  merchantConfigStatus: null,
  webhookUrl: null,
  webhookVerified: false,
  webhookVerifiedAt: null,
  lastHelloGoatSuccessAt: null,
  lastProof: null,
};

const withContext = (overrides: Partial<ActivationResolverContext> = {}) => ({
  ...baseContext,
  ...overrides,
});

const getStep = (id: ActivationStep["id"]) => {
  const step = activationSteps.find((entry) => entry.id === id);
  if (!step) {
    throw new Error(`Activation step ${id} not found`);
  }
  return step;
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("activation step resolvers", () => {
  it("blocks wallet/testnet step until nothing is confirmed", () => {
    const result = getStep("wallet-testnet").resolver(baseContext);
    expect(result.status).toBe("blocked");
  });

  it("marks wallet/testnet ready after confirming wallet but before flipping toggle", () => {
    const result = getStep("wallet-testnet").resolver(
      withContext({ walletConfirmed: true, walletAddress: "0xabc" }),
    );
    expect(result).toEqual({
      status: "ready",
      detail: "Enable Testnet Mode",
    });
  });

  it("marks wallet/testnet done once both checks pass", () => {
    const result = getStep("wallet-testnet").resolver(
      withContext({ walletConfirmed: true, walletAddress: "0xabc", testnetMode: true }),
    );
    expect(result.status).toBe("done");
  });

  it("keeps identity blocked until wallet/testnet gate passes", () => {
    const result = getStep("erc8004-identity").resolver(baseContext);
    expect(result.status).toBe("blocked");
  });

  it("shows identity ready when wallet/testnet are done", () => {
    const result = getStep("erc8004-identity").resolver(
      withContext({ walletConfirmed: true, walletAddress: "0xabc", testnetMode: true }),
    );
    expect(result).toEqual({
      status: "ready",
      detail: "Paste the ERC-8004 registration ID",
    });
  });

  it("marks identity done when ID exists", () => {
    const id = "erc8004_demo";
    const result = getStep("erc8004-identity").resolver(
      withContext({ identityRegistrationId: id }),
    );
    expect(result).toEqual({
      status: "done",
      detail: `Registered as ${id}`,
    });
  });

  it("keeps merchant config ready until status becomes active", () => {
    const result = getStep("x402-merchant-config").resolver(
      withContext({ identityRegistrationId: "erc8004_demo", merchantConfigId: "cfg_1" }),
    );
    expect(result.status).toBe("ready");
  });

  it("marks merchant config done once status is approved", () => {
    const result = getStep("x402-merchant-config").resolver(
      withContext({
        merchantConfigId: "cfg_2",
        merchantConfigStatus: "active",
      }),
    );
    expect(result.status).toBe("done");
  });

  it("keeps webhook blocked until merchant config is active", () => {
    const result = getStep("agent-webhook").resolver(baseContext);
    expect(result.status).toBe("blocked");
  });

  it("shows webhook ready when URL provided but not verified", () => {
    const result = getStep("agent-webhook").resolver(
      withContext({
        merchantConfigId: "cfg_2",
        merchantConfigStatus: "active",
        webhookUrl: "https://agent.test/webhook",
      }),
    );
    expect(result).toEqual({
      status: "ready",
      detail: "Awaiting verification ping",
    });
  });

  it("marks webhook done when verification flag is true", () => {
    const result = getStep("agent-webhook").resolver(
      withContext({
        merchantConfigId: "cfg_2",
        merchantConfigStatus: "active",
        webhookUrl: "https://agent.test/webhook",
        webhookVerified: true,
        webhookVerifiedAt: new Date("2026-02-01T00:00:00.000Z").toISOString(),
      }),
    );
    expect(result.status).toBe("done");
  });

  it("keeps proof blocked until upstream steps succeed", () => {
    const result = getStep("paid-request-proof").resolver(baseContext);
    expect(result.status).toBe("blocked");
  });

  it("moves proof step to ready once webhook verified but no proof stored", () => {
    const result = getStep("paid-request-proof").resolver(
      withContext({
        merchantConfigId: "cfg_2",
        merchantConfigStatus: "active",
        webhookUrl: "https://agent.test/webhook",
        webhookVerified: true,
      }),
    );
    expect(result).toEqual({
      status: "ready",
      detail: "Trigger Hello GOAT flow to capture proof",
    });
  });

  it("marks proof done when a tx hash exists", () => {
    const proof = {
      invoiceId: "inv-123",
      txHash: "0x1234567890abcdef",
      explorerUrl: "https://example/tx/0x1234567890abcdef",
      settledAt: new Date("2026-02-01T00:05:00.000Z").toISOString(),
    };
    const result = getStep("paid-request-proof").resolver(
      withContext({
        merchantConfigId: "cfg_2",
        merchantConfigStatus: "active",
        webhookUrl: "https://agent.test/webhook",
        webhookVerified: true,
        lastProof: proof,
      }),
    );
    expect(result).toEqual({
      status: "done",
      detail: "Proof 0x1234…cdef",
      timestamp: proof.settledAt,
    });
  });
});

describe("describeTimestamp helper", () => {
  it("returns null for invalid inputs", () => {
    expect(describeTimestamp("invalid")).toBeNull();
    expect(describeTimestamp(null)).toBeNull();
  });

  it("returns a stable relative string for valid timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-02T00:00:00.000Z"));
    expect(describeTimestamp("2026-02-01T00:00:00.000Z")).toBe("1 day ago");
  });
});
