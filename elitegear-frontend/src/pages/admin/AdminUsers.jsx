import { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';

export function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try { const res = await userAPI.getAll(); setUsers(res.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await userAPI.delete(id); fetchUsers();
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
        <div>
          <p style={{ fontSize:'10px', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>MANAGEMENT</p>
          <h1 style={{ fontSize:'24px', fontWeight:700, color:'#000000' }}>Users</h1>
        </div>

        {/* SEARCH BAR WITH X BUTTON */}
        <div style={{ position:'relative', width:'220px' }}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{
              background:'#FFFFFF',
              border:'1px solid var(--ghost-border)',
              color:'#000000',
              borderRadius:'8px',
              padding:'10px 38px 10px 16px',
              fontFamily:"'Lexend',sans-serif",
              fontSize:'13px',
              outline:'none',
              width:'100%'
            }}
            onFocus={e=>e.target.style.borderColor='var(--primary)'}
            onBlur={e=>e.target.style.borderColor='var(--ghost-border)'}
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position:'absolute',
                right:'10px',
                top:'50%',
                transform:'translateY(-50%)',
                background:'transparent',
                border:'none',
                cursor:'pointer',
                fontSize:'16px',
                color:'rgba(45,45,45,0.55)',
                padding:'0'
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div style={{ background:'#F9F6F2', borderRadius:'12px', overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', border:'2px solid var(--surface-high)', borderTopColor:'var(--leaf)', animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F5F0E8' }}>
                {['User','Email','Mobile','Region','Actions'].map(h => (
                  <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'10px', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(45,45,45,0.55)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderTop:'1px solid var(--ghost-border)' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(45,45,45,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'16px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:'var(--leaf)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>
                        {u.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p style={{ fontSize:'13px', fontWeight:600, color:'#000000' }}>{u.name}</p>
                        <p style={{ fontSize:'11px', color:'rgba(45,45,45,0.55)' }}>@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'16px 20px', fontSize:'13px', color:'rgba(45,45,45,0.55)' }}>{u.email}</td>
                  <td style={{ padding:'16px 20px', fontSize:'13px', color:'rgba(45,45,45,0.55)' }}>{u.mobile || '—'}</td>
                  <td style={{ padding:'16px 20px' }}>
                    {u.region && <span style={{ background:'#E8DFD5', color:'rgba(45,45,45,0.55)', padding:'3px 8px', borderRadius:'100px', fontSize:'10px' }}>{u.region}</span>}
                  </td>
                  <td style={{ padding:'16px 20px' }}>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button onClick={() => setViewUser(u)} style={{ padding:'7px 14px', background:'rgba(52,211,153,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', color:'rgb(28, 101, 39)', fontFamily:"'Lexend',sans-serif", fontSize:'11px' }}>
                        View
                      </button>
                      <button onClick={()=>handleDelete(u.id)} style={{ padding:'7px 14px', background:'rgba(239,68,68,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', color:'#ef4444', fontFamily:"'Lexend',sans-serif", fontSize:'11px' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewUser && <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />}
    </div>
  );
}

const inputStyle = { width:'100%', background:'#FFFFFF', border:'1px solid var(--ghost-border)', color:'#000000', borderRadius:'8px', padding:'12px 14px', fontFamily:"'Lexend',sans-serif", fontSize:'13px', outline:'none', cursor:'default' };
const labelStyle = { display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' };

// View User Modal Component
export function ViewUserModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
      <div style={{ background:'#F9F6F2', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'500px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <h2 style={{ fontSize:'18px', fontWeight:700, color:'#000000' }}>User Details</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(45,45,45,0.55)', fontSize:'20px' }}>×</button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px' }}>
            <div style={{ width:'60px', height:'60px', borderRadius:'12px', background:'var(--leaf)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0 }}>
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h3 style={{ fontSize:'18px', fontWeight:600, color:'#000000', margin:0 }}>{user.name}</h3>
              <p style={{ fontSize:'14px', color:'rgba(45,45,45,0.55)', margin:'4px 0 0 0' }}>@{user.username}</p>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <div style={inputStyle}>{user.email}</div>
          </div>

          <div>
            <label style={labelStyle}>Mobile</label>
            <div style={inputStyle}>{user.mobile || 'Not provided'}</div>
          </div>

          <div>
            <label style={labelStyle}>Region</label>
            <div style={inputStyle}>{user.region || 'Not provided'}</div>
          </div>

          <div>
            <label style={labelStyle}>User ID</label>
            <div style={inputStyle}>{user.id}</div>
          </div>

          <div>
            <label style={labelStyle}>Account Type</label>
            <div style={inputStyle}>{user.isAdmin ? 'Administrator' : 'Customer'}</div>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'24px' }}>
          <button onClick={onClose} style={{ padding:'12px 24px', background:'var(--surface-high)', border:'none', borderRadius:'8px', color:'var(--linen)', cursor:'pointer', fontFamily:"'Lexend',sans-serif", fontSize:'12px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}