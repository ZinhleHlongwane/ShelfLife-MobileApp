const EXPIRING_SOON_THRESHOLD = 3;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isValidDateOnly = (value: string): boolean => {
  if (!DATE_ONLY_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const toUtcDay = (value: string): number => {
  if (!isValidDateOnly(value)) {
    throw new RangeError(`Invalid expiry date: ${value}`);
  }

  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

export const getDaysUntilExpiry = (
  expiryDate: string,
  today: Date = new Date(),
): number => {
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (toUtcDay(expiryDate) - toUtcDay(todayKey)) / 86_400_000;
};

export const isExpired = (expiryDate: string, today: Date = new Date()): boolean =>
  getDaysUntilExpiry(expiryDate, today) < 0;

export const isExpiringSoon = (
  expiryDate: string,
  today: Date = new Date(),
): boolean => {
  const days = getDaysUntilExpiry(expiryDate, today);
  return days >= 0 && days <= EXPIRING_SOON_THRESHOLD;
};
