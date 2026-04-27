import { Text, View, TouchableOpacity } from "react-native";
import type { FoodItem } from "../models/FoodItem";

// Logic + display helpers
import { getFoodStatus } from "../features/inventory/inventoryLogic";
import { getStatusColor, getStatusLabel } from "../features/inventory/inventoryDisplay";
import { getDaysUntilExpiry } from "../utils/dateHelpers";

// Props: what this component expects
type Props = {
  item: FoodItem;
  onDelete: (id: string) => void;
};

export const FoodCard = ({ item, onDelete }: Props) => {
  // Determine item status (expired / expiringSoon / fresh)
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

        // Left border visually shows status (red/orange/green)
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

      {/* Status label + days left */}
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