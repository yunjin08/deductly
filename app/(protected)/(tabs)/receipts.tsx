import { DataPreview } from '@/components/DataPreview';

// Mock data for receipts
const mockReceipts = [
    {
        id: 1,
        title: 'Receipt Item',
        date: '12/18/2024',
    },
    {
        id: 2,
        title: 'Receipt Item',
        date: '12/18/2024',
    },
    {
        id: 3,
        title: 'Receipt Item',
        date: '12/18/2024',
    },
    {
        id: 4,
        title: 'Receipt Item',
        date: '12/18/2024',
    },
    {
        id: 5,
        title: 'Receipt Item',
        date: '12/18/2024',
    },
];

const ReceiptsScreen = () => {
    const handleGenerateDocument = () => {
        // Implement generate document functionality
    };

    return (
        <DataPreview
            data={mockReceipts}
            title="Receipt List"
            selectionTitle="Select Receipts"
            onGenerateDocument={handleGenerateDocument}
        />
    );
};

export default ReceiptsScreen;
