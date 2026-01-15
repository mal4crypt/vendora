import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, ChevronDown, Utensils, Wrench, Smartphone, Truck, Home as HomeIcon, Dog, Droplet, Briefcase } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import ProductCard from '../components/marketplace/ProductCard';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { CacheService } from '../services/cache';

// Categories are now loaded dynamically from Supabase
// Icons map for dynamic rendering
const ICON_MAP = {
    'Briefcase': <Briefcase size={20} />,
    'Smartphone': <Smartphone size={20} />,
    'Utensils': <Utensils size={20} />,
    'Wrench': <Wrench size={20} />,
    'Droplet': <Droplet size={20} />,
    'Truck': <Truck size={20} />,
    'Home': <HomeIcon size={20} />,
    'Dog': <Dog size={20} />,
    'Home': <HomeIcon size={20} />,
    'Dog': <Dog size={20} />,
    'Box': <Filter size={20} />, // Default
    'Diamond': <div style={{ fontSize: '20px' }}>💎</div> // For Premium
};

const CITIES = ['Lagos, Nigeria', 'Abuja, FCT', 'Port Harcourt, Rivers', 'Kano, Kano', 'Ibadan, Oyo'];

const Home = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [categories, setCategories] = useState([]); // Dynamic categories
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState(CITIES[0]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all, trading, services

    useEffect(() => {
        const fetchProducts = async () => {
            // 1. Try to load from cache first for instant UI
            const cachedProducts = CacheService.get('products');
            if (cachedProducts) {
                setProducts(cachedProducts);
                setLoading(false); // Valid cache found, stop loading spinner
            } else {
                setLoading(true); // No cache, show spinner
            }

            // Fetch Categories (Parallel) with manual fallback
            const fetchCategories = async () => {
                try {
                    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
                    if (error) throw error;
                    if (data) {
                        const premiumCategory = {
                            id: 'premium', label: 'Premium', icon_name: 'Diamond', color: '#FFAB00'
                        };
                        setCategories([premiumCategory, ...data]);
                    }
                } catch (err) {
                    console.warn('Using default categories due to fetch error');
                    // FALLBACK: Use hardcoded categories if DB fails
                    const defaultCats = [
                        { id: 'premium', label: 'Premium', icon_name: 'Diamond', color: '#FFAB00' },
                        { id: 'trading', label: 'Trading', icon_name: 'Smartphone', color: '#A2C2F2' },
                        { id: 'catering', label: 'Catering', icon_name: 'Utensils', color: '#A2C2F2' },
                        { id: 'repair', label: 'Repair', icon_name: 'Wrench', color: '#A2C2F2' },
                        { id: 'logistics', label: 'Logistics', icon_name: 'Truck', color: '#A2C2F2' }
                    ];
                    setCategories(defaultCats);
                }
            };
            fetchCategories();

            // 2. Network fetch (background update)
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data && data.length > 0) {
                    setProducts(data);
                    // 3. Update cache with fresh data
                    CacheService.set('products', data, 30); // Cache for 30 minutes
                }
            } catch (err) {
                console.error('Error fetching products from Supabase:', err);
                // If network fails and we have cache, user still sees content!
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Dynamic Greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const capitalizeName = (name) => {
        if (!name) return '';
        return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const filteredProducts = products.filter(p => {
        let matchesCategory = true;

        if (activeCategory === 'premium') {
            matchesCategory = p.is_premium === true || p.isPremium === true; // Handle both DB (snake_case) and Mock (camelCase)
        } else {
            matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        }

        const matchesFilter = filterType === 'all' || p.category === filterType;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesFilter && matchesSearch;
    });

    return (
        <div className="pb-md">
            {/* Greeting & Location Bar */}
            <div className="flex justify-between items-center mb-md" style={{ marginBottom: '16px' }}>
                <div>
                    <h2 className="font-bold" style={{ fontSize: '24px' }}>
                        {getGreeting()}{user ? `, ${capitalizeName(user?.full_name || user?.email?.split('@')[0]) || 'Member'}` : ''}
                    </h2>
                </div>

                {/* Location Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                        className="flex items-center gap-xs p-sm bg-light rounded-md hover:shadow-sm transition-all"
                        style={{ padding: '8px 12px', background: 'var(--bg-light)', border: '1px solid var(--border-color)' }}
                    >
                        <MapPin size={16} color="var(--primary-blue)" />
                        <span className="text-sm font-medium">{selectedCity}</span>
                        <ChevronDown size={16} />
                    </button>

                    {showLocationDropdown && (
                        <div
                            className="absolute right-0 mt-sm bg-white shadow-md rounded-md p-sm"
                            style={{
                                minWidth: '200px',
                                zIndex: 10,
                                border: '1px solid var(--border-color)',
                                marginTop: '4px'
                            }}
                        >
                            {CITIES.map(city => (
                                <button
                                    key={city}
                                    onClick={() => {
                                        setSelectedCity(city);
                                        setShowLocationDropdown(false);
                                    }}
                                    className="w-full text-left p-sm hover:bg-light rounded-md transition-colors"
                                    style={{
                                        background: city === selectedCity ? 'var(--bg-light)' : 'transparent',
                                        padding: '8px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Search Bar with Filter */}
            <div className="bg-white p-md rounded-md shadow-sm mb-md flex gap-md items-center" style={{ borderRadius: '24px' }}>
                <div className="flex-1 relative flex items-center" style={{ position: 'relative' }}>
                    <Search className="absolute text-secondary" style={{ left: '16px' }} size={20} />
                    <input
                        placeholder="I am looking for..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 48px',
                            border: 'none',
                            outline: 'none',
                            fontSize: '16px',
                            background: 'transparent'
                        }}
                    />

                    {/* Filter Icon with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            style={{
                                padding: '8px',
                                background: 'var(--primary-blue)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <Filter size={18} color="white" />
                        </button>

                        {showFilterDropdown && (
                            <div
                                className="absolute right-0 mt-sm bg-white shadow-md rounded-md p-sm"
                                style={{
                                    minWidth: '150px',
                                    zIndex: 10,
                                    border: '1px solid var(--border-color)',
                                    marginTop: '4px'
                                }}
                            >
                                {['all', 'trading', 'services'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setFilterType(type);
                                            setShowFilterDropdown(false);
                                        }}
                                        className="w-full text-left p-sm hover:bg-light rounded-md transition-colors capitalize"
                                        style={{
                                            background: type === filterType ? 'var(--bg-light)' : 'transparent',
                                            padding: '8px',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {type === 'all' ? 'All Items' : type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Bubbles */}
            <div className="flex gap-md mb-md overflow-x-auto pb-sm" style={{ gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className="flex flex-col items-center gap-xs flex-shrink-0 transition-all"
                        style={{
                            minWidth: '80px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer'
                        }}
                    >
                        <div
                            className="flex items-center justify-center transition-all"
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                border: `2px solid ${activeCategory === cat.id ? 'var(--primary-blue)' : cat.color || '#A2C2F2'}`,
                                background: activeCategory === cat.id ? 'var(--primary-blue)' : 'white',
                                color: activeCategory === cat.id ? 'white' : cat.color || '#A2C2F2',
                                transition: 'all 0.2s'
                            }}
                        >
                            {ICON_MAP[cat.icon_name] || ICON_MAP['Box']}
                        </div>
                        <span className="text-xs font-medium text-center">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Premium Banner */}
            <div className="bg-gradient p-md rounded-md text-white flex justify-between items-center mb-md" style={{ background: 'linear-gradient(135deg, #0052CC 0%, #A2C2F2 100%)', padding: '24px', borderRadius: '12px' }}>
                <div>
                    <h2 className="font-bold text-xl mb-sm">Premium Listings</h2>
                    <p>Boost your sales by 10x today!</p>
                </div>
                <Button variant="secondary">Promote Now</Button>
            </div>

            {/* Product Grid */}
            <div className="flex justify-between items-center mb-md">
                <h2 className="font-bold text-lg">{activeCategory === 'all' ? 'Trending Ads' : `${categories.find(c => c.id === activeCategory)?.label} Results`}</h2>
                {loading && <span className="text-secondary text-sm">Loading...</span>}
            </div>

            <div className="grid-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {!loading && filteredProducts.length === 0 && (
                <div className="text-center p-xl text-secondary">
                    No products found in this category.
                </div>
            )}
        </div>
    );
};

export default Home;
