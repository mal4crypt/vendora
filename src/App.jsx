import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import { ShoppingCart } from 'lucide-react';
import './index.css';

const Header = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="bg-white shadow-sm p-md flex justify-between items-center sticky top-0 z-50" style={{ zIndex: 100 }}>
      <Link to="/" className="text-primary-blue font-bold no-underline" style={{ fontSize: '24px' }}>Vendora</Link>
      <nav className="flex gap-md items-center">
        <Link to="/" className="hover:text-primary-blue font-medium">Home</Link>
        <Link to="/seller" className="hover:text-primary-blue font-medium">Sell on Vendora</Link>
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
        <Link to="/login" className="px-4 py-2 rounded-md bg-light hover:bg-white border border-transparent hover:border-color transition-all">Sign In</Link>
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Header />
            <main className="container mt-md">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
