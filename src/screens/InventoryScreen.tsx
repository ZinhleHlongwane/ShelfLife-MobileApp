import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { FoodCard } from "../components/FoodCard";
import type { FoodItem } from "../models/FoodItem";

// Define allowed categories
type Category = "fridge" | "pantry" | "freezer";

export const InventoryScreen = () => {
  // State: stores all items
  const [items, setItems] = useState<FoodItem[]>([]);

  // State: form inputs
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState<Category>("fridge");

  // Adds a new item to inventory
  const addItem = () => {
    // Basic validation
    if (!name || !quantity || !expiryDate) return;

    const newItem: FoodItem = {
      id: Date.now().toString(), // unique ID
      name,
      quantity: Number(quantity), // string → number
      expiryDate: new Date(expiryDate), // string → Date
      category,
    };

    // Add item to list
    setItems((prev) => [...prev, newItem]);

    // Reset form inputs
    setName("");
    setQuantity("");
    setExpiryDate("");
    setCategory("fridge");
  };

  // Deletes an item by ID
  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {/* App title */}
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        ShelfLife
      </Text>

      {/* Form section */}
      <View style={{ marginVertical: 20 }}>
        {/* Name input */}
        <TextInput
          placeholder="Food name"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        {/* Quantity input */}
        <TextInput
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        {/* Expiry date input */}
        <TextInput
          placeholder="Expiry date e.g. 2026-04-30"
          value={expiryDate}
          onChangeText={setExpiryDate}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        {/* Category selection buttons */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
          <Button title="Fridge" onPress={() => setCategory("fridge")} />
          <Button title="Pantry" onPress={() => setCategory("pantry")} />
          <Button title="Freezer" onPress={() => setCategory("freezer")} />
        </View>

        {/* Show selected category */}
        <Text style={{ marginBottom: 10 }}>
          Selected: {category}
        </Text>

        {/* Add item button */}
        <Button title="Add Item" onPress={addItem} />
      </View>

      {/* Render all items */}
      {items.map((item) => (
        <FoodCard key={item.id} item={item} onDelete={deleteItem} />
      ))}
    </ScrollView>
  );
};