import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            await resetPassword(email);
            setSuccess(true);
            setIsLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
            <Card className="flex flex-col gap-md" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center text-primary-blue font-bold" style={{ fontSize: '24px' }}>
                    Forgot Password?
                </h2>
                <p className="text-center text-sm text-secondary">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {success ? (
                    <div style={{
                        color: 'var(--success)',
                        fontSize: '14px',
                        textAlign: 'center',
                        backgroundColor: '#f0fdf4',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--success)'
                    }}>
                        Reset link sent! Check your email inbox.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                        {error && <div style={{ color: 'var(--danger)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                        />

                        <Button type="submit" isLoading={isLoading} size="full">
                            Send Reset Link
                        </Button>
                    </form>
                )}

                <p className="text-center text-sm text-secondary">
                    Remember your password? <Link to="/login" className="text-primary-blue font-bold">Sign In</Link>
                </p>
            </Card>
        </div>
    );
};

export default ForgotPassword;
