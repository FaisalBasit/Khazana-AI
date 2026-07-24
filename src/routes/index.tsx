import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReactMarkdown from "react-markdown";
import { Download, FileText, Sparkles, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge, RiskBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  categoryBreakdown,
  execSummary,
  invoices,
  kpis,
  monthlySpending,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Finance AI Copilot" },
      { name: "description", content: "Real-time financial health, AI agent activity, and executive summaries." },
    ],
  }),
  component: Dashboard,
});

const CHART_COLORS = ["#6366f1", "#a855f7", "#38bdf8", "#22c55e", "#f59e0b", "#ef4444"];

function Dashboard() {
  const recent = invoices.slice(0, 6);
  return (
    <PageShell title="Dashboard">
      <section className="bg-hero relative overflow-hidden rounded-3xl border border-border p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="text-ai size-3.5" />
            5 agents active · synced 2 minutes ago
          </div>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
            Good morning, Alex. <span className="gradient-text">Acme is on track.</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Your finance copilot processed 128 invoices overnight, resolved 12 compliance exceptions,
            and drafted the July executive report.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="bg-gradient-primary hover:opacity-90">
              View executive report <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button variant="outline" className="border-border bg-background/40 backdrop-blur">
              <Download className="mr-1 size-4" /> Export PDF
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} index={i} />
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Monthly spend vs budget</h3>
              <p className="text-muted-foreground text-xs">Rolling 7 months</p>
            </div>
            <StatusBadge status="active" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySpending}>
                <defs>
                  <linearGradient id="s" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="b" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "rgba(20,20,25,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  formatter={(v: number) => `$${v.toLocaleString()}`}
                />
                <Area type="monotone" dataKey="budget" stroke="#a855f7" strokeWidth={2} fill="url(#b)" />
                <Area type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={2} fill="url(#s)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <h3 className="text-base font-semibold">Vendor breakdown</h3>
            <p className="text-muted-foreground text-xs">By category, MTD</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "rgba(20,20,25,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  formatter={(v: number) => `$${v.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {categoryBreakdown.map((c, i) => (
              <li key={c.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-medium">${(c.value / 1000).toFixed(0)}k</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent invoices</h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Invoice</th>
                  <th className="px-4 py-3 text-left font-medium">Vendor</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((inv) => (
                  <tr key={inv.id} className="border-t border-border/60 hover:bg-accent/30">
                    <td className="px-4 py-3 font-medium">{inv.id}</td>
                    <td className="px-4 py-3">{inv.vendor}</td>
                    <td className="px-4 py-3 text-right font-mono">${inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3"><RiskBadge risk={inv.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="text-ai size-4" />
            <h3 className="text-base font-semibold">AI executive summary</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none prose-headings:mt-3 prose-headings:font-semibold prose-p:text-muted-foreground prose-strong:text-foreground">
            <ReactMarkdown>{execSummary}</ReactMarkdown>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="bg-gradient-primary"><FileText className="mr-1 size-4" /> Export PDF</Button>
            <Button size="sm" variant="outline"><Download className="mr-1 size-4" /> CSV</Button>
            <Button size="sm" variant="ghost">Full report</Button>
          </div>
        </GlassCard>
      </section>

      <section className="mt-8">
        <GlassCard>
          <div className="mb-4">
            <h3 className="text-base font-semibold">Activity timeline</h3>
            <p className="text-muted-foreground text-xs">Agent actions across the last hour</p>
          </div>
          <ol className="relative ml-3 space-y-4 border-l border-border pl-6">
            {[
              { t: "2 min ago", a: "Supervisor", m: "Assigned batch #A-2841 to Invoice Agent" },
              { t: "5 min ago", a: "Compliance", m: "Flagged duplicate suspicion: INV-1017 ↔ INV-1029" },
              { t: "12 min ago", a: "Reporting", m: "Drafted July executive summary" },
              { t: "22 min ago", a: "Expense", m: "Categorized 42 invoices, 8 matched to POs" },
              { t: "38 min ago", a: "Invoice", m: "OCR completed for 128 pages" },
            ].map((e, i) => (
              <li key={i}>
                <span className="bg-primary absolute -left-[5px] mt-1.5 size-2.5 rounded-full ring-4 ring-background" />
                <div className="text-sm"><span className="font-medium">{e.a} Agent</span> · <span className="text-muted-foreground">{e.m}</span></div>
                <div className="text-muted-foreground text-xs">{e.t}</div>
              </li>
            ))}
          </ol>
        </GlassCard>
      </section>
    </PageShell>
  );
}
