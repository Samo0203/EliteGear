import { useEffect, useState } from 'react';
import { productAPI } from '../../services/api';
import { Package, Tag, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    bestSeller: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsRes = await productAPI.getAll();
        const products = productsRes.data;

        // For now we calculate from products (since Category API not shared yet)
        const uniqueCategories = [...new Set(products.map(p => p.category))];

        // Fake best seller for now - you can improve when you give statistics endpoint
        const bestSeller = products.length > 0 
          ? products.reduce((prev, current) => 
              (prev.stock < current.stock) ? current : prev).name 
          : 'No products yet';

        setStats({
          totalProducts: products.length,
          totalCategories: uniqueCategories.length,
          bestSeller: bestSeller
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "orange"
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      color: "emerald"
    },
    {
      title: "Best Seller",
      value: stats.bestSeller,
      icon: TrendingUp,
      color: "amber",
      isText: true
    }
  ];

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="admin-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-500 text-sm">{stat.title}</p>
                {stat.isText ? (
                  <p className="text-2xl font-semibold mt-2 text-amber-400">{stat.value}</p>
                ) : (
                  <p className="text-5xl font-bold mt-2">{stat.value}</p>
                )}
              </div>
              <div className={`p-4 rounded-2xl bg-${stat.color}-500/10`}>
                <stat.icon className={`text-${stat.color}-500`} size={32} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}