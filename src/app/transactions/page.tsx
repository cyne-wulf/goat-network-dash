"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataFieldCard } from "@/components/control-plane/DataFieldCard";
import { useControlPlaneStore } from "@/store/controlPlane";

export default function TransactionsPage() {
  const transactionsLastBatchId = useControlPlaneStore((state) => state.transactionsLastBatchId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Atlas // Transactions
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Settlement & transfers</h1>
        <p className="text-muted-foreground">
          Thin-slice view of the settlement channel, escrow destination, and the last batch processed.
          Store identifiers here and copy them out when debugging mismatched balances.
        </p>
      </div>

      <Card className="border border-blue-200 bg-blue-50/70">
        <CardHeader>
          <CardTitle>Last batch</CardTitle>
          <CardDescription>Atlas ledger batch applied to the escrow contract.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>Batch ID</span>
          <span className="font-mono text-base text-foreground">{transactionsLastBatchId}</span>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <DataFieldCard
          title="Settlement channel ID"
          description="Channel backed by the ledger for this merchant."
          field="transactionsChannelId"
          placeholder="chnl_usdc_12"
        />
        <DataFieldCard
          title="Escrow address"
          description="Destination wallet Atlas uses to hold funds before payouts."
          field="transactionsEscrowAddress"
          placeholder="0xabc...def"
        />
      </div>

      <Card className="border border-dashed">
        <CardHeader>
          <CardTitle>Transactions thin slice</CardTitle>
          <CardDescription>Use this before shipping a transfer batch.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Settlement channel matches the Payments pane.</p>
          <p>2. Escrow address is confirmed via multisig <span className="font-mono">0x</span> snippet.</p>
          <p>3. Batch IDs increment sequentially.</p>
          <p>4. Logs page shows matching transfer IDs if there is a discrepancy.</p>
          <p className="text-xs italic text-amber-600">Requires human confirmation — reconcile balances before re-running batches.</p>
        </CardContent>
      </Card>
    </div>
  );
}
