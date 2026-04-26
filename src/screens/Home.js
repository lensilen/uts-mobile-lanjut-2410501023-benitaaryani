import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getCategories } from "../services/api";

const COLORS = {
  ebony: "#414833",
  reseda: "#737A5D",
  sage: "#A4AC86",
  dun: "#CCBFA3",
  bone: "#EBE3D2",
};

const NUM_COLUMNS = 2;
const CARD_WIDTH = (Dimensions.get("window").width - 48) / NUM_COLUMNS;

function CategoryCard({ item, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 1.08,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start(() => onPress(item));
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        <Image
          source={{ uri: item.strCategoryThumb }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <Text style={styles.cardLabel} numberOfLines={1}>
          {item.strCategory}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Home({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    try {
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (e) {
      setError("Gagal memuat data. Coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const handleCategoryPress = (item) => {
    navigation.navigate("Browse", { category: item.strCategory });
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
        <TouchableOpacity style={styles.retryBtn} onPress={fetchCategories}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Selamat datang di</Text>
        <Text style={styles.appName}>ResepKita</Text>
      </View>

      <FlatList
        key={NUM_COLUMNS}
        data={categories}
        keyExtractor={(item) => item.idCategory}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.ebony]}
          />
        }
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={handleCategoryPress} />
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.reseda,
    fontFamily: "PTSerif_400Italic",
  },
  appName: {
    fontSize: 36,
    color: COLORS.ebony,
    fontFamily: "PlayfairDisplay_700Bold",
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
    elevation: 8,
    shadowColor: COLORS.ebony,
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.reseda,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH,
    backgroundColor: COLORS.bone,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.bone,
    padding: 10,
    textAlign: "center",
    backgroundColor: COLORS.reseda,
    fontFamily: "PTSerif_700Bold",
  },
  Text: {
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
