"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataFieldCard } from "@/components/control-plane/DataFieldCard";
import { useControlPlaneStore } from "@/store/controlPlane";
import { Button } from "@/components/ui/button";

export default function IdentityPage() {
  const identityStatus = useControlPlaneStore((state) => state.identityStatus);
  const identityLastAttestedAt = useControlPlaneStore((state) => state.identityLastAttestedAt);
  const markIdentityAttestedNow = useControlPlaneStore((state) => state.markIdentityAttestedNow);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Atlas // Identity
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Identity registry signal</h1>
        <p className="text-muted-foreground">
          Surface ERC-8004 identity registration status, the registry ID, and the latest attestation
          timestamp so thin-slice operators can confirm a merchant is known to the protocol.
        </p>
      </div>

      <Card className="border border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardTitle>Registration status</CardTitle>
          <CardDescription>Snapshotted from the identity registry.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-lg font-semibold text-emerald-900">{identityStatus}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Last attested:</span>
            <span className="font-mono">
              {identityLastAttestedAt ? new Date(identityLastAttestedAt).toLocaleString() : "Not captured"}
            </span>
            <Button size="xs" variant="outline" onClick={markIdentityAttestedNow}>
              Stamp now
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <DataFieldCard
          title="ERC-8004 registry ID"
          description="Paste the value returned from your identity registry call."
          field="identityRegistryId"
          placeholder="erc8004_reg_0x7a"
          status="Copy to share with compliance"
        />
        <DataFieldCard
          title="Registry status"
          description="Editable summary so downstream operators know the state."
          field="identityStatus"
          placeholder="ERC-8004 attested"
        />
      </div>

      <Card className="border border-dashed">
        <CardHeader>
          <CardTitle>Identity thin slice</CardTitle>
          <CardDescription>What a downstream operator must confirm before handing off.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. Registry ID is stored in this console and matches on-chain payloads.</p>
          <p>2. Attestation timestamp is no older than 7 days.</p>
          <p>3. Compliance copy has been shared in Ops channel.</p>
          <p className="text-xs italic text-amber-600">Requires human confirmation — do not deploy without manual sanity checks.</p>
        </CardContent>
      </Card>
    </div>
  );
}
