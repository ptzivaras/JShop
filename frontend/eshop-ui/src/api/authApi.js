import axiosClient from "./axiosClient";

export const login = (credentials) => {
  return axiosClient.post("/auth/login", credentials);
};

export const register = (userData) => {
  return axiosClient.post("/auth/register", userData);
};

export const getMe = () => {
  return axiosClient.get("/auth/me");
};
