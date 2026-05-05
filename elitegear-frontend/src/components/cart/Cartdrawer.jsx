import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, Trash2, Minus, Plus, Lock } from 'lucide-react';

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateCartQty, cartTotal } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(440px, 100vw)',
          background: 'var(--oat-milk)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '-40px 0 80px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-4">
          <div>
            <h2 className="display-md" style={{ color: '#000', fontSize: '32px', marginTop: 0 }}>
              YOUR CART
            </h2>
            <p className="label mt-1" style={{ color: 'var(--text-muted-light)' }}>
              {cart.length} ITEM{cart.length !== 1 ? 'S' : ''} SELECTED
            </p>
          </div>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--carbon)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="headline" style={{ color: 'var(--carbon)', fontSize: '20px', marginTop: 0 }}>
                Your cart is empty
              </p>
              <p className="body-sm mt-2" style={{ color: 'var(--text-muted-light)' }}>
                Discover elite gear crafted for performance.
              </p>
              <button onClick={() => { navigate('/products'); onClose(); }} className="btn-primary mt-6"
                style={{ background: 'var(--leaf)' }}>
                Browse Products
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartKey || item.id} className="card-technical flex gap-4 items-center"
                style={{ padding: '16px', borderRadius: '12px' }}>

                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ background: 'var(--surface)' }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--oat-milk)' }}>
                    {item.name}
                  </p>
                  <p className="label mt-1" style={{ color: 'white', fontSize: '10px' }}>
                    {item.category?.toUpperCase()}
                  </p>
                  {(item.color || item.size || item.weight) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.color && (
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: item.color,
                          border: '1px solid #ccc'
                        }} title={item.color} />
                      )}
                      {item.size && <span className="label" style={{ color: 'var(--oat-milk)', fontSize: '10px' }}>Size: {item.size}</span>}
                      {item.weight && <span className="label" style={{ color: 'var(--oat-milk)', fontSize: '10px' }}>Weight: {item.weight}</span>}
                    </div>
                  )}
                  {/* Qty controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateCartQty(item.cartKey, item.quantity - 1)}
                      className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                      style={{ background: 'var(--surface-high)', border: 'none', cursor: 'pointer', color: 'var(--carbon)' }}>
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold" style={{ color: 'var(--oat-milk)', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateCartQty(item.cartKey, item.quantity + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                      style={{ background: 'var(--surface-high)', border: 'none', cursor: 'pointer', color: 'var(--carbon)' }}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Price + Delete */}
                <div className="flex flex-col items-end gap-3">
                  <p className="font-bold text-sm" style={{ color: 'var(--oat-milk)' }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button onClick={() => removeFromCart(item.cartKey)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-8 py-6" style={{ borderTop: '1px solid rgba(45,45,45,0.15)' }}>
            <div className="flex justify-between mb-2">
              <span className="label" style={{ color: 'var(--text-muted-light)' }}>SUBTOTAL</span>
              <span className="label" style={{ color: 'var(--carbon)' }}>
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="label" style={{ color: 'var(--text-muted-light)' }}>SHIPPING</span>
              <span className="label" style={{ color: 'var(--leaf)', fontWeight: 600 }}>COMPLIMENTARY</span>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="font-bold text-xl" style={{ color: '#000' }}>TOTAL</span>
              <span className="font-bold text-2xl" style={{ color: '#000' }}>
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full"
              style={{ background: 'var(--leaf)', padding: '16px', fontSize: '14px', borderRadius: '8px' }}>
              CHECKOUT NOW →
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock size={12} style={{ color: 'var(--text-muted-light)' }} />
              <p className="label" style={{ color: 'var(--text-muted-light)', fontSize: '10px' }}>
                ENCRYPTED CHECKOUT GUARANTEED
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}