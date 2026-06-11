import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-fill credentials based on role parameter
    if (role === 'admin') {
      setEmail('principal@qwings.com');
      setPassword('Admin@1234');
    } else if (role === 'sales') {
      setEmail('sales@qwings.com');
      setPassword('Sales@1234');
    }
  }, [role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (role && role !== user.role) {
        setError(`This account is a "${user.role}" user. Use the ${user.role} login page or update the account role.`);
        return;
      }
      if (user.role === 'admin') navigate('/admin');
      else navigate('/sales');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-[2rem] bg-slate-950/95 p-10 shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <h1 className="text-3xl font-semibold">Qwings {role === 'admin' ? 'Principal' : role === 'sales' ? 'Sales Rep' : ''} Login</h1>
        <p className="mt-3 text-slate-400">{role === 'admin' ? 'Access the principal dashboard to manage school profiles and uploads.' : role === 'sales' ? 'Access the sales dashboard to manage leads and track growth.' : 'Access the school partnership dashboard for principals and sales reps.'}</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <input
              className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <input
              className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-blue"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-red-200">{error}</div>}
          <button className="w-full rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 hover:bg-brand-aqua" type="submit">
            Sign in
          </button>
        </form>
        <div className="mt-6 rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
          New school principal? <Link to="/register" className="font-semibold text-brand-aqua hover:text-brand-blue">Register here</Link>.
        </div>
        <div className="mt-4 rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
          Default user examples: <br />
          Admin: principal@qwings.com / Admin@1234 <br />
          Sales: sales@qwings.com / Sales@1234
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
