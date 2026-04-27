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
  PanResponder,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getMealsByCategory } from "../services/api";

const COLORS = {
  ebony: "#414833",
  reseda: "#737A5D",
  sage: "#A4AC86",
  dun: "#CCBFA3",
  bone: "#EBE3D2",
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 80;

// Referensi: https://reactnative.dev/docs/panresponder
// Referensi: https://reactnative.dev/docs/animated
function SwipeableCard({ item, onSwipe }) {
  const translateX = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      translateX.setValue(0);
    }, []),
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          gestureState.dx < 0
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          onSwipe(item);
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const revealOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.swipeContainer}>
      <Animated.View style={[styles.revealBack, { opacity: revealOpacity }]}>
        <Text style={styles.revealText}>Let's Cook This!</Text>
      </Animated.View>

      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: item.strMealThumb }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.strMeal}
            </Text>
            <Text style={styles.swipeHint}>← swipe</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function Browse({ navigation, route }) {
  const { category } = route.params;
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMeals = async () => {
    try {
      setError(null);
      const data = await getMealsByCategory(category);
      setMeals(data);
    } catch (e) {
      setError("Gagal memuat data. Coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMeals();
  };

  const handleSwipe = (item) => {
    navigation.navigate("Detail", { idMeal: item.idMeal });
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
        <TouchableOpacity style={styles.retryBtn} onPress={fetchMeals}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.ebony}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.ebony]}
          />
        }
        renderItem={({ item }) => (
          <SwipeableCard item={item} onSwipe={handleSwipe} />
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.dun,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    color: COLORS.ebony,
    fontFamily: "PlayfairDisplay_700Bold",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  swipeContainer: {
    position: "relative",
  },
  revealBack: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: COLORS.reseda,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  revealText: {
    color: "#fff",
    fontFamily: "PTSerif_700Bold",
    fontSize: 14,
  },
  card: {
    flexDirection: "row",
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
  },
  cardImage: {
    width: 90,
    height: 90,
  },
  cardInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    color: COLORS.ebony,
    fontFamily: "PTSerif_700Bold",
  },
  swipeHint: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "PTSerif_400Regular",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: COLORS.reseda,
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
