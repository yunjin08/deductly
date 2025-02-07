import { createApiService, api } from '../baseApi';
import { ChatMessage } from '@/interfaces';

// Define the chat message type

// Create the chat service with custom methods
const chatEndpoint = '/chat';

export const chatService = {
    ...createApiService<ChatMessage>(chatEndpoint),

    // Send a message and get bot response
    sendMessage: async ({ data }: { data: ChatMessage }) => {
        const response = await api.post<ChatMessage>(`${chatEndpoint}/`, {
            question: data.question,
        });
        return response.data;
    },

    // Get chat history, TODO: add pagination and improve security
    getChatHistory: async (id: string) => {
        const response = await api.get<ChatMessage[]>(
            `${chatEndpoint}/history/${id}/`
        );
        return response.data;
    },
};
