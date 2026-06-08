import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './layouts/AdminLayout';
import SalesLayout from './layouts/SalesLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import CsvUploadPage from './pages/admin/CsvUploadPage';
import AdminChat from './pages/admin/AdminChat';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import SalesDashboard from './pages/sales/SalesDashboard';
import SalesLeads from './pages/sales/SalesLeads';
import SalesAnalytics from './pages/sales/SalesAnalytics';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="upload" element={<CsvUploadPage />} />
        <Route path="chat" element={<AdminChat />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
      <Route path="/sales" element={<ProtectedRoute roles={['sales']}><SalesLayout /></ProtectedRoute>}>
        <Route index element={<SalesDashboard />} />
        <Route path="leads" element={<SalesLeads />} />
        <Route path="analytics" element={<SalesAnalytics />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
