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
    role: 'admin'
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
      const user = await register(form);
      
      if (user.role === 'admin') navigate('/admin');
      else navigate('/sales');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] bg-slate-950/95 p-10 shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              Create Account
            </h1>

            <p className="mt-2 text-slate-400">
              Register as a school principal or sales representative to access your dashboard.
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex rounded-full border border-slate-700 bg-white/5 px-5 py-3 text-sm text-slate-100 hover:border-brand-blue"
          >
            Already have an account
          </Link>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-red-200">
              {error}
            </div>
          )}

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
            Account Type
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
            >
              <option value="admin">School Principal (Admin)</option>
              <option value="sales">Sales Representative</option>
            </select>
          </label>

          <div className="rounded-3xl bg-slate-950/70 p-5 text-slate-300">
            <p className="font-semibold text-white">
              After registration
            </p>

            <p className="mt-2 text-sm">
              {form.role === 'admin' 
                ? 'Login to the principal dashboard and upload your school CSV file.' 
                : 'Login to the sales dashboard to start managing leads.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 hover:bg-brand-aqua"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;