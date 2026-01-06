import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { MapPin, Phone, Mail, Star, Share2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find product from shared mock data
    const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];

    const contactWhatsApp = () => {
        window.open(`https://wa.me/${product.seller.phone}?text=Hi, I am interested in your ${product.title} on Vendora`, '_blank');
    };

    const contactEmail = () => {
        window.location.href = `mailto:${product.seller.email}?subject=Inquiry about ${product.title}`;
    };

    return (
        <div className="pb-md">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-sm">← Back</Button>

            <div className="grid gap-md" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Main Info */}
                <div className="flex flex-col gap-md">
                    <Card padding="none" style={{ overflow: 'hidden' }}>
                        <img src={product.image} alt={product.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                    </Card>

                    <Card>
                        <div className="flex justify-between items-start mb-sm">
                            <h1 className="font-bold text-xl">{product.title}</h1>
                            <Button variant="ghost" size="sm"><Share2 size={18} /></Button>
                        </div>
                        <div className="text-primary-blue font-bold text-xl mb-sm">₦{product.price}</div>
                        <div className="flex items-center gap-xs text-secondary mb-md">
                            <MapPin size={16} /> {product.location}
                        </div>

                        <h3 className="font-bold mb-sm border-b border-color pb-xs">Description</h3>
                        <p className="text-secondary leading-relaxed">{product.description}</p>
                    </Card>

                    {/* Comments / Social Proof */}
                    <Card>
                        <h3 className="font-bold mb-md">Reviews ({product.reviews.length})</h3>
                        <div className="flex flex-col gap-md">
                            {product.reviews.map((review, idx) => (
                                <div key={idx} className="border-b border-color pb-sm last:border-0 last:pb-0">
                                    <div className="flex justify-between mb-xs">
                                        <span className="font-bold">{review.user}</span>
                                        <span className="text-warning text-sm">{'★'.repeat(review.rating)}</span>
                                    </div>
                                    <p className="text-sm text-secondary">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-md pt-md border-t border-color text-center">
                            <Button variant="outline">Write a Review</Button>
                        </div>
                    </Card>
                </div>

                {/* Sidebar / Seller Info */}
                <div className="flex flex-col gap-md">
                    <Card>
                        <h3 className="font-bold mb-md text-center">Seller Contact</h3>
                        <div className="flex flex-col items-center gap-sm mb-md">
                            <div style={{ width: 64, height: 64, background: '#e1e1e1', borderRadius: '50%' }}></div>
                            <div className="font-bold">{product.seller.name}</div>
                            <div className="text-xs text-secondary">Member since {product.seller.joined}</div>
                        </div>

                        <div className="flex flex-col gap-sm">
                            <Button onClick={contactWhatsApp} style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}>
                                <Phone size={18} /> WhatsApp
                            </Button>
                            <Button variant="outline" onClick={contactEmail}>
                                <Mail size={18} /> Email Seller
                            </Button>
                            <Button variant="secondary">Show Phone Number</Button>
                        </div>
                    </Card>

                    <Card className="bg-light border-0">
                        <div className="text-center">
                            <h4 className="font-bold mb-xs">Safety Tip</h4>
                            <p className="text-xs text-secondary">
                                Don't pay in advance, including for delivery. Meet the seller at a safe public place.
                            </p>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;
