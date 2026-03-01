"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProgressStore } from "@/store/progressStore";

export function ProofCard() {
  const { lastProof, lastHelloGoatSuccessAt } = useProgressStore((state) => ({
    lastProof: state.lastProof,
    lastHelloGoatSuccessAt: state.lastHelloGoatSuccessAt,
  }));

  const formattedTimestamp = lastProof
    ? new Date(lastProof.settledAt).toLocaleString()
    : lastHelloGoatSuccessAt
      ? new Date(lastHelloGoatSuccessAt).toLocaleString()
      : null;

  const summary = useMemo(() => {
    if (!lastProof) {
      return "Sub-agent Sentry proof pending. Trigger Hello GOAT to mint a receipt.";
    }
    return `Sub-agent Sentry unlocked Hello GOAT for invoice ${lastProof.invoiceId} at ${new Date(lastProof.settledAt).toLocaleString()} via tx ${lastProof.txHash}`;
  }, [lastProof]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Proof summary copied");
    } catch {
      toast.error("Unable to copy proof summary");
    }
  };

  return (
    <Card className="relative h-full overflow-hidden border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/60 to-white shadow-[0_25px_80px_rgba(16,185,129,0.25)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.25),transparent_60%)] blur-3xl" />
      </div>
      <CardHeader className="relative z-10">
        <CardDescription className="text-emerald-700">
          Sub-agent Sentry
        </CardDescription>
        <CardTitle className="text-emerald-900">
          Proof of Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Agent Identity
          </p>
          <p className="mt-1 text-2xl font-semibold text-emerald-900">
            Hello GOAT Auditor
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            Captures each 402 → pay → success cycle for judges.
          </p>
        </div>

        {lastProof ? (
          <div className="space-y-3">
            <Badge variant="outline" className="bg-emerald-100 text-emerald-900">
              Latest paid request
            </Badge>
            <dl className="space-y-2 text-sm">
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">Tx hash</dt>
                <dd className="font-mono text-base text-emerald-900">
                  {shorten(lastProof.txHash)}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">Invoice</dt>
                <dd className="font-mono text-sm">{lastProof.invoiceId}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">Settled</dt>
                <dd className="text-sm font-medium text-emerald-900">
                  {formattedTimestamp}
                </dd>
              </div>
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleCopy} className="sm:flex-1" size="sm">
                Copy summary
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="sm:flex-1"
                asChild
              >
                <a href={lastProof.explorerUrl} target="_blank" rel="noreferrer">
                  View explorer
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-muted-foreground">
            Trigger Hello GOAT to mint a proof. Once the tx settles, this panel will show the hash, explorer link, and copyable summary for judges.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function shorten(value: string, head = 8, tail = 6) {
  if (value.length <= head + tail) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}
