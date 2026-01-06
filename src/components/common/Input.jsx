import React from 'react';

const Input = ({ label, error, containerClass = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-sm ${containerClass}`} style={{ marginBottom: '16px' }}>
            {label && (
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    {label}
                </label>
            )}
            <input
                style={{
                    padding: '10px 12px',
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
            {error && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{error}</span>}
        </div>
    );
};

export default Input;
