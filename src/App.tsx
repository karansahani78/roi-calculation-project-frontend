import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import Countries from "./pages/Countries";
import Majors from "./pages/Majors";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import SeoPage from "./pages/SeoPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DegreeWorthIt from "./pages/DegreeWorthIt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/results/:uuid" element={<Results />} />
                <Route path="/countries" element={<Countries />} />
                <Route path="/majors" element={<Majors />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/insights/degree-worth-it" element={<DegreeWorthIt />} />
                <Route path="/page/:slug" element={<SeoPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
