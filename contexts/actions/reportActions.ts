import { createAsyncThunk } from '@reduxjs/toolkit';
import { reportsApi } from '@/services/api/reports';
import type { Report, DateRangeParams, ExportParams } from '@/interfaces';

// Base CRUD operations
export const fetchReports = createAsyncThunk(
    'reports/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await reportsApi.getAll();
        } catch (error) {
            return rejectWithValue('Failed to fetch reports');
        }
    }
);

export const fetchReport = createAsyncThunk(
    'reports/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            return await reportsApi.getOne(id);
        } catch (error) {
            return rejectWithValue('Failed to fetch report');
        }
    }
);

export const createReport = createAsyncThunk(
    'reports/create',
    async (data: Partial<Report>, { rejectWithValue }) => {
        try {
            return await reportsApi.create(data);
        } catch (error) {
            return rejectWithValue('Failed to create report');
        }
    }
);

export const updateReport = createAsyncThunk(
    'reports/update',
    async (
        { id, data }: { id: string; data: Partial<Report> },
        { rejectWithValue }
    ) => {
        try {
            return await reportsApi.update(id, data);
        } catch (error) {
            return rejectWithValue('Failed to update report');
        }
    }
);

export const deleteReport = createAsyncThunk(
    'reports/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            return await reportsApi.delete(id);
        } catch (error) {
            return rejectWithValue('Failed to delete report');
        }
    }
);

// Report-specific operations
export const generateAnalytics = createAsyncThunk(
    'reports/generateAnalytics',
    async ({ startDate, endDate }: DateRangeParams, { rejectWithValue }) => {
        try {
            return await reportsApi.generateAnalytics(startDate, endDate);
        } catch (error) {
            return rejectWithValue('Failed to generate analytics');
        }
    }
);

export const fetchReportsByDateRange = createAsyncThunk(
    'reports/fetchByDateRange',
    async ({ startDate, endDate }: DateRangeParams, { rejectWithValue }) => {
        try {
            return await reportsApi.getByDateRange(startDate, endDate);
        } catch (error) {
            return rejectWithValue('Failed to fetch reports by date range');
        }
    }
);

export const fetchReportsByCategory = createAsyncThunk(
    'reports/fetchByCategory',
    async (category: string, { rejectWithValue }) => {
        try {
            return await reportsApi.getByCategory(category);
        } catch (error) {
            return rejectWithValue('Failed to fetch reports by category');
        }
    }
);

export const exportReport = createAsyncThunk(
    'reports/export',
    async ({ reportId, format }: ExportParams, { rejectWithValue }) => {
        try {
            return await reportsApi.exportReport(reportId, format);
        } catch (error) {
            return rejectWithValue('Failed to export report');
        }
    }
);

export const fetchDeductionSummary = createAsyncThunk(
    'reports/deductionSummary',
    async (reportId: string, { rejectWithValue }) => {
        try {
            return await reportsApi.getDeductionSummary(reportId);
        } catch (error) {
            return rejectWithValue('Failed to fetch deduction summary');
        }
    }
);
