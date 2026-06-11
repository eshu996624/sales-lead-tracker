import { useEffect, useState } from 'react';
import api from '../../services/api';

const statCards = [
  { label: 'Total Uploads', key: 'totalUploads' },
  { label: 'Total Records', key: 'totalRecords' },
  { label: 'School Profiles', key: 'schoolCount' }
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUploads: 0, totalRecords: 0, schoolCount: 0 });
  const [recent, setRecent] = useState([]);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analytics, activityRes] = await Promise.all([api.get('/admin/analytics'), api.get('/admin/activity')]);
        setStats(analytics.data);
        setRecent(analytics.data.recentUploads || []);
        setActivity(activityRes.data || []);
      } catch (err) {
        setError('Unable to load dashboard data.');
      }
    };
    loadData();
  }, []);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Principal Dashboard</h1>
        <p className="mt-2 text-slate-600">Review your uploads, school statistics, and recent activity in one place.</p>
      </div>
      {error && <div className="rounded-3xl bg-red-50 px-6 py-4 text-red-700">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{stats[card.key]}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Recent CSV uploads</h2>
          {recent.length ? (
            <div className="mt-4 space-y-4">
              {recent.map((upload) => (
                <div key={upload.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{upload.filename}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{upload.recordCount} records</span>
                  </div>
                  <p className="mt-2 text-slate-500">Uploaded {new Date(upload.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-500">No recent uploads yet. Upload a CSV to begin analysis.</p>
          )}
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Activity Log</h2>
          <div className="mt-4 space-y-3">
            {activity.length ? activity.map((entry) => (
              <div key={entry._id} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{entry.action}</p>
                <p className="mt-1 text-sm text-slate-600">{entry.details}</p>
                <p className="mt-2 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-slate-500">No activity recorded yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
