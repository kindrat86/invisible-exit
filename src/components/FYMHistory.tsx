import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface Entry {
  id: string;
  runway_months: number;
  monthly_burn: number;
  monthly_revenue: number;
  fym_monthly: number;
  fym_total: number;
  created_at: string;
}

interface FYMHistoryProps {
  userId: string;
  refreshKey: number;
}

export default function FYMHistory({ userId, refreshKey }: FYMHistoryProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fym_entries")
      .select("id, runway_months, monthly_burn, monthly_revenue, fym_monthly, fym_total, created_at")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
    if (error) console.error(error);
    setEntries((data as Entry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [userId, refreshKey]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("fym_entries")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  if (loading) {
    return <p className="text-[#8A95A8] text-center py-8">Loading history...</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="text-[#8A95A8] text-center py-8">
        No entries yet. Use the calculator to create your first entry.
      </p>
    );
  }

  const chartData = entries.map((e) => ({
    date: new Date(e.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    fym: Number(e.fym_monthly),
  }));

  const reversed = [...entries].reverse();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [fmt.format(value), "FYM Monthly"]}
            />
            <ReferenceLine y={0} stroke="#8A95A8" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="fym"
              stroke="#D4A843"
              strokeWidth={2}
              dot={{ fill: "#D4A843", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Runway</TableHead>
              <TableHead>Burn</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>FYM Monthly</TableHead>
              <TableHead>FYM Total</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reversed.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap">
                  {new Date(entry.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{entry.runway_months}mo</TableCell>
                <TableCell>{fmt.format(Number(entry.monthly_burn))}</TableCell>
                <TableCell>{fmt.format(Number(entry.monthly_revenue))}</TableCell>
                <TableCell
                  className={
                    Number(entry.fym_monthly) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {fmt.format(Number(entry.fym_monthly))}
                </TableCell>
                <TableCell>{fmt.format(Number(entry.fym_total))}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-[#8A95A8]" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the entry from your history.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
