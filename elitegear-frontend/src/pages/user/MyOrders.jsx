import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { Package, Eye, Calendar, DollarSign } from 'lucide-react';

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getByUser(user.id);
      // Sort orders by createdAt in descending order (latest first)
      const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'PROCESSING': return '#3b82f6';
      case 'DELIVERED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) return (
    <div style={{ background: '#F5F3F0', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
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
              MY ORDERS
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Package size={16} style={{ color: 'var(--leaf)' }} />
              <p className="body-sm" style={{ color: 'var(--text-muted-light)' }}>
                Track your elite gear purchases and delivery status.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={64} style={{ color: 'var(--text-muted-light)', margin: '0 auto 24px' }} />
              <h2 className="font-bold mb-4" style={{ color: 'var(--carbon)', fontSize: '24px' }}>No Orders Yet</h2>
              <p className="body-sm mb-8" style={{ color: 'var(--text-muted-light)' }}>
                Start shopping to see your orders here.
              </p>
              <button onClick={() => navigate('/products')} className="btn-primary">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map(order => (
                <div key={order.id} className="rounded-2xl p-6"
                  style={{ background: 'rgba(241,237,227,0.6)', border: '1px solid rgba(45,45,45,0.1)' }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package size={20} style={{ color: 'var(--carbon)' }} />
                        <span className="font-bold" style={{ color: 'var(--carbon)', fontSize: '16px' }}>
                          Order #{order.id.slice(-8)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ background: getStatusColor(order.status), color: 'white' }}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted-light)' }}>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          Rs. {order.total.toLocaleString()}
                        </div>
                        <div>
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="btn-secondary flex items-center gap-2"
                      style={{ padding: '10px 20px' }}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
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