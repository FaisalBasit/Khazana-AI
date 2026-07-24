import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { StatusBadge, RiskBadge } from "@/components/shared/status-badge";
import { auditLogs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Finance AI Copilot" },
      { name: "description", content: "Immutable, searchable trail of every AI agent action." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const rows = auditLogs.filter((r) =>
    [r.id, r.invoice, r.agent, r.action].join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <PageShell title="Audit Logs">
      <GlassCard>
        <div className="mb-4 flex items-center gap-3">
          <div className="glass flex flex-1 items-center gap-2 rounded-full px-3 py-2">
            <Search className="text-muted-foreground size-4" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by invoice, agent, or action..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="text-muted-foreground text-xs">{rows.length} entries</div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium">Invoice</th>
                <th className="px-4 py-3 text-left font-medium">Agent</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Risk</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => setOpen(open === r.id ? null : r.id)}
                    className="cursor-pointer border-t border-border/60 hover:bg-accent/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{new Date(r.ts).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium">{r.invoice}</td>
                    <td className="px-4 py-3">{r.agent}</td>
                    <td className="px-4 py-3">{r.action}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3"><RiskBadge risk={r.risk} /></td>
                    <td className="px-4 py-3">
                      <ChevronDown className={cn("size-4 transition-transform", open === r.id && "rotate-180")} />
                    </td>
                  </tr>
                  {open === r.id && (
                    <tr className="bg-accent/20">
                      <td colSpan={7} className="px-6 py-4 text-xs">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <div className="text-muted-foreground">Log ID</div>
                            <div className="font-mono">{r.id}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Reasoning</div>
                            <div>Cross-referenced against last 60 days of vendor history.</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Payload hash</div>
                            <div className="font-mono">0x{r.id.slice(-8).padEnd(8, "0")}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </PageShell>
  );
}
