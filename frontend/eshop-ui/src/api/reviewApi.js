import axiosClient from "./axiosClient";

export const getProductReviews = (productId) => {
  return axiosClient.get(`/reviews/product/${productId}`);
};

export const getProductRatingSummary = (productId) => {
  return axiosClient.get(`/reviews/product/${productId}/summary`);
};

export const getMyReviews = () => {
  return axiosClient.get("/reviews/user/me");
};

export const createReview = (productId, reviewData) => {
  return axiosClient.post(`/reviews/product/${productId}`, reviewData);
};

export const updateReview = (reviewId, reviewData) => {
  return axiosClient.put(`/reviews/${reviewId}`, reviewData);
};

export const deleteReview = (reviewId) => {
  return axiosClient.delete(`/reviews/${reviewId}`);
};
