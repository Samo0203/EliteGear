import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, categoryAPI } from '../../services/api';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function Home() {
  const { user, addToCart } = useAuth();
  const navigate = useNavigate();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([productAPI.getAll(), categoryAPI.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.slice(0, 8));
        setCategories(cRes.data.slice(0, 6));
      })
      .catch(() => {})
  }, []);

  /* Fallback static data for demo */
  const staticCategories = [
    { id: 1, name: 'Cricket',    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&q=80' },
    { id: 2, name: 'Badminton',  imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80' },
    { id: 3, name: 'Football',   imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&q=80' },
    { id: 4, name: 'Tennis',     imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=300&q=80' },
    { id: 5, name: 'Swimming',   imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&q=80' },
    { id: 6, name: 'Basketball', imageUrl: 'https://images.unsplash.com/photo-1546519638405-a9d1a8f9e4d0?w=300&q=80' },
  ];

  const staticProducts = [
    { id: 'p1', name: 'Volt-X Racket',      price: 24500, category: 'Badminton', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80', weights: ['2.7kg', '3.0kg'] },
    { id: 'p2', name: 'Elite Guard Pads',   price: 15900, category: 'Cricket',   imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80', weights: ['Light', 'Medium'] },
    { id: 'p3', name: 'Kinetic Shoes',      price: 13900, category: 'Running',   imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', weights: ['7', '8', '9', '10'] },
    { id: 'p4', name: 'Pro Football',       price: 8500,  category: 'Football',  imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80', weights: ['Size 5', 'Size 4'] },
    { id: 'p5', name: 'Swim Goggles Pro',   price: 4200,  category: 'Swimming',  imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80', weights: ['One Size'] },
    { id: 'p6', name: 'Tennis Precision',   price: 18700, category: 'Tennis',    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80', weights: ['Light', 'Heavy'] },
    { id: 'p7', name: 'Titan Wheelie Bag',  price: 11000, category: 'Gear',      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', weights: ['Compact', 'Full Size'] },
    { id: 'p8', name: 'Carbon Fibre Bat',   price: 49900, category: 'Cricket',   imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80', weights: ['Light', 'Medium', 'Heavy'] },
  ];

  const displayCategories = categories.length > 0 ? categories : staticCategories;
  const displayProducts   = products.length   > 0 ? products   : staticProducts;

  return (
    <div style={{ fontFamily: "'Lexend',sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="noir relative overflow-hidden"
        style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80"
          alt="Hero athlete"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 40%, transparent)' }} />

        <div className="relative z-10 max-w-eg px-eg mx-auto w-full py-32">
          <p className="label mb-6 animate-fade-up" style={{ color: 'var(--primary)', animationDelay: '0s' }}>
            ENGINEERED FOR VELOCITY
          </p>
          <h1 className="display-xl mb-6 animate-fade-up"
            style={{ color: 'var(--linen)', animationDelay: '0.1s', maxWidth: '700px' }}>
            UNLEASH YOUR<br />
            <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>INNER ELITE</span>
          </h1>
          <p className="body-lg mb-10 animate-fade-up"
            style={{ color: 'rgba(0,0,0,0.6)', maxWidth: '420px', animationDelay: '0.2s' }}>
            Premium Sports Equipment for Champions. Architectural precision in every product.
          </p>
          <div className="flex gap-4 flex-wrap animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/products" className="btn-primary btn-gradient"
              style={{ padding: '16px 32px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/category" className="btn-secondary"
              style={{ padding: '16px 32px', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Explore Gear
            </Link>
          </div>
        </div>
      </section>

      {/* ── SHOP BY DISCIPLINE ── */}
      <section className="naturalist" style={{ padding: '96px 0' }}>
        <div className="max-w-eg px-eg mx-auto">
          <p className="label mb-3" style={{ color: 'var(--leaf)' }}>SHOP BY DISCIPLINE</p>
          <h2 className="font-bold mb-2" style={{ color: 'var(--carbon)', fontSize: '32px', marginTop: 0 }}>
            Precision gear for every arena.
          </h2>
          <p className="body-sm mb-12" style={{ color: 'var(--text-muted-light)' }}>
            Find equipment built for your sport.
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {displayCategories.map((cat, i) => (
              <Link key={cat.id || i} to={`/category?type=${cat.name}`}
                className="flex flex-col items-center gap-3 group" style={{ textDecoration: 'none' }}>
                <div className="w-40 h-40 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'var(--carbon)' }}>
                  {cat.imageUrl
                    ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" style={{ filter: 'grayscale(20%)' }} />
                    : <div className="w-full h-full flex items-center justify-center text-5xl">🏃</div>
                  }
                </div>
                <span className="label text-center" style={{ color: 'var(--carbon)', fontSize: '11px' }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERFORMANCE DEALS ── */}
      <section className="naturalist" style={{ paddingBottom: '96px' }}>
        <div className="max-w-eg px-eg mx-auto">
          <p className="label mb-8" style={{ color: 'var(--leaf)' }}>PERFORMANCE DEALS</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Deal 1 — Technical */}
            <div className="technical rounded-2xl overflow-hidden relative"
              style={{ minHeight: '320px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div className="absolute inset-0 overflow-hidden">
                <img src="https://t3.ftcdn.net/jpg/05/07/79/68/360_F_507796863_XOctjfN6VIiHa79bFj7GCg92P9TpELIe.jpg" style={{ opacity: 0.4 }} />
              </div>
              <div className="relative z-10">
                <span className="chip mb-4" style={{ fontSize: '10px', background: 'rgba(241,237,227,0.15)' }}>SEASONAL OFFER</span>
                <h3 className="font-bold mb-2" style={{ color: 'var(--oat-milk)', fontSize: '24px', lineHeight: 1.2 }}>
                  DON'T MISS OUT!<br />
                  <span className="body-sm" style={{ color: 'rgba(241,237,227,0.6)', fontWeight: 400 }}>10% OFF ON EVERY ORDER YOU PLACED</span>
                </h3>
                <button className="btn-primary" style={{background: 'rgb(255, 47, 0)',padding: '12px 24px', fontSize: '12px' }}
                  onClick={() => navigate('/products')}>
                  Buy NOW
                </button>
              </div>
            </div>
            
            {/* Deal 2 — Signature */}
            <div className="signature rounded-2xl overflow-hidden relative"
              style={{ minHeight: '320px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div className="absolute inset-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80"
                  alt="Deal" className="w-full h-full object-cover" style={{ opacity: 0.25 }} />
              </div>
              <div className="relative z-10">
                <span className="chip chip-outline mb-4" style={{ fontSize: '10px' , background: 'rgba(241,237,227,0.15)'}}>FLASH SALE</span>
                <h3 className="font-bold mb-2" style={{ color: 'var(--oat-milk)', fontSize: '28px', lineHeight: 1.1 }}>
                  Apex Pro<br />Series Bat
                </h3>
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-bold text-xl" style={{ color: 'var(--oat-milk)' }}>Rs. 4,900</span>
                  <span style={{ color: 'rgba(241,237,227,0.5)', textDecoration: 'line-through', fontSize: '14px' }}>Rs. 7,500</span>
                </div>
                <button className="btn-secondary" style={{ padding: '12px 24px', fontSize: '12px' }}
                  onClick={() => navigate('/products/69f0a0bbf75a159c5b21b576')}>
                  Claim Offer
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── THE FRESH FLEET (New Arrivals) ── */}
      <section className="noir" style={{ padding: '96px 0' }}>
        <div className="max-w-eg px-eg mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-bold" style={{ color: 'var(--linen)', fontSize: '28px', letterSpacing: '0.02em' }}>
              THE FRESH FLEET
            </h2>
            <Link to="/products" className="label"
              style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              View Collection →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {displayProducts.slice(0, 4).map((product, i) => (
              <div key={product.id || i}
                className="product-card"
                onClick={() => navigate(`/products/${product.id}`)}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '1', background: '#E8DFD5' }}>
                  <span className="chip chip-primary absolute top-3 left-3" style={{ fontSize: '9px', zIndex: 1 }}>
                    NEW ARRIVAL
                  </span>
                  {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    : <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                  }
                </div>
                <div style={{ padding: '16px' }}>
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--carbon)' }}>{product.name}</p>
                  <p className="label mt-1" style={{ color: 'rgba(45,45,45,0.55)', fontSize: '10px' }}>{product.category}</p>
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
                  <div className="mt-2">
                    {product.offerPrice > 0 && product.offerPrice < product.price ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: 'var(--carbon)', fontSize: '15px' }}>
                          Rs. {Number(product.offerPrice).toLocaleString()}
                        </span>
                        <span className="text-sm line-through" style={{ color: '#ef4444' }}>
                          Rs. {Number(product.price).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <p className="font-bold" style={{ color: '#2fdb65', fontSize: '15px' }}>
                        Rs. {Number(product.price).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE GEAR VAULT ── */}
      <section className="naturalist" style={{ padding: '96px 0' }}>
        <div className="max-w-eg px-eg mx-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="font-bold" style={{ color: 'var(--carbon)', fontSize: '32px', letterSpacing: '0.01em' }}>
                THE GEAR VAULT
              </h2>
              <p className="body-sm mt-1" style={{ color: 'var(--text-muted-light)' }}>
                Every tool for your victory. Filtered for performance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
            {displayProducts.slice(0, 5).map((product) => (
              <div className="rounded-xl overflow-hidden group cursor-pointer"
                style={{ background: '#F9F6F2', border: '1px solid #E8DFD5' }}
                onClick={() => navigate(`/products/${product.id}`)}>
                <div className="relative" style={{ aspectRatio: '1', overflow: 'hidden' }}>
                  {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    : <div className="w-full h-full flex items-center justify-center text-4xl"
                        style={{ background: '#E8DFD5' }}>📦</div>
                  }
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
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: 'var(--leaf)', border: 'none', cursor: 'pointer' }}>
                    <ShoppingBag size={14} style={{ color: 'var(--oat-milk)' }} />
                  </button>
                </div>
                <div style={{ padding: '12px' }}>
                  <p className="font-semibold truncate" style={{ color: 'var(--carbon)', fontSize: '12px' }}>{product.name}</p>
                  {product.weights?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.weights.slice(0, 2).map((weight, i) => (
                        <span key={i} className="text-[8px] px-1 py-0.5 rounded-full" style={{ background: '#E8DFD5', color: '#000' }}>
                          {weight}
                        </span>
                      ))}
                      {product.weights.length > 2 && (
                        <span className="text-[8px] text-zinc-500">+{product.weights.length - 2}</span>
                      )}
                    </div>
                  )}
                  <div className="mt-1">
                    {product.offerPrice > 0 && product.offerPrice < product.price ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: 'var(--carbon)', fontSize: '13px' }}>
                          Rs. {Number(product.offerPrice).toLocaleString()}
                        </span>
                        <span className="text-xs line-through" style={{ color: '#ef4444' }}>
                          Rs. {Number(product.price).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <p className="font-bold" style={{ color: '#2fdb65', fontSize: '13px' }}>
                        Rs. {Number(product.price).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary"
              style={{ background: 'var(--carbon)', color: 'var(--oat-milk)', padding: '16px 48px', fontSize: '13px', display: 'inline-block', textDecoration: 'none', borderRadius: '8px' }}>
              SEE ALL GEAR
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}