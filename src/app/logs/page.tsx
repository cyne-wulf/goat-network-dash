import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { readLogs } from "@/lib/x402/logStore";
import type { LogEntry } from "@/lib/x402/types";

export default async function LogsPage() {
  const logs = (await readLogs()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Atlas // Logs
        </Badge>
        <h1 className="text-3xl font-semibold">Hello GOAT observability</h1>
        <p className="text-muted-foreground max-w-2xl">
          Every POST /api/x402 call is recorded with direction, HTTP status, request body, and
          success/error payloads so judges can replay the 402 → pay → success journey.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live stream</CardTitle>
          <CardDescription>
            Timeline chips show request direction, log type, and HTTP status. Expand entries for payloads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No logs yet. Trigger the Hello GOAT panel to capture the first invoice/payment cycle.
            </p>
          ) : (
            <div className="space-y-4">
              {logs.map((entry) => (
                <LogRow key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LogRow({ entry }: { entry: LogEntry }) {
  const timestamp = new Date(entry.timestamp).toLocaleString();
  const requestPayload = extractRequestPayload(entry.payload);
  const responsePayload = extractResponsePayload(entry.payload);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm">
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="outline" className="uppercase tracking-wide">
          {entry.type}
        </Badge>
        <Badge variant={entry.level === "error" ? "destructive" : "secondary"}>
          {entry.level}
        </Badge>
        <Badge variant="outline">{entry.direction === "client" ? "Client → Server" : "Server → Client"}</Badge>
        {entry.statusCode && <Badge variant="outline">HTTP {entry.statusCode}</Badge>}
        {entry.attempt && <Badge variant="outline">Attempt {entry.attempt}</Badge>}
        {entry.errorCode && (
          <Badge variant="destructive" className="uppercase tracking-wide">
            {entry.errorCode}
          </Badge>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-zinc-900">{entry.event}</p>
          <p className="text-sm text-muted-foreground">{entry.payload?.requestId ?? "–"}</p>
        </div>
        <p className="text-xs font-mono text-zinc-500">{timestamp}</p>
      </div>

      <div className="mt-4 space-y-3">
        {requestPayload ? <PayloadBlock title="Request payload" data={requestPayload} /> : null}
        {responsePayload ? <PayloadBlock title="Response payload" data={responsePayload} /> : null}
        {entry.payload ? <PayloadBlock title="Metadata" data={entry.payload} /> : null}
      </div>
    </div>
  );
}

function PayloadBlock({ title, data }: { title: string; data: unknown }) {
  return (
    <details className="group rounded-xl border border-zinc-200/70 bg-zinc-50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-zinc-700">
        {title}
      </summary>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-white/70 p-3 text-xs text-zinc-800">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

function extractRequestPayload(payload?: Record<string, unknown>) {
  if (!payload) return null;
  if ("request" in payload) return (payload as { request: unknown }).request;
  if ("body" in payload) return (payload as { body: unknown }).body;
  return null;
}

function extractResponsePayload(payload?: Record<string, unknown>) {
  if (!payload) return null;
  if ("response" in payload) return (payload as { response: unknown }).response;
  if ("invoice" in payload) return (payload as { invoice: unknown }).invoice;
  if ("error" in payload) return (payload as { error: unknown }).error;
  return null;
}
