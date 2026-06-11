import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const SalesDashboard = () => {
  const [stats, setStats] = useState({ totalLeads: 0, counts: [], conversionRate: 0, monthlyGrowth: [] });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/leads/stats');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Sales Representative Overview</h1>
        <p className="mt-2 text-slate-600">Manage leads, monitor deal stages, and track monthly growth.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total Leads</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.totalLeads}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Conversion Rate</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.conversionRate}%</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Hot Leads</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.counts.find((c) => c.status === 'Hot Lead')?.count || 0}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Lead Status Summary</h2>
          <div className="mt-6 space-y-3">
            {stats.counts.map((item) => (
              <div key={item.status} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900">{item.status}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Next Steps</h2>
          <ul className="mt-6 space-y-3 text-slate-600">
            <li>• Add new schools and capture lead details.</li>
            <li>• Update lead status as proposals and MOUs progress.</li>
            <li>• Monitor growth and close deals faster.</li>
          </ul>
          <Link to="/sales/leads" className="mt-6 inline-flex rounded-full bg-brand-blue px-6 py-3 text-white hover:bg-brand-aqua">
            View Leads
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
