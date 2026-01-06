
import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, ShoppingCart as CartIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

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
                <button style={{ position: 'absolute', top: '8px', right: '8px', background: 'white', borderRadius: '50%', padding: '6px' }}>
                    <Heart size={16} color="var(--text-secondary)" />
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
