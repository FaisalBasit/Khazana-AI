import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Sparkles, User } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Copilot Chat — Finance AI Copilot" },
      { name: "description", content: "Ask anything about your finances. The copilot answers in seconds." },
    ],
  }),
  component: ChatPage,
});

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const suggestions = [
  "Show duplicate invoices from July",
  "Explain the current policy violations",
  "Summarize July spending by category",
  "Generate an executive report for the board",
];

const seed: Msg[] = [
  { id: "1", role: "user", text: "Summarize July spending by category." },
  {
    id: "2",
    role: "assistant",
    text: `**July spend: $482,910** across 6 categories.

| Category | Amount | vs June |
|---|---:|---:|
| Cloud | $184,200 | +12% |
| Software | $128,400 | +4% |
| Marketing | $62,100 | -8% |
| Consulting | $43,610 | +21% |
| Travel | $41,800 | +2% |
| Office | $22,800 | -5% |

**Key drivers**
- Snowflake commitment upgrade contributed **$28k** to Cloud growth.
- Consulting spike from a one-time legal engagement.

Want me to draft a variance memo for the board?`,
  },
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const user: Msg = { id: crypto.randomUUID(), role: "user", text };
    const ai: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `Working on it...\n\nHere's what I found for **"${text.trim()}"**:\n\n- Analyzed 128 invoices\n- 3 potential anomalies detected\n- Confidence: 92%\n\nAsk a follow-up to drill deeper.`,
    };
    setMessages((m) => [...m, user, ai]);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <PageShell title="AI Copilot">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <GlassCard className="flex h-[calc(100vh-13rem)] flex-col p-0">
          <div className="flex items-center gap-2 border-b border-border/60 px-6 py-4">
            <div className="bg-gradient-ai grid size-8 place-items-center rounded-full">
              <Sparkles className="size-4 text-black" />
            </div>
            <div>
              <div className="text-sm font-semibold">Finance Copilot</div>
              <div className="text-muted-foreground text-xs">GPT-class model · connected to your ledger</div>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            {messages.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.15) }}
                className={cn("flex gap-3", m.role === "user" ? "justify-end" : "")}
              >
                {m.role === "assistant" && (
                  <div className="bg-gradient-ai grid size-8 shrink-0 place-items-center rounded-full">
                    <Sparkles className="size-4 text-black" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-table:my-3 prose-td:py-1 prose-th:py-1">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <span>{m.text}</span>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="bg-gradient-primary grid size-8 shrink-0 place-items-center rounded-full">
                    <User className="size-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="border-t border-border/60 p-4">
            <div className="glass flex items-end gap-2 rounded-2xl p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask about invoices, policies, cash flow..."
                className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button size="icon" className="bg-gradient-primary size-9 rounded-xl" onClick={() => send(input)}>
                <ArrowUp className="size-4" />
              </Button>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <h4 className="text-sm font-semibold">Suggested prompts</h4>
            <div className="mt-3 space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-left text-xs hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <h4 className="text-sm font-semibold">Conversations</h4>
            <ul className="mt-3 space-y-2 text-xs">
              {["July variance analysis", "Q3 vendor consolidation", "Snowflake contract review", "Duplicate detection sweep"].map((c) => (
                <li key={c} className="text-muted-foreground hover:text-foreground cursor-pointer truncate">
                  {c}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </PageShell>
  );
}
