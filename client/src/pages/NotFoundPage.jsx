import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
    <div className="max-w-xl rounded-[2rem] bg-slate-900/95 p-10 text-center shadow-2xl shadow-black/30 ring-1 ring-white/10">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-4 text-lg text-slate-300">Page not found. Return to the Qwings landing page or login.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link className="rounded-full bg-brand-blue px-6 py-3 text-white hover:bg-brand-aqua" to="/">Home</Link>
        <Link className="rounded-full border border-slate-600 px-6 py-3 text-slate-100 hover:border-brand-blue" to="/login">Login</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
