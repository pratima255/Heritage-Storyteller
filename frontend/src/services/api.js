const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('heritage_auth_token') || localStorage.getItem('heritage_jwt_token') || localStorage.getItem('heritage_token') || null;
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Prefer relative path when Vite proxy is available, fallback to direct API_BASE_URL
  const primaryUrl = `/api${cleanEndpoint}`;
  const fallbackUrl = `${API_BASE_URL}${cleanEndpoint}`;

  let res;
  try {
    res = await fetch(primaryUrl, {
      ...options,
      headers
    });
    // If the proxy returns 404 on non-topic endpoints or connection fails, try direct backend URL
    if (res.status === 404 && !cleanEndpoint.startsWith('/topics/')) {
      res = await fetch(fallbackUrl, {
        ...options,
        headers
      });
    }
  } catch (primaryErr) {
    try {
      res = await fetch(fallbackUrl, {
        ...options,
        headers
      });
    } catch (fallbackErr) {
      return {
        success: false,
        message: 'Unable to connect to server. Please check your backend connection.'
      };
    }
  }

  // Clear stale tokens if server reports unauthorized on auth/me
  if (res.status === 401 && cleanEndpoint === '/auth/me') {
    localStorage.removeItem('heritage_auth_token');
    localStorage.removeItem('heritage_jwt_token');
    localStorage.removeItem('heritage_token');
  }

  try {
    const data = await res.json();
    return data;
  } catch (parseErr) {
    return {
      success: res.ok,
      message: res.statusText || (res.ok ? 'Success' : `Request failed with status ${res.status}`)
    };
  }
};

export const api = {
  // Auth APIs
  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getCurrentUser: async () => {
    return request('/auth/me', {
      method: 'GET'
    });
  },

  // Topics APIs
  getTopics: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/topics${params ? '?' + params : ''}`, {
      method: 'GET'
    });
  },

  getTopicById: async (topicId) => {
    return request(`/topics/${topicId}`, {
      method: 'GET'
    });
  },

  // Chapters & Story APIs
  getChapters: async (topicId) => {
    return request(`/topics/${topicId}/chapters`, {
      method: 'GET'
    });
  },

  completeStory: async (topicId) => {
    return request(`/topics/${topicId}/complete-story`, {
      method: 'POST'
    });
  },

  // Quiz APIs
  getQuiz: async (topicId) => {
    return request(`/topics/${topicId}/quiz`, {
      method: 'GET'
    });
  },

  submitQuiz: async (topicId, answers) => {
    return request(`/topics/${topicId}/quiz/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  },

  // Game APIs
  getArtifactMatchGame: async (topicId) => {
    return request(`/games/artifact-match/${topicId}`, {
      method: 'GET'
    });
  },

  submitArtifactMatchGame: async (topicId, score) => {
    return request(`/games/artifact-match/${topicId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ score })
    });
  },

  getMemoryGame: async (topicId) => {
    return request(`/games/memory/${topicId}`, {
      method: 'GET'
    });
  },

  submitMemoryGame: async (topicId, score) => {
    return request(`/games/memory/${topicId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ score })
    });
  },

  // Progress & Dashboard APIs
  getUserProgress: async () => {
    return request('/progress', {
      method: 'GET'
    });
  },

  getDashboardStats: async () => {
    return request('/dashboard', {
      method: 'GET'
    });
  },

  // Admin APIs
  getAdminDashboard: async () => {
    return request('/admin/dashboard', {
      method: 'GET'
    });
  },

  getAllUsers: async () => {
    return request('/admin/users', {
      method: 'GET'
    });
  }
};
