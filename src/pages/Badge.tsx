import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Badge() {
  const { shareId } = useParams<{ shareId: string }>();
  const [badgeValue, setBadgeValue] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!shareId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("fym_badges")
        .select("badge_value")
        .eq("share_id", shareId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setBadgeValue(Number(data.badge_value));
      }
      setLoading(false);
    };
    fetch();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1D3A] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4A843] border-t-transparent" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0B1D3A] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#8A95A8] text-lg mb-4">
            This badge is no longer available.
          </p>
          <Link
            to="/fym"
            className="text-[#D4A843] hover:underline text-sm"
          >
            Calculate your number
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1D3A] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <p className="text-5xl sm:text-7xl font-bold text-[#D4A843]">
          {badgeValue !== null ? fmt.format(badgeValue) : ""}
        </p>
        <p className="text-[#8A95A8] text-lg">What's yours?</p>
        <Link
          to="/fym"
          className="inline-block bg-[#D4A843] hover:bg-[#E0BC5E] text-[#0B1D3A] font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Calculate Your Number
        </Link>
      </div>
      <footer className="absolute bottom-6 text-[#4A5568] text-xs">
        Invisible Exit
      </footer>
    </div>
  );
}
