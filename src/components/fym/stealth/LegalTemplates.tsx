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
import { Search, X, Copy, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { LEGAL_TEMPLATES } from "@/data/legal-templates";
import type { LegalTemplate, LegalTemplateCategory, RiskLevel } from "@/types/stealth";
import { getRiskBadgeClasses } from "@/types/stealth";

const CATEGORIES: LegalTemplateCategory[] = [
  "Entity Formation",
  "Contracts & Agreements",
  "IP Protection",
  "Privacy & NDAs",
  "Tax & Compliance",
];

const RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High", "Critical"];

export default function LegalTemplates() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);

  const hasFilters = search || category !== "all" || riskLevel !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setRiskLevel("all");
  };

  const filtered = useMemo(() => {
    let result = LEGAL_TEMPLATES;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }

    if (category !== "all") result = result.filter((t) => t.category === category);
    if (riskLevel !== "all") result = result.filter((t) => t.risk_level === riskLevel);

    return result;
  }, [search, category, riskLevel]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Template copied to clipboard");
    } catch {
      toast.error("Failed to copy — try selecting the text manually");
    }
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          These templates are for <strong>educational purposes only</strong> and do not constitute legal advice.
          Consult a qualified attorney before using any template for your specific situation.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A95A8]" />
          <Input
            placeholder="Search templates by name, category, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[#8A95A8]">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <p className="text-sm text-[#8A95A8]">
          Showing {filtered.length} of {LEGAL_TEMPLATES.length} templates
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((tpl) => (
          <Card
            key={tpl.id}
            className="bg-white border border-gray-200 cursor-pointer hover:translate-y-[-2px] hover:shadow-md transition-all duration-300"
            onClick={() => setSelectedTemplate(tpl)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {tpl.category}
                </Badge>
                <Badge className={`text-xs ${getRiskBadgeClasses(tpl.risk_level)}`}>
                  {tpl.risk_level}
                </Badge>
              </div>

              <h3 className="font-bold text-[#0B1D3A] text-sm mb-2">{tpl.title}</h3>
              <p className="text-sm text-[#4A5568] line-clamp-2 mb-3">{tpl.description}</p>

              <div className="flex gap-3 text-xs text-[#8A95A8]">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {tpl.estimated_cost}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tpl.time_to_complete}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#4A5568] text-lg font-medium mb-2">No templates match your filters.</p>
          <p className="text-[#8A95A8]">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        {selectedTemplate && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex gap-2 flex-wrap mb-1">
                <Badge variant="secondary">{selectedTemplate.category}</Badge>
                <Badge className={`text-xs ${getRiskBadgeClasses(selectedTemplate.risk_level)}`}>
                  {selectedTemplate.risk_level} Priority
                </Badge>
              </div>
              <DialogTitle className="text-lg">{selectedTemplate.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <p className="text-sm text-[#4A5568]">{selectedTemplate.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#8A95A8] uppercase">Estimated Cost</p>
                  <p className="text-sm font-medium text-[#0B1D3A]">{selectedTemplate.estimated_cost}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A95A8] uppercase">Time to Complete</p>
                  <p className="text-sm font-medium text-[#0B1D3A]">{selectedTemplate.time_to_complete}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-1">When You Need This</p>
                <p className="text-sm text-[#0B1D3A]">{selectedTemplate.when_you_need_it}</p>
              </div>

              {/* Template Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-[#8A95A8] uppercase">Template</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(selectedTemplate.template_content)}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Template
                  </Button>
                </div>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-[#4A5568] whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
                  {selectedTemplate.template_content}
                </pre>
              </div>

              {/* Checklist */}
              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-2">Action Checklist</p>
                <div className="space-y-2">
                  {selectedTemplate.checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#60A5FA] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#4A5568]">{item}</span>
                    </div>
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
