import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import ProductCard from '../components/marketplace/ProductCard';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { Heart, Clock, Package } from 'lucide-react';

const CustomerProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('wishlist');
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'wishlist') {
            fetchWishlist();
        } else {
            fetchHistory();
        }
    }, [activeTab]);

    const fetchWishlist = async () => {
        setLoading(true);
        if (!user) { // Safety check
            setWishlistProducts([]);
            setLoading(false);
            return;
        }

        // 1. Get Wishlist IDs for this user
        const { data: wishlistData, error } = await supabase
            .from('wishlist')
            .select('product_id')
            .eq('user_id', user.id);

        if (wishlistData && wishlistData.length > 0) {
            const productIds = wishlistData.map(w => w.product_id);

            // 2. Fetch product details
            // Supabase 'in' query for array of IDs
            const { data: productsData } = await supabase
                .from('products')
                .select('*')
                .in('id', productIds);

            setWishlistProducts(productsData || []);
        } else {
            setWishlistProducts([]);
        }
        setLoading(false);
    };

    const fetchHistory = async () => {
        setLoading(true);
        if (!user) {
            setHistory([]);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) {
            // Transform for UI if needed, or use direct DB columns
            setHistory(data.map(order => ({
                id: order.id,
                date: new Date(order.created_at).toLocaleDateString(),
                total: order.total_amount,
                status: order.status,
                items: order.items ? order.items.map(i => i.title).join(', ') : 'Items'
            })));
        } else {
            console.error(error);
            setHistory([]);
        }
        setLoading(false);
    };

    return (
        <div className="container mt-md">
            <h1 className="text-primary-blue font-bold mb-md text-2xl">My Account</h1>

            <div className="flex gap-md mb-md">
                <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`flex items-center gap-xs px-md py-sm rounded-full transition-all ${activeTab === 'wishlist' ? 'bg-primary text-white' : 'bg-white text-secondary'}`}
                    style={{ background: activeTab === 'wishlist' ? 'var(--primary-blue)' : 'white', color: activeTab === 'wishlist' ? 'white' : 'var(--text-secondary)' }}
                >
                    <Heart size={18} fill={activeTab === 'wishlist' ? 'white' : 'none'} />
                    <span className="font-bold">Wishlist</span>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-xs px-md py-sm rounded-full transition-all ${activeTab === 'history' ? 'bg-primary text-white' : 'bg-white text-secondary'}`}
                    style={{ background: activeTab === 'history' ? 'var(--primary-blue)' : 'white', color: activeTab === 'history' ? 'white' : 'var(--text-secondary)' }}
                >
                    <Clock size={18} />
                    <span className="font-bold">Transaction History</span>
                </button>
            </div>

            {loading ? (
                <div className="p-xl text-center text-secondary">Loading...</div>
            ) : (
                <>
                    {activeTab === 'wishlist' && (
                        <div>
                            {wishlistProducts.length === 0 ? (
                                <div className="text-center p-xl text-secondary bg-white rounded-md">
                                    <Heart size={48} className="mx-auto mb-sm opacity-20" />
                                    <p>Your wishlist is empty.</p>
                                </div>
                            ) : (
                                <div className="grid-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                                    {wishlistProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <Card>
                            {history.length === 0 ? (
                                <div className="text-center p-md">No transactions yet.</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-color text-secondary text-sm">
                                            <th className="p-sm">Order ID</th>
                                            <th className="p-sm">Date</th>
                                            <th className="p-sm">Items</th>
                                            <th className="p-sm">Total (₦)</th>
                                            <th className="p-sm">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map(tx => (
                                            <tr key={tx.id} className="border-b border-color hover:bg-light">
                                                <td className="p-sm font-bold text-primary-blue">{tx.id}</td>
                                                <td className="p-sm text-sm">{tx.date}</td>
                                                <td className="p-sm text-sm max-w-xs truncate">{tx.items}</td>
                                                <td className="p-sm font-bold">{tx.total}</td>
                                                <td className="p-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'Delivered' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`}
                                                        style={{ background: tx.status === 'Delivered' ? '#e6fffa' : '#fffbe6', color: tx.status === 'Delivered' ? 'var(--success)' : 'var(--warning)' }}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default CustomerProfile;
