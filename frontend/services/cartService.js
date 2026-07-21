import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

const getCart = async (userId) => {
  const response = await axios.get(`${API_URL}/cart/${userId}`, { withCredentials: true });
  return response.data;
};

const addToCart = async (data) => {
  const response = await axios.post(`${API_URL}/cart/add`, data, { withCredentials: true });
  return response.data;
};

const updateQuantity = async (data) => {
  const response = await axios.put(`${API_URL}/cart/update`, data, { withCredentials: true });
  return response.data;
};

const removeItem = async (userId, productId, color = "", size = "") => {
  const response = await axios.delete(
    `${API_URL}/cart/remove/${userId}/${productId}?color=${color}&size=${size}`,
    { withCredentials: true }
  );
  return response.data;
};

const clearCart = async (userId) => {
  const response = await axios.delete(`${API_URL}/cart/clear/${userId}`, { withCredentials: true });
  return response.data;
};

const applyCoupon = async (data) => {
  const response = await axios.post(`${API_URL}/cart/apply-coupon`, data, { withCredentials: true });
  return response.data;
};

const cartService = {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
};

export default cartService;
