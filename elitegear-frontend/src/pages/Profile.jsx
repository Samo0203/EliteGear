import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, User, Mail, Phone, MapPin, LogOut, Package, Calendar, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    // Load orders from user object
    setOrders(user.orders || []);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="bg-black border-b border-zinc-800 py-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dumbbell className="text-orange-500" size={32} />
            <span className="text-2xl font-bold tracking-tight">ELITE<span className="text-orange-500">GEAR</span></span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-zinc-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Profile Information Sidebar */}
          <div className="lg:w-96 bg-zinc-900 rounded-3xl p-10 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 border-4 border-zinc-700">
                <User size={70} className="text-zinc-500" />
              </div>
              <h2 className="text-3xl font-bold">{user.name || user.username}</h2>
              <p className="text-orange-500 mt-1">@{user.username}</p>
              <div className="mt-6 px-6 py-2 bg-emerald-900/30 text-emerald-400 rounded-2xl text-sm font-medium">
                Premium Member
              </div>
            </div>

            <div className="mt-12 space-y-8 text-sm">
              <div className="flex gap-4">
                <Mail className="text-orange-500 mt-1" size={22} />
                <div>
                  <p className="text-zinc-500">EMAIL</p>
                  <p className="font-medium">{user.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="text-orange-500 mt-1" size={22} />
                <div>
                  <p className="text-zinc-500">MOBILE</p>
                  <p className="font-medium">{user.mobile || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="text-orange-500 mt-1" size={22} />
                <div>
                  <p className="text-zinc-500">REGION</p>
                  <p className="font-medium">{user.region || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Calendar className="text-orange-500 mt-1" size={22} />
                <div>
                  <p className="text-zinc-500">MEMBER SINCE</p>
                  <p className="font-medium">
                    {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    }) : 'March 2026'}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="mt-16 w-full flex items-center justify-center gap-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 py-4 rounded-2xl transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          {/* Order History Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold flex items-center gap-4">
                <Package className="text-orange-500" size={36} />
                Order History
              </h2>
              <span className="text-zinc-500">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <div key={index} className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:border-orange-500/30 transition">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="font-mono text-orange-400 text-sm tracking-widest">
                          ORDER #{order.orderId || `ORD${Date.now()}`}
                        </p>
                        <p className="text-lg font-semibold mt-1">
                          {new Date(order.date || order.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-400">
                          LKR {order.total?.toLocaleString() || '0'}
                        </p>
                        <p className="text-xs text-emerald-500 mt-1 font-medium">
                          {order.status || 'Delivered'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                      <p className="text-zinc-400 text-sm mb-3">
                        {order.items?.length || 1} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                      {order.items && order.items.length > 0 && (
                        <div className="text-sm text-zinc-500">
                          {order.items.map((item, i) => (
                            <span key={i}>
                              {item.name} × {item.quantity || 1}
                              {i < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-3xl py-24 text-center">
                <Package size={80} className="mx-auto text-zinc-700 mb-6" />
                <h3 className="text-2xl font-medium mb-3">No orders yet</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">
                  When you complete your first purchase, your order history will appear here.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-8 bg-orange-500 hover:bg-orange-600 px-10 py-4 rounded-2xl font-medium"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}