import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
// import GoBackRoute from '@/components/GoBackRoute';
import { useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendMessage } from '@/contexts/actions/userActions';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuthHooks';

// Dummy chat data type
type ChatMessage = {
    id: string;
    text?: string;
    sender: 'user' | 'bot';
    options?: string[];
};

// Initial dummy chat data
const initialChats: ChatMessage[] = [
    {
        id: '1',
        text: 'Hey Lucas!',
        sender: 'bot',
    },
    {
        id: '2',
        text: "How's your tax management going?",
        sender: 'bot',
    },
    {
        id: '3',
        text: 'How to file a tax and get a deduction',
        sender: 'user',
    },
    {
        id: '4',
        text: 'File your income tax returns 😊',
        sender: 'bot',
        options: ['File A Tax'],
    },
];

const ChatbotScreen = () => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.auth.session?.user?.id);
    const [messages, setMessages] = useState<ChatMessage[]>(initialChats);
    const [inputText, setInputText] = useState('');

    // useEffect(() => {
    //     if (userId) {
    //         dispatch(fetchChatHistory(userId));
    //     }
    // }, [dispatch, userId]);

    const handleSend = async () => {
        if (inputText.trim()) {
            setMessages([
                ...messages,
                {
                    id: Date.now().toString(),
                    text: inputText,
                    sender: 'user',
                },
            ]);
            const resultAction = await dispatch(
                sendMessage({
                    question: inputText,
                })
            );
            // Type guard to check if the action was fulfilled
            if (sendMessage.fulfilled.match(resultAction)) {
                console.log('Bot response:', resultAction.payload.answer);

                // Add bot response to messages
                const botMessage: ChatMessage = {
                    id: Date.now().toString(),
                    text: resultAction.payload.answer,
                    sender: 'bot',
                };

                setMessages((prev) => [...prev, botMessage]);
            }

            // setMessages([...messages, result.answer]);

            setInputText('');
        }
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 relative">
            <View className="flex-1 relative">
                {/* <GoBackRoute withScrollableLayout /> */}

                {/* Chat Messages */}
                <ScrollView className="flex-1 mt-10 px-4">
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            className={`my-2 ${
                                message.sender === 'user'
                                    ? 'items-end'
                                    : 'items-start'
                            }`}
                        >
                            {message.sender === 'bot' && (
                                <Text className="text-gray-600 ml-2 mb-1">
                                    Cynerate
                                </Text>
                            )}
                            <View
                                className={`rounded-2xl p-3 max-w-[80%] ${
                                    message.sender === 'user'
                                        ? 'bg-primary'
                                        : 'bg-gray-100'
                                }`}
                            >
                                <Text
                                    className={
                                        message.sender === 'user'
                                            ? 'text-white'
                                            : 'text-black'
                                    }
                                >
                                    {message.text}
                                </Text>
                            </View>
                            {message.options && (
                                <View className="mt-2">
                                    {message.options.map((option, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className="bg-gray-200 rounded-full px-4 py-2 mt-1"
                                        >
                                            <Text>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                >
                    <View className="border-t border-gray-200 px-4 py-2">
                        <View className="flex-row items-center">
                            <TextInput
                                className="flex-1 border-primary border-[1px] bg-gray-100 rounded-full px-4 py-2 mr-2"
                                placeholder="Type a message..."
                                value={inputText}
                                onChangeText={setInputText}
                                multiline={false}
                            />
                            <TouchableOpacity
                                onPress={handleSend}
                                className="bg-primary p-2 rounded-full"
                            >
                                <FontAwesome6
                                    name="paper-plane"
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default ChatbotScreen;
