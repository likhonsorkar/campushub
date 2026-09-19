import API from './api';

// Check if any active user session exists
export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const registerUser = (userData) => API.post('users/register/', userData);

export const loginUser = async (credentials) => {
  const response = await API.post('users/login/', credentials);
  if (response.data.access) {
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
  }
  return response.data;
};

export const getUserProfile = () => API.get('users/profile/');

export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};