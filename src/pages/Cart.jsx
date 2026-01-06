import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
                <ShoppingBag size={64} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
                <h2 className="font-bold text-xl mb-sm text-secondary">Your cart is empty</h2>
                <p className="text-secondary mb-md">Browse products and add items to your cart</p>
                <Button onClick={() => navigate('/')}>Continue Shopping</Button>
            </div>
        );
    }

    const formatPrice = (price) => {
        const num = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;
        return num.toLocaleString();
    };

    return (
        <div className="pb-md">
            <div className="flex justify-between items-center mb-md">
                <h1 className="text-primary-blue font-bold" style={{ fontSize: '28px' }}>Shopping Cart</h1>
                <Button variant="ghost" onClick={() => navigate('/')}>Continue Shopping</Button>
            </div>

            <div className="grid gap-md" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Cart Items */}
                <div className="flex flex-col gap-md">
                    {cartItems.map(item => (
                        <Card key={item.id} className="flex gap-md items-center">
                            <div style={{ width: '100px', height: '100px', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
                                <img
                                    src={item.image || 'https://via.placeholder.com/100'}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 className="font-bold">{item.title}</h3>
                                <div className="text-secondary text-sm">{item.location}</div>
                                <div className="font-bold text-primary-blue mt-sm">₦{formatPrice(item.price)}</div>
                            </div>

                            <div className="flex items-center gap-sm">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    style={{ padding: '4px', background: 'var(--bg-light)', borderRadius: '4px' }}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold" style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    style={{ padding: '4px', background: 'var(--bg-light)', borderRadius: '4px' }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <Button variant="ghost" onClick={() => removeFromCart(item.id)}>
                                <Trash2 size={18} color="var(--danger)" />
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="h-fit">
                    <Card>
                        <h3 className="font-bold mb-md">Order Summary</h3>

                        <div className="flex justify-between mb-sm text-secondary">
                            <span>Subtotal</span>
                            <span>₦{formatPrice(getCartTotal())}</span>
                        </div>
                        <div className="flex justify-between mb-sm text-secondary">
                            <span>Delivery Fee</span>
                            <span>₦2,000</span>
                        </div>

                        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                        <div className="flex justify-between mb-md font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary-blue">₦{formatPrice(getCartTotal() + 2000)}</span>
                        </div>

                        <Button size="full" className="mb-sm">Proceed to Checkout</Button>
                        <Button variant="outline" size="full" onClick={clearCart}>Clear Cart</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Cart;
