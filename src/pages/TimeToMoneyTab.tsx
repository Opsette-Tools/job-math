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

type TimeMode = "hm" | "decimal";

const DEMO = { hourlyRate: 75, hours: 2, minutes: 30, decimalHours: 2.5, timeMode: "hm" as TimeMode };

export default function TimeToMoneyTab() {
  const [hourlyRate, setHourlyRate] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [decimalHours, setDecimalHours] = useState(0);
  const [timeMode, setTimeMode] = useState<TimeMode>("hm");
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();

  const totalHours = timeMode === "hm" ? hours + minutes / 60 : decimalHours;
  const amountToCharge = hourlyRate * totalHours;
  const displayH = timeMode === "hm" ? hours : Math.floor(decimalHours);
  const displayM = timeMode === "hm" ? minutes : Math.round((decimalHours - Math.floor(decimalHours)) * 60);

  const handleClear = () => {
    setHourlyRate(0);
    setHours(0);
    setMinutes(0);
    setDecimalHours(0);
    setIsDemo(false);
  };

  const handleDemo = () => {
    setHourlyRate(DEMO.hourlyRate);
    setHours(DEMO.hours);
    setMinutes(DEMO.minutes);
    setDecimalHours(DEMO.decimalHours);
    setTimeMode(DEMO.timeMode);
    setIsDemo(true);
  };

  const handleCopy = async () => {
    const text = `Time to Money: ${displayH}h ${displayM}m at ${formatCurrency(hourlyRate)}/hr = ${formatCurrency(amountToCharge)}`;
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

      {/* Hourly Rate */}
      <Card className="shadow-card-md">
        <CardContent className="pt-5 pb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Hourly Rate</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground/50">$</span>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={hourlyRate || ""}
              onChange={(e) => setHourlyRate(numVal(e.target.value))}
              className="pl-10 text-2xl font-bold h-14 min-h-[44px] rounded-xl border-2 border-border focus-visible:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Time Worked */}
      <Card className="shadow-card">
        <CardContent className="pt-5 pb-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time Worked</label>
            <div className="grid grid-cols-2 gap-1 bg-muted rounded-lg p-0.5">
              <button
                onClick={() => {
                  setTimeMode("hm");
                  if (decimalHours > 0) {
                    setHours(Math.floor(decimalHours));
                    setMinutes(Math.round((decimalHours - Math.floor(decimalHours)) * 60));
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  timeMode === "hm"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                H : M
              </button>
              <button
                onClick={() => {
                  setTimeMode("decimal");
                  if (hours > 0 || minutes > 0) {
                    setDecimalHours(parseFloat((hours + minutes / 60).toFixed(2)));
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  timeMode === "decimal"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Decimal
              </button>
            </div>
          </div>

          {timeMode === "hm" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Hours</label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={hours || ""}
                  onChange={(e) => setHours(numVal(e.target.value))}
                  className="min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Minutes</label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  min={0}
                  max={59}
                  value={minutes || ""}
                  onChange={(e) => setMinutes(Math.min(numVal(e.target.value), 59))}
                  className="min-h-[44px]"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Decimal Hours</label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0.0"
                step="0.25"
                value={decimalHours || ""}
                onChange={(e) => setDecimalHours(numVal(e.target.value))}
                className="min-h-[44px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-results border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-card to-accent/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Charge Summary</p>

          {/* Hero: amount to charge */}
          <div className="text-center py-5 mb-4 rounded-2xl bg-background/60 backdrop-blur-sm shadow-card">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5 font-semibold">Amount to Charge</p>
            <p className="text-5xl font-black tracking-tight text-primary">
              {formatCurrency(amountToCharge)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Time Worked</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{displayH}h {displayM}m</p>
            </div>
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Rate Used</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(hourlyRate)}/hr</p>
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
