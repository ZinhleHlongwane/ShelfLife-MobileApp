const EXPIRING_SOON_THRESHOLD = 3;

// Calculates how many days are left before the item expires.
export const getDaysUntilExpiry = (expiryDate: Date): number => {
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Returns true if the expiry date has already passed.
export const isExpired = (expiryDate: Date): boolean => {
  return getDaysUntilExpiry(expiryDate) < 0;
};

// Returns true if the item expires within 3 days but is not expired.
export const isExpiringSoon = (expiryDate: Date): boolean => {
  const days = getDaysUntilExpiry(expiryDate);

  return days >= 0 && days <= EXPIRING_SOON_THRESHOLD;
};