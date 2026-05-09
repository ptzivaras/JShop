import axiosClient from "./axiosClient";

export const getMyWishlist = () => {
  return axiosClient.get("/wishlist/me");
};

export const addToWishlist = (productId) => {
  return axiosClient.post(`/wishlist/me/${productId}`);
};

export const removeFromWishlist = (productId) => {
  return axiosClient.delete(`/wishlist/me/${productId}`);
};

export const isProductInWishlist = (productId) => {
  return axiosClient.get(`/wishlist/me/${productId}/exists`);
};
