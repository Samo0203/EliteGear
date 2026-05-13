import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { categoryAPI } from '../../services/api';

export function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [search,     setSearch]     = useState('');
  const [form, setForm] = useState({ name:'', description:'', imageUrl:'', type:'OUTDOOR' });

  const fetchAll = async () => {
    setLoading(true);
    try { const res = await categoryAPI.getAll(); setCategories(res.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd  = () => { setEditing(null); setForm({ name:'',description:'',imageUrl:'',type:'OUTDOOR' }); setShowForm(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name:c.name,description:c.description||'',imageUrl:c.imageUrl||'',type:c.type||'OUTDOOR' }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if category already exists
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase().trim() === form.name.toLowerCase().trim() &&
      (!editing || cat.id !== editing.id)
    );
    
    if (existingCategory) {
      alert('Category already exists!');
      return;
    }
    
    try {
      if (editing) await categoryAPI.update(editing.id, form);
      else         await categoryAPI.create(form);
      setShowForm(false); fetchAll();
    } catch { alert('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await categoryAPI.delete(id); fetchAll();
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = { width:'100%', background:'white', border:'1px solid #DDD3CA', color:'var(--carbon)', borderRadius:'8px', padding:'12px 14px', fontFamily:"'Lexend',sans-serif", fontSize:'13px', outline:'none' };
  const labelStyle = { display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
        <div>
          <p style={{ fontSize:'10px', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>MANAGEMENT</p>
          <h1 style={{ fontSize:'24px', fontWeight:700, color:'var(--carbon)' }}>Categories</h1>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 20px', fontSize:'12px' }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom:'24px' }}>
        <input
          type="text"
          placeholder="Search categories by name or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:'100%', padding:'12px 14px', background:'white', border:'1px solid #DDD3CA', borderRadius:'8px', fontSize:'13px', fontFamily:"'Lexend',sans-serif", color:'var(--carbon)', outline:'none' }}
        />
      </div>

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
          <div style={{ background:'#F9F6F2', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'480px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--carbon)' }}>{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={()=>setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(45,45,45,0.55)' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div><label style={labelStyle}>Name</label><input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
              <div><label style={labelStyle}>Description</label><textarea style={{...inputStyle,height:'80px',resize:'none'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
              <div><label style={labelStyle}>Image URL</label><input style={inputStyle} value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://..." onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}/></div>
              <div><label style={labelStyle}>Type</label>
                <select style={{...inputStyle,cursor:'pointer'}} value={form.type} onChange={e=>setForm({...form,type:e.target.value})} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}>
                  <option value="OUTDOOR">OUTDOOR</option>
                  <option value="INDOOR">INDOOR</option>
                </select>
              </div>
              <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
                <button type="button" onClick={()=>setShowForm(false)} style={{ flex:1, padding:'14px', background:'#E8DFD5', border:'none', borderRadius:'8px', color:'var(--carbon)', cursor:'pointer', fontFamily:"'Lexend',sans-serif", fontSize:'12px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex:1, padding:'14px', fontSize:'12px', borderRadius:'8px' }}>{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' }}>
        {loading ? (
          <div style={{ gridColumn:'1/-1', display:'flex', justifyContent:'center', padding:'60px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', border:'2px solid var(--surface-high)', borderTopColor:'var(--leaf)', animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'rgba(45,45,45,0.55)' }}>No categories found.</div>
        ) : filteredCategories.map(cat => (
          <div key={cat.id} style={{ background:'#F9F6F2', borderRadius:'12px', overflow:'hidden', border:'1px solid #E8DFD5' }}>
            <div style={{ height:'140px', background:'#E8DFD5', overflow:'hidden' }}>
              {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.8 }} /> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>🏆</div>}
            </div>
            <div style={{ padding:'16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'6px' }}>
                <p style={{ fontWeight:700, color:'var(--carbon)', fontSize:'14px' }}>{cat.name}</p>
                <span style={{ background: cat.type==='SPORT' ? 'rgba(34,85,34,0.15)' : cat.type==='INDOOR' ? 'rgba(96,165,250,0.15)' : 'rgba(34,85,34,0.15)', color: cat.type==='SPORT' ? '#225722' : cat.type==='INDOOR' ? '#60a5fa' : '#225722', padding:'2px 8px', borderRadius:'100px', fontSize:'9px', fontWeight:500, letterSpacing:'0.05em' }}>{cat.type}</span>
              </div>
              <p style={{ fontSize:'11px', color:'rgba(45,45,45,0.55)', lineHeight:1.5, marginBottom:'12px' }}>{cat.description || 'No description'}</p>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => setViewCategory(cat)} style={{ flex:1, padding:'8px', background:'rgba(52,211,153,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', color:'rgb(28, 101, 39)', fontFamily:"'Lexend',sans-serif", fontSize:'11px' }}>View</button>
                <button onClick={()=>openEdit(cat)} style={{ flex:1, padding:'8px', background:'rgba(96,165,250,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', color:'#60a5fa', fontFamily:"'Lexend',sans-serif", fontSize:'11px' }}>Edit</button>
                <button onClick={()=>handleDelete(cat.id)} style={{ flex:1, padding:'8px', background:'rgba(239,68,68,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', color:'#ef4444', fontFamily:"'Lexend',sans-serif", fontSize:'11px' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewCategory && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
          <div style={{ background:'#F9F6F2', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'500px', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--carbon)' }}>Category Details</h2>
              <button onClick={()=>setViewCategory(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(45,45,45,0.55)', fontSize:'20px' }}>×</button>
            </div>
            
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div>
                <label style={labelStyle}>Name</label>
                <div style={{...inputStyle, cursor:'default'}}>{viewCategory.name}</div>
              </div>
              
              <div>
                <label style={labelStyle}>Description</label>
                <div style={{...inputStyle, cursor:'default', minHeight:'80px', whiteSpace:'pre-wrap'}}>{viewCategory.description || 'No description'}</div>
              </div>
              
              <div>
                <label style={labelStyle}>Image URL</label>
                <div style={{...inputStyle, cursor:'default'}}>{viewCategory.imageUrl || 'No image'}</div>
              </div>
              
              <div>
                <label style={labelStyle}>Type</label>
                <div style={{...inputStyle, cursor:'default'}}>{viewCategory.type || 'OUTDOOR'}</div>
              </div>
              
              {viewCategory.imageUrl && (
                <div>
                  <label style={labelStyle}>Preview</label>
                  <div style={{ borderRadius:'8px', overflow:'hidden', maxHeight:'200px' }}>
                    <img src={viewCategory.imageUrl} alt={viewCategory.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'24px' }}>
              <button onClick={()=>setViewCategory(null)} style={{ padding:'12px 24px', background:'#E8DFD5', border:'none', borderRadius:'8px', color:'var(--carbon)', cursor:'pointer', fontFamily:"'Lexend',sans-serif", fontSize:'12px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}