import type {
    Report,
    User,
    Group,
    KnowledgeItem,
    Document,
    Image,
    Receipt,
    ReceiptItem,
    Vendor,
} from '@/interfaces';

// Generic state interface
interface BaseState<T> {
    data: T[];
    selected: T | null;
    isLoading: boolean;
    error: string | null;
}

export interface ReportsState extends BaseState<Report> {
    dateRange?: { start: Date; end: Date };
    totalDeductions: number;
}

export interface UsersState extends BaseState<User> {
    currentUser: User | null;
}

export interface KnowledgeState extends BaseState<KnowledgeItem> {
    searchResults: KnowledgeItem[];
}

export interface DocumentsState extends BaseState<Document> {
    uploadProgress: number;
}

export interface ImagesState extends BaseState<Image> {
    uploadProgress: number;
}

export interface ReceiptsState extends BaseState<Receipt> {
    filteredReceipts: Receipt[];
    totalExpenditure: number;
}

export interface ReceiptItemsState extends BaseState<ReceiptItem> {
    totalDeductable: number;
}
