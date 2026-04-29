import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [form,     setForm]     = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(form.username, form.password);
    if (res.success) {
      navigate(res.user.isAdmin ? '/admin' : '/');
    } else {
      setError(res.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F3F0', fontFamily: "'Lexend', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div className="flex flex-col justify-between w-full md:w-[46%] px-12 py-10"
        style={{ background: '#F5F3F0', zIndex: 1 }}>

        {/* Logo */}
        <div>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--carbon)', fontStyle: 'italic' }}>
            EliteGear
          </div>
          <p className="label" style={{ color: 'rgba(45,45,45,0.5)' }}>
            ARCHITECTURAL NATURALISM
          </p>
        </div>

        {/* Hero Text + Form */}
        <div className="my-8">
          <h1 className="display-md mb-10"
            style={{ color: 'var(--carbon)', marginTop: 0, lineHeight: 1.1, fontSize: 'clamp(36px,4vw,56px)' }}>
            Elevate Your<br />Performance.
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" style={{ maxWidth: '380px' }}>

            {/* Username */}
            <div>
              <label className="label mb-2 block" style={{ color: 'rgba(45,45,45,0.6)' }}>
                USERNAME OR EMAIL
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Enter your identifier"
                required
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid rgba(45,45,45,0.15)',
                  color: '#2D2D2D',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: "'Lexend',sans-serif",
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="label mb-2 block" style={{ color: 'rgba(45,45,45,0.6)' }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid rgba(45,45,45,0.15)',
                    color: '#2D2D2D',
                    borderRadius: '8px',
                    padding: '16px 48px 16px 16px',
                    fontFamily: "'Lexend',sans-serif",
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(45,45,45,0.4)',
                  }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ accentColor: 'var(--leaf)', width: '14px', height: '14px' }} />
                <span className="label" style={{ color: 'rgba(45,45,45,0.6)' }}>KEEP ME LOGGED IN</span>
              </label>
              <button type="button" className="label"
                style={{ background: 'none', border: 'none', color: 'rgba(45,45,45,0.7)', cursor: 'pointer', fontWeight: 600 }}>
                FORGOT PASSWORD?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} style={{ color: '#ef4444' }} />
                <span className="body-sm" style={{ color: '#ef4444' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-primary w-full"
              style={{
                background: 'var(--leaf)',
                padding: '18px',
                fontSize: '14px',
                letterSpacing: '0.08em',
                borderRadius: '8px',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? 'LOGGING IN...' : <span className="flex items-center justify-center gap-2">LOGIN <ArrowRight size={16} /></span>}
            </button>

          </form>
        </div>

        {/* Bottom */}
        <div>
          <p style={{ color: 'rgba(45,45,45,0.6)', fontSize: '13px' }}>
            NEW TO ELITEGEAR?{' '}
            <Link to="/register" style={{ color: 'var(--carbon)', fontWeight: 700, textDecoration: 'underline' }}>
              REGISTER AN ACCOUNT
            </Link>
          </p>
          <p className="label mt-4" style={{ color: 'rgba(45,45,45,0.4)' }}>
            © ELITEGEAR
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80"
          alt="Athlete"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(30%) brightness(0.75)' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #000 0%, transparent 40%)' }} />
        <div className="absolute bottom-10 right-10">
          
        </div>
      </div>
    </div>
  );
}