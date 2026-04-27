import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { FoodCard } from "../components/FoodCard";
import type { FoodItem } from "../models/FoodItem";

export const InventoryScreen = () => {
  // State: holds all food items
  const [items, setItems] = useState<FoodItem[]>([]);

  // State: form inputs
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Adds a new item to the inventory
  const addItem = () => {
    // Basic validation
    if (!name || !quantity || !expiryDate) return;

    const newItem: FoodItem = {
      id: Date.now().toString(), // simple unique ID
      name,
      quantity: Number(quantity), // convert string → number
      expiryDate: new Date(expiryDate), // convert string → Date
    };

    // Add item to list
    setItems((prev) => [...prev, newItem]);

    // Reset inputs
    setName("");
    setQuantity("");
    setExpiryDate("");
  };

  // Removes an item by ID
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

        {/* Add button */}
        <Button title="Add Item" onPress={addItem} />
      </View>

      {/* Render list of items */}
      {items.map((item) => (
        <FoodCard key={item.id} item={item} onDelete={deleteItem} />
      ))}
    </ScrollView>
  );
};