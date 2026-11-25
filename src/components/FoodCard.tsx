import { Pressable, StyleSheet, Text, View } from "react-native";
import type { FoodItem } from "../models/FoodItem";
import { getFoodStatus } from "../features/inventory/inventoryLogic";
import { getStatusColor, getStatusLabel } from "../features/inventory/inventoryDisplay";
import { getDaysUntilExpiry } from "../utils/dateHelpers";

type Props = {
  item: FoodItem;
  onDelete: (id: string) => void;
  onEdit: (item: FoodItem) => void;
};

const formatDate = (date: Date): string =>
  date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export const FoodCard = ({ item, onDelete, onEdit }: Props) => {
  const status = getFoodStatus(item);
  const color = getStatusColor(status);
  const daysLeft = getDaysUntilExpiry(item.expiryDate);
  const expiryText = daysLeft < 0
    ? `Expired ${Math.abs(daysLeft)} day(s) ago`
    : daysLeft === 0 ? "Expires today" : `${daysLeft} day(s) left`;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>{item.quantity} {item.unit.toLowerCase()} <Text style={styles.separator}>·</Text> {item.category}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
      </View>
      <View style={styles.bottomRow}>
        <View>
          <Text style={[styles.status, { color }]}>{getStatusLabel(status)} · {expiryText}</Text>
          <Text style={styles.date}>Best before {formatDate(item.expiryDate)}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => onEdit(item)} hitSlop={8}><Text style={styles.edit}>Edit</Text></Pressable>
          <Pressable onPress={() => onDelete(item.id)} hitSlop={8}><Text style={styles.delete}>Delete</Text></Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#fffefa", borderWidth: 1, borderColor: "#e8ede5", borderLeftWidth: 4, borderRadius: 11, padding: 13, marginBottom: 9 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  titleGroup: { flex: 1 },
  name: { color: "#26372e", fontSize: 14, fontWeight: "700" },
  meta: { color: "#78847a", fontSize: 10, marginTop: 5, textTransform: "capitalize" },
  separator: { color: "#b5beb4" },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12, gap: 8 },
  status: { fontSize: 10, fontWeight: "700" },
  date: { color: "#929d91", fontSize: 9, marginTop: 4 },
  actions: { flexDirection: "row", gap: 13 },
  edit: { color: "#55775b", fontSize: 10, fontWeight: "600" },
  delete: { color: "#a56c62", fontSize: 10, fontWeight: "600" },
});
