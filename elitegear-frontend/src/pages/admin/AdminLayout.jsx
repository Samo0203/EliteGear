import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, Tags, ShoppingCart,
  Users, LogOut, User, ChevronRight
} from 'lucide-react';

const menuItems = [
  { path: '/admin',          icon: LayoutDashboard, label: 'Dashboard',  end: true },
  { path: '/admin/products', icon: Package,         label: 'Products' },
  { path: '/admin/categories',icon: Tags,           label: 'Categories' },
  { path: '/admin/orders',   icon: ShoppingCart,    label: 'Orders' },
  { path: '/admin/users',    icon: Users,           label: 'Users' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Lexend',sans-serif", background: '#F5F0E8' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: '#2D2D2D',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, height: '100vh',
        borderRight: '1px solid rgba(45, 45, 45, 0.15)',
        zIndex: 30,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(249, 246, 242, 0.12)' }}>
          <div style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '20px', color: '#F5F0E8' }}>
            EliteGear
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'rgba(249, 246, 242, 0.45)', marginTop: '4px', textTransform: 'uppercase' }}>
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 12px', overflow: 'auto' }}>
          <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(249, 246, 242, 0.45)', padding: '0 12px', marginBottom: '8px' }}>
            MAIN MENU
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {menuItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? 'var(--leaf)' : 'transparent',
                  color: isActive ? '#F5F0E8' : 'rgba(249, 246, 242, 0.55)',
                  transition: 'all 0.2s ease',
                })}
                onMouseEnter={e => { if (!e.currentTarget.style.background.includes('var(--leaf)')) e.currentTarget.style.background = 'rgba(249, 246, 242, 0.08)'; }}
                onMouseLeave={e => { if (!e.currentTarget.style.background.includes('var(--leaf)')) e.currentTarget.style.background = 'transparent'; }}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(249, 246, 242, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(249, 246, 242, 0.08)' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--leaf)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={16} style={{ color: '#F5F0E8' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#F5F0E8', truncate: true }}>{user?.username || 'Admin'}</p>
              <p style={{ fontSize: '10px', color: 'var(--primary)', letterSpacing: '0.05em' }}>ONLINE</p>
            </div>
            <button onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(249, 246, 242, 0.4)', padding: '4px' }}
              title="Logout"
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(249, 246, 242, 0.4)'}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{
          height: '60px',
          background: '#FAFAF8',
          borderBottom: '1px solid #E8DFD5',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(45,45,45,0.55)' }}>
            <span>Admin</span>
            <ChevronRight size={13} />
            <span style={{ color: 'var(--carbon)' }}>Dashboard</span>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(45,45,45,0.55)' }}>
            Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user?.name || 'Administrator'}</span>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}