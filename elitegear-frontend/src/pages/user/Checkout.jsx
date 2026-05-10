import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, productAPI } from '../../services/api';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { User, Truck, Receipt, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { user, cart, cartTotal, clearCart } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    streetAddress: '',
    zipCode: '',
    city: '',
    phone: user?.mobile || '',
    preferredDate: '',
    detailedAddress: '',
    specialInstructions: '',
  });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');

  const DISCOUNT = Math.round(cartTotal * 0.1);
  const TOTAL    = cartTotal - DISCOUNT;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!user)         { navigate('/login'); return; }
    if (!user.id)      { setError('User session invalid. Please login again.'); return; }
    if (cart.length === 0) { navigate('/products'); return; }

    // Validate stock
    for (const item of cart) {
      if (item.quantity > item.stock) {
        setError(`Insufficient stock for ${item.name}. Available: ${item.stock}`);
        return;
      }
    }

    // Validate preferred date
    if (form.preferredDate) {
      const selectedDate = new Date(form.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setError('Preferred date must be today or later.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      await orderAPI.create({
        userId: user.id,
        items: cart.map(i => ({ 
          productId: i.id, 
          name: i.name, 
          price: i.price, 
          quantity: i.quantity, 
          imageUrl: i.imageUrl,
          color: i.color,
          size: i.size,
          weight: i.weight
        })),
        total: TOTAL,
        status: 'PENDING',
        recipient: form,
      });

      // Update stock for each product
      for (const item of cart) {
        await productAPI.patch(item.id, { stock: item.stock - item.quantity });
      }

      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Styles ── */
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
  };
  const labelStyle = {
    display: 'block',
    fontFamily: "'Lexend',sans-serif",
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted-light)',
    marginBottom: '8px',
  };

  if (success) return (
    <div style={{ background: '#F5F3F0', minHeight: '100vh', fontFamily: "'Lexend',sans-serif" }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '80vh', textAlign: 'center', padding: '40px' }}>
        <CheckCircle size={80} style={{ color: 'var(--primary)', marginBottom: '24px' }} />
        <h1 className="display-md" style={{ color: 'var(--carbon)', marginTop: 0, fontSize: '36px' }}>Order Confirmed!</h1>
        <p className="body-sm mt-4 mb-8" style={{ color: 'var(--text-muted-light)' }}>
          Your elite gear is on its way. We'll notify you when it ships.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '16px 40px' }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Lexend',sans-serif" }}>
      <Navbar />

      <section className="naturalist" style={{ padding: '64px 0 96px' }}>
        <div className="max-w-eg px-eg mx-auto">
          <div className="mb-10">
            <h1 className="font-bold" style={{ color: 'var(--carbon)', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em' }}>
              SECURE CHECKOUT
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck size={16} style={{ color: 'var(--leaf)' }} />
              <p className="body-sm" style={{ color: 'var(--text-muted-light)' }}>
                Professional grade security for elite performance acquisitions.
              </p>
            </div>
          </div>

          <form onSubmit={handleConfirm}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── RECIPIENT ── */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--carbon)' }}>
                    <User size={18} style={{ color: 'var(--oat-milk)' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: 'var(--carbon)', fontSize: '18px', letterSpacing: '0.05em' }}>
                    RECIPIENT
                  </h2>
                </div>
                <div className="rounded-2xl p-6 flex flex-col gap-5"
                  style={{ background: 'rgba(241,237,227,0.6)' }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input style={inputStyle} placeholder="e.g. Julian Amsel"
                      value={form.fullName} onChange={set('fullName')} required
                      onFocus={e => e.target.style.borderColor = 'var(--leaf)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Street Address</label>
                    <input style={inputStyle} placeholder="123 Performance Way"
                      value={form.streetAddress} onChange={set('streetAddress')} required
                      onFocus={e => e.target.style.borderColor = 'var(--leaf)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Zip Code</label>
                      <input style={inputStyle} placeholder="10001"
                        value={form.zipCode} onChange={set('zipCode')} required
                        onFocus={e => e.target.style.borderColor = 'var(--leaf)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
                    </div>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input style={inputStyle} placeholder="Colombo"
                        value={form.city} onChange={set('city')} required
                        onFocus={e => e.target.style.borderColor = 'var(--leaf)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input style={inputStyle} type="tel" placeholder="+94 77 000 0000"
                      value={form.phone} onChange={set('phone')} required
                      onFocus={e => e.target.style.borderColor = 'var(--leaf)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
                  </div>
                </div>
              </div>

              {/* ── LOGISTICS ── */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--carbon)' }}>
                    <Truck size={18} style={{ color: 'var(--oat-milk)' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: 'var(--carbon)', fontSize: '18px', letterSpacing: '0.05em' }}>
                    LOGISTICS
                  </h2>
                </div>
                <div className="rounded-2xl p-6 flex flex-col gap-5"
                  style={{ background: 'rgba(241,237,227,0.6)' }}>
                  <div>
                    <label style={labelStyle}>Preferred Date</label>
                    <input style={inputStyle} type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.preferredDate} onChange={set('preferredDate')}
                      onFocus={e => e.target.style.borderColor = 'var(--leaf)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Detailed Address</label>
                    <textarea style={{ ...inputStyle, height: '100px', resize: 'none' }}
                      placeholder="Enter your full building, street, and landmark details..."
                      value={form.detailedAddress} onChange={set('detailedAddress')}
                      onFocus={e => e.target.style.borderColor = 'var(--leaf)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Special Instructions</label>
                    <textarea style={{ ...inputStyle, height: '100px', resize: 'none' }}
                      placeholder="Instructional notes for delivery..."
                      value={form.specialInstructions} onChange={set('specialInstructions')}
                      onFocus={e => e.target.style.borderColor = 'var(--leaf)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(45,45,45,0.15)'} />
                  </div>
                </div>
              </div>

              {/* ── SUMMARY ── */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--carbon)' }}>
                    <Receipt size={18} style={{ color: 'var(--oat-milk)' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: 'var(--carbon)', fontSize: '18px', letterSpacing: '0.05em' }}>
                    SUMMARY
                  </h2>
                </div>

                <div className="technical rounded-2xl p-6">
                  {/* Items preview */}
                  {cart.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 mb-4 pb-4"
                      style={{ borderBottom: '1px solid rgba(241,237,227,0.1)' }}>
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: '#E8DFD5' }}>
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">📦</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--oat-milk)', fontSize: '12px' }}>{item.name}</p>
                        <p style={{ color: 'var(--text-muted-dark)', fontSize: '11px' }}>×{item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--oat-milk)', fontSize: '12px' }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  <div className="flex justify-between mb-2">
                    <span className="label" style={{ color: 'white' }}>SUBTOTAL</span>
                    <span className="label" style={{ color: 'var(--oat-milk)' }}>Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="label" style={{ color: 'white' }}>DISCOUNT</span>
                    <span className="label" style={{ color: 'var(--primary)' }}>- Rs. {DISCOUNT.toLocaleString()}</span>
                  </div>

                  <div className="pt-4 mb-6" style={{ borderTop: '1px solid rgba(241,237,227,0.15)' }}>
                    <p className="label mb-1" style={{ color: 'var(--text-muted-dark)' }}>TOTAL PAYABLE</p>
                    <p className="font-bold" style={{ color: 'var(--oat-milk)', fontSize: '36px', lineHeight: 1 }}>
                      Rs. {TOTAL.toLocaleString()}
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg mb-4"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <p style={{ color: '#ef4444', fontSize: '12px' }}>{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading || cart.length === 0}
                    className="btn-primary w-full"
                    style={{ padding: '18px', fontSize: '13px', borderRadius: '10px', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'PLACING ORDER...' : 'CONFIRM ORDER →'}
                  </button>

                  {/* Payment icons */}
                  <div className="flex justify-center gap-4 mt-4">
                    {['💵','🚚'].map((icon, i) => (
                      <div key={i} className="w-10 h-8 rounded flex items-center justify-center text-lg"
                        style={{ background: '#E8DFD5' }}>{icon}</div>
                    ))}
                  </div>
                </div>

                {/* Security note */}
                <div className="flex gap-3 p-4 rounded-xl mt-4"
                  style={{ background: '#F5F3F0' }}>
                  <ShieldCheck size={20} style={{ color: 'var(--leaf)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p className="label" style={{ color: 'var(--carbon)' }}>ELITE PROTECTION</p>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-muted-light)', fontSize: '12px' }}>
                      256-bit encryption. All orders are backed by our 30-day performance assurance policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}