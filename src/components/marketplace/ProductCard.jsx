
import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, ShoppingCart as CartIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../supabase';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const { user } = useAuth();
    const [isLiked, setIsLiked] = React.useState(false);

    // Check DB status on mount
    React.useEffect(() => {
        if (user) {
            checkWishlistStatus();
        } else {
            // Fallback for guests
            const saved = localStorage.getItem('vendora_wishlist');
            if (saved) {
                setIsLiked(JSON.parse(saved).includes(product.id));
            }
        }
    }, [user, product.id]);

    const checkWishlistStatus = async () => {
        const { data } = await supabase
            .from('wishlist')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', product.id)
            .maybeSingle(); // Use maybeSingle to avoid 406 error if not found
        if (data) setIsLiked(true);
    };

    const toggleLike = async (e) => {
        e.stopPropagation();

        if (!user) {
            // Guest Logic (LocalStorage)
            const saved = localStorage.getItem('vendora_wishlist');
            let wishlist = saved ? JSON.parse(saved) : [];
            if (isLiked) {
                wishlist = wishlist.filter(id => id !== product.id);
            } else {
                wishlist.push(product.id);
            }
            localStorage.setItem('vendora_wishlist', JSON.stringify(wishlist));
            setIsLiked(!isLiked);
            alert('Please login to save your wishlist permanently!');
            return;
        }

        // Auth User Logic (Database)
        if (isLiked) {
            const { error } = await supabase
                .from('wishlist')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', product.id);
            if (!error) setIsLiked(false);
        } else {
            const { error } = await supabase
                .from('wishlist')
                .insert([{ user_id: user.id, product_id: product.id }]);
            if (!error) setIsLiked(true);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Card className="flex flex-col gap-sm hover:shadow-md transition-all cursor-pointer" padding="xs" style={{ height: '100%' }} onClick={() => navigate(`/product/${product.id}`)}>
            <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                <img
                    src={product.image || 'https://via.placeholder.com/300?text=No+Image'}
                    alt={product.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {product.isPremium && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#FFAB00', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                        PREMIUM
                    </div>
                )}
                <button
                    onClick={toggleLike}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'white', borderRadius: '50%', padding: '6px', border: 'none', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                >
                    <Heart size={16} color={isLiked ? "#FF5630" : "var(--text-secondary)"} fill={isLiked ? "#FF5630" : "none"} />
                </button>
            </div>

            <div className="p-sm flex flex-col gap-xs" style={{ flex: 1 }}>
                <h3 className="font-bold text-md" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</h3>
                <div className="text-primary-blue font-bold">₦{product.price}</div>
                <div className="flex items-center gap-xs text-secondary text-sm wrap">
                    <MapPin size={12} />
                    <span style={{ fontSize: '12px' }}>{product.location}</span>
                </div>

                {/* Rating Mock */}
                <div className="flex items-center gap-xs mt-auto">
                    <span style={{ color: '#FFAB00', fontSize: '12px' }}>★ {product.rating}</span>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>({product.reviews?.length || 0} reviews)</span>
                </div>

                <Button
                    onClick={handleAddToCart}
                    size="sm"
                    style={{ marginTop: '8px', width: '100%' }}
                >
                    <CartIcon size={14} /> Add to Cart
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
