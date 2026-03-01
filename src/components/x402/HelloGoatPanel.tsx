"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Invoice, HelloGoatResponse } from "@/lib/x402/types";
import { useProgressStore } from "@/store/progressStore";
import { Badge } from "@/components/ui/badge";

const RETRY_LIMIT = 2;

export function HelloGoatPanel() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [status, setStatus] = useState<
    "idle" | "requesting" | "invoice" | "paying" | "success" | "error"
  >("idle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastHint, setLastHint] = useState<string | null>(null);
  const {
    recordHelloGoatSuccess,
    proofs,
    lastHelloGoatSuccessAt,
  } = useProgressStore();

  const latestProof = proofs[0];

  const startFlow = async () => {
    setLastError(null);
    setLastHint(null);
    setStatus("requesting");
    try {
      const response = await fetch("/api/x402", { method: "POST" });
      if (response.status === 402) {
        const invoicePayload = (await response.json()) as Invoice;
        setInvoice(invoicePayload);
        setDialogOpen(true);
        setStatus("invoice");
        await attemptPayment(invoicePayload.id);
        return;
      }

      if (response.ok) {
        const payload = (await response.json()) as HelloGoatResponse;
        handleSuccess(payload);
        return;
      }

      const details = await parseErrorResponse(response);
      applyFinalError(details);
    } catch (error) {
      applyFinalError(normalizeFlowError(error, "Unable to reach x402 API"));
    }
  };

  const attemptPayment = async (invoiceId: string, attempt = 0): Promise<void> => {
    setStatus("paying");
    const attemptNumber = attempt + 1;
    try {
      const response = await fetch("/api/x402", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, action: "pay", attempt: attemptNumber }),
      });

      if (!response.ok) {
        const details = await parseErrorResponse(response);
        throw details;
      }

      const payload = (await response.json()) as HelloGoatResponse;
      handleSuccess(payload);
    } catch (error) {
      const details = normalizeFlowError(error, "Payment attempt failed");
      toast.error(composeMessage(details));
      if (attempt < RETRY_LIMIT) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        return attemptPayment(invoiceId, attempt + 1);
      }
      setStatus("error");
      setLastError(details.message);
      setLastHint(details.hint ?? null);
    }
  };

  const handleSuccess = (payload: HelloGoatResponse) => {
    setStatus("success");
    setDialogOpen(false);
    setInvoice(null);
    setLastError(null);
    setLastHint(null);
    recordHelloGoatSuccess(payload);
    toast.success("Hello GOAT unlocked");
  };

  const applyFinalError = (details: FlowErrorDetails) => {
    setStatus("error");
    setLastError(details.message);
    setLastHint(details.hint ?? null);
    toast.error(composeMessage(details));
  };

  return (
    <section
      id="hello-goat"
      className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.2),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-16 left-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.15),transparent_60%)] blur-3xl" />
      </div>
      <div className="relative z-10">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge
              variant="outline"
              className="w-fit border-amber-200 bg-amber-50/80 text-amber-700"
            >
              Hello GOAT flow
            </Badge>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              x402 Paywall
            </h2>
            <p className="text-sm text-zinc-600">
              Automatic retries honor the 402 invoice contract until the proof
              ledger lands.
            </p>
          </div>
          <button
            onClick={startFlow}
            disabled={status === "requesting" || status === "paying"}
            className="mt-2 inline-flex rounded-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,23,42,0.35)] transition hover:translate-y-0.5 disabled:cursor-not-allowed disabled:from-zinc-400 disabled:via-zinc-400 disabled:to-zinc-400"
          >
            {status === "requesting" || status === "paying"
              ? "Processing..."
              : "Say Hello GOAT"}
          </button>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          <StatusCard
            label="Stage"
            value={statusLabel(status)}
            caption={lastError ?? lastHint ?? "Awaiting next action"}
            tone={statusTone(status)}
          />
          <StatusCard
            label="Last success"
            value={
              lastHelloGoatSuccessAt
                ? new Date(lastHelloGoatSuccessAt).toLocaleString()
                : "Not yet"
            }
            caption={
              latestProof ? `Tx ${shorten(latestProof.txHash)}` : "Trigger a run"
            }
          />
          <StatusCard
            label="Invoice"
            value={invoice ? invoice.id.slice(0, 8) + "…" : "Pending"}
            caption={
              invoice
                ? invoice.amount.value + " " + invoice.amount.currency
                : "Request to start"
            }
          />
        </div>

        {dialogOpen && invoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-zinc-900">Invoice</h3>
              <p className="mt-2 text-sm text-zinc-600">
                We returned HTTP 402. Review details, then we will pay automatically.
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Invoice ID</dt>
                  <dd className="font-mono">{invoice.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Amount</dt>
                  <dd>
                    {invoice.amount.value} {invoice.amount.currency}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Receiver</dt>
                  <dd className="font-mono">
                    {shorten(invoice.instructions.receiver)}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-sm text-zinc-600">
                Attempting payment now. This dialog will close automatically on success.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusCard({
  label,
  value,
  caption,
  tone,
}: {
  label: string;
  value: string;
  caption?: string | null;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const color =
    tone === "success"
      ? "text-green-700"
      : tone === "warning"
        ? "text-amber-700"
        : tone === "danger"
          ? "text-rose-700"
          : "text-zinc-600";
  const captionText = caption ?? "Awaiting next action";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{captionText}</p>
    </div>
  );
}

function statusLabel(status: string) {
  switch (status) {
    case "requesting":
      return "Requesting";
    case "invoice":
      return "Invoice";
    case "paying":
      return "Paying";
    case "success":
      return "Unlocked";
    case "error":
      return "Needs attention";
    default:
      return "Idle";
  }
}

function statusTone(status: string): "neutral" | "success" | "warning" | "danger" {
  switch (status) {
    case "success":
      return "success";
    case "invoice":
    case "paying":
      return "warning";
    case "error":
      return "danger";
    default:
      return "neutral";
  }
}

function shorten(value: string, head = 6, tail = 4) {
  if (value.length <= head + tail) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

interface FlowErrorDetails {
  message: string;
  hint?: string | null;
}

async function parseErrorResponse(response: Response): Promise<FlowErrorDetails> {
  const fallback = `${response.status} ${response.statusText}` || "Request failed";
  try {
    const data = await response.json();
    return {
      message: typeof data.error === "string" ? data.error : fallback,
      hint: typeof data.hint === "string" ? data.hint : undefined,
    };
  } catch {
    return { message: fallback };
  }
}

function normalizeFlowError(error: unknown, fallback: string): FlowErrorDetails {
  if (error && typeof error === "object") {
    const maybeMessage = (error as { message?: unknown }).message;
    const maybeHint = (error as { hint?: unknown }).hint;
    if (typeof maybeMessage === "string" || typeof maybeHint === "string") {
      return {
        message: typeof maybeMessage === "string" ? maybeMessage : fallback,
        hint: typeof maybeHint === "string" ? maybeHint : undefined,
      };
    }
  }

  if (error instanceof Error && error.message) {
    return { message: error.message };
  }

  return { message: fallback };
}

function composeMessage(details: FlowErrorDetails) {
  return details.hint ? `${details.message} — ${details.hint}` : details.message;
}
