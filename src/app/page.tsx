import { ActivationChecklist } from "@/components/activation/ActivationChecklist";
import { HelloGoatPanel } from "@/components/x402/HelloGoatPanel";
import { ProofCard } from "@/components/proof/ProofCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const stats = [
  { label: "Activations queued", value: "18", delta: "+4 w/w" },
  { label: "Wallets synced", value: "126", delta: "99.2% coverage" },
  { label: "Avg. response time", value: "428 ms", delta: "-36 ms" },
];

const events = [
  {
    id: "evt_b9f2",
    type: "Activation",
    status: "Succeeded",
    actor: "Atlas Bot",
    time: "14:12 PT",
  },
  {
    id: "evt_8af1",
    type: "Transfer",
    status: "Queued",
    actor: "Ops API",
    time: "13:54 PT",
  },
  {
    id: "evt_7dc4",
    type: "Log sync",
    status: "Streaming",
    actor: "Indexer",
    time: "13:48 PT",
  },
  {
    id: "evt_5ca2",
    type: "Activation",
    status: "Failed",
    actor: "Atlas Bot",
    time: "13:20 PT",
  },
];

const readiness = [
  { label: "Signer health", value: 92 },
  { label: "RPC stability", value: 76 },
  { label: "Webhook SLA", value: 88 },
];

const signalTicker = [
  { label: "x402", value: "Challenging & responding" },
  { label: "Proofs", value: "Ledger synced" },
  { label: "Webhook SLA", value: "88% green" },
  { label: "Signer", value: "92% nominal" },
  { label: "Ops Bot", value: "Atlas v7.4" },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.08] p-8 text-white shadow-[0_30px_120px_rgba(2,6,23,0.65)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.5),transparent_60%)] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.4),transparent_60%)] blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit border border-white/10 bg-white/20 text-white">
            Atlas // Mission Control
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Operator console for activations, proofs, and observability
          </h1>
          <p className="text-base text-white/80 md:text-lg">
            Track the x402 paywall loop, inspect proof ledgers, and jump to thin-slice views for
            Onboarding, Identity, Payments, Transactions, and Webhooks without leaving the console shell.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="#hello-goat"
              className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-[0_15px_45px_rgba(255,255,255,0.35)] transition hover:translate-y-0.5 hover:bg-white/90"
            >
              Trigger Hello GOAT
            </a>
            <a
              href="/logs"
              className="inline-flex items-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur"
            >
              Inspect logs
            </a>
          </div>
        </div>
        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)]"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.delta}</p>
            </div>
          ))}
        </div>
        <div className="relative z-10 mt-8 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] py-3">
          <div className="flex min-w-full items-center gap-6 whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-white/70 animate-marquee">
            {signalTicker.concat(signalTicker).map((signal, index) => (
              <span key={`${signal.label}-${index}`} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {signal.label} · {signal.value}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ActivationChecklist />
        <ProofCard />
      </div>

      <HelloGoatPanel />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="border-brand-100/60 bg-gradient-to-br from-brand-50 to-white lg:col-span-2">
          <CardHeader>
            <CardTitle>Activation readiness</CardTitle>
            <CardDescription>
              Testnet gate checks before promoting to mainnet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {readiness.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Streamed from the replicated log index.
              </CardDescription>
            </div>
            <Badge variant="outline">Live</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">
                      {event.id}
                    </TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          event.status === "Succeeded"
                            ? "default"
                            : event.status === "Failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.actor}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {event.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
