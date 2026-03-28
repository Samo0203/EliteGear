import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/eg';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const productAPI = {
  getAll: () => api.get('/getproduct'),
  getById: (id) => api.get(`/getproduct/${id}`),
  create: (product) => api.post('/postproduct', product),
  update: (id, product) => api.put(`/putproduct/${id}`, product),
  delete: (id) => api.delete(`/deleteproduct/${id}`),
};

export const userAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
};

export default api;