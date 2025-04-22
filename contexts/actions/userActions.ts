import { createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '@/services/api/chatbot';

export const fetchChatHistory = createAsyncThunk(
    'chat/fetchHistory',
    async (filters: any, { rejectWithValue }) => {
        try {
            return await chatService.getChatHistory(filters);
        } catch (e) {
            console.error('Failed to fetch chat history', e);
            return rejectWithValue('Failed to fetch chat history');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (data: any, { rejectWithValue }) => {
        try {
            const result = await chatService.sendMessage(data.pk, data.filters);
            return result;
        } catch (e) {
            console.error('Failed to send message', e);
            return rejectWithValue('Failed to send message');
        }
    }
);
