"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DataFieldCard } from "@/components/control-plane/DataFieldCard";
import { Button } from "@/components/ui/button";
import { useControlPlaneStore } from "@/store/controlPlane";

export default function PaymentsPage() {
  const paymentsLastValidatedAt = useControlPlaneStore((state) => state.paymentsLastValidatedAt);
  const markPaymentsValidatedNow = useControlPlaneStore((state) => state.markPaymentsValidatedNow);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Atlas // Payments
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Merchant payments configuration</h1>
        <p className="text-muted-foreground">
          This view keeps track of the merchant configuration ID, settlement channel, and operator notes
          for payment hooks. The data persists locally so you can paste credentials once the partner
          approves.
        </p>
      </div>

      <Card className="border border-amber-200 bg-amber-50/70">
        <CardHeader>
          <CardTitle>Validation window</CardTitle>
          <CardDescription>Document the last time you re-validated processor config.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>Last validation</span>
          <span className="font-mono text-base text-foreground">
            {paymentsLastValidatedAt ? new Date(paymentsLastValidatedAt).toLocaleString() : "Not yet recorded"}
          </span>
        </CardContent>
        <CardFooter>
          <Button onClick={markPaymentsValidatedNow}>Stamp validation</Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <DataFieldCard
          title="Payments config ID"
          description="Set after connecting to the merchant in the payments API."
          field="paymentsMerchantConfigId"
          placeholder="mrcfg_live_01"
          status="Share with finance"
        />
        <DataFieldCard
          title="Settlement channel ID"
          description="Channel used to settle funds from this merchant."
          field="transactionsChannelId"
          placeholder="chnl_usdc_12"
        />
      </div>

      <Card className="border border-dashed">
        <CardHeader>
          <CardTitle>Payments thin slice</CardTitle>
          <CardDescription>Operators should confirm the following before toggling production.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Merchant config ID exists in this console and Atlas admin.</p>
          <p>2. Latest validation timestamp is from this week.</p>
          <p>3. Settlement channel matches the escrow address on file.</p>
          <p>4. Finance has acknowledged receipt of merchant config details.</p>
          <p className="text-xs italic text-amber-600">Requires human confirmation — do not trust stale validation stamps.</p>
        </CardContent>
      </Card>
    </div>
  );
}
