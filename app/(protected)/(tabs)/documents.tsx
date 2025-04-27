import { DataPreview } from '@/components/DataPreview';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuthHooks';
import { fetchDocuments } from '@/contexts/actions/documentsActions';
import { useSelector } from 'react-redux';
// Fallback mock data in case Redux data is not available

const DocumentsScreen = () => {
    const dispatch = useAppDispatch();
    const reduxState = useAppSelector((state) => state);
    const [displayData, setDisplayData] = useState([]);
    const documents = useSelector((state: any) => state.documents.documents);

    useEffect(() => {
        dispatch(fetchDocuments());
    }, []);

    const handleGenerateDocument = () => {
        // Implement generate document functionality
    };

    return (
        <DataPreview
            data={documents.objects}
            title="Tax Documents"
            selectionTitle="Select Report Documents"
            onGenerateDocument={handleGenerateDocument}
        />
    );
};

export default DocumentsScreen;
