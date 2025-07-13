import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BlockchainProvider } from "./contexts/BlockchainContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Explorer from "./pages/Explorer";
import Auth from "./pages/Auth";
import DataManager from "./pages/DataManager";
import EnhancedDataManager from "./pages/EnhancedDataManager";
import SubmitData from "./pages/SubmitData";
import VerifyData from "./pages/VerifyData";
import AdminDashboard from "./pages/AdminDashboard";
import EducationalSection from "./pages/EducationalSection";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BlockchainProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/data-manager" element={<DataManager />} />
              <Route path="/enhanced-data" element={<EnhancedDataManager />} />
              <Route path="/submit" element={<SubmitData />} />
              <Route path="/verify" element={<VerifyData />} />
              <Route path="/learn" element={<EducationalSection />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </BlockchainProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
