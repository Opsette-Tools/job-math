import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

function numVal(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

type DiscountType = "percentage" | "flat";

const DEMO = {
  originalPrice: 850,
  discountType: "percentage" as DiscountType,
  discountValue: 15,
  taxEnabled: true,
  taxRate: 8.25,
};

export default function DiscountTab() {
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();

  const discountAmount =
    discountType === "percentage"
      ? originalPrice * (Math.min(discountValue, 100) / 100)
      : Math.min(discountValue, originalPrice);
  const subtotal = Math.max(originalPrice - discountAmount, 0);
  const taxAmount = taxEnabled ? subtotal * (taxRate / 100) : 0;
  const finalPrice = subtotal + taxAmount;

  const handleClear = () => {
    setOriginalPrice(0);
    setDiscountType("percentage");
    setDiscountValue(0);
    setTaxEnabled(false);
    setTaxRate(0);
    setIsDemo(false);
  };

  const handleDemo = () => {
    setOriginalPrice(DEMO.originalPrice);
    setDiscountType(DEMO.discountType);
    setDiscountValue(DEMO.discountValue);
    setTaxEnabled(DEMO.taxEnabled);
    setTaxRate(DEMO.taxRate);
    setIsDemo(true);
  };

  const handleCopy = async () => {
    let text = `Discount: ${formatCurrency(originalPrice)} - ${formatCurrency(discountAmount)} discount = ${formatCurrency(subtotal)}`;
    if (taxEnabled && taxRate > 0) {
      text += ` + ${formatCurrency(taxAmount)} tax = ${formatCurrency(finalPrice)}`;
    }
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

      {/* Original Price */}
      <Card className="shadow-card-md">
        <CardContent className="pt-5 pb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Original Price</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground/50">$</span>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={originalPrice || ""}
              onChange={(e) => setOriginalPrice(numVal(e.target.value))}
              className="pl-10 text-2xl font-bold h-14 min-h-[44px] rounded-xl border-2 border-border focus-visible:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Discount */}
      <Card className="shadow-card">
        <CardContent className="pt-5 pb-5 space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Discount Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setDiscountType("percentage"); setDiscountValue(0); }}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                discountType === "percentage"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Percentage
            </button>
            <button
              onClick={() => { setDiscountType("flat"); setDiscountValue(0); }}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                discountType === "flat"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Flat Amount
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {discountType === "percentage" ? "Discount (%)" : "Discount ($)"}
            </label>
            <div className="relative">
              {discountType === "flat" && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">$</span>
              )}
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={discountValue || ""}
                onChange={(e) => setDiscountValue(numVal(e.target.value))}
                className={`min-h-[44px] ${discountType === "flat" ? "pl-7" : ""}`}
              />
              {discountType === "percentage" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">%</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax */}
      <Card className="shadow-card">
        <CardContent className="pt-5 pb-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Tax</label>
            <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
          </div>
          {taxEnabled && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tax Rate (%)</label>
              <div className="relative">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={taxRate || ""}
                  onChange={(e) => setTaxRate(numVal(e.target.value))}
                  className="min-h-[44px]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/50 font-medium">%</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-results border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-card to-accent/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Price Breakdown</p>

          {/* Hero: final price */}
          <div className="text-center py-5 mb-4 rounded-2xl bg-background/60 backdrop-blur-sm shadow-card">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5 font-semibold">Final Price</p>
            <p className="text-5xl font-black tracking-tight text-primary">
              {formatCurrency(finalPrice)}
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-background/50 rounded-xl p-3 flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Original Price</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(originalPrice)}</p>
            </div>

            <div className="bg-background/50 rounded-xl p-3 flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Discount</p>
              <p className="text-lg font-bold text-destructive line-through">-{formatCurrency(discountAmount)}</p>
            </div>

            <div className="bg-background/50 rounded-xl p-3 flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Subtotal</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(subtotal)}</p>
            </div>

            {taxEnabled && taxRate > 0 && (
              <div className="bg-background/50 rounded-xl p-3 flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Tax ({taxRate}%)</p>
                <p className="text-lg font-bold text-foreground">+{formatCurrency(taxAmount)}</p>
              </div>
            )}
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
