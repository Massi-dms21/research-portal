// src/api/userService.js
import axiosInstance from './axiosInstance';

const getAllUsers = async () => {
  // ... (try-catch and logging as before) ...
  const response = await axiosInstance.get('/users');
  console.log("SERVICE (User): getAllUsers - Axios RAW response.data:", response.data);
  let parsedData = [];
  if (typeof response.data === 'string') {
    try {
      parsedData = JSON.parse(response.data); // Attempt to parse the string
      console.log("SERVICE (User): getAllUsers - Parsed string to data:", parsedData);
    } catch (e) {
      console.error("SERVICE (User): getAllUsers - Failed to parse string response.data:", e);
      parsedData = []; // Default to empty if parsing fails
    }
  } else {
    parsedData = response.data; // Assume it might sometimes be correct
  }

  if (!Array.isArray(parsedData)) {
    console.warn("SERVICE (User): getAllUsers - Data (after potential parse) is NOT an array. Normalizing to [].");
    return [];
  }
  return parsedData};

const getUserById = async (userId) => {
  // It's good practice to add similar try/catch and type checking for other functions too,
  // but getAllUsers is the one causing the .map error right now.
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data; // Assuming this returns a single user object or null/error
};

const createUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};

const updateUser = async (userId, userData) => {
  const { password, ...payload } = userData;
  const response = await axiosInstance.put(`/users/${userId}`, payload);
  return response.data;
};

const deleteUser = async (userId) => {
  // Delete often returns 204 No Content, so response.data might be empty or undefined
  // The component calling this should handle that.
  await axiosInstance.delete(`/users/${userId}`);
  // return response.data; // Or nothing, or a success indicator
};

const assignUserToTeam = async (userId, teamId) => {
    const response = await axiosInstance.put(`/users/${userId}/team/${teamId}`);
    return response.data;
};

const removeUserFromTeam = async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}/team`);
    return response.data;
};

const changeUserRole = async (userId, newRole) => {
    const response = await axiosInstance.put(`/users/${userId}/role`, null, {
        params: { newRole }
    });
    return response.data;
};

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  assignUserToTeam,
  removeUserFromTeam,
  changeUserRole,
};
export default userService;