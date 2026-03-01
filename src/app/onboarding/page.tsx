"use client";

import { Badge } from "@/components/ui/badge";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Atlas // Onboarding
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Operator onboarding dossier</h1>
        <p className="text-muted-foreground max-w-2xl">
          Track the Atlas activation tasks for new merchants. Each field syncs with the shared
          control-plane store so the next operator can pick up where you leave off.
        </p>
      </div>

      <OnboardingWizard />
    </div>
  );
}
