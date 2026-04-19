import axiosClient from "./axiosClient";

export const getAllUsers = () => {
  return axiosClient.get("/users");
};

export const getUserById = (id) => {
  return axiosClient.get(`/users/${id}`);
};

export const createUser = (userData) => {
  return axiosClient.post("/users", userData);
};
