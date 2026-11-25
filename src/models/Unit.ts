export const Unit = {
  GRAM: "g",
  KILOGRAM: "kg",
  MILLILITER: "ml",
  LITER: "l",
  COUNT: "count",
} as const;

export type Unit = (typeof Unit)[keyof typeof Unit];
