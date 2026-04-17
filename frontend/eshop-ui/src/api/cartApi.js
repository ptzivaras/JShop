import axiosClient from "./axiosClient";

export const getCart = (userId) => {
  return axiosClient.get(`/cart/${userId}`);
};

export const addItemToCart = (userId, itemData) => {
  return axiosClient.post(`/cart/${userId}/items`, itemData);
};

export const removeItemFromCart = (userId, itemId) => {
  return axiosClient.delete(`/cart/${userId}/items/${itemId}`);
};
