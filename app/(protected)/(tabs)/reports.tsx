import { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { ScrollableLayout } from '@/components/ScrollableLayout';
import { FontAwesome6 } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import Header from '@/components/Header';

// Mock data for receipts
const mockReports = [
    {
        id: 1,
        title: 'Report Item',
        date: '12/18/2024',
    },
    {
        id: 2,
        title: 'Report Item',
        date: '12/18/2024',
    },
    {
        id: 3,
        title: 'Report Item',
        date: '12/18/2024',
    },
    {
        id: 4,
        title: 'Report Item',
        date: '12/18/2024',
    },
    {
        id: 5,
        title: 'Report Item',
        date: '12/18/2024',
    },
];

const ReportsScreen = () => {
    const [selectedReports, setSelectedReports] = useState<number[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const handleLongPress = (id: number) => {
        setIsSelectionMode(true);
        setSelectedReports([id]);
    };

    const handlePress = (id: number) => {
        if (isSelectionMode) {
            if (selectedReports.includes(id)) {
                const newSelected = selectedReports.filter(
                    (item) => item !== id
                );
                setSelectedReports(newSelected);
                if (newSelected.length === 0) {
                    setIsSelectionMode(false);
                }
            } else {
                setSelectedReports([...selectedReports, id]);
            }
        }
    };

    const handleDelete = () => {
        // Implement delete functionality here
        setSelectedReports([]);
        setIsSelectionMode(false);
    };

    const renderHeader = () => (
        <>
            <Header />
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl w-full text-center font-bold">
                    {isSelectionMode ? 'Select Receipts' : 'Receipt List'}
                </Text>
                {isSelectionMode && selectedReports.length > 0 && (
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="flex-row items-center gap-2"
                    >
                        <FontAwesome6 name="trash" size={20} color="red" />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );

    const renderItem = ({ item }) => {
        const isSelected = selectedReports.includes(item.id);
        return (
            <Pressable
                onLongPress={() => handleLongPress(item.id)}
                onPress={() => handlePress(item.id)}
                className={`flex-row items-center p-4 rounded-xl mb-2 ${
                    isSelected ? 'bg-gray-200' : 'bg-gray-50'
                }`}
            >
                <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                    <FontAwesome6 name="image" size={24} color="#A0A0A0" />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-medium">{item.title}</Text>
                    <Text className="text-gray-500">{item.date}</Text>
                </View>
                {isSelectionMode && (
                    <View
                        className={`w-6 h-6 rounded-full border-2 ${
                            isSelected
                                ? 'bg-primary border-primary'
                                : 'border-gray-300'
                        } items-center justify-center`}
                    >
                        {isSelected && (
                            <FontAwesome6
                                name="check"
                                size={12}
                                color="white"
                            />
                        )}
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <ScrollableLayout>
            <FlatList
                data={mockReports}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
            />
            {isSelectionMode && (
                <TouchableOpacity className="bg-primary py-4 rounded-xl mt-4">
                    <Text className="text-white text-center font-semibold">
                        Generate Tax Document
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollableLayout>
    );
};

export default ReportsScreen;
