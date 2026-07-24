import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/shared/page-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Finance AI Copilot" },
      { name: "description", content: "Company info, policies, thresholds, API keys, and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <PageShell title="Settings">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Company information" subtitle="Used across reports and exports" />
          <div className="mt-4 space-y-3">
            <Field label="Legal name" defaultValue="Acme Inc" />
            <Field label="Tax ID" defaultValue="US-84-2938471" />
            <Field label="Fiscal year end" defaultValue="December 31" />
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Finance policies" subtitle="Guardrails for autonomous agents" />
          <div className="mt-4 space-y-3">
            <Field label="Default currency" defaultValue="USD" />
            <Field label="Approval threshold" defaultValue="$10,000" />
            <Field label="Duplicate window (days)" defaultValue="30" />
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Spending limits" subtitle="Per category, per month" />
          <div className="mt-4 space-y-3">
            <Field label="Cloud" defaultValue="$200,000" />
            <Field label="Software" defaultValue="$140,000" />
            <Field label="Marketing" defaultValue="$80,000" />
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Notifications" subtitle="Where alerts land" />
          <div className="mt-4 space-y-4">
            <Toggle label="Email alerts for policy violations" defaultChecked />
            <Toggle label="Slack digest every morning" defaultChecked />
            <Toggle label="SMS for critical fraud alerts" />
            <Toggle label="Weekly executive email" defaultChecked />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <SectionTitle title="API keys" subtitle="Rotate keys used by integrations and agents" />
          <div className="mt-4 space-y-3">
            <Field label="Production key" defaultValue="fc_live_••••••••••••7f2a" />
            <Field label="Sandbox key" defaultValue="fc_test_••••••••••••a913" />
            <div className="flex gap-2">
              <Button className="bg-gradient-primary">Rotate keys</Button>
              <Button variant="outline">Revoke all</Button>
            </div>
          </div>
          <Separator className="my-6" />
          <SectionTitle title="Preferences" />
          <div className="mt-4 space-y-4">
            <Toggle label="Enable reduced motion" />
            <Toggle label="Compact table density" />
            <Toggle label="Show AI confidence scores" defaultChecked />
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold">{title}</h3>
      {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} className="glass border-border/60" />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </label>
  );
}
