import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { updatePassword } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            await updatePassword(password);
            setIsLoading(false);
            // Redirect to login after successful password reset
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to update password');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
            <Card className="flex flex-col gap-md" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center text-primary-blue font-bold" style={{ fontSize: '24px' }}>
                    Reset Password
                </h2>
                <p className="text-center text-sm text-secondary">
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                    {error && <div style={{ color: 'var(--danger)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                    <Input
                        label="New Password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                    />

                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                    />

                    <Button type="submit" isLoading={isLoading} size="full">
                        Update Password
                    </Button>
                </form>

                <p className="text-center text-sm text-secondary">
                    <Link to="/login" className="text-primary-blue font-bold">Back to Sign In</Link>
                </p>
            </Card>
        </div>
    );
};

export default ResetPassword;
