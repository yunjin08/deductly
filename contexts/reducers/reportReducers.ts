import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchReports,
    fetchReport,
    createReport,
    updateReport,
    deleteReport,
    generateAnalytics,
    fetchReportsByDateRange,
    fetchReportsByCategory,
    exportReport,
    fetchDeductionSummary,
} from '@/contexts/actions/reportActions';
import type { ReportsState } from '@/interfaces';
import type { Report } from '@/interfaces';

const initialState: ReportsState = {
    reports: [],
    selectedReport: null,
    isLoading: false,
    error: null,
    filters: {},
    analytics: {
        totalExpenditure: 0,
        totalDeductions: 0,
        categorizedExpenses: {},
        monthlyTrends: [],
    },
    exportProgress: 0,
};

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setFilters: (
            state,
            action: PayloadAction<Partial<ReportsState['filters']>>
        ) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {};
        },
        setSelectedReport: (state, action: PayloadAction<Report | null>) => {
            state.selectedReport = action.payload;
        },
        setExportProgress: (state, action: PayloadAction<number>) => {
            state.exportProgress = action.payload;
        },
        resetAnalytics: (state) => {
            state.analytics = initialState.analytics;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all reports
            .addCase(fetchReports.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reports = action.payload;
                state.error = null;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Generate analytics
            .addCase(generateAnalytics.fulfilled, (state, action) => {
                state.analytics = {
                    ...state.analytics,
                    ...action.payload,
                };
            })
            // Fetch by date range
            .addCase(fetchReportsByDateRange.fulfilled, (state, action) => {
                state.reports = action.payload;
            })
            // Fetch by category
            .addCase(fetchReportsByCategory.fulfilled, (state, action) => {
                state.reports = action.payload;
            })
            // Export report
            .addCase(exportReport.fulfilled, (state) => {
                state.exportProgress = 100;
            })
            // Fetch deduction summary
            .addCase(fetchDeductionSummary.fulfilled, (state, action) => {
                state.analytics.totalDeductions =
                    action.payload.totalDeductions;
                state.analytics.categorizedExpenses =
                    action.payload.categorizedDeductions;
            });
    },
});

export const {
    setFilters,
    clearFilters,
    setSelectedReport,
    setExportProgress,
    resetAnalytics,
} = reportsSlice.actions;

export default reportsSlice.reducer;
