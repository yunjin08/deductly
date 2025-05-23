import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface ReportData {
    id: string;
    title: string;
    category: string;
    start_date: string;
    end_date: string;
    grand_total_expenditure: string;
    total_tax_deductions: string;
    created_at: string;
    updated_at: string;
}

interface ReportGraphProps {
    reports: ReportData[];
}

export const ReportGraph = ({ reports }: ReportGraphProps) => {
    // Filter only monthly reports
    const monthlyReports = reports?.filter(report => report.category === 'MONTHLY');

    // Sort reports by date
    const sortedReports = [...monthlyReports]?.sort((a, b) => 
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    // Helper function to safely parse numbers
    const safeParseFloat = (value: string): number => {
        if (!value) return 0;
        const parsed = parseFloat(value.replace(/,/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    };

    // Prepare data for the chart
    const chartData = {
        labels: sortedReports?.map(report => {
            const date = new Date(report.start_date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }) || [],
        datasets: [
            {
                data: sortedReports?.map(report => safeParseFloat(report.grand_total_expenditure)) || [],
                color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue color
                strokeWidth: 2
            },
            {
                data: sortedReports?.map(report => safeParseFloat(report.total_tax_deductions)) || [],
                color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green color
                strokeWidth: 2
            }
        ],
        legend: ["Total Expenditure", "Tax Deductions"]
    };

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
        }
    };

    // Don't render the chart if there's no data
    if (!sortedReports || sortedReports.length === 0) {
        return (
            <View className="mb-6">
                <Text className="text-lg font-bold mb-4 text-center">Monthly Report Summary</Text>
                <Text className="text-center text-gray-500">No monthly reports available</Text>
            </View>
        );
    }

    return (
        <View className="mb-6">
            <Text className="text-lg font-bold mb-4 text-center">Monthly Report Summary</Text>
            <LineChart
                data={chartData}
                width={Dimensions.get("window").width - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
}; 