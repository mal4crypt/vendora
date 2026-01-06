import React from 'react';
import { Loader2 } from 'lucide-react';
import '../../index.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    disabled,
    ...props
}) => {
    const baseStyles = {
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        gap: '8px',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary-blue)',
            color: 'white',
            border: '1px solid var(--primary-blue)',
        },
        secondary: {
            backgroundColor: 'var(--secondary-blue)',
            color: 'var(--primary-blue)',
            border: '1px solid var(--secondary-blue)',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--primary-blue)',
            border: '1px solid var(--primary-blue)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: 'none',
        }
    };

    const sizes = {
        sm: { padding: '4px 8px', fontSize: '12px' },
        md: { padding: '8px 16px', fontSize: '14px' },
        lg: { padding: '12px 24px', fontSize: '16px' },
        full: { width: '100%', padding: '10px' }
    };

    // Merge styles (inline for simplicity in this MVP, classes better in real app)
    const style = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        opacity: disabled || isLoading ? 0.7 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    };

    return (
        <button style={style} disabled={disabled || isLoading} {...props}>
            {isLoading && <Loader2 className="animate-spin" size={16} />}
            {children}
        </button>
    );
};

export default Button;
