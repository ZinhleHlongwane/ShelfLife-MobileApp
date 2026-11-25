import { Text, View, TouchableOpacity } from "react-native";
import type { FoodItem } from "../models/FoodItem";
import { getFoodStatus } from "../features/inventory/inventoryLogic";
import { getStatusColor, getStatusLabel } from "../features/inventory/inventoryDisplay";
import { getDaysUntilExpiry } from "../utils/dateHelpers";

type Props = {
  item: FoodItem;
  onDelete: (id: string) => void;
};

export const FoodCard = ({ item, onDelete }: Props) => {
  const status = getFoodStatus(item);
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);
  const daysLeft = getDaysUntilExpiry(item.expiryDate);

  const expiryMessage =
    daysLeft < 0
      ? `Expired ${Math.abs(daysLeft)} day(s) ago`
      : daysLeft === 0
        ? "Expires today"
        : `${daysLeft} day(s) until expiry`;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderLeftWidth: 6,
        borderLeftColor: statusColor,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
      <Text>Quantity: {item.quantity} {item.unit}</Text>
      <Text>Storage: {item.category}</Text>
      <Text style={{ color: statusColor, fontWeight: "bold", marginTop: 6 }}>
        {statusLabel} · {expiryMessage}
      </Text>
      <TouchableOpacity onPress={() => onDelete(item.id)} accessibilityRole="button" accessibilityLabel={`Remove ${item.name}`}>
        <Text style={{ color: "red", marginTop: 10 }}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};
