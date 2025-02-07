import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ChatMessage } from '@/interfaces';
import { chatService } from '@/services/api/users';

export const fetchChatHistory = createAsyncThunk(
    'chat/fetchHistory',
    async (userId: string, { rejectWithValue }) => {
        try {
            return await chatService.getChatHistory(userId);
        } catch (e) {
            console.error('Failed to fetch chat history', e);
            return rejectWithValue('Failed to fetch chat history');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (message: ChatMessage, { rejectWithValue }) => {
        try {
            return await chatService.sendMessage({ data: message });
        } catch (e) {
            console.error('Failed to send message', e);
            return rejectWithValue('Failed to send message');
        }
    }
);
