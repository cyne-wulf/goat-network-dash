"use client";

import * as React from "react";
import { ClipboardCopy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useControlPlaneStore, ControlPlaneEditableField } from "@/store/controlPlane";
import { cn } from "@/lib/utils";

interface DataFieldCardProps {
  title: string;
  description: string;
  field: ControlPlaneEditableField;
  badge?: string;
  placeholder?: string;
  readOnly?: boolean;
  status?: string;
  onAction?: () => void;
  actionLabel?: string;
  actionIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

export function DataFieldCard({
  title,
  description,
  field,
  badge,
  placeholder,
  readOnly,
  status,
  onAction,
  actionLabel = "Refresh",
  actionIcon: ActionIcon = RefreshCw,
  className,
}: DataFieldCardProps) {
  const value = useControlPlaneStore((state) => state[field]);
  const setField = useControlPlaneStore((state) => state.setField);

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard unavailable in this environment");
      return;
    }
    try {
      await navigator.clipboard.writeText(value || "");
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Unable to copy");
    }
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setField(field, event.target.value);
  };

  return (
    <Card className={cn("border border-dashed", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <CardTitle>{title}</CardTitle>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={handleInput}
            placeholder={placeholder}
            readOnly={readOnly}
            className="font-mono"
          />
          <Button variant="outline" size="icon" onClick={handleCopy} aria-label={`Copy ${title}`}>
            <ClipboardCopy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span>{status ?? (value ? "Stored in console" : "Requires human confirmation")}</span>
          {onAction ? (
            <Button variant="ghost" size="xs" onClick={onAction} className="h-auto px-2 text-xs font-semibold">
              {ActionIcon ? <ActionIcon className="mr-1 h-3 w-3" /> : null}
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
