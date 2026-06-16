import axios from 'axios';

const API_URL = '/api/analytics';

const getAuthHeader = () => {
  const token = localStorage.getItem('edulearn_token');
  return { Authorization: `Bearer ${token}` };
};

const analyticsService = {
  getDashboard: async () => {
    const { data } = await axios.get(`${API_URL}/dashboard`, { headers: getAuthHeader() });
    return data;
  },

  getAISuggestions: async () => {
    const { data } = await axios.get(`${API_URL}/suggestions`, { headers: getAuthHeader() });
    return data;
  },

  getTopics: async () => {
    const { data } = await axios.get(`${API_URL}/topics`, { headers: getAuthHeader() });
    return data;
  }
};

export default analyticsService;