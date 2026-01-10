import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Map, Users, List, Trash2, Ban, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('logistics');

    if (!user || (user.role !== 'admin' && user.type !== 'admin' && user.email !== 'mal4crypt404@gmail.com')) {
        return (
            <div className="container mt-md text-center p-md">
                <Card>
                    <h2 className="text-danger font-bold mb-sm">Access Denied</h2>
                    <p className="text-secondary mb-md">You do not have permission to view this page.</p>
                    <Button onClick={() => navigate('/login')}>Login as Admin</Button>
                </Card>
            </div>
        );
    }

    // Architecture for Tabs
    const renderTabContent = () => {
        switch (activeTab) {
            case 'logistics': return <LogisticsView />;
            case 'users': return <UserModeration />;
            case 'categories': return <CategoryManagement />;
            default: return <LogisticsView />;
        }
    };

    return (
        <div className="container mt-md">
            <h1 className="text-primary-blue font-bold mb-md text-2xl" style={{ fontSize: '24px' }}>Admin Dashboard</h1>

            <div className="grid gap-md" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
                {/* Sidebar Nav */}
                <Card className="h-fit">
                    <div className="flex flex-col gap-sm">
                        <NavButton
                            active={activeTab === 'logistics'}
                            onClick={() => setActiveTab('logistics')}
                            icon={<Map size={18} />}
                            label="Logistics Tracker"
                        />
                        <NavButton
                            active={activeTab === 'users'}
                            onClick={() => setActiveTab('users')}
                            icon={<Users size={18} />}
                            label="User Moderation"
                        />
                        <NavButton
                            active={activeTab === 'categories'}
                            onClick={() => setActiveTab('categories')}
                            icon={<List size={18} />}
                            label="Categories"
                        />
                    </div>
                </Card>

                {/* Content Area */}
                <div className="h-full">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

// --- Sub Components ---

const NavButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-sm p-sm rounded-md w-full text-left transition-colors ${active ? 'bg-primary text-white' : 'text-secondary hover:bg-light'}`}
        style={{
            backgroundColor: active ? 'var(--primary-blue)' : 'transparent',
            color: active ? 'white' : 'var(--text-secondary)',
            padding: '10px'
        }}
    >
        {icon}
        <span className="font-bold">{label}</span>
    </button>
);

const LogisticsView = () => (
    <Card>
        <div className="flex justify-between items-center mb-md">
            <h2 className="font-bold">Live Logistics Tracker</h2>
            <span className="text-sm text-success flex items-center gap-xs">● Live Updates</span>
        </div>

        {/* Map Placeholder */}
        <div style={{ height: '400px', background: '#e1e3e8', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
            {/* Fake Map Grid */}
            <div style={{
                backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                width: '100%',
                height: '100%',
                opacity: 0.3
            }}></div>

            <div style={{ position: 'absolute', top: '30%', left: '40%', textAlign: 'center' }}>
                <MapPin color="var(--primary-blue)" size={32} fill="var(--secondary-blue)" />
                <div className="bg-white px-2 py-1 rounded shadow-sm text-xs font-bold mt-1">Driver: John</div>
            </div>

            <div style={{ position: 'absolute', top: '60%', left: '70%', textAlign: 'center' }}>
                <MapPin color="var(--danger)" size={32} fill="#ffccc7" />
                <div className="bg-white px-2 py-1 rounded shadow-sm text-xs font-bold mt-1">Delivery #842</div>
            </div>

            <div className="absolute bottom-4 right-4 bg-white p-sm rounded shadow-md">
                <div className="text-xs font-bold mb-xs">Logistics Legend</div>
                <div className="flex items-center gap-xs text-xs mb-1"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'blue' }}></span> Active Drivers</div>
                <div className="flex items-center gap-xs text-xs"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'red' }}></span> Pending Pickups</div>
            </div>
        </div>
    </Card>
);

const UserModeration = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                if (action === 'delete') {
                    const { error } = await supabase.from('profiles').delete().eq('id', id);
                    if (error) throw error;
                    setUsers(users.filter(u => u.id !== id));
                } else if (action === 'suspend') {
                    // Suspended logic placeholder
                    alert('User suspended (placeholder)');
                }
            } catch (err) {
                alert('Action failed: ' + err.message);
            }
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-md">
                <h2 className="font-bold">User Moderation</h2>
                {loading && <span className="text-secondary text-sm">Loading users...</span>}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr className="text-left text-secondary border-b border-color">
                        <th className="p-sm">User</th>
                        <th className="p-sm">Role</th>
                        <th className="p-sm">Location</th>
                        <th className="p-sm text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading && users.length === 0 && (
                        <tr><td colSpan="4" className="text-center p-md text-secondary">No users found.</td></tr>
                    )}
                    {users.map(u => (
                        <tr key={u.id} className="border-b border-color">
                            <td className="p-sm">
                                <div className="font-bold">{u.full_name || 'N/A'}</div>
                                <div className="text-xs text-secondary">{u.id}</div>
                            </td>
                            <td className="p-sm capitalize">{u.role}</td>
                            <td className="p-sm text-sm">{u.city}, {u.state}</td>
                            <td className="p-sm text-right">
                                <div className="flex justify-end gap-sm">
                                    <Button variant="ghost" size="sm" onClick={() => handleAction(u.id, 'suspend')} title="Suspend">
                                        <Ban size={16} color="var(--warning)" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleAction(u.id, 'delete')} title="Delete">
                                        <Trash2 size={16} color="var(--danger)" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCat, setNewCat] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchCategoriesSafe = async () => {
            setLoading(true);
            try {
                // Timebox the request to 5 seconds
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timed out')), 5000)
                );

                const { data, error } = await Promise.race([
                    supabase.from('categories').select('*').order('created_at', { ascending: true }),
                    timeoutPromise
                ]);

                if (!mounted) return;

                if (error) {
                    console.error('Error fetching categories:', error);
                    // Don't clear categories if we have error, just show empty state or previous state
                    // But here we init with empty array so it is fine
                    setCategories([]);
                } else {
                    setCategories(data || []);
                }
            } catch (err) {
                console.error('Category fetch error:', err);
                if (mounted) setCategories([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchCategoriesSafe();

        return () => { mounted = false; };
    }, []);

    const addCategory = async (e) => {
        e.preventDefault();
        if (newCat) {
            setLoading(true);
            try {
                const id = newCat.toLowerCase().replace(/\s+/g, '-');
                const { data, error } = await supabase
                    .from('categories')
                    .insert([{ id, label: newCat, icon_name: 'Box', color: '#A2C2F2' }])
                    .select();

                if (!error && data) {
                    setCategories([...categories, data[0]]);
                    setNewCat('');
                } else {
                    alert('Failed to add category. It might already exist.');
                }
            } catch (err) {
                console.error('Add error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const deleteCategory = async (id) => {
        if (confirm('Delete this category?')) {
            try {
                const { error } = await supabase.from('categories').delete().eq('id', id);
                if (!error) {
                    setCategories(categories.filter(c => c.id !== id));
                } else {
                    alert('Failed to delete.');
                }
            } catch (err) {
                console.error('Delete error:', err);
            }
        }
    };

    return (
        <Card>
            <h2 className="font-bold mb-md">Manage Categories</h2>

            <form onSubmit={addCategory} className="flex gap-sm mb-md">
                <Input
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="New Category Name"
                    containerClass="flex-1 mb-0" // override
                    style={{ marginBottom: 0 }}
                />
                <Button type="submit" isLoading={loading}>Add Category</Button>
            </form>

            {loading && categories.length === 0 ? (
                <div className="p-md text-center text-secondary">Loading categories...</div>
            ) : (
                <div className="flex flex-col gap-sm">
                    {categories.length === 0 && <p className="text-secondary text-center p-sm">No categories found.</p>}
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex justify-between items-center p-sm bg-light rounded-md">
                            <div className="flex items-center gap-sm">
                                <span style={{ width: 12, height: 12, background: cat.color, borderRadius: '50%' }}></span>
                                <span className="font-bold">{cat.label}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteCategory(cat.id)}>
                                <Trash2 size={16} color="var(--text-secondary)" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default AdminDashboard;
