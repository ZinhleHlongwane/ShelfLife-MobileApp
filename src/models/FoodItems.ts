import { Text, View, TouchableOpacity } from "react-native";
import { FoodItem } from "../models/FoodItem";

type Props = {
  item: FoodItem;
  onDelete: (id: string) => void;
};

export const FoodCard = ({ item, onDelete }: Props) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {item.name}
      </Text>

      <Text>
        Quantity: {item.quantity}
      </Text>

      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Text style={{ color: "red", marginTop: 10 }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};