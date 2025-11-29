import type { Report } from '../../types';

interface ReportViewProps {
  report: Report | null;
}

export const ReportView = ({ report }: ReportViewProps) => {
  if (!report) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
        No report selected
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Date From:</span>
            <p className="font-semibold" style={{ color: 'var(--color-text-white)' }}>{report.date_from || 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Date To:</span>
            <p className="font-semibold" style={{ color: 'var(--color-text-white)' }}>{report.date_to || 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Total Price:</span>
            <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-white)' }}>{`$${(report.total_price || 0).toFixed(2)}`}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Expenses Count:</span>
            <p className="font-semibold" style={{ color: 'var(--color-text-white)' }}>{report.expenses?.length || 0}</p>
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Most Expensive Items:</span>
            <p className="font-semibold" style={{ color: 'var(--color-text-white)' }}>{report.most_expensive_items?.length || 0}</p>
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Created:</span>
            <p className="font-semibold" style={{ color: 'var(--color-text-white)' }}>{report.created_at}</p>
          </div>
        </div>
      </div>
      
      {report.most_expensive_items && report.most_expensive_items.length > 0 && (
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
          <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-white)' }}>Most Expensive Items:</h4>
          <div className="space-y-2">
            {report.most_expensive_items.map((item, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: 'rgba(183, 206, 206, 0.2)', border: '1px solid var(--color-border)' }}
              >
                <span className="font-medium" style={{ color: 'var(--color-text-white)' }}>
                  {`${item.item_name || 'N/A'} - $${(item.item_price || 0).toFixed(2)} (Qty: ${item.item_quantity || 0})`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
