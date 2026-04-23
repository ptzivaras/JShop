import axiosClient from "./axiosClient";

export const getCart = () => {
  return axiosClient.get("/cart/me");
};

export const addItemToCart = (itemData) => {
  return axiosClient.post("/cart/me/items", itemData);
};

export const removeItemFromCart = (itemId) => {
  return axiosClient.delete(`/cart/me/items/${itemId}`);
};
