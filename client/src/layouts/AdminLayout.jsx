import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const adminItems = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/profile', label: 'School Profile' },
  { to: '/admin/upload', label: 'CSV Upload' },
  { to: '/admin/schools', label: 'School Management' },
  { to: '/admin/users', label: 'User Management' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/chat', label: 'AI Assistant' }
];

const AdminLayout = () => (
  <div className="min-h-screen md:flex bg-slate-50">
    <Sidebar items={adminItems} />
    <main className="flex-1 p-6 md:p-10">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
