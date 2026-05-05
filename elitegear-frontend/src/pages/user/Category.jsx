import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, categoryAPI } from '../../services/api';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { LayoutGrid, List } from 'lucide-react';

export default function Category() {
  const { user, addToCart } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || '';

  const [categories,  setCategories]  = useState([]);
  const [products,    setProducts]    = useState([]);
  const [selected,    setSelected]    = useState(typeParam);
  const [viewGrid,    setViewGrid]    = useState(true);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([categoryAPI.getAll(), productAPI.getAll()])
      .then(([cRes, pRes]) => {
        setCategories(cRes.data);
        setProducts(pRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const staticCategories = [
    { id: 'c1', name: 'Cricket',    description: 'Professional cricket equipment', type: 'OUTDOOR' },
    { id: 'c2', name: 'Badminton',  description: 'Precision racket sports gear',   type: 'INDOOR' },
    { id: 'c3', name: 'Football',   description: 'Championship football gear',     type: 'OUTDOOR' },
    { id: 'c4', name: 'Tennis',     description: 'Elite tennis equipment',         type: 'OUTDOOR' },
    { id: 'c5', name: 'Swimming',   description: 'Aquatic performance gear',       type: 'INDOOR' },
    { id: 'c6', name: 'Basketball', description: 'Court domination equipment',     type: 'INDOOR' },
  ];

  const staticProducts = [
    { id: 'p1', name: 'Apex V-Track Runner',  price: 18900, category: 'Cricket',    description: 'Technical Road Gear',    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', stock: 10, colors: ['#000000', '#FFFFFF', '#8B4513'], sizes: ['S', 'M', 'L', 'XL'], weights: ['Light', 'Medium'] },
    { id: 'p2', name: 'Core Shield Base',     price: 8500,  category: 'Badminton',  description: 'Compression Apparel',    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80', stock: 5,  colors: ['#000000', '#FF0000', '#0000FF'], sizes: ['S', 'M', 'L'], weights: ['S', 'M', 'L'] },
    { id: 'p3', name: 'Storm-Lite Shell',     price: 24000, category: 'Football',   description: 'Weather Resistant',      imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', stock: 3,  colors: ['#000000', '#FFFFFF'], sizes: ['M', 'L', 'XL'], weights: ['Size 5', 'Size 4'] },
    { id: 'p4', name: 'Quantum X-Pacer',      price: 49900, category: 'Tennis',     description: 'Performance Tracking',   imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', stock: 8, badge: 'LIMITED', colors: ['#000000', '#FFFFFF', '#FFD700'], sizes: ['S', 'M', 'L', 'XL'], weights: ['Light', 'Heavy'] },
    { id: 'p5', name: 'Volt-X Racket',        price: 24500, category: 'Badminton',  description: 'Aerodynamic Frame',      imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80', stock: 15, colors: ['#000000', '#FF0000'], sizes: ['Standard'], weights: ['2.7kg', '3.0kg'] },
    { id: 'p6', name: 'Elite Guard Pads',     price: 15900, category: 'Cricket',    description: 'Pro Cricket Protection', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80', stock: 7,  colors: ['#000000', '#FFFFFF'], sizes: ['S', 'M', 'L'], weights: ['Light', 'Medium'] },
    { id: 'p7', name: 'Swim Goggles Pro',     price: 4200,  category: 'Swimming',   description: 'Anti-Fog Polarized',     imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80', stock: 20, badge: 'NEW ARRIVAL', colors: ['#000000', '#0000FF', '#FF0000'], sizes: ['One Size'], weights: ['One Size'] },
    { id: 'p8', name: 'Hoop Dominator Ball',  price: 6500,  category: 'Basketball', description: 'Official Size 7',        imageUrl: 'https://images.unsplash.com/photo-1546519638405-a9d1a8f9a4d0?w=400&q=80', stock: 12, colors: ['#8B4513', '#FF8C00'], sizes: ['7'], weights: ['Size 7'] },
  ];

  const displayCategories = categories.length > 0 ? categories : staticCategories;
  const displayProducts   = products.length   > 0 ? products   : staticProducts;

  const activeCat   = displayCategories.find(c => c.name === selected) || displayCategories[0];
  const filtered    = selected
    ? displayProducts.filter(p => p.category === selected)
    : displayProducts;

  return (
    <div style={{ fontFamily: "'Lexend',sans-serif" }}>
      <Navbar />

      {/* ── Hero Banner ── */}
      <section className="signature relative overflow-hidden" style={{ minHeight: '380px', display: 'flex', alignItems: 'flex-end' }}>
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80"
          alt="Category hero"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.3 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(58,95,65,0.9) 0%, transparent 70%)' }} />

        <div className="absolute top-8 right-8">
          <span
            className="label"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 16px',
              borderRadius: '999px',
              background: 'rgba(45,45,45,0.12)',
              color: '#F5F0E8',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
            }}>
            {activeCat?.type || 'ALL ENVIRONMENTS'}
          </span>
        </div>

        <div className="relative z-10 max-w-eg px-eg mx-auto w-full pb-12">
          <span className="chip chip-outline mb-5" style={{ display: 'inline-block', fontSize: '11px' }}>
            ELITE PERFORMANCE
          </span>
          <h1 className="display-lg" style={{ color: 'var(--oat-milk)', marginTop: 0 }}>
            AERODYNAMIC<br />PRECISION
          </h1>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <div className="naturalist" style={{ paddingTop: '0' }}>
        <div className="max-w-eg px-eg mx-auto">
          <div className="flex gap-2 pt-6 pb-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelected('')}
              className="chip flex-shrink-0 transition-all"
              style={{
                background: !selected ? 'var(--leaf)' : '#E8DFD5',
                color: !selected ? 'var(--oat-milk)' : 'var(--carbon)',
                border: 'none', cursor: 'pointer',
              }}>
              ALL
            </button>
            {displayCategories.map(cat => (
              <button key={cat.id}
                onClick={() => setSelected(cat.name)}
                className="chip flex-shrink-0 transition-all"
                style={{
                  background: selected === cat.name ? 'var(--leaf)' : '#E8DFD5',
                  color: selected === cat.name ? 'var(--oat-milk)' : 'var(--carbon)',
                  border: 'none', cursor: 'pointer',
                }}>
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products Section ── */}
      <section className="naturalist" style={{ padding: '48px 0 96px' }}>
        <div className="max-w-eg px-eg mx-auto">

          {/* Header row */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="label mb-2" style={{ color: 'var(--leaf)' }}>PREMIUM APPAREL</p>
              <h2 className="font-bold" style={{ color: 'var(--carbon)', fontSize: '28px', marginTop: 0 }}>
                Engineered for Velocity.
              </h2>
              <p className="body-sm mt-2" style={{ color: 'var(--text-muted-light)', maxWidth: '480px' }}>
                Our latest category collection features performance-engineered products designed to support your most intense sessions.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setViewGrid(false)}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: !viewGrid ? 'var(--carbon)' : '#E8DFD5', border: 'none', cursor: 'pointer', color: !viewGrid ? 'var(--oat-milk)' : 'var(--carbon)' }}>
                <List size={16} />
              </button>
              <button onClick={() => setViewGrid(true)}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: viewGrid ? 'var(--carbon)' : '#E8DFD5', border: 'none', cursor: 'pointer', color: viewGrid ? 'var(--oat-milk)' : 'var(--carbon)' }}>
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(58,95,65,0.2)', borderTopColor: 'var(--leaf)' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ color: 'var(--text-muted-light)' }}>No products in this category yet.</p>
            </div>
          ) : viewGrid ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
              {filtered.map((product, i) => (
                <div key={product.id || i}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}>
                  <div className="rounded-xl overflow-hidden relative"
                    style={{ background: '#F9F6F2', aspectRatio: '3/4', border: '1px solid #E8DFD5' }}>
                    {product.badge && (
                      <span className="chip chip-primary absolute top-3 left-3 z-10" style={{ fontSize: '9px' }}>
                        {product.badge}
                      </span>
                    )}
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                    }
                  </div>
                  <div className="pt-4">
                    <p className="font-bold label" style={{ color: 'var(--carbon)' }}>{product.name.toUpperCase()}</p>
                    <p className="label mt-1" style={{ color: 'rgba(45,45,45,0.55)', fontSize: '10px' }}>{product.description}</p>
                    <div className="flex gap-2 mt-2">
                      {(product.colors || ['#2D4A2D', '#888', '#1a1a1a']).slice(0, 3).map((c, ci) => (
                        <div key={ci} className="w-4 h-4 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    {product.weights?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.weights.slice(0, 2).map((weight, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#E8DFD5', color: '#000' }}>
                            {weight}
                          </span>
                        ))}
                        {product.weights.length > 2 && (
                          <span className="text-[9px] text-zinc-500">+{product.weights.length - 2}</span>
                        )}
                      </div>
                    )}
                    <div className="mt-3">
                      {product.offerPrice && product.offerPrice < product.price ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold" style={{ color: 'var(--carbon)', fontSize: '16px' }}>
                            Rs. {Number(product.offerPrice).toLocaleString()}
                          </span>
                          <span className="text-sm line-through" style={{ color: '#ef4444' }}>
                            Rs. {Number(product.price).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <p className="font-bold" style={{ color: 'var(--leaf)', fontSize: '16px' }}>
                          Rs. {Number(product.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-8">
              {filtered.map((product, i) => (
                <div key={product.id || i}
                  className="flex gap-6 p-5 rounded-xl cursor-pointer group transition-colors"
                  style={{ background: '#F9F6F2', border: '1px solid #E8DFD5' }}
                  onClick={() => navigate(`/products/${product.id}`)}>
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: '#E8DFD5' }}>
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    }
                  </div>
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: 'var(--carbon)' }}>{product.name}</p>
                    <p className="label mt-1" style={{ color: 'rgba(45,45,45,0.55)', fontSize: '10px' }}>{product.description}</p>
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {product.colors.slice(0, 4).map((c, ci) => (
                          <div key={ci} className="w-4 h-4 rounded-full" style={{ background: c, border: '1px solid #ccc' }} />
                        ))}
                      </div>
                    )}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.sizes.slice(0, 3).map((size, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-full" style={{ background: '#E8DFD5', color: '#000' }}>{size}</span>
                        ))}
                        {product.sizes.length > 3 && <span className="text-[10px] text-zinc-500">+{product.sizes.length - 3}</span>}
                      </div>
                    )}
                    <div className="mt-3">
                      {product.offerPrice && product.offerPrice < product.price ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold" style={{ color: 'var(--carbon)' }}>
                            Rs. {Number(product.offerPrice).toLocaleString()}
                          </span>
                          <span className="text-sm line-through" style={{ color: '#ef4444' }}>
                            Rs. {Number(product.price).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <p className="font-bold" style={{ color: 'var(--primary)' }}>
                          Rs. {Number(product.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (!user) { navigate('/login'); return; }
                      addToCart(product, {
                        color: product.colors?.[0] || '',
                        size: product.sizes?.[0] || '',
                        weight: product.weights?.[0] || '',
                      });
                    }}
                    className="btn-primary self-center flex-shrink-0"
                    style={{ padding: '10px 20px', fontSize: '12px' }}>
                    Add to Bag
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}