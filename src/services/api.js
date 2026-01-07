const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

let getTokenFunction = null;

export const setTokenGetter = (fn) => {
  getTokenFunction = fn;
};

const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (getTokenFunction) {
    try {
      const token = await getTokenFunction();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  health: () => fetchWithAuth('/health'),

  artworks: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      const query = queryParams.toString();
      return fetchWithAuth(`/artworks${query ? `?${query}` : ''}`);
    },
    getById: (id) => fetchWithAuth(`/artworks/${id}`),
    getLatest: (limit = 5) => fetchWithAuth(`/artworks/latest/${limit}`),
    create: (data) => fetchWithAuth('/artworks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    delete: (id) => fetchWithAuth(`/artworks/${id}`, {
      method: 'DELETE',
    }),
  },

  orders: {
    getAll: () => fetchWithAuth('/orders'),
    create: (data) => fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateStatus: (id, status) => fetchWithAuth(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  },
};

