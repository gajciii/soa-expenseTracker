import { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useReports } from '../hooks/useReports';
import { MonthlyAnalytics } from '../components/analytics/MonthlyAnalytics';
import { WeeklyAnalytics } from '../components/analytics/WeeklyAnalytics';
import { ReportForm } from '../components/reports/ReportForm';
import { ReportList } from '../components/reports/ReportList';
import { ReportView } from '../components/reports/ReportView';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import type { ExpenseParams } from '../types';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const { showNotification } = useNotification();
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const {
    monthlyAnalytics,
    weeklyAnalytics,
    loading,
    error,
    fetchMonthly,
    fetchWeekly,
    recomputeMonthly,
    recomputeWeekly,
    deleteMonthly,
    deleteWeekly,
  } = useAnalytics(userId);
  const {
    reports,
    currentReport,
    loading: reportsLoading,
    error: reportsError,
    createReport,
    fetchReport,
    deleteReport,
    deleteAllReports,
    fetchReportIds,
  } = useReports(userId);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    if (userId) {
      fetchMonthly(selectedMonth);
      fetchWeekly();
      fetchReportIds();
    }
  }, [userId, selectedMonth]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    fetchMonthly(month);
  };

  const handleRecomputeMonthly = async () => {
    try {
      await recomputeMonthly(selectedMonth);
      showNotification('Monthly analytics recomputed successfully!', 'success');
    } catch (error) {
      showNotification('Failed to recompute monthly analytics', 'error');
    }
  };

  const handleDeleteMonthly = async () => {
    try {
      await deleteMonthly(selectedMonth);
      showNotification('Monthly analytics deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete monthly analytics', 'error');
    }
  };

  const handleRecomputeWeekly = async () => {
    try {
      await recomputeWeekly();
      showNotification('Weekly analytics recomputed successfully!', 'success');
    } catch (error) {
      showNotification('Failed to recompute weekly analytics', 'error');
    }
  };

  const handleDeleteWeekly = async () => {
    try {
      await deleteWeekly();
      showNotification('Weekly analytics deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete weekly analytics', 'error');
    }
  };

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
          Reports & Analytics Dashboard
        </h1>
        <p className={pageClasses.subtitle} style={pageStyles.subtitle}>
          Track your spending patterns and budget performance
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Expense Reports
            </h2>
          </div>
          {reportsError && (
            <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(28, 15, 19, 0.1)', border: '1px solid var(--color-primary-dark)', color: 'var(--color-text-primary)' }}>
              Error: {reportsError}
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
              <ReportForm onSubmit={handleCreateReport} loading={reportsLoading} onDeleteAll={handleDeleteAll} />
            </div>
          )}
          <ReportList reports={reports} loading={reportsLoading} onView={handleViewReport} onDelete={handleDeleteReport} />
        </div>

        <MonthlyAnalytics
          analytics={monthlyAnalytics}
          loading={loading}
          error={error}
          month={selectedMonth}
          onMonthChange={handleMonthChange}
          onRecompute={handleRecomputeMonthly}
          onDelete={handleDeleteMonthly}
        />

        <WeeklyAnalytics
          analytics={weeklyAnalytics}
          loading={loading}
          error={error}
          onRecompute={handleRecomputeWeekly}
          onDelete={handleDeleteWeekly}
        />
      </div>

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

