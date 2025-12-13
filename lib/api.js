import { API_BASE_URL } from './config';

/**
 * Get authentication token from storage
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

/**
 * Get user ID from storage
 */
export function getUserId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
}

/**
 * API request wrapper with error handling
 */
export async function apiRequest(url, options = {}) {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Unauthorized - clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('userId');
          window.location.href = '/auth';
        }
        throw new Error('Session expired. Please login again.');
      }

      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return { success: true, data: data.data || data, response };
  } catch (error) {
    console.error('API request error:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred', 
      data: null 
    };
  }
}

/**
 * GET request helper
 */
export async function apiGet(url, options = {}) {
  return apiRequest(url, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost(url, body, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT request helper
 */
export async function apiPut(url, body, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request helper
 */
export async function apiDelete(url, options = {}) {
  return apiRequest(url, { ...options, method: 'DELETE' });
}

