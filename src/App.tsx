import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import FYM from "./pages/FYM.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import NotFound from "./pages/NotFound.tsx";
import OTOFounding from "./pages/OTOFounding.tsx";
import OTOSecondTool from "./pages/OTOSecondTool.tsx";
import Login from "./pages/Login.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Badge from "./pages/Badge.tsx";
import Training from "./pages/Training.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import FoundingMember from "./pages/FoundingMember.tsx";
import Confirmation from "./pages/Confirmation.tsx";
import Blog from "./pages/Blog.tsx";
import IdeaPipeline from "./pages/IdeaPipeline.tsx";
import StealthOps from "./pages/StealthOps.tsx";
import LaunchControl from "./pages/LaunchControl.tsx";
import BrandManager from "./pages/BrandManager.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fym" element={<FYM />} />
          <Route path="/idea-pipeline" element={<IdeaPipeline />} />
          <Route path="/ideas" element={<IdeaPipeline />} />
          <Route path="/stealth-ops" element={<StealthOps />} />
          <Route path="/launch-control" element={<LaunchControl />} />
          <Route path="/brand-manager" element={<BrandManager />} />
          <Route path="/founding-member" element={<FoundingMember />} />
          <Route path="/training" element={<Training />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/oto/founding" element={<OTOFounding />} />
          <Route path="/oto/second-tool" element={<OTOSecondTool />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ideas" element={<IdeaPipeline />} />
          <Route path="/fym/badge/:shareId" element={<Badge />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
