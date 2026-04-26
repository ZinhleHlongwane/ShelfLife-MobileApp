import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { FoodCard } from "../components/FoodCard";
import { FoodItem } from "../models/FoodItem";

export const InventoryScreen = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const addItem = () => {
    if (!name || !quantity) return;

    const newItem: FoodItem = {
      id: Date.now().toString(),
      name,
      quantity: Number(quantity),
    };

    setItems((prev) => [...prev, newItem]);

    setName("");
    setQuantity("");
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        ShelfLife
      </Text>

      <View style={{ marginVertical: 20 }}>
        <TextInput
          placeholder="Food name"
          value={name}
          onChangeText={setName}
          style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
          }}
        />

        <Button title="Add Item" onPress={addItem} />
      </View>

      {items.map((item) => (
        <FoodCard key={item.id} item={item} onDelete={deleteItem} />
      ))}
    </ScrollView>
  );
};