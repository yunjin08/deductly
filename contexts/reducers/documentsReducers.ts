import { createSlice } from '@reduxjs/toolkit';
import {
    fetchDocuments,
    fetchDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    uploadDocument,
    downloadDocument,
    shareDocument,
} from '../actions/documentsActions';
import type { DocumentsState } from '@/interfaces';

const initialState: DocumentsState = {
    documents: [],
    selectedDocument: null,
    isLoading: false,
    error: null,
    uploadProgress: 0,
};

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle base CRUD operations
            .addCase(fetchDocuments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.documents = action.payload;
                state.error = null;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // ... similar cases for other base operations ...

            // Handle document-specific operations
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.documents.push(action.payload);
                state.uploadProgress = 100;
            })
            .addCase(downloadDocument.fulfilled, (state) => {
                // Handle download completion if needed
            })
            .addCase(shareDocument.fulfilled, (state) => {
                // Handle share completion if needed
            });
    },
});

export const { setUploadProgress } = documentsSlice.actions;
export default documentsSlice.reducer;
