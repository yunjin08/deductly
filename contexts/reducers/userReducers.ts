import { createSlice } from '@reduxjs/toolkit';
import { fetchChatHistory, sendMessage } from '@/contexts/actions/userActions';
import type { ChatMessage } from '@/interfaces';

interface UserState {
    chatHistory: ChatMessage[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    chatHistory: [],
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearChatHistory: (state) => {
            state.chatHistory = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Chat History
            .addCase(fetchChatHistory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chatHistory = action.payload;
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Send Message
            .addCase(sendMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chatHistory = [...state.chatHistory, action.payload];
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearChatHistory, clearError } = userSlice.actions;
export default userSlice.reducer;
