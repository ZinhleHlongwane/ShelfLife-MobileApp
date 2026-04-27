// This describes the shape of one food item in the app.
export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  expiryDate: Date;
}