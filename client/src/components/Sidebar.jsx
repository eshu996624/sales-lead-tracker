import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ items }) => {
  const { logout } = useContext(AuthContext);
  return (
    <aside className="w-full md:w-72 bg-slate-900 text-slate-100 p-5 min-h-screen">
      <div className="mb-10">
        <div className="text-2xl font-bold text-white">Qwings</div>
        <div className="text-slate-400 mt-2">Partnership Management</div>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 transition ${isActive ? 'bg-brand-blue text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-8 w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white hover:bg-brand-aqua"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
