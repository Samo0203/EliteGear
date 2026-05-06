import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

const REGIONS = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'Sabaragamuwa', 'Uva', 'North Central'];

export default function Register() {
  const [form, setForm] = useState({
    name: '', username: '', email: '', mobile: '',
    nic: '', region: '', password: '', confirmPassword: ''
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { confirmPassword, ...payload } = form;
    const res = await register(payload);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(res.message || 'Registration failed');
    }
    setLoading(false);
  };

  /* ── Input style helpers ── */
  const inputStyle = {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid rgba(45,45,45,0.15)',
    color: '#2D2D2D',
    borderRadius: '8px',
    padding: '14px 16px',
    fontFamily: "'Lexend',sans-serif",
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };
  const labelStyle = {
    display: 'block',
    fontFamily: "'Lexend',sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(45,45,45,0.6)',
    marginBottom: '8px',
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F3F0' }}>
        <div className="text-center p-16 rounded-2xl" style={{ background: '#FFFFFF' }}>
          <CheckCircle size={64} style={{ color: 'var(--primary)', margin: '0 auto 24px' }} />
          <h2 className="display-md" style={{ color: 'var(--carbon)', marginTop: 0, fontSize: '28px' }}>
            Account Created!
          </h2>
          <p className="body-sm mt-3" style={{ color: 'var(--text-muted-light)' }}>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between py-8 px-6"
      style={{ background: '#F5F3F0', fontFamily: "'Lexend',sans-serif" }}>

      {/* Top bar */}
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
        <Link to="/" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '50px', color: 'var(--carbon)', textDecoration: 'none' }}>
          EliteGear
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto w-full my-8 rounded-2xl overflow-hidden flex"
        style={{ background: '#FFFFFF', minHeight: '580px' }}>

        {/* Left — Athlete panel */}
        <div className="hidden md:flex flex-col justify-end w-80 flex-shrink-0 relative overflow-hidden"
          style={{ background: '#E8DFD5' }}>
          <img
            src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80"
            alt="Athlete"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(40%) brightness(0.6)' }}
          />
          <div className="relative z-10 p-8"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
            <h2 className="font-bold leading-tight mb-3"
              style={{ color: 'var(--linen)', fontSize: '28px', lineHeight: 1.1 }}>
              JOIN THE<br />ELITE CIRCLE.
            </h2>
            <p className="body-sm" style={{ color: 'rgba(249,246,242,0.55)', lineHeight: 1.7 }}>
              Equip yourself with architectural precision. Experience the next evolution of performance.
            </p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 p-10">
          <h1 className="font-bold mb-1" style={{ color: 'var(--carbon)', fontSize: '24px', letterSpacing: '-0.01em' }}>
            Register
          </h1>
          <p className="body-sm mb-8" style={{ color: 'var(--text-muted-light)' }}>
            Register your profile to access premium equipment.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} placeholder="Alex Mercer" value={form.name}
                  onChange={set('name')} required
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input style={inputStyle} placeholder="Elite_01" value={form.username}
                  onChange={set('username')} required
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label style={labelStyle}>Email Address</label>
                <input style={inputStyle} type="email" placeholder="operative@elitegear.com"
                  value={form.email} onChange={set('email')} required
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
              </div>
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <input style={inputStyle} type="tel" placeholder="+94 XXX XXX XXX"
                  value={form.mobile} onChange={set('mobile')} required
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label style={labelStyle}>National Identity Card (NIC)</label>
                <input style={inputStyle} placeholder="XXXXX-XXXXX-XX"
                  value={form.nic} onChange={set('nic')} required
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
              </div>
              <div>
                <label style={labelStyle}>Region</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.region} onChange={set('region')} required
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'}>
                  <option value="">SELECT REGION</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type="password" placeholder="••••••••"
                  value={form.password} onChange={set('password')} required
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input style={inputStyle} type="password" placeholder="••••••••"
                  value={form.confirmPassword} onChange={set('confirmPassword')} required
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg mb-5"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                <span style={{ color: '#ef4444', fontSize: '13px' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full btn-primary"
              style={{
                background: ' #3A5F41',
                padding: '18px',
                fontSize: '13px',
                letterSpacing: '0.08em',
                borderRadius: '8px',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
            </button>

            {/* Login link */}
            <p className="text-center mt-6" style={{ fontSize: '13px', color: 'rgba(45,45,45,0.6)' }}>
              ALREADY REGISTERED?{' '}
              <Link to="/login"
                style={{ color: 'var(--carbon)', fontWeight: 700, textDecoration: 'underline' }}>
                LOGIN
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <div>
          
          <p style={{ color: 'rgba(45,45,45,0.5)', fontSize: '11px' }}>© ELITEGEAR</p>
        </div>
        <div className="flex gap-6">
          {['TERMS', 'PRIVACY', 'SUPPORT'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(45,45,45,0.6)', fontSize: '11px', textDecoration: 'none', letterSpacing: '0.05em' }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}