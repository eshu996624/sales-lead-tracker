import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const items = [
  { to: '/sales', label: 'Overview' },
  { to: '/sales/leads', label: 'Lead Management' },
  { to: '/sales/analytics', label: 'Analytics' }
];

const SalesLayout = () => (
  <div className="min-h-screen md:flex bg-slate-50">
    <Sidebar items={items} />
    <main className="flex-1 p-6 md:p-10">
      <Outlet />
    </main>
  </div>
);

export default SalesLayout;
