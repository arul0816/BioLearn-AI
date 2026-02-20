import axios from 'axios';

const API_URL = '/api/auth';

const getAuthHeader = () => {
  const token = localStorage.getItem('biolearn_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const authService = {
  register: async (name, email, password, level) => {
    const { data } = await axios.post(`${API_URL}/register`, { name, email, password, level });
    return data;
  },

  login: async (email, password) => {
    const { data } = await axios.post(`${API_URL}/login`, { email, password });
    return data;
  },

  getMe: async () => {
    const { data } = await axios.get(`${API_URL}/me`, { headers: getAuthHeader() });
    return data;
  },

  updateProfile: async (updates) => {
    const { data } = await axios.put(`${API_URL}/profile`, updates, { headers: getAuthHeader() });
    return data;
  }
};

export default authService;