import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ShareModal from "./ShareModal";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface FYMCalculatorProps {
  userId: string;
  onSaved: () => void;
}

interface Results {
  runwayMonths: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  fymMonthly: number;
  fymTotal: number;
  fymFreedomNumber: number;
}

export default function FYMCalculator({ userId, onSaved }: FYMCalculatorProps) {
  const [runwayMonths, setRunwayMonths] = useState("");
  const [monthlyBurn, setMonthlyBurn] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState({ freedomNumber: "", shareUrl: "" });

  const handleCalculate = () => {
    const runway = parseInt(runwayMonths, 10);
    const burn = parseFloat(monthlyBurn);
    const revenue = parseFloat(monthlyRevenue);

    if (!runway || runway < 1 || runway > 120) {
      toast.error("Runway must be between 1 and 120 months.");
      return;
    }
    if (isNaN(burn) || burn < 0) {
      toast.error("Monthly burn must be 0 or more.");
      return;
    }
    if (isNaN(revenue) || revenue < 0) {
      toast.error("Monthly revenue must be 0 or more.");
      return;
    }

    const fymMonthly = revenue - burn;
    const fymTotal = fymMonthly * runway;
    const fymFreedomNumber = burn * 12 * 3;

    setResults({
      runwayMonths: runway,
      monthlyBurn: burn,
      monthlyRevenue: revenue,
      fymMonthly,
      fymTotal,
      fymFreedomNumber,
    });
  };

  const handleSave = async () => {
    if (!results) return;
    setSaving(true);
    const { error } = await supabase.from("fym_entries").insert({
      user_id: userId,
      runway_months: results.runwayMonths,
      monthly_burn: results.monthlyBurn,
      monthly_revenue: results.monthlyRevenue,
      fym_monthly: results.fymMonthly,
      fym_total: results.fymTotal,
      fym_freedom_number: results.fymFreedomNumber,
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to save entry.");
      console.error(error);
    } else {
      toast.success("Entry saved.");
      onSaved();
    }
  };

  const handleShare = async () => {
    if (!results) return;
    setSharing(true);
    const { data, error } = await supabase.functions.invoke("create-badge", {
      body: { badge_value: results.fymFreedomNumber },
    });
    setSharing(false);
    if (error || !data?.share_url) {
      toast.error("Failed to create badge.");
      return;
    }
    setShareData({
      freedomNumber: fmt.format(results.fymFreedomNumber),
      shareUrl: data.share_url,
    });
    setShareOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="runway">How many months until your target exit date?</Label>
          <Input
            id="runway"
            type="number"
            min={1}
            max={120}
            placeholder="e.g., 18"
            value={runwayMonths}
            onChange={(e) => setRunwayMonths(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="burn">Your total monthly personal expenses</Label>
          <Input
            id="burn"
            type="number"
            min={0}
            placeholder="e.g., 4500"
            value={monthlyBurn}
            onChange={(e) => setMonthlyBurn(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="revenue">Your current monthly side-business revenue</Label>
          <Input
            id="revenue"
            type="number"
            min={0}
            placeholder="e.g., 1200"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
          />
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        className="bg-[#D4A843] hover:bg-[#E0BC5E] text-[#0B1D3A] font-semibold"
      >
        Calculate
      </Button>

      {results && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#8A95A8] font-medium">
                  Your FYM Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-3xl font-bold ${
                    results.fymMonthly >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {fmt.format(results.fymMonthly)}
                </p>
                <p className="text-sm text-[#8A95A8] mt-1">
                  {results.fymMonthly >= 0
                    ? `+${fmt.format(results.fymMonthly)}/month surplus`
                    : `${fmt.format(results.fymMonthly)}/month deficit`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#8A95A8] font-medium">
                  Your Runway Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#0B1D3A]">
                  {fmt.format(results.fymTotal)}
                </p>
                <p className="text-sm text-[#8A95A8] mt-1">
                  {results.fymTotal >= 0
                    ? `At this rate, you'll have ${fmt.format(results.fymTotal)} in ${results.runwayMonths} months`
                    : `At this rate, you'll need to cover ${fmt.format(Math.abs(results.fymTotal))} in ${results.runwayMonths} months`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#8A95A8] font-medium">
                  Your Freedom Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#D4A843]">
                  {fmt.format(results.fymFreedomNumber)}
                </p>
                <p className="text-sm text-[#8A95A8] mt-1">
                  This is what your side business needs to generate annually to
                  fully replace your income for 3 years
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} variant="outline">
              {saving ? "Saving..." : "Save Entry"}
            </Button>
            <Button
              onClick={handleShare}
              disabled={sharing}
              className="bg-[#0B1D3A] hover:bg-[#132D5E] text-white"
            >
              {sharing ? "Creating badge..." : "Share"}
            </Button>
          </div>

          <ShareModal
            open={shareOpen}
            onOpenChange={setShareOpen}
            freedomNumber={shareData.freedomNumber}
            shareUrl={shareData.shareUrl}
          />
        </>
      )}
    </div>
  );
}
