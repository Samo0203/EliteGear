import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { LogOut, Camera, Check, X } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', region: '' });
  const [avatar, setAvatar] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!user) return;
    if (user.isAdmin) {
      navigate('/');
      return;
    }
    setForm({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      region: user.region || '',
    });
    setAvatar(user.avatarUrl || null);
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setMessage('');
    setError('');
    setEditMode(true);
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        region: user.region || '',
      });
      setAvatar(user.avatarUrl || null);
    }
    setError('');
    setMessage('');
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    if (!user) {
      setError('Unable to save profile');
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      region: form.region.trim(),
      avatarUrl: avatar,
    };

    const userId = user.id || user._id;
    const res = await updateProfile(userId, payload);
    if (res.success) {
      setMessage('Profile updated successfully.');
      setToastVisible(true);
      setForm({
        name: res.user.name || '',
        email: res.user.email || '',
        mobile: res.user.mobile || '',
        region: res.user.region || '',
      });
      setAvatar(res.user.avatarUrl || avatar);
      setEditMode(false);
    } else {
      setError(res.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  useEffect(() => {
    if (!message) return;
    setToastVisible(true);
    const timeout = setTimeout(() => setToastVisible(false), 3200);
    return () => clearTimeout(timeout);
  }, [message]);

  const inputDisplayStyle = {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid rgba(45,45,45,0.15)',
    color: 'var(--carbon)',
    borderRadius: '8px',
    padding: '16px',
    fontFamily: "'Lexend',sans-serif",
    fontSize: '13px',
    letterSpacing: '0.05em',
    outline: 'none',
    cursor: 'default',
  };
  const inputStyle = {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid rgba(45,45,45,0.15)',
    color: 'var(--carbon)',
    borderRadius: '8px',
    padding: '16px',
    fontFamily: "'Lexend',sans-serif",
    fontSize: '13px',
    letterSpacing: '0.05em',
    outline: 'none',
  };
  const labelStyle = {
    display: 'block',
    fontFamily: "'Lexend',sans-serif",
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--carbon)',
    marginBottom: '8px',
  };

  return (
    <div style={{ fontFamily: "'Lexend',sans-serif", background: 'var(--surface)', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '64px 0 96px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 24px' }}>

          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="label" style={{ color: 'var(--text-muted-dark)', letterSpacing: '0.08em', fontSize: '10px', marginBottom: '6px' }}>ACCOUNT</p>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--black)', margin: 0 }}>Your Profile</h1>
            </div>
            {editMode ? (
              <div className="flex gap-3">
                <button type="button" onClick={handleCancel}
                  style={{ padding: '12px 18px', background: 'var(--surface-high)', border: '1px solid var(--ghost-border)', borderRadius: '10px', color: 'var(--text-on-light)', cursor: 'pointer', fontSize: '12px' }}>
                  <X size={14} /> Cancel
                </button>
                <button type="button" onClick={handleSave} disabled={saving}
                  style={{ padding: '12px 18px', background: 'var(--leaf)', border: 'none', borderRadius: '10px', color: 'var(--oat-milk)', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '12px' }}>
                  <Check size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button type="button" onClick={handleEdit}
                style={{ padding: '12px 18px', background: 'var(--surface-high)', border: '1px solid var(--ghost-border)', borderRadius: '10px', color: 'var(--text-on-light)', cursor: 'pointer', fontSize: '12px' }}>
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#22c55e' }}>
              {message}
            </div>
          )}

          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-4">
              <div className="rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  width: '120px', height: '120px',
                  background: 'var(--surface-low)',
                  border: '2px solid var(--leaf)',
                }}>
                {avatar
                  ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  : user?.avatarUrl
                    ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    : <span style={{ fontSize: '48px' }}>👤</span>
                }
              </div>
              {editMode && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: 'var(--leaf)', border: '2px solid var(--surface)' }}>
                  <Camera size={13} style={{ color: 'var(--oat-milk)' }} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
            {editMode && (
              <button type="button" className="label"
                style={{ background: 'none', border: '1px solid var(--ghost-border)', borderRadius: '6px', padding: '8px 16px', color: 'var(--text-on-light)', cursor: 'pointer', fontSize: '10px' }}>
                Upload Picture
              </button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label style={labelStyle}>Name</label>
              {editMode ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <div style={inputDisplayStyle}>{(user?.name || user?.username || '—')}</div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              {editMode ? (
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <div style={inputDisplayStyle}>{(user?.email || '—')}</div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Contact Number</label>
              {editMode ? (
                <input
                  type="text"
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <div style={inputDisplayStyle}>{user?.mobile || '—'}</div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Region</label>
              {editMode ? (
                <input
                  type="text"
                  value={form.region}
                  onChange={e => setForm({ ...form, region: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <div style={inputDisplayStyle}>{user?.region || '—'}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center mt-12 gap-4">
            <button onClick={handleLogout}
              className="flex items-center gap-3"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontFamily: "'Lexend',sans-serif", fontSize: '14px', fontWeight: 600 }}>
              <LogOut size={18} />
              Logout
            </button>
            <p className="label" style={{ color: 'var(--text-muted-dark)', fontSize: '10px' }}>
              ACCOUNT ACTIVE SINCE {user?.joinedAt
                ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
                : 'RECENTLY'}
            </p>
          </div>
        </div>
      </section>

      {toastVisible && message && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(16, 185, 129, 0.96)',
          color: 'white',
          borderRadius: '16px',
          padding: '14px 18px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          zIndex: 50,
          maxWidth: '320px',
          fontSize: '13px',
          lineHeight: 1.4,
        }}>
          {message}
        </div>
      )}

      <Footer />
    </div>
  );
}