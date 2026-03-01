import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Atlas // Settings
        </Badge>
        <h1 className="text-3xl font-semibold">Console preferences</h1>
        <p className="text-muted-foreground">
          Settings are persisted locally so operators can pick up exactly where they
          left off: theme, network mode, and layout density.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Light, dark, or follow the OS preference.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Theme switching is controlled globally via the ThemeProvider wrapper.
            </p>
            <Button variant="outline">Toggle theme</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network preference</CardTitle>
            <CardDescription>Mirrors the Testnet Mode toggle in the top bar.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Changes are stored through zustand persistence for reliable reloads.
            </p>
            <Button>Manage networks</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
