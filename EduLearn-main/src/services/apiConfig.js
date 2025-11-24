// src/services/apiConfig.js
const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  COURSES: `${API_BASE_URL}/cours`,
  COURSES_BY_TEACHER: (teacherId) => `${API_BASE_URL}/cours/enseignant/${teacherId}`,
  COURSE_DETAILS: (courseId) => `${API_BASE_URL}/cours/${courseId}/details`,
  RESOURCES: `${API_BASE_URL}/resources`,
  RESOURCES_BY_COURSE: (courseId) => `${API_BASE_URL}/resources/${courseId}`
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};