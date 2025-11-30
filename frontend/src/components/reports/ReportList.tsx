import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';

interface ReportListProps {
  reports: string[];
  loading: boolean;
  onView: (reportId: string) => void;
  onDelete: (reportId: string) => Promise<void>;
}

export const ReportList = ({ reports, loading, onView, onDelete }: ReportListProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (reportId: string): void => {
    setShowDeleteConfirm(reportId);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (showDeleteConfirm) {
      await onDelete(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Reports</h2>
      
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-primary)' }}>Loading reports...</div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Report IDs ({reports.length})
          </h3>
          {reports.length === 0 ? (
            <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              No reports found
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((reportId, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'rgba(28, 15, 19, 0.1)', border: '1px solid var(--color-border)', backdropFilter: 'blur(10px)' }}
                >
                  <span className="font-mono text-xs sm:text-sm break-all sm:break-normal" style={{ color: 'var(--color-text-primary)' }}>{reportId}</span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button onClick={() => onView(reportId)} variant="primary" size="sm" className="flex-1 sm:flex-initial">
                      View
                    </Button>
                    <Button onClick={() => handleDelete(reportId)} variant="danger" size="sm" className="flex-1 sm:flex-initial">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <ConfirmModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Report"
        message="Are you sure you want to delete this report?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  );
};
