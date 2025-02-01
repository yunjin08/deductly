// Generic CRUD action types
export const createActionTypes = (feature: string) => ({
    FETCH_ALL: `${feature}/fetchAll`,
    FETCH_ONE: `${feature}/fetchOne`,
    CREATE: `${feature}/create`,
    UPDATE: `${feature}/update`,
    DELETE: `${feature}/delete`,
});

export const REPORTS = createActionTypes('reports');
export const USERS = createActionTypes('users');
export const GROUPS = createActionTypes('groups');
export const KNOWLEDGE = createActionTypes('knowledge');
export const DOCUMENTS = createActionTypes('documents');
export const IMAGES = createActionTypes('images');
export const RECEIPTS = createActionTypes('receipts');
export const RECEIPT_ITEMS = createActionTypes('receiptItems');
export const VENDORS = createActionTypes('vendors');
