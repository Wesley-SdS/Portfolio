'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

interface AccessibleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      disabled,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const disabledClasses = disabled || loading 
      ? 'opacity-50 cursor-not-allowed' 
      : 'cursor-pointer';

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle Enter and Space keys for accessibility
      if ((event.key === 'Enter' || event.key === ' ') && onClick && !disabled && !loading) {
        event.preventDefault();
        // Create a synthetic mouse event for the onClick handler
        const syntheticEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });
        event.currentTarget.dispatchEvent(syntheticEvent);
      }
      
      onKeyDown?.(event);
    };

    const renderIcon = () => {
      if (!icon) return null;
      
      return (
        <span className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>
          {icon}
        </span>
      );
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabledClasses}
          ${className}
        `}
        disabled={disabled || loading}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role="button"
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {iconPosition === 'left' && renderIcon()}
        <span>{children}</span>
        {iconPosition === 'right' && renderIcon()}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;