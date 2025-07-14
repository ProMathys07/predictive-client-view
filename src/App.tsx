
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { NotificationProvider } from '@/hooks/useNotifications';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Companies from '@/pages/Companies';
import ClientDetail from '@/pages/ClientDetail';
import ModelTracking from '@/pages/ModelTracking';
import Analytics from '@/pages/Analytics';
import Tutorial from '@/pages/Tutorial';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <NotificationProvider>
      <CompanyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="companies" element={<Companies />} />
              <Route path="client/:clientId" element={<ClientDetail />} />
              <Route path="client/:clientId/model/:modelId" element={<ModelTracking />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="tutorial" element={<Tutorial />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </CompanyProvider>
    </NotificationProvider>
  );
}

export default App;
