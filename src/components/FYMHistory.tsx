import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Trash2, ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/fym-calculations";
import type { CalculatorInputs } from "@/types/fym";

interface Entry {
  id: string;
  runway_months: number;
  monthly_burn: number;
  monthly_revenue: number;
  fym_monthly: number;
  fym_total: number;
  fym_freedom_number: number;
  created_at: string;
}

type SortKey = "created_at" | "monthly_revenue" | "fym_monthly" | "fym_total";
type SortDir = "asc" | "desc";

interface FYMHistoryProps {
  userId: string;
  refreshKey: number;
  onLoadEntry?: (entry: CalculatorInputs) => void;
}

const PAGE_SIZE = 10;

export default function FYMHistory({
  userId,
  refreshKey,
  onLoadEntry,
}: FYMHistoryProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fym_entries")
      .select(
        "id, runway_months, monthly_burn, monthly_revenue, fym_monthly, fym_total, fym_freedom_number, created_at"
      )
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
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

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const sorted = useMemo(() => {
    const arr = [...entries];
    arr.sort((a, b) => {
      const aVal = sortKey === "created_at" ? new Date(a[sortKey]).getTime() : Number(a[sortKey]);
      const bVal = sortKey === "created_at" ? new Date(b[sortKey]).getTime() : Number(b[sortKey]);
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return arr;
  }, [entries, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRowClick = (entry: Entry) => {
    if (onLoadEntry) {
      onLoadEntry({
        runwayMonths: entry.runway_months,
        monthlyBurn: Number(entry.monthly_burn),
        monthlyRevenue: Number(entry.monthly_revenue),
      });
    }
  };

  if (loading) {
    return (
      <p className="text-[#8A95A8] text-center py-8">Loading history...</p>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#4A5568] text-lg font-medium mb-2">
          No entries yet.
        </p>
        <p className="text-[#8A95A8]">
          Calculate your FYM score and save your first entry to start tracking
          your journey.
        </p>
      </div>
    );
  }

  const SortHeader = ({
    label,
    sortKeyVal,
  }: {
    label: string;
    sortKeyVal: SortKey;
  }) => (
    <TableHead
      className="cursor-pointer select-none hover:bg-gray-50"
      onClick={() => toggleSort(sortKeyVal)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 text-[#8A95A8]" />
      </span>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHeader label="Date" sortKeyVal="created_at" />
              <TableHead>Runway</TableHead>
              <TableHead>Expenses</TableHead>
              <SortHeader label="Revenue" sortKeyVal="monthly_revenue" />
              <SortHeader label="FYM Score" sortKeyVal="fym_monthly" />
              <SortHeader label="FYM Total" sortKeyVal="fym_total" />
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((entry, i) => (
              <TableRow
                key={entry.id}
                className={`${onLoadEntry ? "cursor-pointer hover:bg-blue-50" : ""} ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}
                onClick={() => handleRowClick(entry)}
              >
                <TableCell className="whitespace-nowrap">
                  {new Date(entry.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{entry.runway_months}mo</TableCell>
                <TableCell>
                  {formatCurrency(Number(entry.monthly_burn))}
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(entry.monthly_revenue))}
                </TableCell>
                <TableCell
                  className={
                    Number(entry.fym_monthly) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {formatCurrency(Number(entry.fym_monthly))}
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(entry.fym_total))}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-[#8A95A8]">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
