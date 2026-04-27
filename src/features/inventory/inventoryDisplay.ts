import type { FoodStatus } from "./inventoryLogic";

// Converts internal status into text the user understands.
export const getStatusLabel = (status: FoodStatus): string => {
  if (status === "expired") return "Expired";
  if (status === "expiringSoon") return "Expiring Soon";

  return "Fresh";
};

// Converts internal status into a card color.
export const getStatusColor = (status: FoodStatus): string => {
  if (status === "expired") return "#e53935";
  if (status === "expiringSoon") return "#fb8c00";

  return "#43a047";
};