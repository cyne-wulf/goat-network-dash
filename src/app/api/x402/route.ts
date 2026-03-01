import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  Invoice,
  InvoiceSchema,
  LogEntry,
  PaymentActionSchema,
} from "@/lib/x402/types";
import { appendLog } from "@/lib/x402/logStore";
import { executeHelloGoatPayment } from "@/lib/x402/proofService";
import { asHelloGoatError, HelloGoatError, HelloGoatErrorCode } from "@/lib/x402/errors";

function buildInvoice(): Invoice {
  const now = new Date();
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    amount: {
      currency: "ETH",
      value: "0.000001",
    },
    instructions: {
      payer: "Hello GOAT",
      receiver: process.env.GOAT_RECEIVER_ADDRESS ?? "<GOAT_RECEIVER_ADDRESS>",
      chain: process.env.NEXT_PUBLIC_RPC_URL ?? "CHAIN_RPC_URL",
      memo: "POST /api/x402 { invoiceId, action: 'pay' }",
    },
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
  };

  return InvoiceSchema.parse(invoice);
}

async function logEvent(
  entry: Omit<LogEntry, "timestamp" | "id"> & { payload?: Record<string, unknown> },
) {
  await appendLog({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  });
}

const errorStatusMap: Record<HelloGoatErrorCode, number> = {
  MISSING_ENV: 500,
  RPC_UNAUTHORIZED: 401,
  RPC_UNREACHABLE: 503,
  INSUFFICIENT_FUNDS: 402,
  PAYMENT_FAILED: 500,
};

export async function POST(req: NextRequest) {
  const contextId = crypto.randomUUID();
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  await logEvent({
    level: "info",
    event: "x402.request.received",
    type: "request",
    direction: "client",
    payload: {
      requestId: contextId,
      method: req.method,
      path: req.nextUrl.pathname,
      body,
    },
  });

  if (!body) {
    const invoice = buildInvoice();
    await logEvent({
      level: "info",
      event: "x402.invoice",
      type: "challenge",
      direction: "server",
      statusCode: 402,
      payload: {
        requestId: contextId,
        invoice,
      },
    });
    return NextResponse.json(invoice, { status: 402 });
  }

  const parseResult = PaymentActionSchema.safeParse(body);
  if (!parseResult.success) {
    await logEvent({
      level: "error",
      event: "x402.payment.invalid",
      type: "error",
      direction: "server",
      statusCode: 400,
      errorCode: "INVALID_REQUEST",
      payload: {
        requestId: contextId,
        body,
        issues: parseResult.error.issues,
      },
    });
    return NextResponse.json({ error: "Invalid payment action" }, { status: 400 });
  }

  const { invoiceId, attempt = 1 } = parseResult.data;

  await logEvent({
    level: "info",
    event: "x402.payment.attempt",
    type: "payment",
    direction: "client",
    attempt,
    payload: {
      requestId: contextId,
      invoiceId,
    },
  });

  try {
    const proof = await executeHelloGoatPayment(invoiceId);
    const responsePayload = {
      message: "Hello GOAT unlocked",
      receipt: {
        invoiceId,
        paidAt: new Date().toISOString(),
      },
      proof,
    };

    await logEvent({
      level: "info",
      event: "x402.payment.success",
      type: "success",
      direction: "server",
      statusCode: 200,
      attempt,
      payload: {
        requestId: contextId,
        invoiceId,
        response: responsePayload,
      },
    });
    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    const normalized = error instanceof HelloGoatError ? error : asHelloGoatError(error);
    const status = errorStatusMap[normalized.code] ?? 500;
    await logEvent({
      level: "error",
      event: "x402.payment.error",
      type: "error",
      direction: "server",
      statusCode: status,
      attempt,
      errorCode: normalized.code,
      payload: {
        requestId: contextId,
        invoiceId,
        error: {
          message: normalized.message,
          hint: normalized.hint,
        },
      },
    });
    return NextResponse.json(
      { error: normalized.message, code: normalized.code, hint: normalized.hint },
      { status },
    );
  }
}
