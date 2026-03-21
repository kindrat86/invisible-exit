import { formatCurrency } from "@/lib/fym-calculations";
import type { FymEntry } from "@/types/fym";

interface WelcomeHeaderProps {
  email: string;
  latestEntry: FymEntry | null | undefined;
}

export default function WelcomeHeader({ email, latestEntry }: WelcomeHeaderProps) {
  const name = email.split("@")[0];

  let subtitle = "Let's calculate your first FYM score.";
  if (latestEntry) {
    const burn = Number(latestEntry.monthly_burn);
    const revenue = Number(latestEntry.monthly_revenue);
    const freedomPct = burn > 0 ? Math.min((revenue / burn) * 100, 100) : 0;

    if (freedomPct >= 100) {
      subtitle = "You've reached your freedom number. The cage is open.";
    } else {
      subtitle = `Your exit is ${Math.round(freedomPct)}% funded. Keep building.`;
    }
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1D3A] tracking-tight">
        Welcome back, {name}.
      </h1>
      <p className="text-[#4A5568] mt-1">{subtitle}</p>
    </div>
  );
}
