import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { Package, Truck, MapPin, User, Calendar, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function OrderDetail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [user, id, navigate]);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getById(id);
      setOrder(res.data);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock size={20} style={{ color: '#f59e0b' }} />;
      case 'PROCESSING': return <Package size={20} style={{ color: '#3b82f6' }} />;
      case 'DELIVERED': return <CheckCircle size={20} style={{ color: '#10b981' }} />;
      case 'CANCELLED': return <XCircle size={20} style={{ color: '#ef4444' }} />;
      default: return <Package size={20} style={{ color: '#6b7280' }} />;
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

  if (error || !order) return (
    <div style={{ background: '#F5F3F0', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
        <div className="text-center py-16">
          <XCircle size={64} style={{ color: '#ef4444', margin: '0 auto 24px' }} />
          <h2 className="font-bold mb-4" style={{ color: 'var(--carbon)', fontSize: '24px' }}>Order Not Found</h2>
          <p className="body-sm mb-8" style={{ color: 'var(--text-muted-light)' }}>
            {error || 'The order you\'re looking for doesn\'t exist.'}
          </p>
          <button onClick={() => navigate('/orders')} className="btn-primary">
            Back to Orders
          </button>
        </div>
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
              ORDER DETAILS
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Package size={16} style={{ color: 'var(--leaf)' }} />
              <p className="body-sm" style={{ color: 'var(--text-muted-light)' }}>
                Order #{order.id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Order Status */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl p-6" style={{ background: 'rgba(241,237,227,0.6)' }}>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(order.status)}
                  <h2 className="font-bold" style={{ color: 'var(--carbon)', fontSize: '18px' }}>
                    ORDER STATUS
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted-light)' }}>Status</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: getStatusColor(order.status), color: 'white' }}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted-light)' }}>Total</span>
                    <span className="font-bold" style={{ color: 'var(--carbon)' }}>
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted-light)' }}>Items</span>
                    <span style={{ color: 'var(--carbon)' }}>
                      {order.items?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(241,237,227,0.6)' }}>
                <h2 className="font-bold mb-6" style={{ color: 'var(--carbon)', fontSize: '18px' }}>
                  ORDER ITEMS
                </h2>
                <div className="space-y-4">
                  {order.items?.map((item, index) => {
                    console.log('Order item:', item);
                    const imageUrl = item.imageUrl || item.product?.imageUrl || item.product?.image || item.image;
                    return (
                      <div key={index} className="flex items-center gap-4 pb-4"
                        style={{ borderBottom: '1px solid rgba(45,45,45,0.1)' }}>
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                          style={{ background: '#E8DFD5' }}>
                          {imageUrl
                            ? <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center">📦</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium" style={{ color: 'var(--carbon)' }}>
                            {item.name}
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--text-muted-light)' }}>
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: 'var(--carbon)' }}>
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-muted-light)' }}>
                            Rs. {item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Info */}
              {order.recipient && (
                <div className="rounded-2xl p-6" style={{ background: 'rgba(241,237,227,0.6)' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <User size={18} style={{ color: 'var(--carbon)' }} />
                    <h2 className="font-bold" style={{ color: 'var(--carbon)', fontSize: '18px' }}>
                      DELIVERY DETAILS
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3" style={{ color: 'var(--carbon)' }}>Recipient</h3>
                      <div className="space-y-2 text-sm" style={{ color: 'var(--text-muted-light)' }}>
                        <p><strong>Name:</strong> {order.recipient.fullName}</p>
                        <p><strong>Phone:</strong> {order.recipient.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3" style={{ color: 'var(--carbon)' }}>Address</h3>
                      <div className="space-y-2 text-sm" style={{ color: 'var(--text-muted-light)' }}>
                        <p>{order.recipient.streetAddress}</p>
                        <p>{order.recipient.city}, {order.recipient.zipCode}</p>
                        {order.recipient.detailedAddress && <p>{order.recipient.detailedAddress}</p>}
                      </div>
                    </div>
                  </div>
                  {order.recipient.specialInstructions && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3" style={{ color: 'var(--carbon)' }}>Special Instructions</h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted-light)' }}>
                        {order.recipient.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/orders')} className="btn-secondary" style={{ background: 'var(--leaf)', color:'white' }}>
              Back to My Orders
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}