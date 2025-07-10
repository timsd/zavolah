import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminSettingsProvider } from "./contexts/AdminSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Index from "./pages/Index";
import Store from "./pages/Store";
import Marketplace from "./pages/Marketplace";
import Academy from "./pages/Academy";
import Services from "./pages/Services";
import StaffAccess from "./pages/StaffAccess";
import BuyerDashboard from "./pages/BuyerDashboard";
import BecomeSeller from "./pages/BecomeSeller";
import StaffCRM from "./pages/StaffCRM";
import ZavChargeProduct from "./pages/ZavChargeProduct";
import ZavCharge from "./pages/ZavCharge";
import ReferEarn from "./pages/ReferEarn";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdminSettingsProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/store" element={<Store />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/marketplace/become-seller" element={<BecomeSeller />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/services" element={<Services />} />
              <Route path="/staff" element={<StaffAccess />} />
              <Route path="/staff/crm" element={<StaffCRM />} />
              <Route path="/zavcharge-product" element={<ZavChargeProduct />} />
              <Route path="/zavcharge" element={<ZavCharge />} />
              <Route path="/refer-earn" element={<ReferEarn />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </AdminSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
