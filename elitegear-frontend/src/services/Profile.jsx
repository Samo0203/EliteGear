import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, User, Mail, Phone, MapPin, LogOut, Calendar, Package } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.isAdmin) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <nav className="bg-black border-b border-zinc-800 py-5">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dumbbell className="text-orange-500" size={32} />
            <span className="text-2xl font-bold">ELITE<span className="text-orange-500">GEAR</span></span>
          </div>
          <button onClick={() => navigate('/')} className="hover:text-orange-500 transition">← Back to Home</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold">My Profile</h1>
            <p className="text-zinc-500 mt-2">Welcome back, {user.name || user.username}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-500">
            <LogOut size={20} /> Logout
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Profile Info Sidebar */}
          <div className="md:col-span-2 bg-zinc-900 rounded-3xl p-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
                <User size={70} className="text-zinc-600" />
              </div>
              <h2 className="text-3xl font-semibold">{user.name}</h2>
              <p className="text-orange-500">@{user.username}</p>
            </div>

            <div className="mt-12 space-y-8">
              <div className="flex gap-4">
                <Mail className="text-orange-500 mt-1" size={22} />
                <div>
                  <p className="text-xs text-zinc-500">EMAIL</p>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-orange-500 mt-1" size={22} />
                <div>
                  <p className="text-xs text-zinc-500">MOBILE</p>
                  <p>{user.mobile}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="text-orange-500 mt-1" size={22} />
                <div>
                  <p className="text-xs text-zinc-500">REGION</p>
                  <p>{user.region}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Calendar className="text-orange-500 mt-1" size={22} />
                <div>
                  <p className="text-xs text-zinc-500">MEMBER SINCE</p>
                  <p>{new Date(user.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold flex items-center gap-3">
                <Package size={32} className="text-orange-500" /> Order History
              </h2>
              <span className="text-sm text-zinc-500">
                {user.orders?.length || 0} orders
              </span>
            </div>

            {user.orders && user.orders.length > 0 ? (
              <div className="space-y-6">
                {user.orders.map((order) => (
                  <div key={order.orderId} className="bg-zinc-900 rounded-3xl p-8 hover:border-orange-500 border border-transparent transition">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="font-mono text-orange-400 text-sm">#{order.orderId}</p>
                        <p className="text-xl font-semibold mt-1">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-semibold">LKR {order.total?.toLocaleString()}</p>
                        <p className="text-xs text-zinc-500 mt-1">{order.status || 'Delivered'}</p>
                      </div>
                    </div>

                    <div className="text-sm text-zinc-400">
                      {order.items?.length || 1} item{order.items?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-3xl p-20 text-center">
                <Package size={60} className="mx-auto text-zinc-700 mb-6" />
                <h3 className="text-2xl font-medium mb-3">No orders yet</h3>
                <p className="text-zinc-500">When you make your first purchase, it will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}