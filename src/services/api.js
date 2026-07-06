import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Socket.io connection
let socket = null;

export const initializeSocket = (userId) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
    auth: {
      token: localStorage.getItem('token')
    }
  });

  if (userId) {
    socket.emit('join-room', userId);
  }

  return socket;
};

export const getSocket = () => socket;

// Notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    // Bypass API call - just return success
    const mockUser = {
      id: 'demo-user',
      name: credentials.email.split('@')[0],
      email: credentials.email,
      isVerified: true,
      trustScore: 50,
      role: 'user'
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return {
      message: 'Login successful',
      token: mockToken,
      user: mockUser
    };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (socket) {
      socket.disconnect();
    }
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  resendVerification: async () => {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Items API
export const itemsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  create: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  update: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  search: async (query, filters = {}) => {
    const response = await api.get('/items/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },

  getNearby: async (lat, lng, radius = 10) => {
    const response = await api.get('/items/nearby', {
      params: { lat, lng, radius }
    });
    return response.data;
  },

  addToWishlist: async (itemId) => {
    const response = await api.post(`/items/${itemId}/wishlist`);
    return response.data;
  },

  removeFromWishlist: async (itemId) => {
    const response = await api.delete(`/items/${itemId}/wishlist`);
    return response.data;
  },

  addReview: async (itemId, review) => {
    const response = await api.post(`/items/${itemId}/reviews`, review);
    return response.data;
  }
};

// Borrowings API
export const borrowingsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/borrowings', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/borrowings/${id}`);
    return response.data;
  },

  create: async (borrowingData) => {
    const response = await api.post('/borrowings', borrowingData);
    return response.data;
  },

  approve: async (id) => {
    const response = await api.put(`/borrowings/${id}/approve`);
    return response.data;
  },

  decline: async (id, reason) => {
    const response = await api.put(`/borrowings/${id}/decline`, { reason });
    return response.data;
  },

  return: async (id, condition) => {
    const response = await api.put(`/borrowings/${id}/return`, { condition });
    return response.data;
  },

  cancel: async (id, reason) => {
    const response = await api.put(`/borrowings/${id}/cancel`, { reason });
    return response.data;
  }
};

// Messages API
export const messagesAPI = {
  getAll: async () => {
    const response = await api.get('/messages');
    return response.data;
  },

  send: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/messages/${id}/read`);
    return response.data;
  },

  getConversation: async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  }
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

// Payments API
export const paymentsAPI = {
  createIntent: async (borrowingId, amount, type) => {
    const response = await api.post('/payments/create-intent', {
      borrowingId,
      amount,
      type
    });
    return response.data;
  },

  confirm: async (paymentId) => {
    const response = await api.post(`/payments/confirm/${paymentId}`);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  refund: async (paymentId, reason, amount) => {
    const response = await api.post(`/payments/refund/${paymentId}`, {
      reason,
      amount
    });
    return response.data;
  }
};

// Skills API
export const skillsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/skills', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  },

  create: async (skillData) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },

  update: async (id, skillData) => {
    const response = await api.put(`/skills/${id}`, skillData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },

  getMySkills: async () => {
    const response = await api.get('/skills/user/my-skills');
    return response.data;
  },

  addReview: async (skillId, review) => {
    const response = await api.post(`/skills/${skillId}/reviews`, review);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/skills/categories/list');
    return response.data;
  }
};

// Groups API
export const groupsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/groups', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  create: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  update: async (id, groupData) => {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },

  join: async (id) => {
    const response = await api.post(`/groups/${id}/join`);
    return response.data;
  },

  leave: async (id) => {
    const response = await api.post(`/groups/${id}/leave`);
    return response.data;
  },

  updateMemberRole: async (groupId, memberId, role) => {
    const response = await api.put(`/groups/${groupId}/members/${memberId}/role`, {
      role
    });
    return response.data;
  },

  getMyGroups: async () => {
    const response = await api.get('/groups/user/my-groups');
    return response.data;
  },

  getTypes: async () => {
    const response = await api.get('/groups/types/list');
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getProfile: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  addRating: async (userId, rating) => {
    const response = await api.post(`/users/${userId}/rating`, rating);
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
  }
};

// Utility functions
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default api;