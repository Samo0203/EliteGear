import axios from 'axios';

const BASE = 'http://localhost:8080/eg';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

/*Products */
export const productAPI = {
  getAll:    ()         => api.get('/getproduct'),
  getById:   (id)       => api.get(`/getproduct/${id}`),
  getByCategory: (cat)  => api.get(`/getproduct/category/${cat}`),
  create:    (data)     => api.post('/postproduct', data),
  update:    (id, data) => api.put(`/putproduct/${id}`, data),  patch:     (id, data) => api.patch(`/patchproduct/${id}`, data),  delete:    (id)       => api.delete(`/deleteproduct/${id}`),
};
  
/*Categories */
export const categoryAPI = {
  getAll:  ()         => api.get('/getcategory'),
  getById: (id)       => api.get(`/getcategory/${id}`),
  create:  (data)     => api.post('/postcategory', data),
  update:  (id, data) => api.put(`/putcategory/${id}`, data),
  delete:  (id)       => api.delete(`/deletecategory/${id}`),
};

/*Users */
export const userAPI = {
  register: (data)        => api.post('/register', data),
  login:    (credentials) => api.post('/login', credentials),
  getAll:   ()            => api.get('/users'),
  update:   (id, data)    => api.put(`/users/${id}`, data),
  delete:   (id)          => api.delete(`/users/${id}`),
};

/*Orders */
export const orderAPI = {
  getAll:       ()         => api.get('/orders'),
  getById:      (id)       => api.get(`/orders/${id}`),
  getByUser:    (userId)   => api.get(`/orders/user/${userId}`),
  create:       (data)     => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  cancel:       (id)       => api.patch(`/orders/${id}/status`, { status: 'CANCELLED' }),
};

export default api;