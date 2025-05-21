import { DataPreview } from '@/components/DataPreview';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAuthHooks';
import { fetchReports } from '@/contexts/actions/reportActions';
import { useSelector } from 'react-redux';

const ReportsScreen = () => {
    const dispatch = useAppDispatch();
    const reports = useSelector((state: any) => state.reports.reports);

    useEffect(() => {
        dispatch(fetchReports());
    }, [dispatch]);

    const handleGenerateDocument = () => {
        // Implement generate document functionality
    };

    return (
        <DataPreview
            itemType="report"
            data={reports.objects}
            title="Tax Reports"
            selectionTitle="Select Tax Reports"
            onGenerateDocument={handleGenerateDocument}
        />
    );
};

export default ReportsScreen;
