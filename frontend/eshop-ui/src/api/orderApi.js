import axiosClient from "./axiosClient";

export const getAllOrders = () => {
  return axiosClient.get("/orders");
};

export const getOrderById = (id) => {
  return axiosClient.get(`/orders/${id}`);
};

export const getOrdersByUserId = (userId) => {
  return axiosClient.get(`/orders/user/${userId}`);
};

export const createOrder = (userId) => {
  return axiosClient.post(`/orders/user/${userId}`);
};

export const updateOrderStatus = (orderId, status) => {
  return axiosClient.put(`/orders/${orderId}/status`, { status });
};
