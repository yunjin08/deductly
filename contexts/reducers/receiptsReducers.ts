import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchReceipts,
    fetchReceipt,
    createReceipt,
    updateReceipt,
    deleteReceipt,
    scanReceipt,
    fetchUserReceipts,
    fetchReceiptsByCategory,
    fetchReceiptsByDateRange,
    fetchReceiptItems,
    addReceiptItem,
    calculateDeductions,
} from '../actions/receiptsActions';
import type { ReceiptsState } from '@/interfaces';
import type { Receipt } from '@/interfaces';

const initialState: ReceiptsState = {
    receipts: [],
    selectedReceipt: null,
    receiptItems: {},
    isLoading: false,
    error: null,
    scanProgress: 0,
    filters: {},
    stats: {
        totalExpenditure: 0,
        totalDeductions: 0,
    },
};

const receiptsSlice = createSlice({
    name: 'receipts',
    initialState,
    reducers: {
        setScanProgress: (state, action: PayloadAction<number>) => {
            state.scanProgress = action.payload;
        },
        setFilters: (
            state,
            action: PayloadAction<Partial<ReceiptsState['filters']>>
        ) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {};
        },
        calculateStats: (state) => {
            state.stats.totalExpenditure = state.receipts.reduce(
                (sum, receipt) => sum + receipt.total_expenditure,
                0
            );
        },
        setSelectedReceipt: (state, action: PayloadAction<Receipt | null>) => {
            state.selectedReceipt = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all receipts
            .addCase(fetchReceipts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchReceipts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.receipts = action.payload;
                state.error = null;
            })
            .addCase(fetchReceipts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Scan receipt
            .addCase(scanReceipt.fulfilled, (state, action) => {
                state.receipts.unshift(action.payload);
                state.scanProgress = 100;
            })
            // Fetch receipt items
            .addCase(fetchReceiptItems.fulfilled, (state, action) => {
                state.receiptItems[action.payload.receiptId] =
                    action.payload.items;
            })
            // Add receipt item
            .addCase(addReceiptItem.fulfilled, (state, action) => {
                const items =
                    state.receiptItems[action.payload.receiptId] || [];
                state.receiptItems[action.payload.receiptId] = [
                    ...items,
                    action.payload.item,
                ];
            })
            // Calculate deductions
            .addCase(calculateDeductions.fulfilled, (state, action) => {
                state.stats.totalDeductions = action.payload.totalDeductible;
            });
        // ... handle other cases similarly
    },
});

export const {
    setScanProgress,
    setFilters,
    clearFilters,
    calculateStats,
    setSelectedReceipt,
} = receiptsSlice.actions;

export default receiptsSlice.reducer;
