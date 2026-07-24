import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { CloudUpload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Invoices — Finance AI Copilot" },
      { name: "description", content: "Drag, drop, and watch AI agents process your invoices end to end." },
    ],
  }),
  component: UploadPage,
});

const STAGES = ["Upload", "OCR", "Extraction", "Categorization", "Compliance", "Report", "Done"];

const seed = [
  { name: "aws-july.pdf", vendor: "AWS", amount: 12480.32, stage: 6, status: "completed" as const },
  { name: "figma-team.pdf", vendor: "Figma", amount: 240, stage: 4, status: "processing" as const },
  { name: "openai-usage.pdf", vendor: "OpenAI", amount: 3120.55, stage: 3, status: "processing" as const },
  { name: "snowflake-q3.pdf", vendor: "Snowflake", amount: 42800, stage: 5, status: "flagged" as const },
  { name: "linear-oct.pdf", vendor: "Linear", amount: 96, stage: 6, status: "completed" as const },
];

function UploadPage() {
  const [items] = useState(seed);
  return (
    <PageShell title="Upload Invoices">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="bg-hero flex flex-col items-center justify-center gap-4 border-dashed py-16 text-center">
          <div className="bg-gradient-primary grid size-14 place-items-center rounded-2xl shadow-lg">
            <CloudUpload className="size-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Drop invoices here</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              PDF, PNG, or JPG · up to 25MB · agents start processing instantly
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-gradient-primary">Choose files</Button>
            <Button variant="outline">Connect email inbox</Button>
          </div>
        </GlassCard>
      </motion.div>

      <section className="mt-8">
        <h3 className="mb-4 text-base font-semibold">Processing queue</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((it, i) => {
            const pct = (it.stage / (STAGES.length - 1)) * 100;
            return (
              <motion.div
                key={it.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <div className="glass grid size-14 shrink-0 place-items-center rounded-xl">
                      <FileText className="size-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{it.name}</div>
                          <div className="text-muted-foreground text-xs">{it.vendor} · ${it.amount.toLocaleString()}</div>
                        </div>
                        <StatusBadge status={it.status} />
                      </div>
                      <div className="mt-3">
                        <Progress value={pct} className="h-1.5" />
                      </div>
                      <ol className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                        {STAGES.map((s, idx) => {
                          const done = idx < it.stage;
                          const active = idx === it.stage;
                          return (
                            <li
                              key={s}
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                                done
                                  ? "bg-success/15 text-success"
                                  : active
                                    ? "bg-ai/15 text-ai"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {done ? <CheckCircle2 className="size-2.5" /> : active ? <Loader2 className="size-2.5 animate-spin" /> : null}
                              {s}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
