import React, { createContext, useReducer, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_FAVORITES":
      return action.payload;
    case "ADD_FAVORITE":
      return [...state, action.payload];
    case "REMOVE_FAVORITE":
      return state.filter((item) => item.idMeal !== action.payload.idMeal);
    default:
      return state;
  }
};

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem("favorites");
        if (stored) {
          dispatch({ type: "LOAD_FAVORITES", payload: JSON.parse(stored) });
        }
      } catch (e) {
        console.log("Failed to load favorites:", e);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (e) {
        console.log("Failed to save favorites:", e);
      }
    };
    saveFavorites();
  }, [favorites]);

  const addFavorite = (meal) => dispatch({ type: "ADD_FAVORITE", payload: meal });
  const removeFavorite = (meal) => dispatch({ type: "REMOVE_FAVORITE", payload: meal });
  const isFavorite = (idMeal) => favorites.some((item) => item.idMeal === idMeal);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);