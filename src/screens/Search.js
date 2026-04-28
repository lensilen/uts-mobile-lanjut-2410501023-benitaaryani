import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { searchMeals, getCategories, getAreaList } from "../services/api";

const COLORS = {
  ebony: "#414833",
  reseda: "#737A5D",
  sage: "#A4AC86",
  dun: "#CCBFA3",
  bone: "#EBE3D2",
};

export default function Search({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      const cats = await getCategories();
      const ars = await getAreaList();
      setCategories(cats);
      setAreas(ars);
    };
    loadFilters();
  }, []);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("Keyword tidak boleh kosong");
      return;
    }
    if (keyword.trim().length < 3) {
      setError("Keyword minimal 3 karakter");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchMeals(keyword);
      let filtered = data || [];
      if (selectedCategory) {
        filtered = filtered.filter((m) => m.strCategory === selectedCategory);
      }
      if (selectedArea) {
        filtered = filtered.filter((m) => m.strArea === selectedArea);
      }
      setResults(filtered);
    } catch (e) {
      setError("Gagal mencari resep. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cari Resep</Text>
        <Text style={styles.subtitle}>Temukan resep yang kamu inginkan</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.inputWrap}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={COLORS.reseda}
          />
          <TextInput
            style={styles.input}
            placeholder="Cari resep... (min. 3 karakter)"
            placeholderTextColor={COLORS.sage}
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.dropdown, selectedCategory && styles.dropdownActive]}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedCategory && styles.dropdownTextActive,
            ]}
            numberOfLines={1}
          >
            {selectedCategory || "Kategori"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={16}
            color={selectedCategory ? "#fff" : COLORS.reseda}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dropdown, selectedArea && styles.dropdownActive]}
          onPress={() => setShowAreaModal(true)}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedArea && styles.dropdownTextActive,
            ]}
            numberOfLines={1}
          >
            {selectedArea || "Negara"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={16}
            color={selectedArea ? "#fff" : COLORS.reseda}
          />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.ebony} />
        </View>
      )}

      {searched && !loading && results.length === 0 && (
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="food-off-outline"
            size={56}
            color={COLORS.dun}
          />
          <Text style={styles.emptyText}>Resep tidak ditemukan</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Detail", { idMeal: item.idMeal })
            }
          >
            <Image
              source={{ uri: item.strMealThumb }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.strMeal}
              </Text>
              <View style={styles.cardMeta}>
                <MaterialCommunityIcons
                  name="tag-outline"
                  size={13}
                  color={COLORS.reseda}
                />
                <Text style={styles.cardMetaText}>{item.strCategory}</Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.reseda}
            />
          </TouchableOpacity>
        )}
      />

      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pilih Kategori</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCategory("");
                  setShowCategoryModal(false);
                }}
              >
                <Text style={styles.modalItemText}>Semua Kategori</Text>
                {!selectedCategory && (
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color={COLORS.reseda}
                  />
                )}
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.idCategory}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCategory(cat.strCategory);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{cat.strCategory}</Text>
                  {selectedCategory === cat.strCategory && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color={COLORS.reseda}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showAreaModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pilih Negara Asal</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedArea("");
                  setShowAreaModal(false);
                }}
              >
                <Text style={styles.modalItemText}>Semua Negara</Text>
                {!selectedArea && (
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color={COLORS.reseda}
                  />
                )}
              </TouchableOpacity>
              {areas.map((area) => (
                <TouchableOpacity
                  key={area.strArea}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedArea(area.strArea);
                    setShowAreaModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{area.strArea}</Text>
                  {selectedArea === area.strArea && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color={COLORS.reseda}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bone,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    color: COLORS.ebony,
    fontFamily: "PlayfairDisplay_700Bold",
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.reseda,
    fontFamily: "PTSerif_400Regular",
    marginTop: 4,
  },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 8,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.sage,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.ebony,
    fontFamily: "PTSerif_400Regular",
  },
  searchBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.reseda,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontSize: 12,
    color: "#E8593C",
    paddingHorizontal: 20,
    marginBottom: 8,
    fontFamily: "PTSerif_400Regular",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  dropdown: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.sage,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 6,
  },
  dropdownActive: {
    backgroundColor: COLORS.reseda,
    borderColor: COLORS.reseda,
  },
  dropdownText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.reseda,
    fontFamily: "PTSerif_400Regular",
  },
  dropdownTextActive: {
    color: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.reseda,
    fontFamily: "PTSerif_400Regular",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bone,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.reseda,
    elevation: 3,
    shadowColor: COLORS.ebony,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    paddingRight: 12,
  },
  cardImage: {
    width: 90,
    height: 90,
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 14,
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.ebony,
    fontFamily: "PTSerif_700Bold",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardMetaText: {
    fontSize: 12,
    color: COLORS.reseda,
    fontFamily: "PTSerif_400Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: COLORS.bone,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.ebony,
    fontFamily: "PlayfairDisplay_700Bold",
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sage,
  },
  modalItemText: {
    fontSize: 14,
    color: COLORS.ebony,
    fontFamily: "PTSerif_400Regular",
  },
});
