import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getMealDetail, getRandomMeal } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";

const COLORS = {
  ebony: "#414833",
  reseda: "#737A5D",
  sage: "#A4AC86",
  dun: "#CCBFA3",
  bone: "#EBE3D2",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Detail({ navigation, route }) {
  const { idMeal, random } = route.params;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("ingredients");
  const scrollRef = useRef(null);

  const fetchMeal = async () => {
    try {
      setError(null);
      const data = random ? await getRandomMeal() : await getMealDetail(idMeal);
      setMeal(data);
    } catch (e) {
      setError("Gagal memuat resep. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, []);

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure: measure?.trim() || "" });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.ebony} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchMeal}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ingredients = getIngredients(meal);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: meal.strMealThumb }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={COLORS.ebony}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{meal.strMeal}</Text>
            <TouchableOpacity
              style={styles.favoriteBtn}
              onPress={() => {
                if (isFavorite(meal.idMeal)) {
                  removeFavorite(meal);
                } else {
                  addFavorite(meal);
                }
              }}
            >
              <MaterialCommunityIcons
                name={isFavorite(meal.idMeal) ? "heart" : "heart-outline"}
                size={26}
                color={isFavorite(meal.idMeal) ? "#E8593C" : COLORS.ebony}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color={COLORS.reseda}
            />
            <Text style={styles.metaText}>{meal.strArea}</Text>
            <View style={styles.metaDot} />
            <MaterialCommunityIcons
              name="tag-outline"
              size={16}
              color={COLORS.reseda}
            />
            <Text style={styles.metaText}>{meal.strCategory}</Text>
          </View>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "ingredients" && styles.tabActive,
              ]}
              onPress={() => {
                setActiveTab("ingredients");
                scrollRef.current?.scrollTo({ x: 0, animated: true });
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "ingredients" && styles.tabTextActive,
                ]}
              >
                Bahan-bahan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "instructions" && styles.tabActive,
              ]}
              onPress={() => {
                setActiveTab("instructions");
                scrollRef.current?.scrollTo({
                  x: SCREEN_WIDTH - 40,
                  animated: true,
                });
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "instructions" && styles.tabTextActive,
                ]}
              >
                Cara Memasak
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setActiveTab(
                x > (SCREEN_WIDTH - 40) / 2 ? "instructions" : "ingredients",
              );
            }}
          >
            <View style={{ width: SCREEN_WIDTH - 40 }}>
              {ingredients.map((ing, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientDot} />
                  <Text style={styles.ingredientText}>
                    {ing.measure} {ing.ingredient}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ width: SCREEN_WIDTH - 40 }}>
              {meal.strInstructions
                .split("\n")
                .filter((line) => line.trim())
                .map((line, index) => (
                  <Text key={index} style={styles.instructions}>
                    {line.trim()}
                  </Text>
                ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
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
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
  },
  backBtn: {
    position: "absolute",
    top: 48,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bone,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  content: {
    backgroundColor: COLORS.bone,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    padding: 24,
    paddingBottom: 100,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 26,
    color: COLORS.ebony,
    fontFamily: "PlayfairDisplay_700Bold",
  },
  favoriteBtn: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.reseda,
    fontFamily: "PTSerif_400Regular",
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.dun,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: COLORS.dun,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: COLORS.reseda,
  },
  tabText: {
    fontSize: 13,
    color: COLORS.ebony,
    fontFamily: "PTSerif_400Regular",
  },
  tabTextActive: {
    color: "#fff",
    fontFamily: "PTSerif_700Bold",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.reseda,
  },
  ingredientText: {
    fontSize: 14,
    color: COLORS.ebony,
    fontFamily: "PTSerif_400Regular",
  },
  instructionsList: {
    gap: 10,
  },
  instructions: {
    fontSize: 14,
    color: COLORS.ebony,
    fontFamily: "PTSerif_400Regular",
    lineHeight: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.reseda,
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: COLORS.ebony,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
