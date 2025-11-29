import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white shadow-md hover:shadow-lg focus:ring-palette-blue-grey',
    secondary: 'text-palette-dark hover:opacity-90 focus:ring-palette-lavender',
    success: 'text-white shadow-md hover:shadow-lg focus:ring-palette-blue-grey',
    danger: 'text-white shadow-md hover:shadow-lg focus:ring-palette-dark',
    outline: 'border-2 text-palette-blue-grey hover:bg-palette-mint focus:ring-palette-blue-grey',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const variantStyles = {
    primary: { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' },
    secondary: { backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' },
    success: { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' },
    danger: { backgroundColor: 'var(--color-primary-dark)', borderColor: 'var(--color-primary-dark)' },
    outline: { backgroundColor: 'transparent', borderColor: 'var(--color-primary)' },
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
};

