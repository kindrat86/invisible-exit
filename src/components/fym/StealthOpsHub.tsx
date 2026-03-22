import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Shield, AlertTriangle } from "lucide-react";
import LegalTemplates from "@/components/fym/stealth/LegalTemplates";
import AnonymityPlaybook from "@/components/fym/stealth/AnonymityPlaybook";
import ComplianceDatabase from "@/components/fym/stealth/ComplianceDatabase";

export default function StealthOpsHub() {
  const [activeSection, setActiveSection] = useState("templates");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0B1D3A]">Stealth Ops Hub</h2>
        <p className="text-sm text-[#4A5568] mt-1">
          Legal templates, anonymity playbook, and compliance intelligence.
          Everything you need to stay invisible while building your exit.
        </p>
      </div>

      {/* Sub-tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="flex w-full bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-lg p-1">
          <TabsTrigger
            value="templates"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200 text-sm font-medium gap-1.5"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Legal Templates</span>
            <span className="sm:hidden">Templates</span>
          </TabsTrigger>
          <TabsTrigger
            value="playbook"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200 text-sm font-medium gap-1.5"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Anonymity Playbook</span>
            <span className="sm:hidden">Playbook</span>
          </TabsTrigger>
          <TabsTrigger
            value="compliance"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200 text-sm font-medium gap-1.5"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Compliance Database</span>
            <span className="sm:hidden">Compliance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <LegalTemplates />
        </TabsContent>

        <TabsContent value="playbook">
          <AnonymityPlaybook />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceDatabase />
        </TabsContent>
      </Tabs>
    </div>
  );
}
