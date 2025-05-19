import { DataPreview } from '@/components/DataPreview';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAuthHooks';
import { fetchDocuments } from '@/contexts/actions/documentsActions';
import { useSelector } from 'react-redux';
// Fallback mock data in case Redux data is not available

const DocumentsScreen = () => {
    const dispatch = useAppDispatch();
    const documents = useSelector((state: any) => state.documents.documents);

    useEffect(() => {
        dispatch(fetchDocuments());
    }, [dispatch]);

    const handleGenerateDocument = () => {
        // Implement generate document functionality
    };

    return (
        <DataPreview
            itemType="document"
            data={documents.objects}
            title="Tax Documents"
            selectionTitle="Select Report Documents"
            onGenerateDocument={handleGenerateDocument}
        />
    );
};

export default DocumentsScreen;
