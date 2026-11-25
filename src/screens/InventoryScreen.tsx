import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FoodCard } from "../components/FoodCard";
import type { FoodItem, MeasurementUnit, StorageCategory } from "../models/FoodItem";
import { inventoryApi } from "../services/inventoryApi";

const CATEGORIES: StorageCategory[] = ["fridge", "pantry", "freezer"];
const UNITS: MeasurementUnit[] = ["Count", "Gram", "Kilogram", "Milliliter", "Liter"];
type Filter = "all" | StorageCategory;

const formatDate = (date: Date): string =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");

const parseDate = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};

export const InventoryScreen = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState<MeasurementUnit>("Count");
  const [expiryDate, setExpiryDate] = useState(formatDate(new Date()));
  const [category, setCategory] = useState<StorageCategory>("fridge");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInventory = useCallback(async () => {
    setError(null);
    try {
      setItems(await inventoryApi.getAll());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load your inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const visibleItems = useMemo(
    () => filter === "all" ? items : items.filter((item) => item.category === filter),
    [filter, items],
  );
  const expiringCount = items.filter((item) => {
    const days = Math.round((Date.UTC(item.expiryDate.getFullYear(), item.expiryDate.getMonth(), item.expiryDate.getDate()) - Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) / 86_400_000);
    return days >= 0 && days <= 3;
  }).length;

  const resetForm = () => {
    setName("");
    setQuantity("1");
    setUnit("Count");
    setExpiryDate(formatDate(new Date()));
    setCategory("fridge");
    setEditingId(null);
  };

  const saveItem = async () => {
    const parsedQuantity = Number(quantity);
    const parsedExpiryDate = parseDate(expiryDate);
    if (!name.trim()) {
      Alert.alert("Food name required", "Enter the name of the food item.");
      return;
    }
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert("Check quantity", "Enter a quantity greater than zero.");
      return;
    }
    if (!parsedExpiryDate) {
      Alert.alert("Check expiry date", "Use a valid date in YYYY-MM-DD format.");
      return;
    }

    setSaving(true);
    setError(null);
    const item = { name: name.trim(), quantity: parsedQuantity, unit, expiryDate: parsedExpiryDate, category };
    try {
      if (editingId) {
        const updated = await inventoryApi.update(editingId, item);
        setItems((current) => current.map((entry) => entry.id === updated.id ? updated : entry));
      } else {
        const created = await inventoryApi.create(item);
        setItems((current) => [...current, created].sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime()));
      }
      resetForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this item.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (item: FoodItem) => {
    setEditingId(item.id);
    setName(item.name);
    setQuantity(String(item.quantity));
    setUnit(item.unit);
    setExpiryDate(formatDate(item.expiryDate));
    setCategory(item.category);
    setError(null);
  };

  const deleteItem = (id: string) => {
    Alert.alert("Delete food item?", "This will remove the item from your shared ShelfLife inventory.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void inventoryApi.delete(id).then(() => {
            setItems((current) => current.filter((item) => item.id !== id));
            if (editingId === id) resetForm();
          }).catch((deleteError: unknown) => {
            setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this item.");
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandLeaf}>✳</Text></View>
          <Text style={styles.brand}>ShelfLife</Text>
        </View>
        <Text style={styles.kicker}>YOUR KITCHEN, IN SYNC</Text>
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>A FRESHER WAY TO MANAGE FOOD</Text>
        <Text style={styles.title}>Make room for <Text style={styles.titleAccent}>less waste.</Text></Text>
        <Text style={styles.subtitle}>Keep track of what you have and use it while it is fresh.</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL ITEMS</Text>
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statHint}>In your inventory</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>USE SOON</Text>
          <Text style={[styles.statNumber, styles.warningNumber]}>{expiringCount}</Text>
          <Text style={styles.statHint}>Next 3 days</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeading}>
          <Text style={styles.panelTitle}>{editingId ? "Edit food item" : "Add to your inventory"}</Text>
          <Text style={styles.headingIcon}>＋</Text>
        </View>
        <Text style={styles.fieldLabel}>FOOD NAME</Text>
        <TextInput value={name} onChangeText={setName} placeholder="e.g. Fresh milk" placeholderTextColor="#9aa59a" style={styles.input} maxLength={120} />
        <View style={styles.twoColumns}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>QUANTITY</Text>
            <TextInput value={quantity} onChangeText={setQuantity} keyboardType="decimal-pad" placeholder="1" style={styles.input} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>UNIT</Text>
            <View style={styles.selectWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {UNITS.map((value) => (
                  <Pressable key={value} onPress={() => setUnit(value)} style={[styles.smallChip, unit === value && styles.chipActive]}>
                    <Text style={[styles.smallChipText, unit === value && styles.chipTextActive]}>{value}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        <Text style={styles.fieldLabel}>EXPIRY DATE (YYYY-MM-DD)</Text>
        <TextInput value={expiryDate} onChangeText={setExpiryDate} placeholder="2026-12-31" style={styles.input} autoCapitalize="none" />
        <Text style={styles.fieldLabel}>STORAGE AREA</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((value) => (
            <Pressable key={value} onPress={() => setCategory(value)} style={[styles.categoryChip, category === value && styles.chipActive]}>
              <Text style={[styles.categoryChipText, category === value && styles.chipTextActive]}>{value.charAt(0).toUpperCase() + value.slice(1)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.formActions}>
          {editingId && <Pressable onPress={resetForm} style={styles.cancelButton}><Text style={styles.cancelText}>Cancel</Text></Pressable>}
          <Pressable disabled={saving} onPress={() => void saveItem()} style={[styles.saveButton, saving && styles.disabledButton]}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>{editingId ? "Save changes" : "Add food item"}  →</Text>}
          </Pressable>
        </View>
      </View>

      <View style={styles.inventorySection}>
        <View style={styles.inventoryHeading}>
          <View>
            <Text style={styles.eyebrow}>WHAT YOU HAVE</Text>
            <Text style={styles.panelTitle}>Your inventory</Text>
          </View>
          <Text style={styles.itemCount}>{items.length} items</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {(["all", ...CATEGORIES] as Filter[]).map((value) => (
            <Pressable key={value} onPress={() => setFilter(value)} style={[styles.filterChip, filter === value && styles.filterActive]}>
              <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{value === "all" ? "All items" : value.charAt(0).toUpperCase() + value.slice(1)}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.emptyState}><ActivityIndicator color="#315d45" /><Text style={styles.emptyText}>Loading your shared inventory…</Text></View>
        ) : visibleItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🥬</Text>
            <Text style={styles.emptyTitle}>Nothing here just yet</Text>
            <Text style={styles.emptyText}>Add your groceries above and they will appear here.</Text>
          </View>
        ) : (
          visibleItems.map((item) => <FoodCard key={item.id} item={item} onDelete={deleteItem} onEdit={startEditing} />)
        )}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void loadInventory()}><Text style={styles.retryText}>Retry</Text></Pressable>
        </View>
      )}
      <Text style={styles.footer}>ShelfLife · Less waste, more thoughtful living.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f6f7f1" },
  content: { padding: 20, paddingTop: 56, paddingBottom: 44, maxWidth: 620, width: "100%", alignSelf: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: "#e4e9df" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: { width: 33, height: 33, borderRadius: 11, backgroundColor: "#315d45", alignItems: "center", justifyContent: "center" },
  brandLeaf: { color: "#fff", fontSize: 19 },
  brand: { color: "#26372e", fontSize: 21, fontWeight: "800", letterSpacing: -0.7 },
  kicker: { color: "#849184", fontSize: 9, letterSpacing: 1.1, fontWeight: "700" },
  intro: { paddingTop: 34, paddingBottom: 22 },
  eyebrow: { color: "#6d886f", fontSize: 9, fontWeight: "800", letterSpacing: 1.4, marginBottom: 8 },
  title: { color: "#26372e", fontSize: 34, lineHeight: 41, fontWeight: "800", letterSpacing: -1.4 },
  titleAccent: { color: "#719071" },
  subtitle: { color: "#78847a", fontSize: 13, lineHeight: 20, marginTop: 9, maxWidth: 320 },
  stats: { flexDirection: "row", gap: 10, marginBottom: 17 },
  statCard: { flex: 1, backgroundColor: "#fffefa", borderWidth: 1, borderColor: "#e4e9df", borderRadius: 14, padding: 15 },
  statLabel: { color: "#78847a", fontSize: 9, letterSpacing: 1, fontWeight: "700" },
  statNumber: { color: "#26372e", fontSize: 29, fontWeight: "800", marginTop: 4 },
  warningNumber: { color: "#b47b35" },
  statHint: { color: "#929d91", fontSize: 10, marginTop: 2 },
  panel: { backgroundColor: "#fffefa", borderWidth: 1, borderColor: "#e4e9df", borderRadius: 17, padding: 18 },
  panelHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  panelTitle: { color: "#26372e", fontSize: 19, fontWeight: "800", letterSpacing: -0.5 },
  headingIcon: { color: "#91a78c", fontSize: 24 },
  fieldLabel: { color: "#536258", fontSize: 9, fontWeight: "800", letterSpacing: 1, marginBottom: 7, marginTop: 12 },
  input: { minHeight: 45, borderWidth: 1, borderColor: "#dfe6dc", borderRadius: 9, paddingHorizontal: 12, color: "#26372e", backgroundColor: "#fff", fontSize: 13 },
  twoColumns: { flexDirection: "row", gap: 10 },
  halfField: { flex: 1, minWidth: 0 },
  selectWrap: { minHeight: 45, justifyContent: "center", borderWidth: 1, borderColor: "#dfe6dc", borderRadius: 9, paddingHorizontal: 5, backgroundColor: "#fff" },
  smallChip: { paddingHorizontal: 8, paddingVertical: 7, borderRadius: 7, marginRight: 3 },
  smallChipText: { color: "#68776b", fontSize: 10 },
  chipActive: { backgroundColor: "#315d45", borderColor: "#315d45" },
  chipTextActive: { color: "#fff" },
  chipRow: { flexDirection: "row", gap: 7 },
  categoryChip: { flex: 1, alignItems: "center", borderWidth: 1, borderColor: "#dfe6dc", borderRadius: 8, paddingVertical: 10, backgroundColor: "#fff" },
  categoryChipText: { color: "#68776b", fontSize: 11, fontWeight: "600" },
  formActions: { flexDirection: "row", gap: 8, marginTop: 18 },
  saveButton: { flex: 1, minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 9, backgroundColor: "#315d45" },
  saveText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  disabledButton: { opacity: 0.65 },
  cancelButton: { justifyContent: "center", paddingHorizontal: 14, borderRadius: 9, borderWidth: 1, borderColor: "#e4e9df" },
  cancelText: { color: "#78847a", fontSize: 12 },
  inventorySection: { marginTop: 29 },
  inventoryHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 },
  itemCount: { color: "#78847a", fontSize: 11 },
  filterRow: { gap: 7, paddingBottom: 14 },
  filterChip: { backgroundColor: "#edf1e9", borderRadius: 22, paddingHorizontal: 13, paddingVertical: 8 },
  filterActive: { backgroundColor: "#315d45" },
  filterText: { color: "#68776b", fontSize: 11 },
  filterTextActive: { color: "#fff" },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 34, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 30, marginBottom: 9 },
  emptyTitle: { color: "#26372e", fontSize: 14, fontWeight: "700", marginBottom: 5 },
  emptyText: { color: "#78847a", fontSize: 11, textAlign: "center", lineHeight: 17, marginTop: 8 },
  errorBox: { backgroundColor: "#fff6f3", borderWidth: 1, borderColor: "#f0d2ca", borderRadius: 9, padding: 12, marginTop: 15, gap: 8 },
  errorText: { color: "#9e5146", fontSize: 11, lineHeight: 17 },
  retryText: { color: "#315d45", fontSize: 11, fontWeight: "700" },
  footer: { textAlign: "center", color: "#929d91", fontSize: 10, marginTop: 30 },
});
