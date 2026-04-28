import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Home from "../screens/Home";
import Search from "../screens/Search";
import Favorites from "../screens/Favorites";
import About from "../screens/About";
import Browse from '../screens/Browse';
import Detail from '../screens/Detail';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = "#414833";
const INACTIVE_COLOR = "#A4AC86";

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Browse" component={Browse} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { bottom: Math.max(insets.bottom, 8) + 8 }],
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          height: 64,
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "home-variant" : "home-variant-outline"}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="magnify" label="Search" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "heart" : "heart-outline"}
              label="Favorite"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={About}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "account" : "account-outline"}
              label="About"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ name, label, focused }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: focused ? 88 : 42,
        height: 44,
        borderRadius: 24,
        backgroundColor: focused ? "#E8EDE1" : "transparent",
        gap: focused ? 6 : 0,
        transform: [{ translateY: 12 }],
      }}
    >
      <MaterialCommunityIcons
        name={name}
        size={focused ? 26 : 24}
        color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
      />
      {focused && (
        <Text
          numberOfLines={1}
          style={{ fontSize: 13, fontWeight: "600", color: ACTIVE_COLOR }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 36,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    paddingHorizontal: 8,
  },
});