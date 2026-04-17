import axiosClient from "./axiosClient";

export const getAllCategories = () => {
  return axiosClient.get("/categories");
};

export const getCategoryById = (id) => {
  return axiosClient.get(`/categories/${id}`);
};

export const createCategory = (categoryData) => {
  return axiosClient.post("/categories", categoryData);
};

export const updateCategory = (id, categoryData) => {
  return axiosClient.put(`/categories/${id}`, categoryData);
};

export const deleteCategory = (id) => {
  return axiosClient.delete(`/categories/${id}`);
};
