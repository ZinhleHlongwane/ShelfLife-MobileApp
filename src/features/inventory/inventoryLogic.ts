import type { FoodItem } from "../../models/FoodItem";
import { isExpired, isExpiringSoon } from "../../utils/dateHelpers";

export type FoodStatus = "expired" | "expiringSoon" | "fresh";

// Decides the status of a food item based on expiry date.
export const getFoodStatus = (item: FoodItem): FoodStatus => {
  if (isExpired(item.expiryDate)) {
    return "expired";
  }

  if (isExpiringSoon(item.expiryDate)) {
    return "expiringSoon";
  }

  return "fresh";
};