import type { FoodItem } from "../models/FoodItem";

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.0.2.2:5000").replace(/\/$/, "");

type ApiInventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: "Count" | "Gram" | "Kilogram" | "Milliliter" | "Liter";
  expiryDate: string;
  category: "Fridge" | "Pantry" | "Freezer";
};

type InventoryRequest = Omit<ApiInventoryItem, "id">;

const toFoodItem = (item: ApiInventoryItem): FoodItem => {
  const [year, month, day] = item.expiryDate.split("-").map(Number);
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    expiryDate: new Date(year, month - 1, day),
    category: item.category.toLowerCase() as FoodItem["category"],
  };
};

const toRequest = (item: Omit<FoodItem, "id">): InventoryRequest => ({
  name: item.name.trim(),
  quantity: item.quantity,
  unit: item.unit,
  expiryDate: [
    item.expiryDate.getFullYear(),
    String(item.expiryDate.getMonth() + 1).padStart(2, "0"),
    String(item.expiryDate.getDate()).padStart(2, "0"),
  ].join("-"),
  category: (item.category.charAt(0).toUpperCase() + item.category.slice(1)) as InventoryRequest["category"],
});

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error(`Could not reach ShelfLife API at ${API_BASE_URL}. Check that the API is running and your device can reach it.`);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `The API returned HTTP ${response.status}.`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const inventoryApi = {
  async getAll(): Promise<FoodItem[]> {
    const items = await request<ApiInventoryItem[]>("/api/inventory");
    return items.map(toFoodItem);
  },

  async create(item: Omit<FoodItem, "id">): Promise<FoodItem> {
    const created = await request<ApiInventoryItem>("/api/inventory", {
      method: "POST",
      body: JSON.stringify(toRequest(item)),
    });
    return toFoodItem(created);
  },

  async update(id: string, item: Omit<FoodItem, "id">): Promise<FoodItem> {
    const updated = await request<ApiInventoryItem>(`/api/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(toRequest(item)),
    });
    return toFoodItem(updated);
  },

  async delete(id: string): Promise<void> {
    await request<void>(`/api/inventory/${id}`, { method: "DELETE" });
  },
};
