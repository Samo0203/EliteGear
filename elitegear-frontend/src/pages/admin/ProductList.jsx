import { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', stock: '', description: '', imageUrl: '', colors: [], sizes: []
  });

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData);
      } else {
        await productAPI.create(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', stock: '', description: '', imageUrl: '', colors: [], sizes: [] });
      fetchProducts();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  // ==================== ADD TO CART FUNCTION ====================
  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    alert(`${product.name} added to cart!`);
  };
  // ============================================================

  if (loading) return <div className="text-center py-20 text-xl">Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Products Management</h2>
        <button
          onClick={() => { setShowForm(true); setEditingProduct(null); }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-2xl font-medium"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* Product Form Modal - (unchanged) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Product Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" required />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Price (LKR)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" required />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Stock</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" placeholder="https://example.com/image.jpg" />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 h-32" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Colors (comma-separated hex codes)</label>
                  <input type="text" value={formData.colors.join(', ')} onChange={(e) => setFormData({...formData, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c)})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" placeholder="#000000, #FFFFFF, #FF0000" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Sizes (comma-separated)</label>
                  <input type="text" value={formData.sizes.join(', ')} onChange={(e) => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3" placeholder="S, M, L, XL" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); }}
                  className="flex-1 py-4 border border-zinc-700 rounded-2xl hover:bg-zinc-800">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl font-semibold">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
        <table className="w-full">
          <thead className="bg-zinc-950">
            <tr>
              <th className="px-8 py-5 text-left">Product</th>
              <th className="px-8 py-5 text-left">Category</th>
              <th className="px-8 py-5 text-left">Colors</th>
              <th className="px-8 py-5 text-left">Sizes</th>
              <th className="px-8 py-5 text-left">Price</th>
              <th className="px-8 py-5 text-left">Stock</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-zinc-800/50">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-xl" />
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-zinc-500 line-clamp-1">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-zinc-800 text-zinc-400 px-4 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-1">
                    {product.colors?.slice(0, 3).map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-zinc-600" style={{ background: color }} />
                    ))}
                    {product.colors?.length > 3 && <span className="text-xs text-zinc-500 ml-1">+{product.colors.length - 3}</span>}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-1 flex-wrap">
                    {product.sizes?.slice(0, 3).map((size, i) => (
                      <span key={i} className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs">
                        {size}
                      </span>
                    ))}
                    {product.sizes?.length > 3 && <span className="text-xs text-zinc-500 ml-1">+{product.sizes.length - 3}</span>}
                  </div>
                </td>
                <td className="px-8 py-6 font-semibold">LKR {product.price}</td>
                <td className="px-8 py-6">
                  <span className={`${product.stock > 10 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {product.stock} left
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setViewProduct(product)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                      View
                    </button>
                    
                    <button onClick={() => handleEdit(product)} className="p-3 hover:bg-zinc-800 rounded-xl text-blue-400">
                      <Edit2 size={18} />
                    </button>
                    
                    <button onClick={() => handleDelete(product.id)} className="p-3 hover:bg-red-950 text-red-400 rounded-xl">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Product Details</h3>
              <button onClick={() => setViewProduct(null)} className="text-zinc-400 hover:text-white text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              {viewProduct.imageUrl && (
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Product Image</label>
                  <img src={viewProduct.imageUrl} alt={viewProduct.name} className="w-full max-w-md h-64 object-cover rounded-xl" />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Product Name</label>
                  <div className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-white">{viewProduct.name}</div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Category</label>
                  <div className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-white">{viewProduct.category}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Price (LKR)</label>
                  <div className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-white">{viewProduct.price}</div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Stock</label>
                  <div className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-white">{viewProduct.stock}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Description</label>
                <div className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-white min-h-[80px] whitespace-pre-wrap">{viewProduct.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Colors</label>
                  <div className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-white">
                    {viewProduct.colors?.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {viewProduct.colors.map((color, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-zinc-600" style={{ background: color }} />
                            <span className="text-xs">{color}</span>
                          </div>
                        ))}
                      </div>
                    ) : 'No colors specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Sizes</label>
                  <div className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 text-white">
                    {viewProduct.sizes?.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {viewProduct.sizes.map((size, i) => (
                          <span key={i} className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs">
                            {size}
                          </span>
                        ))}
                      </div>
                    ) : 'No sizes specified'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-6">
              <button onClick={() => setViewProduct(null)} className="flex-1 py-4 border border-zinc-700 rounded-2xl hover:bg-zinc-800">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}