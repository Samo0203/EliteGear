import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, categoryAPI } from '../../services/api';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { SlidersHorizontal, ShoppingBag } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function Products() {
  const { user, addToCart } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('search') || '';

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);

  const [filters, setFilters] = useState({
    search:    searchQ,
    category:  '',
    minPrice:  0,
    maxPrice:  200000,
  });

  useEffect(() => {
    Promise.all([productAPI.getAll(), categoryAPI.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data);
        setCategories(cRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Static fallback */
  const staticProducts = [
    { id: 'p1', name: 'Tactical Grandmaster Shell', price: 24900, category: 'Apparel',  description: 'Breathable Merino Tech', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', weights: ['S', 'M', 'L', 'XL'] },
    { id: 'p2', name: 'Willow Core V2',             price: 89000, category: 'Cricket',  description: 'Professional Grade Willow', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80', weights: ['Light', 'Medium', 'Heavy'] },
    { id: 'p3', name: 'Strata Carbon String',        price: 41500, category: 'Badminton',description: 'Aerodynamic Frame', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80', weights: ['2.7kg', '3.0kg', '3.3kg'] },
    { id: 'p4', name: 'Aero-Kinetic Vest',           price: 18500, category: 'Apparel',  description: 'High-Compression Fabric', imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80', weights: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 'p5', name: 'Nomad Transit Bag',           price: 32000, category: 'Gear',     description: 'Weather-Proof Ballistic Nylon', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', weights: ['Lightweight', 'Standard'] },
    { id: 'p6', name: 'Volcanic Monolith Set',       price: 125000,category: 'Chess',    description: 'Hand-Carved Basalt', imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80', weights: ['Standard Set'] },
    { id: 'p7', name: 'Kinetic Shoes Pro',           price: 13900, category: 'Footwear', description: 'Carbon Plate Racing', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', weights: ['7', '8', '9', '10', '11', '12'] },
    { id: 'p8', name: 'Titan Wheelie Bag',           price: 11000, category: 'Gear',     description: 'Premium Travel Gear', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', weights: ['Compact', 'Full Size'] },
  ];

  const displayProducts = products.length > 0 ? products : staticProducts;
  const uniqueCats = categories.length > 0
    ? categories.map(c => c.name)
    : [...new Set(staticProducts.map(p => p.category))];

  /* Filter logic */
  const filtered = displayProducts.filter(p => {
    const matchSearch   = !filters.search   || p.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchCategory = !filters.category || p.category === filters.category;
    const matchPrice    = p.price >= filters.minPrice && p.price <= filters.maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    addToCart(product, {
      color: product.colors?.[0] || '',
      size: product.sizes?.[0] || '',
      weight: product.weights?.[0] || '',
    });
  };

  return (
    <div style={{ fontFamily: "'Lexend',sans-serif", background: '#F5F3F0', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Page Header ── */}
      <div className="noir" style={{ padding: '64px 0 48px' }}>
        <div className="max-w-eg px-eg mx-auto">
          <p className="label mb-3" style={{ color: 'var(--primary)' }}>ELITE CURATIONS</p>
          <h1 className="display-lg mb-4" style={{ color: 'var(--linen)', marginTop: 0 }}>
            All Equipment
          </h1>
          <p className="body-sm" style={{ color: 'rgba(45,45,45,0.5)', maxWidth: '440px' }}>
            Performance engineered for the modern athlete. Discover tools that bridge the gap between biological potential and architectural precision.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <div className="chip chip-outline flex items-center gap-2">
              <SlidersHorizontal size={13} />
              DISPLAYING {filtered.length} ARTIFACTS
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-eg px-eg mx-auto py-12 flex gap-10">

        {/* Sidebar */}
        <aside className="hidden md:block flex-shrink-0" style={{ width: '220px' }}>

          {/* Search */}
          <div className="mb-8">
            <label className="label mb-3 block" style={{ color: 'rgba(45,45,45,0.55)' }}>SEARCH</label>
            <input
              type="text"
              value={filters.search}
              onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
              placeholder="Search gear..."
              className="input-dark w-full"
              style={{ fontSize: '12px', padding: '10px 14px', background: '#FFFFFF', color: '#2D2D2D', border: '1px solid rgba(45,45,45,0.15)' }}
            />
          </div>

          {/* Category */}
          <div className="mb-8">
            <label className="label mb-3 block" style={{ color: 'rgba(45,45,45,0.55)' }}>CATEGORY</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cat" value=""
                  checked={filters.category === ''}
                  onChange={() => { setFilters({ ...filters, category: '' }); setPage(1); }}
                  style={{ accentColor: 'var(--leaf)' }} />
                <span style={{ color: 'var(--carbon)', fontSize: '13px' }}>All</span>
              </label>
              {uniqueCats.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="cat" value={cat}
                    checked={filters.category === cat}
                    onChange={() => { setFilters({ ...filters, category: cat }); setPage(1); }}
                    style={{ accentColor: 'var(--leaf)' }} />
                  <span style={{ color: 'var(--carbon)', fontSize: '13px' }}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <label className="label mb-3 block" style={{ color: 'rgba(45,45,45,0.55)' }}>PRICE RANGE</label>
            <input type="range" min={0} max={200000} step={1000}
              value={filters.maxPrice}
              onChange={e => { setFilters({ ...filters, maxPrice: +e.target.value }); setPage(1); }}
              style={{ width: '100%', accentColor: 'var(--leaf)' }} />
            <div className="flex justify-between mt-2">
              <span style={{ color: 'rgba(45,45,45,0.55)', fontSize: '11px' }}>Rs. 0</span>
              <span style={{ color: 'var(--carbon)', fontSize: '11px' }}>
                Rs. {filters.maxPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Promo card */}
          <div className="signature rounded-xl p-5" style={{ marginTop: '32px' }}>
            <p className="label mb-2" style={{ color: 'rgba(241,237,227,0.6)', fontSize: '9px' }}>SUSTAINABLE</p>
            <p className="font-bold mb-3" style={{ color: 'var(--oat-milk)', fontSize: '14px' }}>Carbon Neutral Fleet</p>
            <button className="label" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: '11px' }}>
              Read Journal
            </button>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: '#E8DFD5', borderTopColor: 'var(--leaf)' }} />
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-32">
              <p className="body-lg" style={{ color: 'var(--text-muted-dark)' }}>No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((product, i) => (
                <div key={product.id || i}
                  className="product-card group cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}>

                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: '#E8DFD5' }}>
                    {product.stock === 0 && (
                      <span className="chip absolute top-3 left-3 z-10"
                        style={{ background: 'rgba(239,68,68,0.8)', fontSize: '9px' }}>SOLD OUT</span>
                    )}
                    {product.stock > 0 && (
                      <span className="chip chip-primary absolute top-3 left-3 z-10" style={{ fontSize: '9px' }}>IN STOCK</span>
                    )}
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                    }
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ color: 'var(--carbon)', fontSize: '14px' }}>
                          {product.name}
                        </p>
                        <p className="label mt-1 truncate" style={{ color: 'rgba(45,45,45,0.55)', fontSize: '10px' }}>
                          {product.description || product.category}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {product.offerPrice && product.offerPrice < product.price ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: 'var(--carbon)', fontSize: '14px' }}>
                              Rs. {Number(product.offerPrice).toLocaleString()}
                            </span>
                            <span className="text-xs line-through" style={{ color: '#ef4444' }}>
                              Rs. {Number(product.price).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <p className="font-bold" style={{ color: 'var(--carbon)', fontSize: '14px' }}>
                            Rs. {Number(product.price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div style={{ display:'flex', gap:'6px', marginTop:'10px', marginBottom:'10px' }}>
                        {product.colors.slice(0, 4).map((color, i) => (
                          <div key={i}
                            style={{
                              width:'18px', height:'18px',
                              borderRadius:'50%',
                              background:color,
                              border:'1px solid #ccc',
                              cursor:'pointer'
                            }}
                            title={color}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <div style={{
                            width:'18px', height:'18px',
                            borderRadius:'50%',
                            background:'#E8DFD5',
                            border:'1px solid #ccc',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            fontSize:'10px',
                            color:'rgba(45,45,45,0.55)'
                          }}>+{product.colors.length - 4}</div>
                        )}
                      </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-2" style={{ marginBottom: '10px' }}>
                        {product.sizes.slice(0, 3).map((size, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-full" style={{ background: '#E8DFD5', color: '#000' }}>
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 3 && (
                          <span className="text-[10px] text-zinc-500">+{product.sizes.length - 3}</span>
                        )}
                      </div>
                    )}

                    {product.weights && product.weights.length > 0 && (
                      <div className="flex flex-wrap gap-2" style={{ marginBottom: '10px' }}>
                        {product.weights.slice(0, 3).map((weight, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-full" style={{ background: '#E8DFD5', color: '#000' }}>
                            {weight}
                          </span>
                        ))}
                        {product.weights.length > 3 && (
                          <span className="text-[10px] text-zinc-500">+{product.weights.length - 3}</span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={e => handleAddToCart(e, product)}
                      className="w-full btn-primary mt-4 flex items-center justify-center gap-2"
                      style={{ padding: '11px', fontSize: '12px', borderRadius: '6px' }}>
                      <ShoppingBag size={14} /> ADD TO BAG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ background: 'none', border: 'none', color: page === 1 ? 'rgba(45,45,45,0.55)' : 'var(--carbon)', cursor: page === 1 ? 'default' : 'pointer', fontSize: '13px' }}>
                ← PREVIOUS
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{
                    background: p === page ? 'var(--leaf)' : 'none',
                    border: 'none',
                    color: p === page ? '#F5F0E8' : 'rgba(45,45,45,0.55)',
                    cursor: 'pointer',
                    width: '36px', height: '36px',
                    borderRadius: '6px',
                    fontFamily: "'Lexend',sans-serif",
                    fontSize: '13px',
                    fontWeight: p === page ? 700 : 400,
                  }}>
                  {p.toString().padStart(2, '0')}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ background: 'none', border: 'none', color: page === totalPages ? 'rgba(45,45,45,0.55)' : 'var(--carbon)', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '13px' }}>
                NEXT →
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}