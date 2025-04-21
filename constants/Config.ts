// Backend URL configuration
export const BACKEND_URL = __DEV__ 
    ? 'http://localhost:8000'  // Development
    : 'https://api.deductly.com';  // Production - replace with your actual production URL 