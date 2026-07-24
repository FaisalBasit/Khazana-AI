import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Bot, Brain, Cpu, Clock, Activity, ArrowRight, Sparkles } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { agents } from "@/lib/mock-data";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "AI Agents — Finance AI Copilot" },
      { name: "description", content: "Live orchestration of the multi-agent finance workflow." },
    ],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const selected = agents.find((a) => a.id === open);

  return (
    <PageShell title="AI Agents">
      <section className="bg-hero relative overflow-hidden rounded-3xl border border-border p-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-xs backdrop-blur">
          <Sparkles className="text-ai size-3.5" /> Multi-agent orchestration
        </div>
        <h2 className="text-3xl font-semibold tracking-tight">The finance team, running itself.</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          The Supervisor plans, delegates, and synthesizes. Four specialists execute in parallel with full observability.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {agents.map((a, i) => (
            <div key={a.id} className="flex items-center gap-3">
              <motion.button
                onClick={() => setOpen(a.id)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass hover:glow-primary flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium"
              >
                <span className="bg-primary size-2 animate-pulse rounded-full" />
                {a.name.replace(" Agent", "")}
              </motion.button>
              {i < agents.length - 1 && <ArrowRight className="text-muted-foreground size-3.5" />}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="flex h-full cursor-pointer flex-col gap-4" onClick={() => setOpen(a.id)}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-primary grid size-11 place-items-center rounded-xl">
                    <Bot className="size-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-muted-foreground text-xs">{a.role}</div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="text-muted-foreground text-sm">{a.task}</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Stat icon={Brain} label="Confidence" value={`${Math.round(a.confidence * 100)}%`} />
                <Stat icon={Clock} label="Runtime" value={`${a.runtimeMs}ms`} />
                <Stat icon={Cpu} label="Memory" value={`${a.memoryMb}MB`} />
              </div>
              <div className="border-border/60 border-t pt-3">
                <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs">
                  <Activity className="size-3" /> Recent activity
                </div>
                <ul className="space-y-1 text-xs">
                  {a.activity.map((x) => (
                    <li key={x} className="text-muted-foreground before:text-primary before:mr-2 before:content-['•']">{x}</li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full border-l border-border bg-background/95 backdrop-blur-xl sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Bot className="size-5" /> {selected.name}
                </SheetTitle>
                <SheetDescription>{selected.role}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5 px-4">
                <Block title="Prompt preview">
                  <pre className="glass max-h-40 overflow-auto rounded-xl p-3 text-xs">{`You are the ${selected.name}. Given a batch of invoices,\nperform your specialty and return structured JSON with confidence.`}</pre>
                </Block>
                <Block title="Reasoning">
                  <p className="text-muted-foreground text-sm">
                    Model routed the batch based on vendor priors and historical anomalies. Confidence exceeds the 0.85 threshold.
                  </p>
                </Block>
                <Block title="Tool calls">
                  <ul className="text-sm">
                    {["extract_fields()", "match_vendor()", "detect_duplicates()", "score_risk()"].map((t) => (
                      <li key={t} className="border-border/60 flex items-center justify-between border-b py-2 last:border-none">
                        <code className="text-ai font-mono text-xs">{t}</code>
                        <StatusBadge status="success" />
                      </li>
                    ))}
                  </ul>
                </Block>
                <Block title="Output preview">
                  <pre className="glass max-h-48 overflow-auto rounded-xl p-3 text-xs">{JSON.stringify({ invoice: "INV-1042", vendor: "AWS", total: 12480.32, currency: "USD", risk: "low", confidence: selected.confidence }, null, 2)}</pre>
                </Block>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Bot; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-2.5">
      <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
        <Icon className="size-3" /> {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-muted-foreground mb-2 text-xs uppercase tracking-wide">{title}</div>
      {children}
    </div>
  );
}
