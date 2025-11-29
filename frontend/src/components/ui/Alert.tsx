import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export const Alert = ({ children, variant = 'info', className = '' }: AlertProps) => {
  const variantStyles = {
    success: { 
      backgroundColor: 'var(--color-bg-card)', 
      borderColor: 'var(--color-primary)', 
      color: 'var(--color-text-primary)' 
    },
    error: { 
      backgroundColor: 'var(--color-bg-card)', 
      borderColor: 'var(--color-primary-dark)', 
      color: 'var(--color-text-primary)' 
    },
    warning: { 
      backgroundColor: 'var(--color-bg-card)', 
      borderColor: 'var(--color-border)', 
      color: 'var(--color-text-primary)' 
    },
    info: { 
      backgroundColor: 'var(--color-bg-card)', 
      borderColor: 'var(--color-primary)', 
      color: 'var(--color-text-primary)' 
    },
  };
  
  return (
    <div className={`p-4 border rounded-lg ${className}`} style={variantStyles[variant]}>
      {children}
    </div>
  );
};

