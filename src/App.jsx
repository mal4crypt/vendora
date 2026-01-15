import React, { useState } from 'react'; // Add useState
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CustomerProfile from './pages/CustomerProfile';
import { ShoppingCart, LogOut, User, ChevronDown, Package, Heart } from 'lucide-react'; // Add Icons
import './index.css';

const Header = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const cartCount = getCartCount();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Close menu first
    setShowUserMenu(false);
    // 2. Clear critical storage immediately
    localStorage.removeItem('sb-vbdnxwstnshjsws-auth-token'); // Clear Supabase token if known prefix
    sessionStorage.clear();
    // 3. Call context logout which has the window.location.href
    logout();
  };

  return (
    <header className="bg-white shadow-sm p-md flex justify-between items-center sticky top-0 z-50" style={{ zIndex: 100 }}>
      <Link to="/" className="logo-text no-underline">Vendora</Link>
      <nav className="flex gap-md items-center">
        <Link to="/" className="hover:text-primary-blue font-medium">Home</Link>
        {(user?.role === 'admin' || user?.email === 'mal4crypt404@gmail.com') && (
          <Link to="/admin" className="hover:text-primary-blue font-medium" style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>Admin</Link>
        )}
        <Link to="/seller" className="hover:text-primary-blue font-medium">Sell</Link>
        <Link to="/cart" className="relative hover:text-primary-blue font-medium flex items-center gap-xs">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'var(--primary-blue)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-xs text-sm font-bold text-primary-gray bg-light px-sm py-xs rounded-md capitalize hover:bg-white border border-transparent hover:border-color transition-all cursor-pointer"
            >
              <User size={16} />
              {user?.role === 'admin' ? 'Admin' : (user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User')}
              <ChevronDown size={14} className="text-secondary" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-xs bg-white shadow-lg rounded-md overflow-hidden border border-color" style={{ minWidth: '180px', top: '100%', zIndex: 100 }}>
                <div className="p-sm border-b border-light">
                  <div className="font-bold text-sm truncate">{user?.full_name || 'User'}</div>
                  <div className="text-xs text-secondary truncate">{user?.email}</div>
                </div>

                <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-sm p-sm hover:bg-light text-sm transition-colors block">
                  <User size={16} className="text-primary-blue" />
                  My Profile
                </Link>
                <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-sm p-sm hover:bg-light text-sm transition-colors block">
                  <Heart size={16} className="text-danger" />
                  My Wishlist
                </Link>
                <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-sm p-sm hover:bg-light text-sm transition-colors block">
                  <Package size={16} className="text-success" />
                  My Orders
                </Link>
                {(user?.role === 'admin' || user?.email === 'mal4crypt404@gmail.com') && (
                  <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-sm p-sm hover:bg-light text-sm transition-colors block text-primary-blue font-bold">
                    Admin Dashboard
                  </Link>
                )}
                <div className="border-t border-light p-xs">
                  <button onClick={handleLogout} className="flex items-center gap-sm p-sm w-full text-left hover:bg-danger-light text-danger text-sm rounded-sm transition-colors">
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 rounded-md bg-light hover:bg-white border border-transparent hover:border-color transition-all">Sign In</Link>
        )}
      </nav>
    </header>
  );
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Vendora...</div>;
  }

  return (
    <div className="app-container">
      <Header />
      <main className="container mt-md">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
