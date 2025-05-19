export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If the date is today
    if (diffDays === 0) {
        return 'Today';
    }

    // If the date is yesterday
    if (diffDays === 1) {
        return 'Yesterday';
    }

    // If the date is within the last 7 days
    if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    // If the date is within the current year
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    // For dates from previous years
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
