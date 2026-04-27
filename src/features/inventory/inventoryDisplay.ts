import type { FoodStatus } from "./inventoryLogic";

// Converts status into text for the user.
export const getStatusLabel = (status: FoodStatus): string => {
  if (status === "expired") return "Expired";
  if (status === "expiringSoon") return "Expiring Soon";

  return "Fresh";
};

// Converts status into a color for the card.
export const getStatusColor = (status: FoodStatus): string => {
  if (status === "expired") return "#e53935";
  if (status === "expiringSoon") return "#fb8c00";

  return "#43a047";
};