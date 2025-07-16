
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { ClientProvider } from "@/contexts/ClientContext";
import { NotificationProvider } from "@/hooks/useNotifications";
import Layout from "./components/Layout";
import ClientLayout from "./components/ClientLayout";
import Dashboard from "./pages/Dashboard";
import ClientDetail from "./pages/ClientDetail";
import ModelTracking from "./pages/ModelTracking";
import Analytics from "./pages/Analytics";
import Companies from "./pages/Companies";
import Settings from "./pages/Settings";
import Tutorial from "./pages/Tutorial";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import LoginRedirect from "./components/LoginRedirect";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientPredictions from "./pages/client/ClientPredictions";
import ClientFeedback from "./pages/client/ClientFeedback";
import ClientProfile from "./pages/client/ClientProfile";
import ClientFAQ from "./pages/client/ClientFAQ";

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
            <ClientProvider>
              <NotificationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <LoginRedirect />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  
                  {/* Routes Admin */}
                  <Route element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['admin']}>
                        <Layout />
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  }>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/client/:clientId" element={<ClientDetail />} />
                    <Route path="/client/:clientId/model/:modelId" element={<ModelTracking />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/tutorial" element={<Tutorial />} />
                  </Route>

                  {/* Routes Client */}
                  <Route path="/client" element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['client']}>
                        <ClientLayout />
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<ClientDashboard />} />
                    <Route path="predictions" element={<ClientPredictions />} />
                    <Route path="feedback" element={<ClientFeedback />} />
                    <Route path="faq" element={<ClientFAQ />} />
                    <Route path="profile" element={<ClientProfile />} />
                  </Route>
                  
                  <Route path="" element={<Navigate to="/" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              </NotificationProvider>
            </ClientProvider>
          </CompanyProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
