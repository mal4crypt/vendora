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
        setError('');

        // Safety timeout in case everything hangs (30s)
        const timeout = setTimeout(() => {
            setError('Request is taking longer than expected. Please check your connection.');
            setIsLoading(false);
        }, 30000);


        try {
            await login(formData.email, formData.password);
            clearTimeout(timeout);
            setIsLoading(false);
            navigate('/');
        } catch (err) {
            clearTimeout(timeout);
            setError(err.message || 'Invalid login credentials');
            setIsLoading(false);
        }
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

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <Link to="/forgot-password" className="text-sm text-primary-blue font-bold">
                            Forgot Password?
                        </Link>
                    </div>

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
