import { useEffect, useState } from 'react';
import api from '../../services/api';

const defaultSchool = {
  schoolName: '',
  principalName: '',
  contactNumber: '',
  email: '',
  address: '',
  city: '',
  state: '',
  country: ''
};

const AdminSchools = () => {
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(defaultSchool);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');

  const loadSchools = async () => {
    try {
      const res = await api.get('/admin/schools', { params: { search } });
      setSchools(res.data.schools);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadSchools();
  }, [search]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      if (editingId) {
        await api.put(`/admin/schools/${editingId}`, form);
        setMessage('School updated successfully.');
      } else {
        await api.post('/admin/schools', form);
        setMessage('School created successfully.');
      }
      setForm(defaultSchool);
      setEditingId('');
      loadSchools();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save school.');
    }
  };

  const handleEdit = (school) => {
    setEditingId(school._id);
    setForm({
      schoolName: school.schoolName || '',
      principalName: school.principalName || '',
      contactNumber: school.contactNumber || '',
      email: school.email || '',
      address: school.address || '',
      city: school.city || '',
      state: school.state || '',
      country: school.country || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this school record?')) return;
    try {
      await api.delete(`/admin/schools/${id}`);
      setMessage('School deleted successfully.');
      loadSchools();
    } catch (error) {
      setMessage('Unable to delete school.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">School Management</h1>
        <p className="mt-2 text-slate-600">Search, edit, and maintain school profiles in the system.</p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        {message && <div className="mb-6 rounded-3xl bg-brand-blue/10 p-4 text-brand-blue">{message}</div>}
        <h2 className="text-xl font-semibold">{editingId ? 'Edit School' : 'Add New School'}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-2">
          {Object.entries(form).map(([field, value]) => (
            <label key={field} className="block text-sm font-medium text-slate-700">
              {field === 'schoolName'
                ? 'School Name'
                : field === 'principalName'
                ? 'Principal Name'
                : field === 'contactNumber'
                ? 'Contact Number'
                : field === 'email'
                ? 'Email'
                : field === 'address'
                ? 'Address'
                : field === 'city'
                ? 'City'
                : field === 'state'
                ? 'State'
                : 'Country'}
              <input
                required
                value={value}
                onChange={(e) => handleChange(field, e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
                type={field === 'email' ? 'email' : 'text'}
              />
            </label>
          ))}
          <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
            <button type="submit" className="rounded-full bg-brand-blue px-6 py-3 text-white hover:bg-brand-aqua">
              {editingId ? 'Update School' : 'Create School'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(''); setForm(defaultSchool); setMessage(''); }} className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">School List</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by school, city, or state"
            className="w-full max-w-sm rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-blue"
          />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">School</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Principal</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Location</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {schools.length ? schools.map((school) => (
                <tr key={school._id}>
                  <td className="px-4 py-4 text-slate-800">{school.schoolName}</td>
                  <td className="px-4 py-4 text-slate-800">{school.principalName}</td>
                  <td className="px-4 py-4 text-slate-800">{school.city}, {school.state}</td>
                  <td className="px-4 py-4 text-slate-800">{school.email}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button onClick={() => handleEdit(school)} className="rounded-full border border-brand-blue px-3 py-2 text-sm text-brand-blue hover:bg-brand-blue/10">Edit</button>
                    <button onClick={() => handleDelete(school._id)} className="rounded-full bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-slate-500">No schools found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSchools;
