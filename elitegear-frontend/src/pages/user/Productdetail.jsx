import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { Minus, Plus, ShoppingBag, Truck, Shield, ChevronRight } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');

  // Defined Color Variables
  const darkGreen = '#064e3b';         // Deepest green for button text
  const primaryBrandGreen = '#065f46'; // Your requested green for Titles
  const lightMediumGreen = '#10b981';  // Lighter vibrant green for Sub-text

  useEffect(() => {
    productAPI.getById(id)
      .then(res => setProduct(res.data))
      .catch(() => {
        // Fallback demo product
        setProduct({
          id, 
          name: 'Titan Willow VII', 
          price: 54900, 
          category: 'Cricket',
          description: 'Engineered with Grade 1+ English Willow, the Titan Willow VII features an oversized sweet spot and mid-to-low swell profile for explosive power hitting. Hand-crafted for the professional game.',
          imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
          stock: 15,
          colors: ['#8B4513', '#000000', '#FFFFFF'],
          sizes: ['SH', 'H', 'HH', '6'],
          weights: ['2.7kg', '2.8kg', '2.9kg'],
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setSelectedColor(product.colors?.[0] || '');
    setSelectedSize(product.sizes?.[0] || '');
    setSelectedWeight(product.weights?.[0] || '');
  }, [product]);

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      weight: selectedWeight,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', fontFamily: "'Lexend',sans-serif" }}>
      <Navbar />
      <div className="flex justify-center items-center" style={{ height: '60vh' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--surface-high)', borderTopColor: 'var(--leaf)' }} />
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div style={{ fontFamily: "'Lexend',sans-serif" }}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="naturalist" style={{ padding: '16px 0' }}>
        <div className="max-w-eg px-eg mx-auto flex items-center gap-2">
          {['HOME', product.category || 'PRODUCTS', product.name].map((crumb, i, arr) => (
            <span key={i} className="flex items-center gap-2">
              <span className="label cursor-pointer"
                style={{ color: i === arr.length - 1 ? 'var(--carbon)' : 'var(--text-muted-light)', fontSize: '10px' }}
                onClick={() => { if (i === 0) navigate('/'); else if (i === 1) navigate('/products'); }}>
                {crumb}
              </span>
              {i < arr.length - 1 && <ChevronRight size={10} style={{ color: 'var(--text-muted-light)' }} />}
            </span>
          ))}
        </div>
      </div>

      {/* Product Section */}
      <section className="naturalist" style={{ padding: '48px 0 80px' }}>
        <div className="max-w-eg px-eg mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Images */}
            <div>
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--carbon)', aspectRatio: '1', marginBottom: '16px' }}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Right — Info */}
            <div className="technical rounded-2xl p-8 h-fit">
              <span className="chip chip-outline mb-4" style={{ fontSize: '10px', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>
                ELITE SERIES
              </span>
              
              <h1 className="display-md mb-2" style={{ color: 'var(--oat-milk)', marginTop: '12px', fontSize: '40px' }}>
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-5">
                {product.offerPrice > 0 && product.offerPrice < product.price ? (
                  <span className="font-bold" style={{ color: 'var(--oat-milk)', fontSize: '28px' }}>
                    Rs. {Number(product.offerPrice).toLocaleString()}
                  </span>
                ) : (
                  <span className="font-bold" style={{ color: 'var(--oat-milk)', fontSize: '28px' }}>
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                )}
                {product.offerPrice > 0 && product.offerPrice < product.price && (
                  <span style={{ color: '#ef4444', textDecoration: 'line-through', fontSize: '14px', opacity: 0.85 }}>
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                )}
                <span className="chip" style={{ background: product.stock > 0 ? 'rgba(167,209,171,0.15)' : 'rgba(239,68,68,0.15)', color: product.stock > 0 ? 'var(--primary)' : '#ef4444', fontSize: '10px' }}>
                  {product.stock > 0 ? '● IN STOCK' : '● OUT OF STOCK'}
                </span>
              </div>

              <p className="body-sm mb-6" style={{ color: 'rgba(241,237,227,0.6)', lineHeight: 1.7 }}>
                {product.description}
              </p>

              {/* Selection Labels: Set to White */}
              <div className="mb-6">
                <p className="label mb-3" style={{ color: '#FFFFFF' }}>QUANTITY</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'var(--surface-high)', border: 'none', cursor: 'pointer', color: 'var(--carbon)' }}><Minus size={14} /></button>
                  <span className="font-bold text-lg" style={{ color: 'var(--oat-milk)', minWidth: '24px', textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'var(--surface-high)', border: 'none', cursor: 'pointer', color: 'var(--carbon)' }}><Plus size={14} /></button>
                </div>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="label mb-3" style={{ color: '#FFFFFF' }}>COLOR</p>
                  <div className="flex gap-3">
                    {product.colors.map((color, i) => (
                      <button key={i} onClick={() => setSelectedColor(color)} className="w-8 h-8 rounded-full border-2 transition-all" style={{ background: color, borderColor: selectedColor === color ? 'var(--leaf)' : 'var(--surface-high)', cursor: 'pointer' }} title={color} />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Buttons: Dark Green Font */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <p className="label mb-3" style={{ color: '#FFFFFF' }}>SIZE</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size, i) => (
                      <button key={i} onClick={() => setSelectedSize(size)} className="px-4 py-2 rounded-lg border transition-all"
                        style={{
                          background: selectedSize === size ? 'var(--leaf)' : 'var(--surface-high)',
                          borderColor: selectedSize === size ? 'var(--leaf)' : 'var(--ghost-border)',
                          color: selectedSize === size ? '#FFFFFF' : darkGreen,
                          cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                        }}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Weight Buttons: Dark Green Font */}
              {product.weights && product.weights.length > 0 && (
                <div className="mb-6">
                  <p className="label mb-3" style={{ color: '#FFFFFF' }}>WEIGHT</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.weights.map((weight, i) => (
                      <button key={i} onClick={() => setSelectedWeight(weight)} className="px-4 py-2 rounded-lg border transition-all"
                        style={{
                          background: selectedWeight === weight ? 'var(--leaf)' : 'var(--surface-high)',
                          borderColor: selectedWeight === weight ? 'var(--leaf)' : 'var(--ghost-border)',
                          color: selectedWeight === weight ? '#FFFFFF' : darkGreen,
                          cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                        }}>
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary w-full flex items-center justify-center gap-3 mb-6"
                style={{ padding: '18px', fontSize: '14px', background: added ? '#4a9a54' : 'var(--leaf)', borderRadius: '10px', opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}>
                <ShoppingBag size={18} />
                {added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
              </button>

              {/* Info Pills Section: Titles updated to 065f46, Subtext updated to lightMediumGreen */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Truck, title: 'FAST DELIVERY', sub: '2-3 Business Days' },
                  { icon: Shield, title: 'WARRANTY', sub: '12 Months' },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#E8DFD5' }}>
                    <Icon size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <div>
                      <p className="label" style={{ color: primaryBrandGreen, fontSize: '10px', fontWeight: 700 }}>
                        {title}
                      </p>
                      <p style={{ color: lightMediumGreen, fontSize: '11px', marginTop: '2px', fontWeight: 600 }}>
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="naturalist" style={{ paddingBottom: '96px' }}>
        <div className="max-w-eg px-eg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3', background: 'var(--carbon)' }}>
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" alt="Product story" className="w-full h-full object-cover" style={{ opacity: 0.8 }} />
            </div>
            <div>
              <h2 className="font-bold mb-4" style={{ color: 'var(--carbon)', fontSize: '28px', lineHeight: 1.1, marginTop: 0 }}>
                HAND-PRESSED<br />TO PERFECTION
              </h2>
              <p className="body-sm mb-8" style={{ color: 'var(--text-muted-light)', lineHeight: 1.7 }}>
                Every product is engineered by our master craftspeople to ensure the finest quality for maximum performance and responsiveness.
              </p>
              {[
                { title: 'PRO-DYNAMIC PROFILE', desc: 'Optimized weight distribution for unmatched pickup and balance.' },
                { title: 'SUPER FLEX HANDLE', desc: 'Triple-spring cane handle absorbs shock and boosts power transfer.' },
              ].map(f => (
                <div key={f.title} className="flex gap-4 mb-5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'var(--leaf)' }}>
                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 700 }}>✓</span>
                  </div>
                  <div>
                    <p className="label" style={{ color: 'var(--carbon)' }}>{f.title}</p>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-muted-light)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}