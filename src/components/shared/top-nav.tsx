import { Bell, Search, Sparkles } from "lucide-react";

export function TopNav({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 -mx-6 mb-6 border-b border-border/60 bg-background/60 px-6 py-4 backdrop-blur-xl lg:-mx-10 lg:px-10">
      <div className="flex items-center gap-4">
        <div className="min-w-0">
          <div className="text-muted-foreground text-xs">Finance AI Copilot</div>
          <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="glass hidden items-center gap-2 rounded-full px-3 py-2 md:flex">
            <Search className="text-muted-foreground size-4" />
            <input
              placeholder="Search invoices, vendors, agents..."
              className="w-64 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="glass hidden items-center gap-2 rounded-full px-3 py-2 lg:flex">
            <Sparkles className="text-ai size-4 animate-pulse" />
            <span className="text-xs font-medium">AI processing · 3 tasks</span>
          </div>
          <button className="glass grid size-10 place-items-center rounded-full" aria-label="Notifications">
            <Bell className="size-4" />
          </button>
          <div className="bg-gradient-primary grid size-10 place-items-center rounded-full text-sm font-semibold text-white">
            AL
          </div>
        </div>
      </div>
    </header>
  );
}
