import type { Unit } from "./Unit";

export type StorageCategory = "fridge" | "pantry" | "freezer";

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  // ISO calendar date (YYYY-MM-DD), not a timestamp.
  expiryDate: string;
  category: StorageCategory;
}
