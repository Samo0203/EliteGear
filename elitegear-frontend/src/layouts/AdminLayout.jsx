import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, LayoutDashboard, Package, Tags, LogOut, User } from 'lucide-react';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/categories', icon: Tags, label: 'Categories' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <div className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Dumbbell size={28} />
          </div>
          <div>
            <div className="font-bold text-2xl tracking-tight">ELITEGEAR</div>
            <div className="text-xs text-zinc-500">Admin Panel</div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Main</div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${isActive 
                    ? 'bg-orange-500 text-white' 
                    : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-800 rounded-2xl">
            <div className="w-9 h-9 bg-zinc-700 rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user?.username}</div>
              <div className="text-xs text-emerald-400">Online</div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center px-8 justify-between">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="text-sm text-zinc-500">Welcome back, Admin</div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-zinc-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}