import { DataPreview } from '@/components/DataPreview';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAuthHooks';
import { useSelector } from 'react-redux';
import { fetchReceipts } from '@/contexts/actions/receiptsActions';

const ReceiptsScreen = () => {
    const dispatch = useAppDispatch();
    const receipts = useSelector((state: any) => state.receipts?.receipts);

    useEffect(() => {
        dispatch(fetchReceipts());
    }, [dispatch]);

    const handleGenerateDocument = () => {
        // Implement generate document functionality
    };

    return (
        <DataPreview
            itemType="receipt"
            data={receipts.objects}
            title="Receipt List"
            selectionTitle="Select Receipts"
            onGenerateDocument={handleGenerateDocument}
        />
    );
};

export default ReceiptsScreen;
