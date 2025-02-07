import { createAsyncThunk } from '@reduxjs/toolkit';
import { documentsApi } from '@/services/api/documents';
import type { Document } from '@/interfaces';

// Use base CRUD operations
export const fetchDocuments = createAsyncThunk(
    'documents/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await documentsApi.getAll();
        } catch (error) {
            return rejectWithValue('Failed to fetch documents');
        }
    }
);

export const fetchDocument = createAsyncThunk(
    'documents/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            return await documentsApi.getOne(id);
        } catch (error) {
            return rejectWithValue('Failed to fetch document');
        }
    }
);

export const createDocument = createAsyncThunk(
    'documents/create',
    async (data: Partial<Document>, { rejectWithValue }) => {
        try {
            return await documentsApi.create(data);
        } catch (error) {
            return rejectWithValue('Failed to create document');
        }
    }
);

export const updateDocument = createAsyncThunk(
    'documents/update',
    async (
        { id, data }: { id: string; data: Partial<Document> },
        { rejectWithValue }
    ) => {
        try {
            return await documentsApi.update(id, data);
        } catch (error) {
            return rejectWithValue('Failed to update document');
        }
    }
);

export const deleteDocument = createAsyncThunk(
    'documents/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            return await documentsApi.delete(id);
        } catch (error) {
            return rejectWithValue('Failed to delete document');
        }
    }
);

// Document-specific operations
export const uploadDocument = createAsyncThunk(
    'documents/upload',
    async (
        {
            file,
            onProgress,
        }: { file: FormData; onProgress?: (progress: number) => void },
        { rejectWithValue }
    ) => {
        try {
            return await documentsApi.upload(file, onProgress);
        } catch (error) {
            return rejectWithValue('Failed to upload document');
        }
    }
);

export const downloadDocument = createAsyncThunk(
    'documents/download',
    async (id: string, { rejectWithValue }) => {
        try {
            return await documentsApi.download(id);
        } catch (error) {
            return rejectWithValue('Failed to download document');
        }
    }
);

export const shareDocument = createAsyncThunk(
    'documents/share',
    async (
        { id, userIds }: { id: string; userIds: string[] },
        { rejectWithValue }
    ) => {
        try {
            return await documentsApi.share(id, userIds);
        } catch (error) {
            return rejectWithValue('Failed to share document');
        }
    }
);
