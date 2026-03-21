import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ReactivationScreenProps {
  onViewHistory: () => void;
}

export default function ReactivationScreen({ onViewHistory }: ReactivationScreenProps) {
  const [loading, setLoading] = useState(false);

  const handleReactivate = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {},
    });
    setLoading(false);

    if (error || !data?.url) {
      toast.error("Could not start checkout. Please try again.");
      return;
    }
    window.location.href = data.url;
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <h2 className="text-2xl font-bold text-[#0B1D3A]">
            Your FYM Dashboard subscription is paused.
          </h2>
          <p className="text-[#4A5568]">
            Your subscription is no longer active. You can still view your past
            entries, or reactivate to start tracking again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleReactivate}
              className="bg-[#D4A843] hover:bg-[#E0BC5E] text-[#0B1D3A] font-semibold"
              disabled={loading}
            >
              {loading ? "Loading..." : "Reactivate"}
            </Button>
            <Button variant="outline" onClick={onViewHistory}>
              View your history
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
