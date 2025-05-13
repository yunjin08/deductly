import { DataPreview } from '@/components/DataPreview';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuthHooks';
import { useSelector } from 'react-redux';
import { fetchReceipts } from '@/contexts/actions/receiptsActions';

// Fallback mock data in case Redux data is not available
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
    const dispatch = useAppDispatch();
    const receipts = useSelector((state: any) => state.receipts.receipts);

    useEffect(() => {
        dispatch(fetchReceipts());
    }, []);

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
