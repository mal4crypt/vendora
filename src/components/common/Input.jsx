import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, error, containerClass = '', type = 'text', ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className={`flex flex-col gap-sm ${containerClass}`} style={{ marginBottom: '16px' }}>
            {label && (
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                <input
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        paddingRight: isPassword ? '40px' : '12px',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
                        outline: 'none',
                        fontSize: '14px',
                        transition: 'border-color 0.2s',
                        backgroundColor: 'var(--bg-white)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'}
                    onBlur={(e) => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-color)'}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{error}</span>}
        </div>
    );
};

export default Input;
