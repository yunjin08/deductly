import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';

/**
 * Exports a report to PDF and allows the user to share or save it
 * @param report - The report data to export
 */
export const exportReportToPDF = async (report: any) => {
  try {
    // Format dates for display
    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    };

    // Calculate net expenditure
    const grandTotal = parseFloat(report.grand_total_expenditure || '0');
    const taxDeductions = parseFloat(report.total_tax_deductions || '0');
    const netExpenditure = (grandTotal - taxDeductions).toFixed(2);

    // Create HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f0f0f0;
            }
            .label {
              color: #666;
            }
            .value {
              font-weight: 500;
            }
            .financial-summary {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .total-row {
              font-weight: bold;
              border-top: 2px solid #ddd;
              padding-top: 10px;
              margin-top: 10px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            .green {
              color: #2ecc71;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Financial Report</div>
            <div>${report.title || 'Untitled Report'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Report Details</div>
            <div class="row">
              <span class="label">Category:</span>
              <span class="value">${report.category || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Report Period:</span>
              <span class="value">${formatDate(report.start_date)} - ${formatDate(report.end_date)}</span>
            </div>
            <div class="row">
              <span class="label">Report ID:</span>
              <span class="value">${report.id || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Created:</span>
              <span class="value">${formatDate(report.created_at)}</span>
            </div>
            <div class="row">
              <span class="label">Last Updated:</span>
              <span class="value">${formatDate(report.updated_at)}</span>
            </div>
          </div>
          
          <div class="section financial-summary">
            <div class="section-title">Financial Summary</div>
            <div class="row">
              <span class="label">Total Expenditure:</span>
              <span class="value">₱${report.grand_total_expenditure || '0.00'}</span>
            </div>
            <div class="row">
              <span class="label">Tax Deductions:</span>
              <span class="value green">₱${report.total_tax_deductions || '0.00'}</span>
            </div>
            <div class="row total-row">
              <span class="label">Net Expenditure:</span>
              <span class="value">₱${netExpenditure}</span>
            </div>
          </div>

          <!-- Additional data section - will include any other fields from the report -->
          <div class="section">
            <div class="section-title">Additional Information</div>
            ${Object.entries(report)
              .filter(([key]) => 
                !['id', 'title', 'category', 'start_date', 'end_date', 
                  'grand_total_expenditure', 'total_tax_deductions', 
                  'created_at', 'updated_at'].includes(key)
              )
              .map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  return `
                    <div class="row">
                      <span class="label">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                      <span class="value">${JSON.stringify(value)}</span>
                    </div>
                  `;
                } else {
                  return `
                    <div class="row">
                      <span class="label">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                      <span class="value">${value}</span>
                    </div>
                  `;
                }
              }).join('')}
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </body>
      </html>
    `;

    // Generate the PDF file
    const { uri } = await Print.printToFileAsync({ 
      html: htmlContent,
      base64: false 
    });
    
    // Create a more readable filename
    const sanitizedTitle = (report.title || 'Report')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
      
    const fileName = `${sanitizedTitle}_${new Date().toISOString().split('T')[0]}.pdf`;
    const fileUri = FileSystem.documentDirectory + fileName;
    
    // Copy to the new location with a readable name
    await FileSystem.copyAsync({
      from: uri,
      to: fileUri
    });
    
    // Clean up the original file
    await FileSystem.deleteAsync(uri, { idempotent: true });
    
    if (Platform.OS === 'android') {
      // Save to device storage on Android
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === 'granted') {
        // Save file to media library
        await MediaLibrary.createAssetAsync(fileUri);
        Alert.alert('Success', 'Report saved to your device');
      } else {
        // If no permission, just share the file
        await Sharing.shareAsync(fileUri);
      }
    } else {
      // On iOS, just use the sharing dialog
      await Sharing.shareAsync(fileUri);
    }
    
    return true;
  } catch (error) {
    console.error('Error exporting report:', error);
    Alert.alert('Export Failed', 'There was an error exporting your report.');
    return false;
  }
};