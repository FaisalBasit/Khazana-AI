import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  completed: "bg-success/15 text-success",
  success: "bg-success/15 text-success",
  processing: "bg-ai/15 text-ai",
  running: "bg-ai/15 text-ai",
  active: "bg-primary/20 text-primary",
  pending: "bg-warning/15 text-warning",
  warning: "bg-warning/15 text-warning",
  flagged: "bg-destructive/15 text-destructive",
  error: "bg-destructive/15 text-destructive",
  idle: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = map[status] ?? "bg-muted text-muted-foreground";
  const pulse = ["processing", "running", "active"].includes(status);
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize", cls)}>
      <span className={cn("size-1.5 rounded-full bg-current", pulse && "animate-pulse")} />
      {status}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: "low" | "medium" | "high" }) {
  const cls = risk === "high" ? "bg-destructive/15 text-destructive" : risk === "medium" ? "bg-warning/15 text-warning" : "bg-success/15 text-success";
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", cls)}>{risk}</span>;
}
