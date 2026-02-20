import axios from 'axios';

const API_URL = '/api/quizzes';

const getAuthHeader = () => {
  const token = localStorage.getItem('biolearn_token');
  return { Authorization: `Bearer ${token}` };
};

const quizService = {
  generate: async (topic, level, difficulty, moduleId, questionCount) => {
    const { data } = await axios.post(`${API_URL}/generate`,
      { topic, level, difficulty, moduleId, questionCount },
      { headers: getAuthHeader() }
    );
    return data;
  },

  submit: async (quizId, answers, timeTaken) => {
    const { data } = await axios.post(`${API_URL}/${quizId}/submit`,
      { answers, timeTaken },
      { headers: getAuthHeader() }
    );
    return data;
  },

  getAll: async (params = {}) => {
    const { data } = await axios.get(API_URL, { headers: getAuthHeader(), params });
    return data;
  },

  getById: async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return data;
  }
};

export default quizService;