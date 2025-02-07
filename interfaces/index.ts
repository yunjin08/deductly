// Analytics Types
export interface Report {
    report_id: string;
    title: string;
    category: string;
    start_date: Date;
    end_date: Date;
    grand_total_expenditure: number;
    total_tax_deductions: number;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    createdAt: string;
    options?: string[];
}

export interface ReportsState {
    reports: Report[];
    selectedReport: Report | null;
    isLoading: boolean;
    error: string | null;
    filters: {
        category?: string;
        startDate?: Date;
        endDate?: Date;
    };
    analytics: {
        totalExpenditure: number;
        totalDeductions: number;
        categorizedExpenses: Record<string, number>;
        monthlyTrends: Array<{
            month: string;
            expenditure: number;
            deductions: number;
        }>;
    };
    exportProgress: number;
}

export interface DateRangeParams {
    startDate: Date;
    endDate: Date;
}

export interface ExportParams {
    reportId: string;
    format: 'pdf' | 'csv' | 'excel';
}

// Account Types
export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    group_id: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
}

export interface Group {
    group_id: string;
    name: string;
    permissions: string[];
}

// Chatbot Types
export interface KnowledgeItem {
    knowledge_item_id: string;
    title: string;
    vector: any;
    content: string;
    category: string;
}

// Files Types
export interface Document {
    document_id: string;
    title: string;
    document_url: string;
    user_id: string;
    type: string;
    date_created: Date;
}

export interface DocumentsState {
    documents: Document[];
    selectedDocument: Document | null;
    isLoading: boolean;
    error: string | null;
    uploadProgress?: number;
    downloadProgress?: number;
}

export interface UploadDocumentPayload {
    file: FormData;
    title: string;
    type: string;
}

export interface ShareDocumentPayload {
    documentId: string;
    userIds: string[];
}

export interface Image {
    image_id: string;
    title: string;
    image_url: string;
    user_id: string;
    date_created: Date;
}

export interface GalleryState {
    images: Image[];
    selectedImage: Image | null;
    isLoading: boolean;
    error: string | null;
    uploadProgress: number;
    view: 'grid' | 'list';
    sortBy: 'date' | 'name';
    filterByUser?: string;
}

export interface ImageUploadOptions {
    file: FormData;
    title: string;
}

export interface ImageOptimizeOptions {
    width?: number;
    height?: number;
    quality?: number;
}

// Receipt Types
export interface Receipt {
    receipt_id: string;
    title: string;
    user_id: string;
    category: string;
    image_id: string;
    total_expenditure: number;
    date_scanned: Date;
    date_generated: Date;
    payment_method: string;
    vendor_id: string;
    discount: number;
    value_added_tax: number;
    document_id: string;
    date_created: Date;
}

export interface ReceiptsState {
    receipts: Receipt[];
    selectedReceipt: Receipt | null;
    receiptItems: Record<string, ReceiptItem[]>; // Keyed by receipt_id
    isLoading: boolean;
    error: string | null;
    scanProgress: number;
    filters: {
        category?: string;
        startDate?: Date;
        endDate?: Date;
        vendor?: string;
    };
    stats: {
        totalExpenditure: number;
        totalDeductions: number;
    };
}

export interface ScanReceiptPayload {
    imageData: FormData;
    onProgress?: (progress: number) => void;
}

export interface DateRangeFilter {
    startDate: Date;
    endDate: Date;
}

export interface ReceiptItem {
    receipt_item_id: string;
    title: string;
    quantity: number;
    price: number;
    subtotal_expenditure: number;
    receipt_id: string;
    date_created: Date;
    deductable_amount: number;
}

export interface Vendor {
    vendor_id: string;
    name: string;
    address: string;
    email: string;
    contact_number: string;
    establishment: string;
    date_created: Date;
}
