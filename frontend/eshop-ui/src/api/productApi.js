import axiosClient from "./axiosClient";

export const getAllProducts = () => {
  return axiosClient.get("/products");
};

export const searchProducts = (q, categoryId) => {
  const params = {};
  if (q) params.q = q;
  if (categoryId) params.categoryId = categoryId;
  return axiosClient.get("/products/search", { params });
};

export const getProductById = (id) => {
  return axiosClient.get(`/products/${id}`);
};

export const createProduct = (productData) => {
  return axiosClient.post("/products", productData);
};

export const updateProduct = (id, productData) => {
  return axiosClient.put(`/products/${id}`, productData);
};

export const deleteProduct = (id) => {
  return axiosClient.delete(`/products/${id}`);
};
