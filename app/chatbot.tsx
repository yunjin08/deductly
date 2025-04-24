import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import GoBackRoute from '@/components/GoBackRoute';
import { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchChatHistory, sendMessage } from '@/contexts/actions/userActions';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuthHooks';
import Markdown from 'react-native-markdown-display';
import { useRouter } from 'expo-router'

// Dummy chat data type
type ChatMessage = {
    id?: string | number;
    text?: string;
    sender: 'user' | 'bot' | string | undefined;
    options?: string[];
};

const ChatbotScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const session = useAppSelector((state) => state.auth.session);
    const userId = session?.user?.id;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [contentHeight, setContentHeight] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<
        string | null | undefined
    >(null);

    const handleMessagePress = (messageId: string | undefined) => {
        setSelectedMessage(selectedMessage === messageId ? null : messageId);
    };

    useEffect(() => {
        // This function will run when the component unmounts
        return () => {
          // Reset all state variables to their initial values
          setMessages([]);
          setInputText('');
          setKeyboardVisible(false);
          setCurrentPage(1);
          setIsLoading(false);
          setHasMore(true);
          setTotalPages(1);
          setContentHeight(0);
          setIsLoadingMore(false);
          setSelectedMessage(null);
        };
      }, []); 

    // Handle keyboard events
    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
          }, 300); // Slightly longer timeout to ensure content is rendered
        }
      }, [messages.length === 0]);

    // Fetch chat history
    const fetchChats = useCallback(async () => {
        if (!userId || !hasMore || isLoading) return;
        setIsLoadingMore(true)


        let filters: any = {
            user_id: userId,
        };
        filters['page'] = currentPage;

        // Store the current content height before loading new messages
        const previousContentHeight = contentHeight;

        const result = await dispatch(fetchChatHistory(filters));

        if (fetchChatHistory.fulfilled.match(result)) {
            const allMessages = result.payload.objects;
            const formattedMessages = allMessages
                .flatMap((mes) => [
                    {
                        id: (Number(mes.id) + 0.25 || 0).toString(),
                        text: mes.answer,
                        sender: 'Cynerate',
                    },
                    {
                        id: (Number(mes.id) + 0.5 || 0).toString(),
                        text: mes.question,
                        sender: session?.user?.first_name || 'Guest',
                    },
                ])
                .reverse();

            // Set all messages at once, including initial chat
            setMessages((prev) => [...formattedMessages, ...prev]);
            // Update pagination state
            setHasMore(currentPage < result.payload.num_pages);
            setTotalPages(result.payload.num_pages);
            setCurrentPage((prev) => prev + 1);

            // After rendering, maintain scroll position based on average message height
            setTimeout(() => {
                // Estimate the height of new content based on number of new messages
                // We use an average height per message as an approximation
                const avgMessageHeight = 100; // Approximate height per message in pixels
                const newMessagesCount = formattedMessages.length;
                const scrollOffset = newMessagesCount * avgMessageHeight;
                
                // Scroll to maintain position
                if (scrollViewRef.current && newMessagesCount > 0) {
                    scrollViewRef.current.scrollTo({ 
                        y: scrollOffset, 
                        animated: false 
                    });
                }
                setIsLoadingMore(false);
            }, 200);
        } else {
            setIsLoadingMore(false);
        }
        setIsLoading(false);
    }, [
        dispatch,
        session?.user?.first_name,
        userId,
        currentPage,
        hasMore,
        isLoading,
    ]);

    const navigateToScan = () => {
        router.push('/(protected)/(camera)/camera')
    };

    useEffect(() => {
        if (userId) {
            fetchChats();
        }
    }, [userId]);

    const handleSend = async () => {
        if (inputText.trim()) {
            setInputText('...');
            setMessages([
                ...messages,
                {
                    id: Date.now().toString(),
                    text: inputText,
                    sender: session?.user?.first_name || 'Guest',
                },
            ]);
            // Guest User initialized pk is 0 to simplify the api call
            const resultAction = await dispatch(
                sendMessage({
                    pk: session?.user?.id || 0,
                    filters: {
                        question: inputText,
                    },
                })
            );
            // Type guard to check if the action was fulfilled
            if (sendMessage.fulfilled.match(resultAction)) {

                // Add bot response to messages
                const botMessage: ChatMessage = {
                    id: Date.now().toString(),
                    text: resultAction.payload.answer,
                    sender: 'Cynerate',
                };

                setMessages((prev) => [...prev, botMessage]);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
            setInputText('');
        }
    };

    const getMarkdownStyles = (isCynerate: boolean) => ({
        body: {
            color: isCynerate ? 'black' : 'white',
            fontSize: 12,
            padding: 0,
            marginVertical: 0,
        },
        heading1: {
            color: isCynerate ? 'black' : 'white',
            fontSize: 12, // Same as body text
            fontWeight: '700' as const,
        },
        heading2: {
            color: isCynerate ? 'black' : 'white',
            fontSize: 12, // Same as body text
            fontWeight: '700' as const,
        },
        heading3: {
            color: isCynerate ? 'black' : 'white',
            fontSize: 14, // Same as body text
            fontWeight: '700' as const,
        },
        strong: {
            color: isCynerate ? 'black' : 'white',
            fontWeight: '700' as const,
        },
    });

    // Add an onContentSizeChange handler to track content height
    const handleContentSizeChange = (width: number, height: number) => {
        // Store current scroll position before updating content height
        const prevHeight = contentHeight;
        setContentHeight(height);
        
        // If we're adding new content at the bottom (like sending a message)
        // we should scroll to the bottom
        if (height > prevHeight && !isLoadingMore) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    useEffect(() => {
        if (messages.length > 0 && !isLoadingMore) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
            }, 300);
        }
    }, [messages.length]);


    // Handle scroll to top
    const handleScroll = (event: any) => {
        if (isLoadingMore) return;
        
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

        // Only load more if:
        // 1. We're near the top (within 20 pixels)
        // 2. Not already loading
        // 3. There are more messages to load
        if (contentOffset.y < 20 && !isLoading && !isLoadingMore && hasMore) {
            fetchChats();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            className="flex-1"
        >
            <SafeAreaView edges={['top']} className="flex-1 relative">
                <View className="flex-1 relative">
                    <GoBackRoute withScrollableLayout />

                    {/* Chat Messages */}
                    <View className="flex-1 mt-10 px-4">
                        <ScrollView
                            ref={scrollViewRef}
                            className="flex-1"
                            onScroll={handleScroll}
                            scrollEventThrottle={300}
                            showsVerticalScrollIndicator={false}
                            onContentSizeChange={handleContentSizeChange}
                            bounces={true}
                            alwaysBounceVertical={true}
                        >
                            {isLoadingMore && (
                                <View className="py-2 items-center">
                                    <Text className="text-gray-500">
                                        Loading more messages...
                                    </Text>
                                </View>
                            )}
                            {messages.map((message) => (
                                <TouchableOpacity
                                    key={message.id}
                                    className={`my-2 ${
                                        message.sender !== 'Cynerate'
                                            ? 'items-end'
                                            : 'items-start'
                                    }`}
                                    onPress={() =>
                                        handleMessagePress(
                                            message.id?.toString()
                                        )
                                    }
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-gray-600 ml-2 text-xs mb-1">
                                        {message.sender}
                                    </Text>
                                    <View
                                        className={`rounded-2xl p-3 py-2 max-w-[80%] ${
                                            message.sender !== 'Cynerate'
                                                ? 'bg-primary'
                                                : 'bg-gray-200'
                                        }`}
                                    >
                                        <Markdown
                                            style={getMarkdownStyles(
                                                message.sender === 'Cynerate'
                                            )}
                                        >
                                            {message.text}
                                        </Markdown>
                                        {message.sender === 'Cynerate' && (
                                            <View className="mt-3 border-t border-gray-300 pt-2">
                                                <Text className="text-gray-600 text-xs mb-1">
                                                    You can try scanning your tax documents here:
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={navigateToScan}
                                                    className="bg-primary py-1 px-3 rounded-full mt-1 self-start"
                                                >
                                                    <Text className="text-white text-xs font-medium">Scan</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>

                                    {/* Show date when message is selected */}
                                    {selectedMessage === message.id && (
                                        <Text className="text-gray-500 px-2 text-[0.6rem] mt-1">
                                            {new Date(
                                                parseInt(message.id || '0')
                                            ).toLocaleString()}
                                        </Text>
                                    )}

                                    {message.options && (
                                        <View className="mt-2">
                                            {message.options.map(
                                                (option, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        className="bg-gray-200 rounded-full px-4 py-2 mt-1"
                                                    >
                                                        <Text>{option}</Text>
                                                    </TouchableOpacity>
                                                )
                                            )}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Input Area */}
                    <View className="border-t border-gray-200 px-4 py-2 mb-2">
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
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default ChatbotScreen;
