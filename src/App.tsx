
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { NotificationProvider } from "@/hooks/useNotifications";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ClientDetail from "./pages/ClientDetail";
import Analytics from "./pages/Analytics";
import Services from "./pages/Services";
import Companies from "./pages/Companies";
import Settings from "./pages/Settings";
import Tutorial from "./pages/Tutorial";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <CompanyProvider>
            <NotificationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  
                  <Route element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/client/:clientId" element={<ClientDetail />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/tutorial" element={<Tutorial />} />
                  </Route>
                  
                  <Route path="" element={<Navigate to="/" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </CompanyProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
