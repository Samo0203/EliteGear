 import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI, userAPI, orderAPI } from '../../services/api';
import { Package, Tags, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [stats,   setStats]   = useState({ products: 0, categories: 0, users: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.allSettled([
      productAPI.getAll(), categoryAPI.getAll(), userAPI.getAll(), orderAPI.getAll()
    ]).then(([p, c, u, o]) => {
      const products   = p.status === 'fulfilled' ? p.value.data : [];
      const categories = c.status === 'fulfilled' ? c.value.data : [];
      const users      = u.status === 'fulfilled' ? u.value.data : [];
      const orders     = o.status === 'fulfilled' ? o.value.data : [];
      const revenue    = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
      setStats({ products: products.length, categories: categories.length, users: users.length, orders: orders.length, revenue });
    }).finally(() => setLoading(false));
    
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: 'Total Products',  value: stats.products,   icon: Package,     color: 'var(--leaf)',    bg: 'rgba(58,95,65,0.15)', path: '/admin/products' },
    { label: 'Categories',      value: stats.categories, icon: Tags,        color: '#A7D1AB',        bg: 'rgba(167,209,171,0.12)', path: '/admin/categories' },
    { label: 'Total Users',     value: stats.users,      icon: Users,       color: '#60a5fa',        bg: 'rgba(96,165,250,0.12)', path: '/admin/users' },
    { label: 'Total Orders',    value: stats.orders,     icon: ShoppingCart,color: '#f59e0b',        bg: 'rgba(245,158,11,0.12)', path: '/admin/orders' },
    { label: 'Revenue (Rs.)',   value: `Rs. ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.12)', wide: true },
  ];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--surface-high)', borderTopColor: 'var(--leaf)', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(45,45,45,0.55)', marginBottom: '8px' }}>
            OVERVIEW
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#000000', letterSpacing: '-0.01em' }}>
            Dashboard
          </h1>
        </div>

        {/* Date and Time Widget - Top Right Corner */}
        <div style={{
          background: 'linear-gradient(135deg, #F9F6F2 0%, #FAFAF8 100%)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #E8DFD5',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          minWidth: '200px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000', marginBottom: '4px' }}>
            {currentTime.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--leaf)', letterSpacing: '-0.01em' }}>
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {cards.map(card => (
          <div key={card.label}
            style={{
              background: '#F9F6F2',
              borderRadius: '12px',
              padding: '24px',
              gridColumn: card.wide ? 'span 2' : 'span 1',
              display: 'flex', alignItems: 'center', gap: '16px',
              transition: 'transform 0.2s',
              cursor: card.path ? 'pointer' : 'default',
            }}
            onClick={() => card.path && navigate(card.path)}
            onMouseEnter={e => card.path && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <card.icon size={22} style={{ color: card.color }} />
            </div>
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(45,45,45,0.55)', marginBottom: '4px' }}>
                {card.label}
              </p>
              <p style={{ fontSize: card.wide ? '20px' : '32px', fontWeight: 700, color: '#000000', lineHeight: 1 }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#F9F6F2', borderRadius: '12px', padding: '24px' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(45,45,45,0.55)', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Quick Actions
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: 'Add Product',  path: '/admin/products' },
            { label: 'Add Category', path: '/admin/categories' },
            { label: 'View Orders',  path: '/admin/orders' },
            { label: 'Manage Users', path: '/admin/users' },
          ].map(action => (
            <a key={action.label} href={action.path}
              style={{
                background: '#E8DFD5',
                color: '#000000',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                letterSpacing: '0.03em',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--leaf)'}
              onMouseLeave={e => e.currentTarget.style.background = '#E8DFD5'}>
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}