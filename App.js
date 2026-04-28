import React from "react";
import { View, ActivityIndicator } from "react-native";
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  PTSerif_400Regular,
  PTSerif_700Bold,
} from "@expo-google-fonts/pt-serif";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PTSerif_400Regular,
    PTSerif_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EBE3D2" }}>
        <ActivityIndicator size="large" color="#414833" />
      </View>
    );
  }

  return (
    <FavoritesProvider>
      <AppNavigator />
    </FavoritesProvider>
  );
}