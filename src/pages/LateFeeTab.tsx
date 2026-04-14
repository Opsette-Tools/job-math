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

type FeeType = "percentage" | "flat";
type FeePeriod = "day" | "week" | "month";

const DEMO = {
  invoiceAmount: 1200,
  daysOverdue: 30,
  feeType: "percentage" as FeeType,
  feeValue: 1.5,
  feePeriod: "month" as FeePeriod,
};

export default function LateFeeTab() {
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [daysOverdue, setDaysOverdue] = useState(0);
  const [feeType, setFeeType] = useState<FeeType>("percentage");
  const [feeValue, setFeeValue] = useState(0);
  const [feePeriod, setFeePeriod] = useState<FeePeriod>("month");
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();

  const periodDays = feePeriod === "day" ? 1 : feePeriod === "week" ? 7 : 30;
  const periodsElapsed = daysOverdue / periodDays;

  const lateFee =
    feeType === "percentage"
      ? invoiceAmount * (feeValue / 100) * periodsElapsed
      : feeValue * periodsElapsed;
  const newTotal = invoiceAmount + lateFee;

  const periodLabel = feePeriod === "day" ? "day" : feePeriod === "week" ? "week" : "month";
  const feePerPeriod =
    feeType === "percentage"
      ? `${feeValue}%/${periodLabel}`
      : `${formatCurrency(feeValue)}/${periodLabel}`;

  const handleClear = () => {
    setInvoiceAmount(0);
    setDaysOverdue(0);
    setFeeType("percentage");
    setFeeValue(0);
    setFeePeriod("month");
    setIsDemo(false);
  };

  const handleDemo = () => {
    setInvoiceAmount(DEMO.invoiceAmount);
    setDaysOverdue(DEMO.daysOverdue);
    setFeeType(DEMO.feeType);
    setFeeValue(DEMO.feeValue);
    setFeePeriod(DEMO.feePeriod);
    setIsDemo(true);
  };

  const handleCopy = async () => {
    const text = `Late Fee: ${formatCurrency(invoiceAmount)} invoice | ${daysOverdue} days overdue at ${feePerPeriod} | Fee: ${formatCurrency(lateFee)} | Total owed: ${formatCurrency(newTotal)}`;
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

      {/* Invoice Amount */}
      <Card className="shadow-card-md">
        <CardContent className="pt-5 pb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Invoice Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground/50">$</span>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={invoiceAmount || ""}
              onChange={(e) => setInvoiceAmount(numVal(e.target.value))}
              className="pl-10 text-2xl font-bold h-14 min-h-[44px] rounded-xl border-2 border-border focus-visible:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Days Overdue */}
      <Card className="shadow-card">
        <CardContent className="pt-5 pb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Days Overdue</label>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={daysOverdue || ""}
            onChange={(e) => setDaysOverdue(numVal(e.target.value))}
            className="min-h-[44px]"
          />
        </CardContent>
      </Card>

      {/* Fee Config */}
      <Card className="shadow-card">
        <CardContent className="pt-5 pb-5 space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Fee Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setFeeType("percentage"); setFeeValue(0); }}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                feeType === "percentage"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Percentage
            </button>
            <button
              onClick={() => { setFeeType("flat"); setFeeValue(0); }}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                feeType === "flat"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Flat
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {feeType === "percentage" ? "Fee (%)" : "Fee ($)"}
            </label>
            <div className="relative">
              {feeType === "flat" && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">$</span>
              )}
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={feeValue || ""}
                onChange={(e) => setFeeValue(numVal(e.target.value))}
                className={`min-h-[44px] ${feeType === "flat" ? "pl-7" : ""}`}
              />
              {feeType === "percentage" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">%</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Fee Period</label>
            <div className="grid grid-cols-3 gap-2">
              {(["day", "week", "month"] as FeePeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setFeePeriod(p)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all min-h-[40px] capitalize ${
                    feePeriod === p
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Per {p}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-results border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-card to-accent/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Late Fee Summary</p>

          {/* New total - hero */}
          <div className="text-center py-5 mb-4 rounded-2xl bg-background/60 backdrop-blur-sm shadow-card">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5 font-semibold">Total Owed</p>
            <p className="text-5xl font-black tracking-tight text-destructive">
              {formatCurrency(newTotal)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Original Amount</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(invoiceAmount)}</p>
            </div>
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Late Fee</p>
              <p className="text-xl font-bold text-destructive mt-0.5">+{formatCurrency(lateFee)}</p>
            </div>
          </div>

          <div className="bg-background/50 rounded-xl p-3">
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Breakdown</p>
            <p className="text-sm text-foreground">
              {formatCurrency(invoiceAmount)} original + {formatCurrency(lateFee)} late fee ({daysOverdue} days at {feePerPeriod})
            </p>
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
