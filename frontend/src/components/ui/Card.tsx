import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md'
}: CardProps) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const shadowStyles = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    none: '',
  };
  
  return (
    <div 
      className={`rounded-xl ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
      style={{ 
        backgroundColor: 'rgba(28, 15, 19, 0.1)',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {children}
    </div>
  );
};

