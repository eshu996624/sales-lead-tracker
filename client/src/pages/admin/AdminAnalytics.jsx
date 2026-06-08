import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../services/api';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({ totalUploads: 0, totalRecords: 0, schoolCount: 0, recentUploads: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats.recentUploads.map((upload) => ({ name: upload.filename, records: upload.recordCount }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
        <p className="mt-2 text-slate-600">Visualize recent uploads, school statistics, and upload trends.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {[
          { label: 'Total Uploads', value: stats.totalUploads },
          { label: 'Total Records', value: stats.totalRecords },
          { label: 'Schools Profiled', value: stats.schoolCount }
        ].map((card) => (
          <div key={card.label} className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Recent Uploads</h2>
          <div className="mt-6 space-y-4">
            {stats.recentUploads.map((upload) => (
              <div key={upload.id} className="rounded-3xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{upload.filename}</p>
                <p className="mt-1 text-slate-500">{upload.recordCount} records • {new Date(upload.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {!stats.recentUploads.length && <p className="text-slate-500">No uploads yet.</p>}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Upload Record Trend</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRecords" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip />
                <Area type="monotone" dataKey="records" stroke="#2563eb" fillOpacity={1} fill="url(#colorRecords)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
