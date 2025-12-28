// API Configuration
// Use NEXT_PUBLIC_ prefix for client-side access in Next.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google-login`,
  },
  LESSONS: {
    UNITS: `${API_BASE_URL}/api/lessons/units`,
    ALL: `${API_BASE_URL}/api/lessons`,
    BY_UNIT: (unitId) => `${API_BASE_URL}/api/lessons/unit/${unitId}`,
    BY_ID: (lessonId) => `${API_BASE_URL}/api/lessons/${lessonId}`,
    BY_UNIT_AND_NUMBER: (unitNumber, lessonNumber) => `${API_BASE_URL}/api/lessons/unit/${unitNumber}/lesson/${lessonNumber}`,
  },
  PROGRESS: {
    DASHBOARD: (userId, timezoneOffset) => `${API_BASE_URL}/api/progress/dashboard?userId=${userId}${timezoneOffset ? `&timezoneOffset=${timezoneOffset}` : ''}`,
    STATS: (userId) => `${API_BASE_URL}/api/progress/stats?userId=${userId}`,
    ACTIVITIES: (userId) => `${API_BASE_URL}/api/progress/activities?userId=${userId}`,
    LESSON: (lessonId, userId) => `${API_BASE_URL}/api/progress/lesson/${lessonId}?userId=${userId}`,
    UPDATE: `${API_BASE_URL}/api/progress/update`,
    RECOVER_STREAK: `${API_BASE_URL}/api/progress/recover-streak`,
  },
  PROFILE: {
    GET: (userId) => `${API_BASE_URL}/api/profile?userId=${userId}`,
    UPDATE: `${API_BASE_URL}/api/profile/update`,
  },
  LEADERBOARD: {
    GET: (period = 'week', userId) => {
      const url = new URL(`${API_BASE_URL}/api/leaderboard`);
      url.searchParams.set('period', period);
      if (userId) url.searchParams.set('userId', userId);
      return url.toString();
    },
  },
};

