import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const items = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/profile', label: 'School Profile' },
  { to: '/admin/upload', label: 'CSV Upload' },
  { to: '/admin/chat', label: 'AI Assistant' },
  { to: '/admin/analytics', label: 'Analytics' }
];

const AdminLayout = () => (
  <div className="min-h-screen md:flex bg-slate-50">
    <Sidebar items={items} />
    <main className="flex-1 p-6 md:p-10">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
