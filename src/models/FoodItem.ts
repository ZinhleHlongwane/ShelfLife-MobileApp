// This describes the shape of one food item in the app.
export interface FoodItem {
  id: string;
  name: string;
  quantity: number;

  // Used to calculate freshness status
  expiryDate: Date;

  // Used to organize items by storage area
  category: "fridge" | "pantry" | "freezer";
}