import axiosClient from "./axiosClient";

export const getAllOrders = () => {
  return axiosClient.get("/orders");
};

export const getOrderById = (id) => {
  return axiosClient.get(`/orders/${id}`);
};

export const getMyOrders = () => {
  return axiosClient.get("/orders/me");
};

export const createOrder = (couponCode = null) => {
  return axiosClient.post("/orders/me", couponCode ? { couponCode } : {});
};

export const updateOrderStatus = (orderId, status) => {
  return axiosClient.put(`/orders/${orderId}/status`, { status });
};
