import { useEffect, useState } from 'react';
import api from '../../services/api';

const statusOptions = ['New Lead', 'Hot Lead', 'Cold Lead', 'Proposal Sent', 'MOU Sent', 'Closed'];

const SalesLeads = () => {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ schoolName: '', contactPerson: '', phoneNumber: '', email: '', address: '', state: '', city: '', notes: '', status: 'New Lead' });
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadLeads = async () => {
    try {
      const res = await api.get('/leads', { params: { search, status: selectedStatus } });
      setLeads(res.data.leads);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [search, selectedStatus]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/leads', form);
      setForm({ schoolName: '', contactPerson: '', phoneNumber: '', email: '', address: '', state: '', city: '', notes: '', status: 'New Lead' });
      setMessage('Lead added successfully.');
      loadLeads();
    } catch (error) {
      setMessage('Unable to create lead.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leads/${id}`, { status });
      loadLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLead = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      loadLeads();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Lead Management</h1>
        <p className="mt-2 text-slate-600">Add, update, and track lead progression through Qwings sales stages.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Create New Lead</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {['schoolName', 'contactPerson', 'phoneNumber', 'email', 'address', 'state', 'city', 'notes'].map((field) => (
              <label key={field} className="block text-sm font-medium text-slate-700">
                {field === 'contactPerson' ? 'Contact Person' : field === 'phoneNumber' ? 'Phone Number' : field === 'schoolName' ? 'School Name' : field === 'email' ? 'Email' : field === 'state' ? 'State' : field === 'city' ? 'City' : field === 'notes' ? 'Notes' : 'Address'}
                {field === 'notes' ? (
                  <textarea value={form[field]} onChange={(e) => handleChange(field, e.target.value)} rows="3" className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue" />
                ) : (
                  <input value={form[field]} onChange={(e) => handleChange(field, e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue" required={field !== 'notes'} />
                )}
              </label>
            ))}
            <label className="block text-sm font-medium text-slate-700">
              Lead Status
              <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-blue">
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <button className="mt-4 rounded-full bg-brand-blue px-6 py-3 text-white hover:bg-brand-aqua" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Lead'}</button>
            {message && <p className="text-brand-blue">{message}</p>}
          </form>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="mt-6 space-y-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads" className="w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-blue" />
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-blue">
              <option value="">All statuses</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
        <h2 className="text-xl font-semibold">Lead List</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">School</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Contact</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="px-4 py-4 text-slate-800">{lead.schoolName}</td>
                  <td className="px-4 py-4 text-slate-800">{lead.contactPerson} • {lead.phoneNumber}</td>
                  <td className="px-4 py-4 text-slate-800">{lead.status}</td>
                  <td className="px-4 py-4 space-x-2">
                    <select value={lead.status} onChange={(e) => updateStatus(lead._id, e.target.value)} className="rounded-full border border-slate-300 px-3 py-2 text-sm outline-none">
                      {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button onClick={() => deleteLead(lead._id)} className="rounded-full bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
              {!leads.length && (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-slate-500">No leads found based on the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesLeads;
