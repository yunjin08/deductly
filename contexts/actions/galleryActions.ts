import { createAsyncThunk } from '@reduxjs/toolkit';
import { imagesApi } from '@/services/api/gallery';
import type {
    Image,
    ImageUploadOptions,
    ImageOptimizeOptions,
} from '@/interfaces';

// Base CRUD operations
export const fetchImages = createAsyncThunk(
    'gallery/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await imagesApi.getAll();
        } catch (error) {
            return rejectWithValue('Failed to fetch images');
        }
    }
);

export const fetchImage = createAsyncThunk(
    'gallery/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            return await imagesApi.getOne(id);
        } catch (error) {
            return rejectWithValue('Failed to fetch image');
        }
    }
);

export const deleteImage = createAsyncThunk(
    'gallery/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            return await imagesApi.delete(id);
        } catch (error) {
            return rejectWithValue('Failed to delete image');
        }
    }
);

// Image-specific operations
export const uploadImage = createAsyncThunk(
    'gallery/upload',
    async (
        {
            file,
            onProgress,
        }: { file: FormData; onProgress?: (progress: number) => void },
        { rejectWithValue }
    ) => {
        try {
            return await imagesApi.upload(file, onProgress);
        } catch (error) {
            return rejectWithValue('Failed to upload image');
        }
    }
);

export const uploadMultipleImages = createAsyncThunk(
    'gallery/uploadMultiple',
    async (
        {
            files,
            onProgress,
        }: { files: FormData; onProgress?: (progress: number) => void },
        { rejectWithValue }
    ) => {
        try {
            return await imagesApi.uploadMultiple(files, onProgress);
        } catch (error) {
            return rejectWithValue('Failed to upload images');
        }
    }
);

export const fetchUserImages = createAsyncThunk(
    'gallery/fetchUserImages',
    async (userId: string, { rejectWithValue }) => {
        try {
            return await imagesApi.getByUserId(userId);
        } catch (error) {
            return rejectWithValue('Failed to fetch user images');
        }
    }
);

export const optimizeImage = createAsyncThunk(
    'gallery/optimize',
    async (
        { id, options }: { id: string; options: ImageOptimizeOptions },
        { rejectWithValue }
    ) => {
        try {
            return await imagesApi.optimize(id, options);
        } catch (error) {
            return rejectWithValue('Failed to optimize image');
        }
    }
);
