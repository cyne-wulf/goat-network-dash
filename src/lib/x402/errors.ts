export type HelloGoatErrorCode =
  | "MISSING_ENV"
  | "RPC_UNAUTHORIZED"
  | "RPC_UNREACHABLE"
  | "INSUFFICIENT_FUNDS"
  | "PAYMENT_FAILED";

export class HelloGoatError extends Error {
  code: HelloGoatErrorCode;
  hint?: string;

  constructor(code: HelloGoatErrorCode, message: string, hint?: string) {
    super(message);
    this.name = "HelloGoatError";
    this.code = code;
    this.hint = hint;
  }
}

export const hints = {
  missingEnv:
    "Set CHAIN_RPC_URL, GOAT_PAYER_PRIVATE_KEY, GOAT_RECEIVER_ADDRESS, and CHAIN_EXPLORER_BASE in .env.local",
  rpcUnauthorized: "Confirm CHAIN_RPC_URL allows your wallet and credentials",
  rpcUnreachable: "Verify the RPC URL is correct and the endpoint is online",
  insufficientFunds: "Fund GOAT_PAYER_PRIVATE_KEY with enough testnet ETH",
  generic: "Inspect server logs for full context and retry",
};

export function asHelloGoatError(error: unknown): HelloGoatError {
  if (error instanceof HelloGoatError) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  return new HelloGoatError("PAYMENT_FAILED", message, hints.generic);
}

export function translatePaymentError(error: unknown): HelloGoatError {
  if (error instanceof HelloGoatError) return error;

  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (normalized.includes("insufficient funds")) {
    return new HelloGoatError(
      "INSUFFICIENT_FUNDS",
      "Wallet is out of funds",
      hints.insufficientFunds,
    );
  }

  if (normalized.includes("401") || normalized.includes("403") || normalized.includes("unauthorized")) {
    return new HelloGoatError(
      "RPC_UNAUTHORIZED",
      "RPC rejected the call (401/403)",
      hints.rpcUnauthorized,
    );
  }

  if (
    normalized.includes("fetch failed") ||
    normalized.includes("connect") ||
    normalized.includes("timeout") ||
    normalized.includes("unreachable")
  ) {
    return new HelloGoatError("RPC_UNREACHABLE", "RPC endpoint is unreachable", hints.rpcUnreachable);
  }

  return new HelloGoatError("PAYMENT_FAILED", message || "Payment execution failed", hints.generic);
}
