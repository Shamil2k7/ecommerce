import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ;

const getCart = async (userId) => {
  const response = await axios.get(`${API_URL}/api/cart/${userId}`, {
    withCredentials: true,
  });

  return response.data;
};

const addToCart = async (cartData) => {
  const response = await axios.post(
    `${API_URL}/api/cart/add`,
    cartData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const updateQuantity = async (cartData) => {
  const response = await axios.put(
    `${API_URL}/api/cart/update`,
    cartData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const removeItem = async (userId, productId, color, size) => {
  const response = await axios.delete(
    `${API_URL}/api/cart/remove/${userId}/${productId}?color=${color}&size=${size}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const clearCart = async (userId) => {
  const response = await axios.delete(
    `${API_URL}/api/cart/clear/${userId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const applyCoupon = async (couponData) => {
  const response = await axios.post(
    `${API_URL}/api/cart/apply-coupon`,
    couponData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export default {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
};