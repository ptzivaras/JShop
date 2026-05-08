import axiosClient from "./axiosClient";

export const getAllProducts = () => {
  return axiosClient.get("/products");
};

export const searchProducts = (q, categoryId, minPrice, maxPrice, stockStatus, sortBy, sortDir) => {
  const params = {};
  if (q) params.q = q;
  if (categoryId) params.categoryId = categoryId;
  if (minPrice !== null && minPrice !== undefined) params.minPrice = minPrice;
  if (maxPrice !== null && maxPrice !== undefined) params.maxPrice = maxPrice;
  if (stockStatus) params.stockStatus = stockStatus;
  if (sortBy) params.sortBy = sortBy;
  if (sortDir) params.sortDir = sortDir;
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
