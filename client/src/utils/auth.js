const STORAGE_KEY = 'cp_user';
const TOKEN_KEY = 'cp_token';

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user:', error);
  }
};

export const clearStoredUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user:', error);
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear token:', error);
  }
};

// Decode JWT token to get roll number
export const getRollNumber = () => {
  try {
    const token = getToken();
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload))?.rollNumber || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Logout - clear all auth data
export const logout = () => {
  clearStoredUser();
  clearToken();
};
