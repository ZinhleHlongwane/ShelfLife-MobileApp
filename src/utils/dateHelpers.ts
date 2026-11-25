const EXPIRING_SOON_THRESHOLD = 3;

const toCalendarDay = (date: Date): number =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

export const getDaysUntilExpiry = (expiryDate: Date): number => {
  const today = new Date();
  return Math.round((toCalendarDay(expiryDate) - toCalendarDay(today)) / 86_400_000);
};

export const isExpired = (expiryDate: Date): boolean =>
  getDaysUntilExpiry(expiryDate) < 0;

export const isExpiringSoon = (expiryDate: Date): boolean => {
  const days = getDaysUntilExpiry(expiryDate);
  return days >= 0 && days <= EXPIRING_SOON_THRESHOLD;
};
