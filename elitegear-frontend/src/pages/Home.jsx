import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Search, ShoppingCart, User, Dumbbell, ArrowLeft, ArrowRight, LogOut } from 'lucide-react';

const categories = [
  { name: "Dumbbells", img: "https://picsum.photos/id/1015/300/200" },
  { name: "Treadmills", img: "https://picsum.photos/id/201/300/200" },
  { name: "Football", img: "https://picsum.photos/id/301/300/200" },
  { name: "Yoga Mats", img: "https://picsum.photos/id/401/300/200" },
  { name: "Bikes", img: "https://picsum.photos/id/501/300/200" },
];

const offers = [
  { title: "50% OFF on Selected Gear", desc: "Limited time offer", img: "https://picsum.photos/id/106/800/400" },
  { title: "Buy 1 Get 1 Free", desc: "On all protein supplements", img: "https://picsum.photos/id/107/800/400" },
];

const newArrivals = [
  { name: "Pro Carbon Bike", price: 899, img: "https://picsum.photos/id/180/300/300" },
  { name: "Wireless Earbuds", price: 129, img: "https://picsum.photos/id/201/300/300" },
  { name: "Smart Watch Fitness", price: 249, img: "https://picsum.photos/id/251/300/300" },
];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentOffer, setCurrentOffer] = useState(0);

  const handleProfileClick = () => {
    if (user) {
      if (user.isAdmin || user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const nextCategory = () => setCurrentCategory((prev) => (prev + 1) % categories.length);
  const prevCategory = () => setCurrentCategory((prev) => (prev - 1 + categories.length) % categories.length);

  const nextOffer = () => setCurrentOffer((prev) => (prev + 1) % offers.length);
  const prevOffer = () => setCurrentOffer((prev) => (prev - 1 + offers.length) % offers.length);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
              <Menu size={28} />
            </button>
            <div className="flex items-center gap-3">
              <Dumbbell className="text-orange-500" size={32} />
              <span className="text-3xl font-bold tracking-tighter">ELITE<span className="text-orange-500">GEAR</span></span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-lg">
            <Link to="/" className="hover:text-orange-500 transition">Home</Link>
            <Link to="/shop" className="hover:text-orange-500 transition">Shop</Link>
            <Link to="#" className="hover:text-orange-500 transition">Categories</Link>
            <Link to="#" className="hover:text-orange-500 transition">Deals</Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search equipment..."
                className="bg-zinc-900 border border-zinc-700 pl-10 pr-4 py-2.5 rounded-full w-80 focus:outline-none focus:border-orange-500"
              />
              <Search className="absolute left-4 top-3 text-zinc-500" size={20} />
            </div>

            {/* Cart Icon */}
            <button className="relative hover:text-orange-500 transition" onClick={() => navigate('/cart')}>
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* User / Login Section */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 hover:text-orange-500 transition"
                  >
                    <User size={24} />
                    <span className="hidden md:block text-sm font-medium">
                      {user.username || user.name}
                    </span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="text-zinc-400 hover:text-red-400 transition"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 hover:text-orange-500 transition"
                >
                  <User size={24} />
                  <span className="hidden md:block text-sm">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[600px] bg-cover bg-center flex items-center" 
           style={{ backgroundImage: "url('https://picsum.photos/id/1015/1920/1080')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tighter">
            GEAR UP FOR GREATNESS
          </h1>
          <p className="text-2xl text-zinc-300 mb-10">Premium Sports Equipment for Champions</p>
          <Link 
            to="/shop" 
            className="inline-block bg-orange-500 hover:bg-orange-600 px-10 py-4 rounded-2xl text-xl font-semibold transition"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-10 text-center">Shop by Category</h2>
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-500" 
              style={{ transform: `translateX(-${currentCategory * 100}%)` }}
            >
              {categories.map((cat, i) => (
                <div key={i} className="min-w-full relative">
                  <img src={cat.img} alt={cat.name} className="w-full h-96 object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 p-10">
                    <h3 className="text-4xl font-bold">{cat.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={prevCategory} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 p-4 rounded-full hover:bg-orange-500 transition"
          >
            <ArrowLeft size={28} />
          </button>
          <button 
            onClick={nextCategory} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 p-4 rounded-full hover:bg-orange-500 transition"
          >
            <ArrowRight size={28} />
          </button>
        </div>
      </div>

      {/* Offers Carousel */}
      <div className="bg-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-10 text-center">Special Offers</h2>
          <div className="relative rounded-3xl overflow-hidden">
            <img 
              src={offers[currentOffer].img} 
              alt="offer" 
              className="w-full h-[420px] object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
              <div className="max-w-lg px-12">
                <h3 className="text-5xl font-bold mb-4">{offers[currentOffer].title}</h3>
                <p className="text-2xl text-orange-400 mb-8">{offers[currentOffer].desc}</p>
                <button className="bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-orange-500 hover:text-white transition">
                  Grab the Deal
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            {offers.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentOffer(i)} 
                className={`w-4 h-4 rounded-full transition-all ${i === currentOffer ? 'bg-orange-500 scale-125' : 'bg-zinc-700'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-10 text-center">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals.map((item, i) => (
            <div key={i} className="group bg-zinc-900 rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300">
              <img src={item.img} alt={item.name} className="w-full h-80 object-cover" />
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-2">{item.name}</h3>
                <p className="text-3xl font-bold text-orange-500">LKR {item.price}</p>
                <button className="mt-6 w-full bg-zinc-800 hover:bg-orange-500 py-4 rounded-2xl transition font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-20 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Dumbbell className="text-orange-500" size={32} />
              <span className="text-2xl font-bold">ELITEGEAR</span>
            </div>
            <p className="text-zinc-500">Premium sports equipment for athletes who demand the best.</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <div className="space-y-3 text-zinc-400">
              <p>Home</p>
              <p>Shop</p>
              <p>Categories</p>
              <p>Contact Us</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact</h4>
            <div className="space-y-3 text-zinc-400">
              <p>Negombo, Sri Lanka</p>
              <p>+94 77 123 4567</p>
              <p>support@elitegear.lk</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Follow Us</h4>
            <div className="flex gap-6 text-3xl text-zinc-400">
              <span>𝕏</span>
              <span>📘</span>
              <span>📷</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}