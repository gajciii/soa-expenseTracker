import { useEffect, useState } from 'react';
import { useReports } from '../hooks/useReports';
import { ReportForm } from '../components/reports/ReportForm';
import { ReportList } from '../components/reports/ReportList';
import { ReportView } from '../components/reports/ReportView';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import type { ExpenseParams } from '../types';

export const ReportsPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const { showNotification } = useNotification();
  const {
    reports,
    currentReport,
    loading,
    error,
    createReport,
    fetchReport,
    deleteReport,
    deleteAllReports,
    fetchReportIds,
  } = useReports(userId);

  useEffect(() => {
    fetchReportIds();
  }, [fetchReportIds]);

  const handleCreateReport = async (params: ExpenseParams): Promise<void> => {
    try {
      await createReport(params);
      showNotification('Report created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create report:', error);
      showNotification('Failed to create report. Check console for details.', 'error');
    }
  };

  const handleViewReport = async (reportId: string): Promise<void> => {
    try {
      await fetchReport(reportId);
      setShowReportModal(true);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      showNotification('Failed to fetch report. Check console for details.', 'error');
    }
  };

  const handleDeleteReport = async (reportId: string): Promise<void> => {
    try {
      await deleteReport(reportId);
      showNotification('Report deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete report:', error);
      showNotification('Failed to delete report. Check console for details.', 'error');
    }
  };

  const handleDeleteAll = async (): Promise<void> => {
    try {
      await deleteAllReports();
      showNotification('All reports deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete all reports:', error);
      showNotification('Failed to delete all reports. Check console for details.', 'error');
    }
  };

  return (
    <div className={pageClasses.container}>
      <div className={pageClasses.header}>
        <h1 className={pageClasses.title} style={pageStyles.title}>
          Expense Reports & Analytics
        </h1>
        <p className={pageClasses.subtitle} style={pageStyles.subtitle}>
          Generate detailed reports and analyze your spending patterns
        </p>
      </div>
      {error && (
        <div className={pageClasses.error} style={pageStyles.error}>
          Error: {error}
        </div>
      )}
      <div className={pageClasses.toggleContainer}>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'primary' : 'outline'}
          size="md"
        >
          {showCreateForm ? 'Hide Create Form' : 'Create New Report'}
        </Button>
      </div>
      {showCreateForm && (
        <div className={pageClasses.formContainer}>
          <ReportForm onSubmit={handleCreateReport} loading={loading} onDeleteAll={handleDeleteAll} />
        </div>
      )}
      <ReportList reports={reports} loading={loading} onView={handleViewReport} onDelete={handleDeleteReport} />
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Details"
      >
        <ReportView report={currentReport} />
      </Modal>
    </div>
  );
};
