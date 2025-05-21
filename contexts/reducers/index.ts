import { combineReducers } from 'redux';
import authReducer from './authReducers';
import receiptsReducer from './receiptsReducers';
import documentsReducer from './documentsReducers';
import reportsReducer from './reportReducers';
import galleryReducer from './galleryReducers';

const rootReducer = combineReducers({
    auth: authReducer,
    receipts: receiptsReducer,
    documents: documentsReducer,
    reports: reportsReducer,
    gallery: galleryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
