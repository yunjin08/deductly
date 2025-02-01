import { ScrollableLayout } from '@/components/ScrollableLayout';
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
        <ScrollableLayout>
            <DataPreview
                data={mockReports}
                title="Tax Reports"
                selectionTitle="Select Tax Reports"
                onGenerateDocument={handleGenerateDocument}
            />
        </ScrollableLayout>
    );
};

export default ReportsScreen;
