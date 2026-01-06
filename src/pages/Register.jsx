import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [accountType, setAccountType] = useState('customer'); // customer | seller
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        address: '', // city/state for seller
        contact: '',
        agreedToCommission: false
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await register(formData.email, formData.password, {
                name: formData.name,
                role: accountType,
                city: formData.address.split(',')[0].trim(),
                state: formData.address.split(',')[1]?.trim() || '',
                commission_agreed: formData.agreedToCommission
            });
            setIsLoading(false);
            navigate(accountType === 'seller' ? '/seller' : '/');
        } catch (err) {
            setError(err.message || 'Registration failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center mt-md" style={{ marginBottom: '40px' }}>
            <Card style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="text-center text-primary-blue font-bold mb-md" style={{ fontSize: '24px' }}>
                    Create Account
                </h2>

                {error && <div className="p-sm bg-light text-danger rounded-md text-sm text-center mb-md" style={{ backgroundColor: '#fff2f0', border: '1px solid #ffccc7', padding: '8px', marginBottom: '16px', color: 'var(--danger)' }}>{error}</div>}

                {/* Account Type Toggle */}
                <div className="flex justify-center bg-light p-1 rounded-md mb-md" style={{ background: '#F4F5F7', padding: '4px', borderRadius: '8px', marginBottom: '24px' }}>
                    <button
                        type="button"
                        onClick={() => setAccountType('customer')}
                        className={`flex-1 p-2 rounded-md font-bold transition-all ${accountType === 'customer' ? 'bg-white shadow-sm text-primary-blue' : 'text-secondary'}`}
                        style={{
                            backgroundColor: accountType === 'customer' ? 'white' : 'transparent',
                            color: accountType === 'customer' ? 'var(--primary-blue)' : '#6B778C',
                            border: 'none',
                            borderRadius: '6px'
                        }}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setAccountType('seller')}
                        className={`flex-1 p-2 rounded-md font-bold transition-all ${accountType === 'seller' ? 'bg-white shadow-sm text-primary-blue' : 'text-secondary'}`}
                        style={{
                            backgroundColor: accountType === 'seller' ? 'white' : 'transparent',
                            color: accountType === 'seller' ? 'var(--primary-blue)' : '#6B778C',
                            border: 'none',
                            borderRadius: '6px'
                        }}
                    >
                        Seller
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
                    <Input
                        label="Full Name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="user@vendora.com"
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />

                    <Input
                        label="Phone Contact"
                        name="contact"
                        required
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="+123 456 7890"
                    />

                    <Input
                        label={accountType === 'seller' ? "City & State (Location)" : "Delivery Address"}
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={accountType === 'seller' ? "Lagos, Nigeria" : "123 Street, City"}
                    />

                    {accountType === 'seller' && (
                        <div className="bg-light p-md rounded-md border border-color mb-md" style={{ padding: '16px', backgroundColor: '#ebf8ff', border: '1px solid #A2C2F2', borderRadius: '8px' }}>
                            <div className="flex items-start gap-sm">
                                <input
                                    type="checkbox"
                                    name="agreedToCommission"
                                    id="commission"
                                    required
                                    checked={formData.agreedToCommission}
                                    onChange={handleChange}
                                    style={{ marginTop: '4px' }}
                                />
                                <label htmlFor="commission" className="text-sm cursor-pointer">
                                    I agree to the <strong>10% commission fee</strong> on all sales made through Vendora.
                                </label>
                            </div>
                        </div>
                    )}

                    <Button type="submit" isLoading={isLoading} size="full" className="mt-md">
                        {accountType === 'seller' ? 'Register as Seller' : 'Create Customer Account'}
                    </Button>

                    <p className="text-center text-sm text-secondary mt-md">
                        Already have an account? <Link to="/login" className="text-primary-blue font-bold">Sign In</Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Register;
