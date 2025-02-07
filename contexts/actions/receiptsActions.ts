import { createAsyncThunk } from '@reduxjs/toolkit';
import { receiptsApi } from '@/services/api/receipts';
import type { Receipt, ReceiptItem } from '@/interfaces';
import type { ScanReceiptPayload, DateRangeFilter } from '@/interfaces';

// Base CRUD operations
export const fetchReceipts = createAsyncThunk(
    'receipts/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await receiptsApi.getAll();
        } catch (error) {
            return rejectWithValue('Failed to fetch receipts');
        }
    }
);

export const fetchReceipt = createAsyncThunk(
    'receipts/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            return await receiptsApi.getOne(id);
        } catch (error) {
            return rejectWithValue('Failed to fetch receipt');
        }
    }
);

export const createReceipt = createAsyncThunk(
    'receipts/create',
    async (data: Partial<Receipt>, { rejectWithValue }) => {
        try {
            return await receiptsApi.create(data);
        } catch (error) {
            return rejectWithValue('Failed to create receipt');
        }
    }
);

export const updateReceipt = createAsyncThunk(
    'receipts/update',
    async (
        { id, data }: { id: string; data: Partial<Receipt> },
        { rejectWithValue }
    ) => {
        try {
            return await receiptsApi.update(id, data);
        } catch (error) {
            return rejectWithValue('Failed to update receipt');
        }
    }
);

export const deleteReceipt = createAsyncThunk(
    'receipts/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            return await receiptsApi.delete(id);
        } catch (error) {
            return rejectWithValue('Failed to delete receipt');
        }
    }
);

// Receipt-specific operations
export const scanReceipt = createAsyncThunk(
    'receipts/scan',
    async (
        { imageData, onProgress }: ScanReceiptPayload,
        { rejectWithValue }
    ) => {
        try {
            return await receiptsApi.scan(imageData, onProgress);
        } catch (error) {
            return rejectWithValue('Failed to scan receipt');
        }
    }
);

export const fetchUserReceipts = createAsyncThunk(
    'receipts/fetchUserReceipts',
    async (userId: string, { rejectWithValue }) => {
        try {
            return await receiptsApi.getByUserId(userId);
        } catch (error) {
            return rejectWithValue('Failed to fetch user receipts');
        }
    }
);

export const fetchReceiptsByCategory = createAsyncThunk(
    'receipts/fetchByCategory',
    async (category: string, { rejectWithValue }) => {
        try {
            return await receiptsApi.getByCategory(category);
        } catch (error) {
            return rejectWithValue('Failed to fetch receipts by category');
        }
    }
);

export const fetchReceiptsByDateRange = createAsyncThunk(
    'receipts/fetchByDateRange',
    async ({ startDate, endDate }: DateRangeFilter, { rejectWithValue }) => {
        try {
            return await receiptsApi.getByDateRange(startDate, endDate);
        } catch (error) {
            return rejectWithValue('Failed to fetch receipts by date range');
        }
    }
);

export const fetchReceiptItems = createAsyncThunk(
    'receipts/fetchItems',
    async (receiptId: string, { rejectWithValue }) => {
        try {
            const items = await receiptsApi.getItems(receiptId);
            return { receiptId, items };
        } catch (error) {
            return rejectWithValue('Failed to fetch receipt items');
        }
    }
);

export const addReceiptItem = createAsyncThunk(
    'receipts/addItem',
    async (
        { receiptId, item }: { receiptId: string; item: Partial<ReceiptItem> },
        { rejectWithValue }
    ) => {
        try {
            const newItem = await receiptsApi.addItem(receiptId, item);
            return { receiptId, item: newItem };
        } catch (error) {
            return rejectWithValue('Failed to add receipt item');
        }
    }
);

export const calculateDeductions = createAsyncThunk(
    'receipts/calculateDeductions',
    async (receiptId: string, { rejectWithValue }) => {
        try {
            return await receiptsApi.calculateDeductions(receiptId);
        } catch (error) {
            return rejectWithValue('Failed to calculate deductions');
        }
    }
);
