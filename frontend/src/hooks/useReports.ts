import { useState, useCallback } from 'react';
import { expenseApi } from '../services/api';
import type { Report, ExpenseParams } from '../types';

interface UseReportsReturn {
  reports: string[];
  currentReport: Report | null;
  loading: boolean;
  error: string | null;
  fetchReportIds: () => Promise<void>;
  fetchReport: (reportId: string) => Promise<Report | undefined>;
  createReport: (params?: ExpenseParams) => Promise<{ message: string; 'report id': string } | null>;
  deleteReport: (reportId: string) => Promise<void>;
  deleteAllReports: () => Promise<void>;
}

export const useReports = (userId: string | null | undefined): UseReportsReturn => {
  const [reports, setReports] = useState<string[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReportIds = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const reportIds = await expenseApi.getAllReportIds(userId);
      setReports(reportIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri pridobivanju report ID-jev';
      setError(errorMessage);
      console.error('Error fetching report IDs:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchReport = useCallback(async (reportId: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const report = await expenseApi.getReport(userId, reportId);
      setCurrentReport(report);
      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri pridobivanju report-a';
      setError(errorMessage);
      console.error('Error fetching report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createReport = useCallback(async (params: ExpenseParams = {}) => {
    if (!userId) return null;
    
    setLoading(true);
    setError(null);
    try {
      const result = await expenseApi.createReport(userId, params);
      await fetchReportIds();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri ustvarjanju report-a';
      setError(errorMessage);
      console.error('Error creating report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchReportIds]);

  const deleteReport = useCallback(async (reportId: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await expenseApi.deleteReport(userId, reportId);
      await fetchReportIds();
      if (currentReport && 'report_id' in currentReport && currentReport.report_id === reportId) {
        setCurrentReport(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju report-a';
      setError(errorMessage);
      console.error('Error deleting report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchReportIds, currentReport]);

  const deleteAllReports = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await expenseApi.deleteAllReports(userId);
      setReports([]);
      setCurrentReport(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju vseh report-ov';
      setError(errorMessage);
      console.error('Error deleting all reports:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    reports,
    currentReport,
    loading,
    error,
    fetchReportIds,
    fetchReport,
    createReport,
    deleteReport,
    deleteAllReports,
  };
};

