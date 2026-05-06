import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [search,     setSearch]     = useState('');
  const [form, setForm] = useState({ name: '', category: '', price: '', offerPrice: '', stock: '', description: '', imageUrl: '', colors: [], sizes: [], weights: [] });
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [weightInput, setWeightInput] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([productAPI.getAll(), categoryAPI.getAll()]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd  = () => { setEditing(null); setForm({ name:'',category:'',price:'',offerPrice:'',stock:'',description:'',imageUrl:'',colors:[],sizes:[],weights:[] }); setColorInput(''); setSizeInput(''); setWeightInput(''); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name:p.name,category:p.category,price:p.price,offerPrice:p.offerPrice||'',stock:p.stock,description:p.description||'',imageUrl:p.imageUrl||'',colors:p.colors||[],sizes:p.sizes||[],weights:p.weights||[] }); setColorInput(''); setSizeInput(''); setWeightInput(''); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        offerPrice: parseFloat(form.offerPrice) || 0,
        stock: parseInt(form.stock),
        colors: form.colors,
        sizes: form.sizes,
        weights: form.weights,
      };
      if (editing) await productAPI.update(editing.id, payload);
      else         await productAPI.create(payload);
      setShowForm(false);
      fetchAll();
    } catch { alert('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await productAPI.delete(id); fetchAll();
  };

  const addColor = () => {
    if (colorInput.match(/^#[0-9A-F]{6}$/i) && !form.colors.includes(colorInput)) {
      setForm({...form, colors: [...form.colors, colorInput]});
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setForm({...form, colors: form.colors.filter(c => c !== color)});
  };

  const addSize = () => {
    const value = sizeInput.trim();
    if (value && !form.sizes.includes(value)) {
      setForm({...form, sizes: [...form.sizes, value]});
      setSizeInput('');
    }
  };

  const removeSize = (size) => {
    setForm({...form, sizes: form.sizes.filter(s => s !== size)});
  };

  const addWeight = () => {
    const value = weightInput.trim();
    if (value && !form.weights.includes(value)) {
      setForm({...form, weights: [...form.weights, value]});
      setWeightInput('');
    }
  };

  const removeWeight = (weight) => {
    setForm({...form, weights: form.weights.filter(w => w !== weight)});
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = { width:'100%', background:'#FFFFFF', border:'1px solid var(--ghost-border)', color:'#000000', borderRadius:'8px', padding:'12px 14px', fontFamily:"'Lexend',sans-serif", fontSize:'13px', outline:'none' };
  const labelStyle = { display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
        <div>
          <p style={{ fontSize:'10px', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>MANAGEMENT</p>
          <h1 style={{ fontSize:'24px', fontWeight:700, color:'#000000' }}>Products</h1>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 20px', fontSize:'12px' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>
      {/* Search Bar */}
      <div style={{ marginBottom:'24px' }}>
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:'100%', padding:'12px 14px', background:'white', border:'1px solid #DDD3CA', borderRadius:'8px', fontSize:'13px', fontFamily:"'Lexend',sans-serif", color:'var(--carbon)', outline:'none' }}
        />
      </div>
      {/* Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:'20px' }}>
          <div style={{ background:'#F9F6F2', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'560px', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <h2 style={{ fontSize:'18px', fontWeight:700, color:'#000000' }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(45,45,45,0.55)' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <div><label style={labelStyle}>Product Name</label><input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
                <div><label style={labelStyle}>Category</label>
                  <select style={{...inputStyle,cursor:'pointer'}} value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}>
                    <option value="">Select</option>
                    {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' }}>
                <div><label style={labelStyle}>Price (Rs.)</label><input style={inputStyle} type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
                <div><label style={labelStyle}>Offer Price</label><input style={inputStyle} type="number" value={form.offerPrice} onChange={e=>setForm({...form,offerPrice:e.target.value})} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
                <div><label style={labelStyle}>Stock</label><input style={inputStyle} type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
              </div>
              <div><label style={labelStyle}>Image URL</label><input style={inputStyle} value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://..." onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
              <div><label style={labelStyle}>Description</label><textarea style={{...inputStyle,height:'80px',resize:'none'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
              <div>
                <label style={labelStyle}>Available Colors (Hex)</label>
                <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                  <input style={{...inputStyle,flex:1}} type="text" value={colorInput} onChange={e=>setColorInput(e.target.value)} placeholder="#FF0000" onKeyPress={e=>e.key==='Enter'&&addColor()} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'} maxLength="7"/>
                  <button type="button" onClick={addColor} style={{ padding:'12px 16px', background:'var(--leaf)', border:'none', borderRadius:'8px', color:'white', cursor:'pointer', fontFamily:"'Lexend',sans-serif", fontSize:'12px' }}>Add</button>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                  {form.colors.map(color => (
                    <div key={color} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#E8DFD5', padding:'6px 12px', borderRadius:'100px', fontSize:'11px' }}>
                      <div style={{ width:'16px', height:'16px', borderRadius:'50%', background:color, border:'1px solid #999' }} />
                      <span>{color}</span>
                      <button type="button" onClick={() => removeColor(color)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', fontSize:'16px', padding:0, marginLeft:'4px' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Available Sizes</label>
                <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                  <input style={{...inputStyle,flex:1}} type="text" value={sizeInput} onChange={e=>setSizeInput(e.target.value)} placeholder="S, M, L" onKeyPress={e=>e.key==='Enter'&&addSize()} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/>
                  <button type="button" onClick={addSize} style={{ padding:'12px 16px', background:'var(--leaf)', border:'none', borderRadius:'8px', color:'white', cursor:'pointer', fontFamily:"'Lexend',sans-serif", fontSize:'12px' }}>Add</button>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                  {form.sizes.map(size => (
                    <div key={size} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#E8DFD5', padding:'6px 12px', borderRadius:'100px', fontSize:'11px' }}>
                      <span>{size}</span>
                      <button type="button" onClick={() => removeSize(size)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', fontSize:'16px', padding:0, marginLeft:'4px' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Available Weights</label>
                <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                  <input style={{...inputStyle,flex:1}} type="text" value={weightInput} onChange={e=>setWeightInput(e.target.value)} placeholder="2.7kg, 3.0kg" onKeyPress={e=>e.key==='Enter'&&addWeight()} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/>
                  <button type="button" onClick={addWeight} style={{ padding:'12px 16px', background:'var(--leaf)', border:'none', borderRadius:'8px', color:'white', cursor:'pointer', fontFamily:"'Lexend',sans-serif", fontSize:'12px' }}>Add</button>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                  {form.weights.map(weight => (
                    <div key={weight} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#E8DFD5', padding:'6px 12px', borderRadius:'100px', fontSize:'11px' }}>
                      <span>{weight}</span>
                      <button type="button" onClick={() => removeWeight(weight)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', fontSize:'16px', padding:0, marginLeft:'4px' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
                <button type="button" onClick={()=>setShowForm(false)} style={{ flex:1, padding:'14px', background:'#E8DFD5', border:'none', borderRadius:'8px', color:'#000000', cursor:'pointer', fontFamily:"'Lexend',sans-serif", fontSize:'12px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex:1, padding:'14px', fontSize:'12px', borderRadius:'8px' }}>{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background:'#F9F6F2', borderRadius:'12px', overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', border:'2px solid var(--surface-high)', borderTopColor:'var(--leaf)', animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F5F0E8' }}>
                {['Product','Category','Price','Stock','Actions'].map(h => (
                  <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'10px', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(45,45,45,0.55)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, i) => (
                <tr key={p.id} style={{ borderTop:'1px solid var(--ghost-border)', cursor: 'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(45,45,45,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  onClick={() => setViewProduct(p)}>
                  <td style={{ padding:'16px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:'44px', height:'44px', borderRadius:'8px', overflow:'hidden', background:'#E8DFD5', flexShrink:0 }}>
                        {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>📦</div>}
                      </div>
                      <div>
                        <p style={{ fontSize:'13px', fontWeight:600, color:'#000000' }}>{p.name}</p>
                        <p style={{ fontSize:'11px', color:'rgba(45,45,45,0.55)', marginTop:'2px' }}>{p.description?.substring(0,40)}...</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'16px 20px' }}>
                    <span style={{ background:'#E8DFD5', color:'rgba(45,45,45,0.55)', padding:'4px 10px', borderRadius:'100px', fontSize:'11px' }}>{p.category}</span>
                  </td>
                  <td style={{ padding:'16px 20px', fontSize:'13px', fontWeight:600, color:'#000000' }}>Rs. {Number(p.offerPrice || p.price).toLocaleString()}</td>
                  <td style={{ padding:'16px 20px' }}>
                    <span style={{ fontSize:'13px', color: p.stock > 10 ? 'var(--leaf)' : p.stock > 0 ? '#f59e0b' : '#ef4444', fontWeight:500 }}>
                      {p.stock} left
                    </span>
                  </td>
                  <td style={{ padding:'16px 20px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button onClick={()=>openEdit(p)} style={{ padding:'8px', background:'rgba(96,165,250,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', color:'#60a5fa' }}><Edit2 size={14} /></button>
                      <button onClick={()=>handleDelete(p.id)} style={{ padding:'8px', background:'rgba(239,68,68,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', color:'#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewProduct && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, padding:'20px' }}>
          <div style={{ background:'#F9F6F2', borderRadius:'16px', width:'100%', maxWidth:'680px', maxHeight:'90vh', overflowY:'auto', padding:'32px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'16px', marginBottom:'24px' }}>
              <div>
                <p style={{ fontSize:'10px', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>Product Details</p>
                <h2 style={{ fontSize:'24px', fontWeight:700, color:'#000000', margin:0 }}>{viewProduct.name}</h2>
              </div>
              <button onClick={() => setViewProduct(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(45,45,45,0.55)' }}><X size={20} /></button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
              <div style={{ borderRadius:'16px', overflow:'hidden', background:'#E8DFD5', minHeight:'320px' }}>
                {viewProduct.imageUrl ? <img src={viewProduct.imageUrl} alt={viewProduct.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>📦</div>}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                <div>
                  <p style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(45,45,45,0.55)', marginBottom:'8px' }}>Category</p>
                  <span style={{ display:'inline-flex', background:'#E8DFD5', color:'rgba(45,45,45,0.55)', padding:'6px 12px', borderRadius:'999px', fontSize:'12px' }}>{viewProduct.category}</span>
                </div>

                <div>
                  <p style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(45,45,45,0.55)', marginBottom:'8px' }}>Pricing</p>
                  <div style={{ display:'flex', gap:'12px', alignItems:'flex-end' }}>
                    {viewProduct.offerPrice > 0 && viewProduct.offerPrice < viewProduct.price ? <p style={{ fontSize:'28px', fontWeight:700, color:'#000000', margin:0 }}>Rs. {Number(viewProduct.offerPrice).toLocaleString()}</p> : <p style={{ fontSize:'28px', fontWeight:700, color:'#000000', margin:0 }}>Rs. {Number(viewProduct.price).toLocaleString()}</p>}
                    {viewProduct.offerPrice > 0 && viewProduct.offerPrice < viewProduct.price ? <p style={{ fontSize:'14px', color:'#ef4444', textDecoration:'line-through', margin:0 }}>Rs. {Number(viewProduct.price).toLocaleString()}</p> : null}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(45,45,45,0.55)', marginBottom:'8px' }}>Stock</p>
                  <p style={{ fontSize:'16px', fontWeight:600, color: viewProduct.stock > 10 ? 'var(--leaf)' : viewProduct.stock > 0 ? '#f59e0b' : '#ef4444', margin:0 }}>{viewProduct.stock} left</p>
                </div>

                <div>
                  <p style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(45,45,45,0.55)', marginBottom:'8px' }}>Description</p>
                  <p style={{ fontSize:'14px', color:'#000000', lineHeight:1.7, margin:0 }}>{viewProduct.description || 'No description provided.'}</p>
                </div>

                <div>
                  <p style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(45,45,45,0.55)', marginBottom:'8px' }}>Available Colors</p>
                  {viewProduct.colors && viewProduct.colors.length > 0 ? (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                      {viewProduct.colors.map(color => (
                        <div key={color} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#E8DFD5', padding:'6px 12px', borderRadius:'100px', fontSize:'11px' }}>
                          <div style={{ width:'14px', height:'14px', borderRadius:'50%', background:color, border:'1px solid #999' }} />
                          <span>{color}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize:'14px', color:'#999', margin:0 }}>No colors available</p>
                  )}
                </div>

                <div>
                  <p style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(45,45,45,0.55)', marginBottom:'8px' }}>Available Sizes</p>
                  {viewProduct.sizes && viewProduct.sizes.length > 0 ? (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                      {viewProduct.sizes.map(size => (
                        <span key={size} style={{ background:'#E8DFD5', color:'#000', padding:'6px 12px', borderRadius:'999px', fontSize:'11px' }}>{size}</span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize:'14px', color:'#999', margin:0 }}>No sizes available</p>
                  )}
                </div>

                <div>
                  <p style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(45,45,45,0.55)', marginBottom:'8px' }}>Available Weights</p>
                  {viewProduct.weights && viewProduct.weights.length > 0 ? (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                      {viewProduct.weights.map(weight => (
                        <span key={weight} style={{ background:'#E8DFD5', color:'#000', padding:'6px 12px', borderRadius:'999px', fontSize:'11px' }}>{weight}</span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize:'14px', color:'#999', margin:0 }}>No weights available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}