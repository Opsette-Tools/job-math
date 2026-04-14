import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

function numVal(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

type DepositType = "percentage" | "flat";

const DEMO = { jobTotal: 4500, depositType: "percentage" as DepositType, depositValue: 50 };

export default function DepositTab() {
  const [jobTotal, setJobTotal] = useState(0);
  const [depositType, setDepositType] = useState<DepositType>("percentage");
  const [depositValue, setDepositValue] = useState(50);
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();

  const depositAmount =
    depositType === "percentage"
      ? jobTotal * (Math.min(Math.max(depositValue, 0), 100) / 100)
      : Math.min(depositValue, jobTotal);
  const remaining = Math.max(jobTotal - depositAmount, 0);
  const depositPct = jobTotal > 0 ? (depositAmount / jobTotal) * 100 : 0;

  const handleClear = () => {
    setJobTotal(0);
    setDepositType("percentage");
    setDepositValue(50);
    setIsDemo(false);
  };

  const handleDemo = () => {
    setJobTotal(DEMO.jobTotal);
    setDepositType(DEMO.depositType);
    setDepositValue(DEMO.depositValue);
    setIsDemo(true);
  };

  const handleCopy = async () => {
    const text = `Deposit Split: ${formatCurrency(jobTotal)} job | Deposit: ${formatCurrency(depositAmount)} | Remaining: ${formatCurrency(remaining)}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Summary copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy to clipboard", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {isDemo && (
        <div className="rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground flex items-center justify-between shadow-card">
          <span className="font-medium">Demo data loaded</span>
          <Button variant="ghost" size="sm" onClick={handleClear} className="min-h-[36px] text-accent-foreground font-semibold">Clear</Button>
        </div>
      )}

      {/* Job Total */}
      <Card className="shadow-card-md">
        <CardContent className="pt-5 pb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Job Total</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground/50">$</span>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={jobTotal || ""}
              onChange={(e) => setJobTotal(numVal(e.target.value))}
              className="pl-10 text-2xl font-bold h-14 min-h-[44px] rounded-xl border-2 border-border focus-visible:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deposit Type Toggle */}
      <Card className="shadow-card">
        <CardContent className="pt-5 pb-5 space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Deposit Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setDepositType("percentage"); setDepositValue(50); }}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                depositType === "percentage"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Percentage
            </button>
            <button
              onClick={() => { setDepositType("flat"); setDepositValue(0); }}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                depositType === "flat"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Flat Amount
            </button>
          </div>

          {depositType === "percentage" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Deposit Percentage</label>
                <span className="text-sm font-bold text-foreground">{depositValue}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={depositValue}
                onChange={(e) => setDepositValue(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full"
              />
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                value={depositValue || ""}
                onChange={(e) => setDepositValue(Math.min(numVal(e.target.value), 100))}
                className="min-h-[44px]"
                placeholder="50"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Flat Deposit Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">$</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={depositValue || ""}
                  onChange={(e) => setDepositValue(numVal(e.target.value))}
                  className="pl-7 min-h-[44px]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-results border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-card to-accent/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Deposit Breakdown</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Deposit Due Now</p>
              <p className="text-2xl font-black text-primary mt-0.5">{formatCurrency(depositAmount)}</p>
            </div>
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Remaining Balance</p>
              <p className="text-2xl font-black text-foreground mt-0.5">{formatCurrency(remaining)}</p>
            </div>
          </div>

          {/* Split visualization */}
          <div className="bg-background/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Split</p>
              <p className="text-xs font-bold text-muted-foreground">
                {depositPct.toFixed(0)}% / {(100 - depositPct).toFixed(0)}%
              </p>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden flex">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-l-full"
                style={{ width: `${depositPct}%` }}
              />
              <div
                className="h-full bg-muted-foreground/20 transition-all duration-500 ease-out rounded-r-full"
                style={{ width: `${100 - depositPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] font-medium text-muted-foreground">
              <span>Deposit</span>
              <span>Balance</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleCopy} className="h-11 w-11 rounded-xl" aria-label="Copy summary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </Button>
        <Button variant="outline" size="icon" onClick={handleClear} className="h-11 w-11 rounded-xl" aria-label="Clear">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
          </svg>
        </Button>
        <Button variant="outline" size="sm" onClick={handleDemo} className="h-11 rounded-xl text-xs ml-auto gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
          </svg>
          Demo
        </Button>
      </div>
    </div>
  );
}
