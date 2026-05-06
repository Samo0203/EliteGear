import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import CartDrawer from '../cart/CartDrawer';

export default function Navbar() {
  const { user, cartCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen,   setCartOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search,     setSearch]     = useState('');

  const navLinks = [
    { label: 'Home',     path: '/' },
    { label: 'Category', path: '/category' },
    { label: 'Product',  path: '/products' },
    ...(user ? [{ label: 'My Orders', path: '/orders' }] : []),
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const searchParam = `search=${encodeURIComponent(search.trim())}`;
      if (location.pathname === '/products' || location.pathname === '/category') {
        navigate(`${location.pathname}?${searchParam}`);
      } else {
        navigate(`/products?${searchParam}`);
      }
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40" style={{ background: '#F5F0E8', borderBottom: '1px solid #DDD3CA' }}>
        <div className="max-w-eg px-eg mx-auto flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="font-bold text-xl tracking-tight"
            style={{ color: 'var(--carbon)', fontStyle: 'italic' }}>
            EliteGear
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="label transition-colors duration-200"
                style={{
                  color: isActive(link.path)
                    ? '#4bd82b'
                    : 'var(--carbon)',
                  fontWeight: isActive(link.path) ? '600' : '400',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="text-sm py-2 pl-4 pr-10 w-44 focus:w-56 transition-all duration-300"
                  style={{ fontSize: '13px', padding: '8px 36px 8px 14px', background: 'white', border: '1px solid #DDD3CA', borderRadius: '6px', color: 'var(--carbon)' }}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(45, 45, 45, 0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Search size={14} />
                </button>
              </div>
            </form>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 transition-colors"
              style={{ color: 'var(--carbon)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--leaf)', color: 'var(--oat-milk)', fontSize: '10px' }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Login */}
            {user ? (
              <button
                onClick={() => navigate(user.isAdmin ? '/admin' : '/profile')}
                className="flex items-center gap-2 p-2 rounded-lg transition-colors"
                style={{ color: 'var(--carbon)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--leaf)' }}>
                  <User size={15} style={{ color: 'var(--oat-milk)' }} />
                </div>
              </button>
            ) : (
              <Link to="/login"
                className="label"
                style={{ color: 'var(--carbon)', textDecoration: 'none' }}>
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2"
              style={{ color: 'var(--carbon)', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden px-6 pb-6" style={{ borderTop: '1px solid #DDD3CA' }}>
            <div className="pt-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="label"
                  style={{ color: isActive(link.path) ? 'var(--primary)' : 'var(--carbon)', textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ))}
              <form onSubmit={handleSearch} className="mt-2">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search gear..."
                  className="w-full"
                  style={{ fontSize: '13px', padding: '10px 14px', background: 'white', border: '1px solid #DDD3CA', borderRadius: '6px', color: 'var(--carbon)' }}
                />
              </form>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}