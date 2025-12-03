import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-lg 
          focus:outline-none focus:ring-2 focus:border-transparent
          transition-all duration-200
          ${error ? 'focus:ring-palette-dark' : 'focus:ring-palette-blue-grey'}
          ${className}`}
        style={{
          border: `1px solid var(--color-border)`,
          backgroundColor: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)',
          ...(error ? { borderColor: 'var(--color-primary-dark)' } : {})
        }}
        autoComplete={props.autoComplete || 'off'}
        data-lpignore={props.type !== 'password' && props.type !== 'email' ? 'true' : undefined}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--color-primary-dark)' }}>{error}</p>
      )}
    </div>
  );
};

