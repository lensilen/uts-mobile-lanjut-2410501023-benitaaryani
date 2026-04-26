const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories;
};

export const getMealsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  const data = await res.json();
  return data.meals;
};

export const getMealDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals[0];
};

export const searchMeals = async (keyword) => {
  const res = await fetch(`${BASE_URL}/search.php?s=${keyword}`);
  const data = await res.json();
  return data.meals;
};

export const getRandomMeal = async () => {
  const res = await fetch(`${BASE_URL}/random.php`);
  const data = await res.json();
  return data.meals[0];
};

export const getAreaList = async () => {
  const res = await fetch(`${BASE_URL}/list.php?a=list`);
  const data = await res.json();
  return data.meals;
};