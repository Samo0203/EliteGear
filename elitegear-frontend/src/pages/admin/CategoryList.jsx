import { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';
import { Plus, Edit2, Trash2, Package, Home, Activity } from 'lucide-react';

const categoryIcons = {
  'INDOOR': Home,
  'OUTDOOR': Activity,
  'default': Package
};

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    type: 'INDOOR'
  });

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, formData);
        alert('Category updated successfully!');
      } else {
        await categoryAPI.create(formData);
        alert('Category created successfully!');
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        type: 'INDOOR'
      });
      fetchCategories();
    } catch (err) {
      console.error('Operation failed:', err);
      alert('Operation failed. Please try again.');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData(category);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"? This action cannot be undone.`)) {
      try {
        await categoryAPI.delete(id);
        alert('Category deleted successfully!');
        fetchCategories();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const getTypeColor = (type) => {
    return type === 'INDOOR' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20';
  };

  if (loading) return <div className="text-center py-20 text-xl">Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Categories Management</h2>
        <button
          onClick={() => { setShowForm(true); setEditingCategory(null); }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-2xl font-medium transition-colors"
        >
          <Plus size={20} /> Add New Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 focus:border-orange-500 focus:outline-none"
                  placeholder="e.g., Cricket, Football, Tennis"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 h-24 focus:border-orange-500 focus:outline-none resize-none"
                  placeholder="Brief description of the category"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Category Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 focus:border-orange-500 focus:outline-none"
                >
                  <option value="INDOOR">Indoor Sports</option>
                  <option value="OUTDOOR">Outdoor Sports</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 focus:border-orange-500 focus:outline-none"
                  placeholder="https://example.com/category-image.jpg"
                />
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-xl border-2 border-zinc-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => { 
                    setShowForm(false); 
                    setEditingCategory(null); 
                    setFormData({ name: '', description: '', imageUrl: '', type: 'INDOOR' });
                  }}
                  className="flex-1 py-4 border border-zinc-700 rounded-2xl hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl font-semibold transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400 text-lg">No categories found</p>
          <p className="text-zinc-500 mt-2">Create your first category to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => {
            const IconComponent = categoryIcons[category.type] || categoryIcons.default;
            return (
              <div key={category.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${getTypeColor(category.type)}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-zinc-800 rounded-xl text-blue-400 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-2 hover:bg-red-950 text-red-400 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  {category.imageUrl && (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-xl mb-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2">{category.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(category.type)}`}>
                    {category.type}
                  </span>
                  <span className="text-zinc-500 text-xs">ID: {category.id.substring(0, 8)}...</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
