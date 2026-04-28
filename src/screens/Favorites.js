import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites({ navigation }) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Belum ada favorit</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorit</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("Detail", { idMeal: item.idMeal })}
          >
            <Text style={styles.itemText}>{item.strMeal}</Text>
            <TouchableOpacity onPress={() => removeFavorite(item)}>
              <Text style={styles.removeText}>Hapus</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBE3D2",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBE3D2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#414833",
    marginTop: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#737A5D",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#CCBFA3",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#414833",
    flex: 1,
  },
  removeText: {
    fontSize: 13,
    color: "#737A5D",
  },
});