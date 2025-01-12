import { EMAIL_PATTERN } from '@/constants/Regex';

export const isValidEmail = (email: string) => {
    const emailRegex = EMAIL_PATTERN;
    return emailRegex.test(email);
};
