import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth 
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// User 
import Home          from './pages/user/Home';
import Products      from './pages/user/Product';
import Category      from './pages/user/Category';
import ProductDetail from './pages/user/ProductDetail';
import Checkout      from './pages/user/Checkout';
import Profile       from './pages/user/Profile';
import MyOrders      from './pages/user/MyOrders';
import OrderDetail   from './pages/user/OrderDetail';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';

/*  Route Guards  */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'32px', height:'32px', borderRadius:'50%', border:'2px solid var(--surface-high)', borderTopColor:'var(--leaf)', animation:'spin 0.8s linear infinite' }} />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user)         return <Navigate to="/login"  replace />;
  if (!user.isAdmin) return <Navigate to="/"       replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.isAdmin ? '/admin' : '/'} replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/*  Public  */}
          <Route path="/"          element={<Home />} />
          <Route path="/products"  element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category"  element={<Category />} />

          {/*  Auth  */}
          <Route path="/login"    element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/*  User Protected  */}
          <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders"   element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          {/*  Admin Protected  */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index              element={<Dashboard />} />
            <Route path="products"   element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders"     element={<AdminOrders />} />
            <Route path="users"      element={<AdminUsers />} />
          </Route>

          {/*  Fallback  */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;