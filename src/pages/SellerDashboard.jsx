import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const SellerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'trading', // trading | services
        price: '',
        description: '',
        location: user?.city ? `${user.city}, ${user.state}` : '',
        image_url: ''
    });

    useEffect(() => {
        if (user) {
            fetchSellerListings();
        }
    }, [user]);

    const fetchSellerListings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (err) {
            console.error('Error fetching seller listings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePriceChange = (e) => {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        setFormData({ ...formData, price: val });
    };

    const calculateEarnings = (price) => {
        if (!price) return 0;
        const num = parseFloat(price);
        return (num * 0.9).toFixed(2); // 10% commission
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const { data, error } = await supabase
                .from('products')
                .insert([
                    {
                        ...formData,
                        price: parseFloat(formData.price),
                        seller_id: user.id
                    }
                ])
                .select();

            if (error) throw error;

            setItems([data[0], ...items]);
            setShowForm(false);
            setFormData({
                title: '',
                category: 'trading',
                price: '',
                description: '',
                location: user?.city ? `${user.city}, ${user.state}` : '',
                image_url: ''
            });
        } catch (err) {
            setError(err.message || 'Failed to post listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user || user.role !== 'seller') {
        return (
            <div className="container mt-md text-center p-md">
                <Card>
                    <h2 className="text-primary-blue font-bold mb-sm">Seller Access Required</h2>
                    <p className="text-secondary mb-md">Please log in with a seller account to manage your listings.</p>
                    <Button onClick={() => navigate('/login')}>Login as Seller</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mt-md pb-md" style={{ paddingBottom: '40px' }}>
            <header className="flex justify-between items-center mb-md">
                <div>
                    <h1 className="text-primary-blue font-bold" style={{ fontSize: '28px' }}>Seller Dashboard</h1>
                    <p className="text-secondary">Welcome, {user.full_name || user.email}</p>
                </div>
                <div className="flex gap-sm">
                    <Button variant="outline" onClick={() => navigate('/')}>View Marketplace</Button>
                    <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
                </div>
            </header>

            <div className="grid gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

                {/* Main Content: Listings */}
                <div className="flex flex-col gap-md">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold" style={{ fontSize: '20px' }}>Your Listings</h2>
                        <Button onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Cancel' : '+ Add New Listing'}
                        </Button>
                    </div>

                    {showForm && (
                        <Card className="mb-md">
                            <h3 className="font-bold mb-md text-primary-blue">Create New Listing</h3>
                            {error && <div className="p-sm bg-light text-danger mb-md rounded-md text-sm">{error}</div>}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
                                <div className="flex gap-md">
                                    <div style={{ flex: 1 }}>
                                        <Input label="Item Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. iPhone 13 Pro" />
                                    </div>
                                    <div className="flex flex-col gap-sm" style={{ flex: 1 }}>
                                        <label className="text-sm font-bold text-secondary">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                        >
                                            <option value="trading">Trading (Goods)</option>
                                            <option value="services">Services</option>
                                            <option value="catering">Catering</option>
                                            <option value="repair">Repair</option>
                                        </select>
                                    </div>
                                </div>

                                <Input label="Image URL" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />

                                <div className="flex gap-md">
                                    <div style={{ flex: 1 }}>
                                        <Input label="Price (₦)" name="price" value={formData.price} onChange={handlePriceChange} required placeholder="0.00" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Input label="Location (City, State)" name="location" value={formData.location} onChange={handleChange} required />
                                    </div>
                                </div>

                                {/* Earnings Calculator */}
                                {formData.price && (
                                    <div className="bg-light p-md rounded-md flex items-center gap-sm mb-sm" style={{ border: '1px solid var(--success)', background: '#E3FCEF' }}>
                                        <span className="font-bold text-success">💰 Earnings:</span>
                                        <span>Receive <strong>₦{calculateEarnings(formData.price)}</strong> (after 10% fees).</span>
                                    </div>
                                )}

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your item or service..."
                                    rows="4"
                                    className="rounded-md"
                                    style={{ padding: '10px', border: '1px solid var(--border-color)', width: '100%', fontFamily: 'inherit' }}
                                />

                                <Button type="submit" size="lg" className="mt-sm" isLoading={isSubmitting}>Post Listing</Button>
                            </form>
                        </Card>
                    )}

                    {isLoading ? (
                        <div className="text-center p-md">Loading your listings...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center p-md text-secondary bg-white rounded-md border border-color" style={{ borderStyle: 'dashed' }}>
                            No listings yet. Create your first listing to start selling!
                        </div>
                    ) : (
                        items.map(item => (
                            <Card key={item.id} className="flex gap-md items-center">
                                <div style={{ width: '80px', height: '80px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {(item.image_url || item.image) ? <img src={item.image_url || item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'No Img'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 className="font-bold">{item.title}</h3>
                                    <div className="text-secondary text-sm capitalize">{item.category} • {item.location}</div>
                                    <div className="font-bold text-primary-blue mt-sm">₦{item.price}</div>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="flex flex-col gap-md">
                    <Card>
                        <h3 className="font-bold mb-sm">Earnings</h3>
                        <div className="text-secondary text-sm mb-sm">Total Pending Payouts</div>
                        <div className="text-xl font-bold text-success">₦0.00</div>
                        <Button size="full" className="mt-md">Request Payout</Button>
                    </Card>

                    <Card>
                        <h3 className="font-bold mb-sm">Promote Listings</h3>
                        <p className="text-sm text-secondary mb-md">Boost your sales by featuring your items on the homepage.</p>
                        <Button variant="secondary" size="full">Go Premium</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
