import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Upload,
  Bot,
  FileBarChart2,
  ScrollText,
  MessagesSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Invoices", icon: Upload },
  { to: "/agents", label: "AI Agents", icon: Bot },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/audit", label: "Audit Logs", icon: ScrollText },
  { to: "/chat", label: "AI Copilot Chat", icon: MessagesSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="glass-strong sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-2 rounded-none border-y-0 border-l-0 p-4 lg:flex">
      <div className="flex items-center gap-2.5 px-2 py-3">
        <div className="bg-gradient-primary grid size-9 place-items-center rounded-xl shadow-lg">
          <Sparkles className="size-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Finance AI</div>
          <div className="text-muted-foreground text-xs">Copilot</div>
        </div>
      </div>
      <nav className="mt-4 flex flex-col gap-1">
        {nav.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_var(--color-border)]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4", active && "text-primary")} />
              {item.label}
              {active && <span className="bg-primary ml-auto size-1.5 rounded-full" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <div className="glass flex items-center gap-3 rounded-2xl p-3">
          <div className="bg-gradient-ai grid size-9 place-items-center rounded-full text-sm font-semibold text-black">
            AL
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium">Alex Lee</div>
            <div className="text-muted-foreground text-xs">CFO • Acme Inc</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
