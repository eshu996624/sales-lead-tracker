import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import api from '../../services/api';

const SalesAnalytics = () => {
  const [data, setData] = useState({ counts: [], monthlyGrowth: [], conversionRate: 0, totalLeads: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/leads/stats');
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const growthData = data.monthlyGrowth.map((item) => ({ name: `${item._id.month}/${item._id.year}`, value: item.count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Sales Analytics</h1>
        <p className="mt-2 text-slate-600">Track deal progression and monthly lead growth using visual reports.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total Schools</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{data.totalLeads}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Conversion Rate</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{data.conversionRate}%</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Lead Stages</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{data.counts.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Lead Status Distribution</h2>
          <div className="mt-6 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.counts} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Monthly Lead Growth</h2>
          <div className="mt-6 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
