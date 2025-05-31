import axiosInstance from './axiosInstance';

const login = async (username, password) => {
  const response = await axiosInstance.get('/users/login', {
     params: { username, password }
  });

  if (response.data && response.data.id) {
     return {
         userDetails: response.data, // This contains the user details
         token: `mock-jwt-token-for-${response.data.username}` // MOCKING A JWT TOKEN
     };
  }
  throw new Error("Login failed or unexpected response structure from backend.");
};

const register = async (userData) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};

const authService = {
  login,
  register,
};
export default authService;