import React from 'react';

const Card = ({ children, className = '', padding = 'md' }) => {
    return (
        <div
            className={`bg-white shadow-sm rounded-md ${className}`}
            style={{
                border: '1px solid var(--border-color)',
                padding: `var(--spacing-${padding})`,
                overflow: 'hidden' // Ensure content respects rounded corners
            }}
        >
            {children}
        </div>
    );
};

export default Card;
