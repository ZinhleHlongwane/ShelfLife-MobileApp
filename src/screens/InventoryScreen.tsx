import { useState } from "react";
import { Alert, View, Text, TextInput, Button, ScrollView } from "react-native";
import { FoodCard } from "../components/FoodCard";
import type { FoodItem, StorageCategory } from "../models/FoodItem";
import { Unit, type Unit as UnitType } from "../models/Unit";
import { isValidDateOnly } from "../utils/dateHelpers";

export const InventoryScreen = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<UnitType>(Unit.COUNT);
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState<StorageCategory>("fridge");

  const addItem = () => {
    const trimmedName = name.trim();
    const parsedQuantity = Number(quantity);

    if (!trimmedName || !quantity.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert("Check your item", "Enter a food name and a quantity greater than zero.");
      return;
    }

    if (!isValidDateOnly(expiryDate)) {
      Alert.alert("Check the expiry date", "Enter a valid date in YYYY-MM-DD format.");
      return;
    }

    const newItem: FoodItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: trimmedName,
      quantity: parsedQuantity,
      unit,
      expiryDate,
      category,
    };

    setItems((previous) => [...previous, newItem]);
    setName("");
    setQuantity("");
    setUnit(Unit.COUNT);
    setExpiryDate("");
    setCategory("fridge");
  };

  const deleteItem = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>ShelfLife</Text>
      <Text style={{ marginTop: 4 }}>Track food freshness and reduce waste.</Text>

      <View style={{ marginVertical: 20, gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Add food item</Text>
        <TextInput
          placeholder="Food name"
          value={name}
          onChangeText={setName}
          accessibilityLabel="Food name"
          style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 }}
        />
        <TextInput
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="decimal-pad"
          accessibilityLabel="Quantity"
          style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 }}
        />
        <Text style={{ fontWeight: "600" }}>Measurement unit</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {Object.values(Unit).map((option) => (
            <Button
              key={option}
              title={unit === option ? `✓ ${option}` : option}
              onPress={() => setUnit(option)}
            />
          ))}
        </View>
        <TextInput
          placeholder="Expiry date (YYYY-MM-DD)"
          value={expiryDate}
          onChangeText={setExpiryDate}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          accessibilityLabel="Expiry date in YYYY-MM-DD format"
          style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 }}
        />
        <Text style={{ fontWeight: "600" }}>Storage location</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["fridge", "pantry", "freezer"] as const).map((option) => (
            <Button
              key={option}
              title={category === option ? `✓ ${option}` : option}
              onPress={() => setCategory(option)}
            />
          ))}
        </View>
        <Button title="Add item" onPress={addItem} />
      </View>

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Your inventory</Text>
      {items.length === 0 ? (
        <Text>Your inventory is empty. Add your first food item above.</Text>
      ) : (
        items.map((item) => (
          <FoodCard key={item.id} item={item} onDelete={deleteItem} />
        ))
      )}
    </ScrollView>
  );
};
