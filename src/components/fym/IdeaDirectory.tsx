import { useState, useMemo, useCallback } from "react";
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
import { Search, Shield, X, RefreshCw, Rocket } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { allIdeas } from "@/data/idea-generator";
import type { IdeaEntry } from "@/types/fym";

const BATCH_SIZE = 10;

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const INDUSTRIES = [...new Set(allIdeas.map((i) => i.industry))].sort();
const REVENUE_TIERS = [
  "$0-500/mo",
  "$500-2K/mo",
  "$2K-5K/mo",
  "$5K-10K/mo",
  "$10K+/mo",
];
const TIME_INVESTMENTS = [
  "2-3 hrs/week",
  "5-7 hrs/week",
  "10-15 hrs/week",
  "15+ hrs/week",
];
const DIFFICULTIES = ["No-Code", "Low-Code", "Some Coding", "Developer Required"];

interface IdeaDirectoryProps {
  onValidateIdea?: (idea: IdeaEntry) => void;
  onSwitchTab?: (tab: string) => void;
  hasFullAccess?: boolean;
}

export default function IdeaDirectory({ onValidateIdea, onSwitchTab, hasFullAccess = true }: IdeaDirectoryProps) {
  const [, setSearchParams] = useSearchParams();
  const [shuffledPool, setShuffledPool] = useState<IdeaEntry[]>(() =>
    shuffleArray(allIdeas)
  );
  const [batchIndex, setBatchIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [revenueTier, setRevenueTier] = useState("all");
  const [timeInvestment, setTimeInvestment] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [selectedIdea, setSelectedIdea] = useState<IdeaEntry | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const totalBatches = Math.ceil(shuffledPool.length / BATCH_SIZE);

  const currentBatch = useMemo(() => {
    const start = batchIndex * BATCH_SIZE;
    return shuffledPool.slice(start, start + BATCH_SIZE);
  }, [shuffledPool, batchIndex]);

  const handleRegenerate = useCallback(() => {
    setRegenerating(true);
    setTimeout(() => {
      const nextIndex = batchIndex + 1;
      if (nextIndex >= totalBatches) {
        setShuffledPool(shuffleArray(allIdeas));
        setBatchIndex(0);
        toast.success(
          "You've seen all ideas! Reshuffled and starting fresh."
        );
      } else {
        setBatchIndex(nextIndex);
        toast.success(
          "Fresh ideas loaded. Found something interesting? Save it to your pipeline."
        );
      }
      setRegenerating(false);
    }, 800);
  }, [batchIndex, totalBatches]);

  const hasFilters =
    search ||
    industry !== "all" ||
    revenueTier !== "all" ||
    timeInvestment !== "all" ||
    difficulty !== "all";

  const clearFilters = () => {
    setSearch("");
    setIndustry("all");
    setRevenueTier("all");
    setTimeInvestment("all");
    setDifficulty("all");
  };

  const filtered = useMemo(() => {
    let result = currentBatch;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (industry !== "all")
      result = result.filter((i) => i.industry === industry);
    if (revenueTier !== "all")
      result = result.filter((i) => i.revenue_tier === revenueTier);
    if (timeInvestment !== "all")
      result = result.filter((i) => i.time_investment === timeInvestment);
    if (difficulty !== "all")
      result = result.filter((i) => i.technical_difficulty === difficulty);

    return result.sort((a, b) =>
      a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1
    );
  }, [currentBatch, search, industry, revenueTier, timeInvestment, difficulty]);

  const startNum = batchIndex * BATCH_SIZE + 1;
  const endNum = Math.min((batchIndex + 1) * BATCH_SIZE, shuffledPool.length);

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A95A8]" />
          <Input
            placeholder="Search ideas by keyword, industry, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={revenueTier} onValueChange={setRevenueTier}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Revenue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Revenue</SelectItem>
              {REVENUE_TIERS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeInvestment} onValueChange={setTimeInvestment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              {TIME_INVESTMENTS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-[#8A95A8]"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-[#8A95A8]">
            Showing {filtered.length} of {BATCH_SIZE} ideas (#{startNum}-{endNum} of {shuffledPool.length.toLocaleString()})
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="border-gray-200 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`}
            />
            {regenerating ? "Generating..." : "Regenerate Ideas"}
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((idea) => (
          <Card
            key={idea.id}
            className={`bg-white border cursor-pointer hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 ${
              idea.is_featured ? "border-amber-300 ring-1 ring-amber-200" : "border-gray-200"
            }`}
            onClick={() => setSelectedIdea(idea)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {idea.industry}
                  </Badge>
                  {idea.is_featured && (
                    <Badge className="bg-amber-100 text-amber-800 text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8A95A8] flex-shrink-0">
                  <Shield className="h-3 w-3" />
                  {idea.invisibility_score}/10
                </div>
              </div>

              <h3 className="font-bold text-[#0B1D3A] text-sm mb-2">
                {idea.title}
              </h3>
              <p className="text-sm text-[#4A5568] line-clamp-2 mb-3">
                {idea.description}
              </p>

              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {idea.revenue_tier}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {idea.time_investment}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {idea.technical_difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {idea.startup_cost}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#4A5568] text-lg font-medium mb-2">
            No ideas match your filters.
          </p>
          <p className="text-[#8A95A8]">Try adjusting your search or filters, or regenerate for a new batch.</p>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog
        open={!!selectedIdea}
        onOpenChange={(open) => !open && setSelectedIdea(null)}
      >
        {selectedIdea && (
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex gap-2 flex-wrap mb-1">
                <Badge variant="secondary">{selectedIdea.industry}</Badge>
                <div className="flex items-center gap-1 text-sm text-[#8A95A8]">
                  <Shield className="h-3 w-3" />
                  Invisibility: {selectedIdea.invisibility_score}/10
                </div>
              </div>
              <DialogTitle className="text-lg">
                {selectedIdea.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-[#4A5568]">
                {selectedIdea.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#8A95A8] uppercase">Revenue</p>
                  <p className="text-sm font-medium text-[#0B1D3A]">
                    {selectedIdea.revenue_tier}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A95A8] uppercase">Time</p>
                  <p className="text-sm font-medium text-[#0B1D3A]">
                    {selectedIdea.time_investment}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A95A8] uppercase">Difficulty</p>
                  <p className="text-sm font-medium text-[#0B1D3A]">
                    {selectedIdea.technical_difficulty}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A95A8] uppercase">
                    Startup Cost
                  </p>
                  <p className="text-sm font-medium text-[#0B1D3A]">
                    {selectedIdea.startup_cost}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-1">
                  Monetization
                </p>
                <p className="text-sm text-[#0B1D3A]">
                  {selectedIdea.monetization_model}
                </p>
              </div>

              {/* Tools You'll Need - gated for starters */}
              {!hasFullAccess ? (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Tools Needed
                  </p>
                  <div className="mt-2 filter blur-[5px] pointer-events-none select-none">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Claude AI</Badge>
                      <Badge variant="outline">Vercel</Badge>
                      <Badge variant="outline">Stripe</Badge>
                      <Badge variant="outline">+ 2 more</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    The exact tool stack to build this. Available to founding members.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-[#8A95A8] uppercase mb-1">
                    Tools You'll Need
                  </p>
                  <p className="text-sm text-[#0B1D3A]">
                    {selectedIdea.example_tools}
                  </p>
                </div>
              )}

              {/* 48-Hour Validation Method - gated for starters */}
              {!hasFullAccess ? (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    48-Hour Validation Method
                  </p>
                  <div className="mt-2 filter blur-[5px] pointer-events-none select-none text-sm leading-relaxed">
                    Step 1: Identify 3 target communities where your audience gathers.
                    Step 2: Create a minimal landing page with your value proposition.
                    Step 3: Post a problem-awareness thread and measure response.
                    Step 4: Run a micro-test with a $0.97 entry point.
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    The step-by-step validation script to test this idea in one weekend.
                    Available to founding members.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-[#8A95A8] uppercase mb-1">
                    How to Validate in 48 Hours
                  </p>
                  <p className="text-sm text-[#0B1D3A]">
                    {selectedIdea.validation_method}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-[#8A95A8] uppercase mb-1">
                  Invisibility Considerations
                </p>
                <p className="text-sm text-[#4A5568]">
                  {selectedIdea.invisibility_score >= 9
                    ? "Highly invisible. This idea can be run with zero personal branding. Use your LLC name and a separate email. No face or real name needed."
                    : selectedIdea.invisibility_score >= 7
                      ? "Moderately invisible. Some client-facing interaction may be needed. Use a business alias and virtual office address."
                      : "Some visibility required. You may need to present yourself in sales calls. Consider using a co-founder or VA for client-facing work."}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {selectedIdea.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {onValidateIdea && (
                <Button
                  className="w-full bg-[#60A5FA] hover:bg-[#3B82F6] text-white mt-2"
                  onClick={() => {
                    onValidateIdea(selectedIdea);
                    setSelectedIdea(null);
                  }}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Validate This Idea
                </Button>
              )}

              {/* Launch This Idea button - hidden for starters */}
              {hasFullAccess && onSwitchTab && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchParams(
                      {
                        tab: "launch",
                        ideaId: selectedIdea.id,
                        ideaTitle: selectedIdea.title,
                      },
                      { replace: true }
                    );
                    setSelectedIdea(null);
                    onSwitchTab("launch");
                  }}
                  className="w-full font-semibold"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch This Idea
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
