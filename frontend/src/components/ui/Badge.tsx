import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variantStyles = {
    default: { backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)' },
    success: { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-white)' },
    warning: { backgroundColor: 'var(--color-border)', color: 'var(--color-text-primary)' },
    error: { backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-text-white)' },
    info: { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-white)' },
  };
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
};

