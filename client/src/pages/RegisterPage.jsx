import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    schoolName: '',
    contactNumber: '',
    address: '',
    city: '',
    state: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        ...form,
        role: 'admin'
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-[2rem] bg-slate-950/95 p-10 shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Register New School Principal</h1>
            <p className="mt-2 text-slate-400">Create a principal account and register the school before uploading your CSV file.</p>
          </div>
          <Link to="/login" className="inline-flex rounded-full border border-slate-700 bg-white/5 px-5 py-3 text-sm text-slate-100 hover:border-brand-blue">
            Already have an account
          </Link>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-red-200">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Full Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              School Name
              <input
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Contact Number
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Country
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-300">
            Address
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              City
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              State
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              />
            </label>
          </div>
          <div className="rounded-3xl bg-slate-950/70 p-5 text-slate-300">
            <p className="font-semibold text-white">After registration</p>
            <p className="mt-2 text-sm">You can immediately upload a CSV file with school data at the admin upload screen.</p>
          </div>
          <button type="submit" disabled={loading} className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 hover:bg-brand-aqua">
            {loading ? 'Registering...' : 'Register School Principal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
