import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { COMPLIANCE_ENTRIES } from "@/data/compliance-database";
import type { ComplianceEntry, RiskLevel } from "@/types/stealth";
import { getRiskBadgeClasses } from "@/types/stealth";

const RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High", "Critical"];

const ALL_INDUSTRIES = [
  ...new Set(COMPLIANCE_ENTRIES.flatMap((e) => e.common_in)),
].sort();

const ALL_CLAUSE_TYPES = [
  ...new Set(COMPLIANCE_ENTRIES.map((e) => e.clause_type)),
].sort();

export default function ComplianceDatabase() {
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [clauseType, setClauseType] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<ComplianceEntry | null>(null);

  const hasFilters =
    search || riskLevel !== "all" || industry !== "all" || clauseType !== "all";

  const clearFilters = () => {
    setSearch("");
    setRiskLevel("all");
    setIndustry("all");
    setClauseType("all");
  };

  const filtered = useMemo(() => {
    let result = COMPLIANCE_ENTRIES;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.clause_type.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.what_it_means.toLowerCase().includes(q) ||
          e.what_to_do.toLowerCase().includes(q),
      );
    }

    if (riskLevel !== "all") result = result.filter((e) => e.risk_level === riskLevel);
    if (industry !== "all") result = result.filter((e) => e.common_in.includes(industry));
    if (clauseType !== "all") result = result.filter((e) => e.clause_type === clauseType);

    // Sort by risk level severity
    const riskOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return result.sort((a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]);
  }, [search, riskLevel, industry, clauseType]);

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A95A8]" />
          <Input
            placeholder="Search clauses, risks, or actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={riskLevel} onValueChange={setRiskLevel}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              {RISK_LEVELS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {ALL_INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={clauseType} onValueChange={setClauseType}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Clause Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clause Types</SelectItem>
              {ALL_CLAUSE_TYPES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[#8A95A8]">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <p className="text-sm text-[#8A95A8]">
          Showing {filtered.length} of {COMPLIANCE_ENTRIES.length} clauses
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((entry) => (
          <Card
            key={entry.id}
            className="bg-white border border-gray-200 cursor-pointer hover:translate-y-[-1px] hover:shadow-md transition-all duration-300"
            onClick={() => setSelectedEntry(entry)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`text-xs ${getRiskBadgeClasses(entry.risk_level)}`}>
                      {entry.risk_level}
                    </Badge>
                    <h3 className="font-bold text-[#0B1D3A] text-sm">{entry.clause_type}</h3>
                  </div>
                  <p className="text-sm text-[#4A5568] line-clamp-2 mb-2">{entry.description}</p>
                  <div className="flex gap-1 flex-wrap">
                    {entry.common_in.slice(0, 4).map((ind) => (
                      <Badge key={ind} variant="outline" className="text-[10px]">
                        {ind}
                      </Badge>
                    ))}
                    {entry.common_in.length > 4 && (
                      <Badge variant="outline" className="text-[10px]">
                        +{entry.common_in.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#4A5568] text-lg font-medium mb-2">No clauses match your filters.</p>
          <p className="text-[#8A95A8]">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        {selectedEntry && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`text-xs ${getRiskBadgeClasses(selectedEntry.risk_level)}`}>
                  {selectedEntry.risk_level} Risk
                </Badge>
              </div>
              <DialogTitle className="text-lg">{selectedEntry.clause_type}</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <p className="text-sm text-[#4A5568]">{selectedEntry.description}</p>

              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-1">
                  What This Means for Your Side Business
                </p>
                <p className="text-sm text-[#0B1D3A]">{selectedEntry.what_it_means}</p>
              </div>

              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-1">What To Do</p>
                <p className="text-sm text-[#0B1D3A]">{selectedEntry.what_to_do}</p>
              </div>

              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-1">Jurisdiction Notes</p>
                <p className="text-sm text-[#4A5568]">{selectedEntry.jurisdiction_notes}</p>
              </div>

              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-1">Example Contract Language</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-[#4A5568] font-mono italic">
                    {selectedEntry.example_language}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-2">Common In</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedEntry.common_in.map((ind) => (
                    <Badge key={ind} variant="outline" className="text-xs">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
