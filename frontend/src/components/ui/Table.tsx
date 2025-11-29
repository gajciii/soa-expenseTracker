import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children, className = '' }: TableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid var(--color-border)` }}>
      <table className={`min-w-full divide-y ${className}`} style={{ borderColor: 'var(--color-border)' }}>
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children }: { children: ReactNode }) => {
  return (
    <thead style={{ backgroundColor: 'var(--color-bg-card)' }}>
      <tr>{children}</tr>
    </thead>
  );
};

export const TableHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <th className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider ${className}`} style={{ color: 'var(--color-text-primary)' }}>
      {children}
    </th>
  );
};

export const TableBody = ({ children }: { children: ReactNode }) => {
  return (
    <tbody className="divide-y" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <tr className="transition-colors hover:opacity-80" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <td className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm ${className}`} style={{ color: 'var(--color-text-primary)' }}>
      {children}
    </td>
  );
};

