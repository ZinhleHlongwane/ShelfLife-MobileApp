import { Text, View, TouchableOpacity } from "react-native";
import type { FoodItem } from "../models/FoodItem";

// Import logic to determine item status
import { getFoodStatus } from "../features/inventory/inventoryLogic";

// Import helpers to display status nicely
import { getStatusColor, getStatusLabel } from "../features/inventory/inventoryDisplay";
import { getDaysUntilExpiry } from "../utils/dateHelpers";

// Props: what this component receives
type Props = {
  item: FoodItem;
  onDelete: (id: string) => void;
};

export const FoodCard = ({ item, onDelete }: Props) => {
  // Determine the item's status (expired / expiringSoon / fresh)
  const status = getFoodStatus(item);

  // Convert status into UI values
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  // Calculate how many days left before expiry
  const daysLeft = getDaysUntilExpiry(item.expiryDate);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,

        // Visual indicator of status (red/orange/green line)
        borderLeftWidth: 6,
        borderLeftColor: statusColor,
      }}
    >
      {/* Food name */}
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {item.name}
      </Text>

      {/* Quantity */}
      <Text>
        Quantity: {item.quantity}
      </Text>

      {/* Category */}
      <Text>
        Category: {item.category}
      </Text>

      {/* Status + days left */}
      <Text style={{ color: statusColor, fontWeight: "bold", marginTop: 6 }}>
        {statusLabel} • {daysLeft} day(s) left
      </Text>

      {/* Delete button */}
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Text style={{ color: "red", marginTop: 10 }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};