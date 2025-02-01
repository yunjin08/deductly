import { ScrollableLayout } from '@/components/ScrollableLayout';
import { DataPreview } from '@/components/DataPreview';

// Mock data for receipts
const mockDocuments = [
    {
        id: 1,
        title: 'Document Item',
        date: '12/18/2024',
    },
    {
        id: 2,
        title: 'Document Item',
        date: '12/18/2024',
    },
    {
        id: 3,
        title: 'Document Item',
        date: '12/18/2024',
    },
    {
        id: 4,
        title: 'Document Item',
        date: '12/18/2024',
    },
    {
        id: 5,
        title: 'Document Item',
        date: '12/18/2024',
    },
];

const DocumentsScreen = () => {
    const handleGenerateDocument = () => {
        // Implement generate document functionality
    };

    return (
        <ScrollableLayout>
            <DataPreview
                data={mockDocuments}
                title="Tax Documents"
                selectionTitle="Select Report Documents"
                onGenerateDocument={handleGenerateDocument}
            />
        </ScrollableLayout>
    );
};

export default DocumentsScreen;
