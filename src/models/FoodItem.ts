export type StorageCategory = "fridge" | "pantry" | "freezer";
export type MeasurementUnit = "Count" | "Gram" | "Kilogram" | "Milliliter" | "Liter";

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: MeasurementUnit;
  expiryDate: Date;
  category: StorageCategory;
}
