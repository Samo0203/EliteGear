import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const { user, addOrderToUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }

    const order = {
      items: cart,
      total: total,
      status: "Processing"
    };

    addOrderToUser(order);
    localStorage.setItem('cart', '[]');
    setCart([]);
    alert("Order placed successfully! Check your profile for order history.");
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 text-zinc-400 hover:text-white">
          <ArrowLeft size={20} /> Back to Shop
        </button>

        <h1 className="text-4xl font-bold mb-10">Your Cart ({cart.length})</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 rounded-3xl">
            <p className="text-2xl">Your cart is empty</p>
            <button onClick={() => navigate('/')} className="mt-6 bg-orange-500 px-8 py-4 rounded-2xl">Browse Products</button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="bg-zinc-900 rounded-3xl p-8 flex gap-8">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-32 h-32 object-cover rounded-2xl" />}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold">{item.name}</h3>
                    <p className="text-orange-500 text-xl mt-2">LKR {item.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500">
                    <Trash2 size={28} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-zinc-900 rounded-3xl p-10">
              <div className="flex justify-between text-3xl font-bold">
                <span>Total</span>
                <span>LKR {total}</span>
              </div>
              <button 
                onClick={placeOrder}
                className="mt-8 w-full bg-orange-500 hover:bg-orange-600 py-5 rounded-2xl text-xl font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}