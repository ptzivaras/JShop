import axiosClient from "./axiosClient";

export const getMyAddresses = () => {
  return axiosClient.get("/addresses/me");
};

export const addAddress = (data) => {
  return axiosClient.post("/addresses/me", data);
};

export const updateAddress = (id, data) => {
  return axiosClient.put(`/addresses/me/${id}`, data);
};

export const deleteAddress = (id) => {
  return axiosClient.delete(`/addresses/me/${id}`);
};

export const setDefaultAddress = (id) => {
  return axiosClient.put(`/addresses/me/${id}/default`);
};
