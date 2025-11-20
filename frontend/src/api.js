// src/api.js

const api = {
  getProducts: async () => {
    const response = await fetch('http://localhost:8000/products/');
    const data = await response.json();
    return data;
  },

  getProductById: async (id) => {
    const response = await fetch(`http://localhost:8000/products/${id}/`);
    const data = await response.json();
    return data;
  },

  // Add more API methods here (checkout, order, etc.)
};

export default api;
