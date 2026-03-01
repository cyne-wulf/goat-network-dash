"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataFieldCard } from "@/components/control-plane/DataFieldCard";
import { useControlPlaneStore } from "@/store/controlPlane";
import { Button } from "@/components/ui/button";

export default function WebhooksPage() {
  const webhookStatus = useControlPlaneStore((state) => state.webhookStatus);
  const toggleWebhookStatus = useControlPlaneStore((state) => state.toggleWebhookStatus);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Atlas // Webhooks & Telegram
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Delivery surfaces</h1>
        <p className="text-muted-foreground">
          Configure where Atlas sends event notifications. Store webhook URLs, secrets, and the Telegram
          bot handle used to page the on-call operator. Copy an identifier whenever a partner requests it.
        </p>
      </div>

      <Card className="border border-purple-200 bg-purple-50/60">
        <CardHeader>
          <CardTitle>Verification status</CardTitle>
          <CardDescription>Operator override to flag if the webhook is live.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <span>Current status</span>
          <span className="text-base font-semibold text-foreground">{webhookStatus}</span>
          <Button size="sm" variant="outline" onClick={toggleWebhookStatus}>
            Toggle status
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <DataFieldCard
          title="Webhook URL"
          description="HTTPS endpoint that receives Atlas events."
          field="webhookUrl"
          placeholder="https://example.com/webhook"
        />
        <DataFieldCard
          title="Webhook secret"
          description="Shared secret for verifying signatures."
          field="webhookSecret"
          placeholder="whsec_live_123"
        />
        <DataFieldCard
          title="Telegram bot handle"
          description="Ops bot or chat used for manual escalations."
          field="telegramBotHandle"
          placeholder="@atlas_control"
        />
      </div>

      <Card className="border border-dashed">
        <CardHeader>
          <CardTitle>Delivery thin slice</CardTitle>
          <CardDescription>Capture what a partner needs to provide before enabling hooks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Webhook URL reachable from control plane.</p>
          <p>2. Secret generated and stored in this console + partner vault.</p>
          <p>3. Telegram handle cross-checked with Ops roster.</p>
          <p className="text-xs italic text-amber-600">Requires human confirmation — do not toggle to production without live ping tests.</p>
        </CardContent>
      </Card>
    </div>
  );
}
