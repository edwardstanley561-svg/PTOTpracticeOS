import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Authorizations from './pages/Authorizations';
import Schedule from './pages/Schedule';
import TreatmentPlans from './pages/TreatmentPlans';
import Documentation from './pages/Documentation';
import Claims from './pages/Claims';
import Referrals from './pages/Referrals';
import Compliance from './pages/Compliance';
import SettingsPage from './pages/Settings';
import Pricing from './pages/Pricing';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/authorizations" element={<Authorizations />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/treatment-plans" element={<TreatmentPlans />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
