import { createSlice } from '@reduxjs/toolkit';
import {
    fetchImages,
    fetchImage,
    deleteImage,
    uploadImage,
} from '../actions/galleryActions';
import type { DocumentsState, GalleryState } from '@/interfaces';

const initialState: GalleryState = {
    images: [],
    selectedImage: null,
    isLoading: false,
    error: null,
    uploadProgress: 0,
    view: 'grid',
    sortBy: 'date',
};

const gallerySlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle base CRUD operations
            .addCase(fetchImages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.images = action.payload;
                state.error = null;
            })

            // Handle document-specific operations
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.images.push(action.payload);
                state.uploadProgress = 100;
            });
    },
});

export const { setUploadProgress } = gallerySlice.actions;
export default gallerySlice.reducer;
