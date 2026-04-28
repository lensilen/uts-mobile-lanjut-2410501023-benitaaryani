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
} from "react-native";
import { searchMeals, getCategories, getAreaList } from "../services/api";

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
      <Text style={styles.title}>Cari Resep</Text>

      <TextInput
        style={styles.input}
        placeholder="Cari resep... (min. 3 karakter)"
        value={keyword}
        onChangeText={setKeyword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowCategoryModal(true)}
      >
        <Text>{selectedCategory || "Pilih Kategori"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowAreaModal(true)}
      >
        <Text>{selectedArea || "Pilih Negara Asal"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleSearch}>
        <Text style={styles.btnText}>Cari</Text>
      </TouchableOpacity>

      {searched && results.length === 0 && !loading && (
        <Text style={styles.empty}>Resep tidak ditemukan</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("Detail", { idMeal: item.idMeal })
            }
          >
            <Text>{item.strMeal}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pilih Kategori</Text>
            <ScrollView>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory("");
                  setShowCategoryModal(false);
                }}
              >
                <Text style={styles.modalItem}>Semua Kategori</Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.idCategory}
                  onPress={() => {
                    setSelectedCategory(cat.strCategory);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.modalItem}>{cat.strCategory}</Text>
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
            <ScrollView>
              <TouchableOpacity
                onPress={() => {
                  setSelectedArea("");
                  setShowAreaModal(false);
                }}
              >
                <Text style={styles.modalItem}>Semua Negara</Text>
              </TouchableOpacity>
              {areas.map((area) => (
                <TouchableOpacity
                  key={area.strArea}
                  onPress={() => {
                    setSelectedArea(area.strArea);
                    setShowAreaModal(false);
                  }}
                >
                  <Text style={styles.modalItem}>{area.strArea}</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: "#EBE3D2" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#414833",
    marginTop: 48,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  error: { color: "red", fontSize: 12, marginBottom: 8 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#737A5D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#737A5D", marginTop: 20 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontSize: 14,
  },
});
