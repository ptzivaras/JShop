import axiosClient from "./axiosClient";

export const getAllDiscounts = () => {
  return axiosClient.get("/discounts");
};

export const createDiscount = (data) => {
  return axiosClient.post("/discounts", data);
};

export const deleteDiscount = (id) => {
  return axiosClient.delete(`/discounts/${id}`);
};

export const toggleDiscount = (id) => {
  return axiosClient.put(`/discounts/${id}/toggle`);
};

export const applyCoupon = (code, cartTotal) => {
  return axiosClient.post("/discounts/apply", { code, cartTotal });
};
