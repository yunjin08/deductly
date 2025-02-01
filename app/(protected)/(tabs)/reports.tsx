import { DataPreview } from '@/components/DataPreview';

// Mock data for reports
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
    const handleGenerateDocument = () => {
        // Implement generate document functionality
    };

    return (
        <DataPreview
            data={mockReports}
            title="Tax Reports"
            selectionTitle="Select Tax Reports"
            onGenerateDocument={handleGenerateDocument}
        />
    );
};

export default ReportsScreen;
