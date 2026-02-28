import api from './axios';

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updateBudgetSettings: (data) => api.put('/user/budget-settings', data),
  changePassword: (data) => api.put('/user/change-password', data),
};

// Expense APIs
export const expenseAPI = {
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getStats: () => api.get('/expenses/stats'),
};

// Savings APIs
export const savingsAPI = {
  getAll: () => api.get('/savings'),
  update: (id, data) => api.put(`/savings/${id}`, data),
};