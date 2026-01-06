import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (formData.email && formData.password) {
                // Mock logic: specific admin credentials, else email patterns
                let type = 'customer';
                if (formData.email === 'mal4crypt404@gmail.com' && formData.password === 'thetaskmaster') {
                    type = 'admin';
                } else if (formData.email.includes('admin')) {
                    type = 'admin';
                } else if (formData.email.includes('seller')) {
                    type = 'seller';
                }

                login({
                    id: '123',
                    name: 'Test User',
                    email: formData.email,
                    type: type
                });

                setIsLoading(false);
                if (type === 'admin') navigate('/admin');
                else if (type === 'seller') navigate('/seller');
                else navigate('/');
            } else {
                setError('Invalid credentials');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
            <Card className="flex flex-col gap-md" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center text-primary-blue font-bold" style={{ fontSize: '24px' }}>Sign In</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                    {error && <div style={{ color: 'var(--danger)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g., user@example.com"
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />

                    <Button type="submit" isLoading={isLoading} size="full">
                        Sign In
                    </Button>

                    <p className="text-center text-sm text-secondary">
                        Don't have an account? <Link to="/register" className="text-primary-blue font-bold">Sign Up</Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Login;
