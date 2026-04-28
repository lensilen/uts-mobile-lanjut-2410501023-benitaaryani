import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

const COLORS = {
  ebony: "#414833",
  reseda: "#737A5D",
  sage: "#A4AC86",
  dun: "#CCBFA3",
  bone: "#EBE3D2",
};

export default function About() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>About</Text>
      </View>

      <View style={styles.card}>
        <Image
          source={require("../../assets/profile.jpeg")}
          style={styles.avatar}
        />
        <Text style={styles.value}>Benita Aryani</Text>
        <Text style={styles.value}>2410501023</Text>
        <Text style={styles.value}>Kelas A</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Tema</Text>
        <Text style={styles.value}>Tema A — ResepKita (Katalog Resep Kuliner)</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>State Management</Text>
        <Text style={styles.value}>Context API + useReducer</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Framework</Text>
        <Text style={styles.value}>React Native + Expo SDK 54</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>API</Text>
        <Text style={styles.value}>TheMealDB — themealdb.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bone,
  },
  content: {
    paddingBottom: 100,
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
  card: {
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.dun,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: COLORS.dun,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.dun,
    width: "100%",
    marginVertical: 12,
  },
  label: {
    fontSize: 12,
    color: COLORS.reseda,
    fontFamily: "PTSerif_400Regular",
    textAlign: "center",
  },
  value: {
    fontSize: 14,
    color: COLORS.ebony,
    fontFamily: "PTSerif_700Bold",
    textAlign: "center",
    marginTop: 2,
  },
});