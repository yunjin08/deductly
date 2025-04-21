import { createApiService, api } from '../baseApi';
import { ChatMessage, PaginationResponse } from '@/interfaces';

// Define the chat message type

// Create the chat service with custom methods
const chatEndpoint = '/chatbot';

export const chatService = {
    ...createApiService<ChatMessage>(chatEndpoint),

    // Send a message and get bot response
    sendMessage: async (pk: string, filters: any) => {
        const response = await api.put<ChatMessage>(
            `${chatEndpoint}/chat/${pk}/`,
            filters
        );
        return response.data;
    },

    // Get chat history, TODO: add pagination and improve security
    getChatHistory: async (filters: any) => {
        const filterKeys = Object.keys(filters);
        filterKeys.forEach((key: string) => {
            if (Array.isArray(filters[key])) {
                filters[key] = filters[key].join(',');
            }
        });
        const response = await api.get<PaginationResponse<ChatMessage>>(
            `${chatEndpoint}/chat/history/`,
            { params: filters }
        );
        return response.data;
    },
};
