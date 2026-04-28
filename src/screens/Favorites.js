import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFavorites } from "../context/FavoritesContext";

const COLORS = {
  ebony: "#414833",
  reseda: "#737A5D",
  sage: "#A4AC86",
  dun: "#CCBFA3",
  bone: "#EBE3D2",
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function Favorites({ navigation }) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Add your favourite recipe now!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} recipe
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detail", { idMeal: item.idMeal })}
          >
            <Image
              source={{ uri: item.strMealThumb }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFavorite(item)}
            >
              <MaterialCommunityIcons name="heart" size={20} color="#E8593C" />
            </TouchableOpacity>
            <Text style={styles.cardLabel} numberOfLines={2}>
              {item.strMeal}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bone,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bone,
    padding: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    color: COLORS.ebony,
    fontFamily: "PlayfairDisplay_700Bold",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    color: COLORS.ebony,
    fontFamily: "PlayfairDisplay_700Bold",
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.reseda,
    fontFamily: "PTSerif_400Regular",
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  card: {
    width: CARD_WIDTH,
    margin: 8,
    borderRadius: 16,
    backgroundColor: COLORS.bone,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.reseda,
    elevation: 3,
    shadowColor: COLORS.ebony,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 0.85,
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bone,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "PTSerif_700Bold",
    padding: 10,
    backgroundColor: COLORS.reseda,
    textAlign: "center",
    height: 52,
    textAlignVertical: "center",
  },
});