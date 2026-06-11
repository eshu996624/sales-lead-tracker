import { useEffect, useState } from 'react';
import api from '../../services/api';

const defaultUser = {
  name: '',
  email: '',
  password: '',
  role: 'sales'
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(defaultUser);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users', { params: { search } });
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      if (editingId) {
        await api.put(`/admin/users/${editingId}`, form);
        setMessage('User updated successfully.');
      } else {
        await api.post('/admin/users', form);
        setMessage('User created successfully.');
      }
      setForm(defaultUser);
      setEditingId('');
      loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save user.');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'sales' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMessage('User removed successfully.');
      loadUsers();
    } catch (error) {
      setMessage('Unable to delete user.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">User Management</h1>
        <p className="mt-2 text-slate-600">Create sales representatives and manage account roles.</p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/40">
        {message && <div className="mb-6 rounded-3xl bg-brand-blue/10 p-4 text-brand-blue">{message}</div>}
        <h2 className="text-xl font-semibold">{editingId ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              type="password"
              className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
              required={!editingId}
              placeholder={editingId ? 'Leave blank to keep existing password' : ''}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Role
            <select
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-blue"
            >
              <option value="sales">Sales Representative</option>
              <option value="admin">School Principal</option>
            </select>
          </label>
          <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
            <button type="submit" className="rounded-full bg-brand-blue px-6 py-3 text-white hover:bg-brand-aqua">
              {editingId ? 'Update User' : 'Create User'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(''); setForm(defaultUser); setMessage(''); }} className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Accounts</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role"
            className="w-full max-w-sm rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-blue"
          />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Role</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length ? users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-4 text-slate-800">{user.name}</td>
                  <td className="px-4 py-4 text-slate-800">{user.email}</td>
                  <td className="px-4 py-4 text-slate-800">{user.role}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button onClick={() => handleEdit(user)} className="rounded-full border border-brand-blue px-3 py-2 text-sm text-brand-blue hover:bg-brand-blue/10">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="rounded-full bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-slate-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
