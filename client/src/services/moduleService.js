import axios from 'axios';

const API_URL = '/api/modules';

const getAuthHeader = () => {
  const token = localStorage.getItem('edulearn_token');
  return { Authorization: `Bearer ${token}` };
};

const moduleService = {
  generate: async (topic, level) => {
    const { data } = await axios.post(`${API_URL}/generate`, { topic, level }, { headers: getAuthHeader() });
    return data;
  },

  getAll: async (params = {}) => {
    const { data } = await axios.get(API_URL, { headers: getAuthHeader(), params });
    return data;
  },

  getById: async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return data;
  },

  complete: async (id, timeSpent) => {
    const { data } = await axios.put(`${API_URL}/${id}/complete`, { timeSpent }, { headers: getAuthHeader() });
    return data;
  },

  delete: async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return data;
  }
};

export default moduleService;