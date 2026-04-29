import { useEffect, useState } from 'react';
import { orderAPI, userAPI } from '../../services/api';

export function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try { const res = await orderAPI.getAll(); setOrders(res.data); }
    catch {} finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try { const res = await userAPI.getAll(); setUsers(res.data); }
    catch (error) { console.error('Failed to fetch users:', error); }
  };

  useEffect(() => { 
    fetchOrders(); 
    fetchUsers();
  }, []);

  const handleStatus = async (id, status) => {
    await orderAPI.updateStatus(id, status); fetchOrders();
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId || u.username === userId);
    return user ? user.name : userId || '—';
  };

  const STATUS_COLORS = {
    PENDING:    { bg:'rgba(245,158,11,0.15)', text:'#f59e0b' },
    PROCESSING: { bg:'rgba(96,165,250,0.15)', text:'#60a5fa' },
    DELIVERED:  { bg:'rgba(52,211,153,0.15)', text:'#34d399' },
    CANCELLED:  { bg:'rgba(239,68,68,0.15)',  text:'#ef4444' },
  };

  const STATUSES = ['PENDING','PROCESSING','DELIVERED','CANCELLED'];

  return (
    <div>
      <div style={{ marginBottom:'32px' }}>
        <p style={{ fontSize:'10px', letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>MANAGEMENT</p>
        <h1 style={{ fontSize:'24px', fontWeight:700, color:'var(--carbon)' }}>Orders</h1>
      </div>

      <div style={{ background:'#F9F6F2', borderRadius:'12px', overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', border:'2px solid #E8DFD5', borderTopColor:'var(--leaf)', animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', color:'rgba(45,45,45,0.55)' }}>No orders yet.</div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F5F0E8' }}>
                {['Order ID','Customer','Items','Total','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'10px', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(45,45,45,0.55)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
                return (
                  <tr key={order.id} style={{ borderTop:'1px solid #E8DFD5' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(45,45,45,0.03)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'16px 20px', fontSize:'12px', fontWeight:600, color:'var(--primary)', fontFamily:'monospace' }}>
                      #{order.id?.substring(0,8).toUpperCase()}
                    </td>
                    <td style={{ padding:'16px 20px', fontSize:'13px', color:'var(--carbon)' }}>{getUserName(order.userId) || '—'}</td>
                    <td style={{ padding:'16px 20px', fontSize:'13px', color:'rgba(45,45,45,0.55)' }}>{order.items?.length || 0} item(s)</td>
                    <td style={{ padding:'16px 20px', fontSize:'13px', fontWeight:600, color:'var(--carbon)' }}>Rs. {Number(order.total||0).toLocaleString()}</td>
                    <td style={{ padding:'16px 20px' }}>
                      <span style={{ background:sc.bg, color:sc.text, padding:'4px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:600, letterSpacing:'0.05em' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding:'16px 20px' }}>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={() => setViewOrder(order)} style={{ padding:'6px 12px', background:'rgba(96,165,250,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', color:'#60a5fa', fontFamily:"'Lexend',sans-serif", fontSize:'11px' }}>
                          View
                        </button>
                        <select
                          value={order.status}
                          onChange={e=>handleStatus(order.id, e.target.value)}
                          style={{ background:'white', border:'1px solid #DDD3CA', color:'var(--carbon)', borderRadius:'6px', padding:'6px 10px', fontFamily:"'Lexend',sans-serif", fontSize:'11px', cursor:'pointer', outline:'none' }}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {viewOrder && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
          <div style={{ background:'#F9F6F2', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'600px', maxHeight:'80vh', overflow:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--carbon)' }}>Order Details</h2>
              <button onClick={()=>setViewOrder(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(45,45,45,0.55)', fontSize:'20px' }}>×</button>
            </div>
            
            <div style={{ display:'grid', gap:'16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <div>
                  <label style={{ display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>Order ID</label>
                  <div style={{ background:'white', border:'1px solid #DDD3CA', color:'var(--carbon)', borderRadius:'8px', padding:'12px 14px', fontFamily:"'Lexend',sans-serif", fontSize:'13px' }}>
                    #{viewOrder.id?.substring(0,8).toUpperCase()}
                  </div>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>Status</label>
                  <div style={{ background:'white', border:'1px solid #DDD3CA', color:'var(--carbon)', borderRadius:'8px', padding:'12px 14px', fontFamily:"'Lexend',sans-serif", fontSize:'13px' }}>
                    {viewOrder.status}
                  </div>
                </div>
              </div>
              
              <div>
                <label style={{ display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>Customer</label>
                <div style={{ background:'white', border:'1px solid #DDD3CA', color:'var(--carbon)', borderRadius:'8px', padding:'12px 14px', fontFamily:"'Lexend',sans-serif", fontSize:'13px' }}>
                  {getUserName(viewOrder.userId) || '—'}
                </div>
              </div>
              
              <div>
                <label style={{ display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>Items</label>
                <div style={{ background:'white', border:'1px solid #DDD3CA', color:'var(--carbon)', borderRadius:'8px', padding:'12px 14px', fontFamily:"'Lexend',sans-serif", fontSize:'13px' }}>
                  {viewOrder.items?.length || 0} item(s)
                </div>
              </div>
              
              <div>
                <label style={{ display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>Total</label>
                <div style={{ background:'white', border:'1px solid #DDD3CA', color:'var(--carbon)', borderRadius:'8px', padding:'12px 14px', fontFamily:"'Lexend',sans-serif", fontSize:'13px' }}>
                  Rs. {Number(viewOrder.total||0).toLocaleString()}
                </div>
              </div>
              
              {viewOrder.items && viewOrder.items.length > 0 && (
                <div>
                  <label style={{ display:'block', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(45,45,45,0.55)', marginBottom:'6px' }}>Order Items</label>
                  <div style={{ background:'white', border:'1px solid #DDD3CA', borderRadius:'8px', padding:'16px' }}>
                    {viewOrder.items.map((item, i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: i < viewOrder.items.length - 1 ? '1px solid #E8DFD5' : 'none' }}>
                        <div>
                          <p style={{ fontSize:'13px', color:'var(--carbon)', margin:0 }}>{item.name}</p>
                          <p style={{ fontSize:'11px', color:'rgba(45,45,45,0.55)', margin:'2px 0 0 0' }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontSize:'13px', color:'var(--carbon)', margin:0 }}>Rs. {Number(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'24px' }}>
              <button onClick={()=>setViewOrder(null)} style={{ padding:'12px 24px', background:'#E8DFD5', border:'none', borderRadius:'8px', color:'var(--carbon)', cursor:'pointer', fontFamily:"'Lexend',sans-serif", fontSize:'12px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}