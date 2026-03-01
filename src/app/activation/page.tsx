import Link from "next/link";
import { ActivationChecklist } from "@/components/activation/ActivationChecklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ActivationPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Atlas // Activation
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Sub-agent Beacon activation checklist
        </h1>
        <p className="text-muted-foreground">
          Review the live signals that gate an outbound Hello GOAT run:
          project health, RPC readiness, sandbox routing, paid request history,
          and proof persistence. All data resolves from the same stores used by
          the dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="#activation-checklist">Review checklist</a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/#hello-goat">Run Hello GOAT on dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4" id="activation-checklist">
        <ActivationChecklist />
        <p className="text-sm text-muted-foreground">
          Need to capture the resulting proof or inspect logs? Hop to the
          dashboard after the checklist hits 5/5 and use the Hello GOAT panel
          plus the Logs surface.
        </p>
      </div>
    </div>
  );
}
