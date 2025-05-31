import axiosInstance from './axiosInstance';

const getAllRooms = async () => {
  const response = await axiosInstance.get('/rooms');
  return response.data;
};

const getRoomById = async (roomId) => {
  const response = await axiosInstance.get(`/rooms/${roomId}`);
  return response.data;
};

const createRoom = async (roomData, laboratoryId) => {
  // roomData = { name, capacity }
  // laboratoryId is passed as a @RequestParam by the backend controller
  let url = '/rooms';
  const config = { params: {} };
  if (laboratoryId) {
    config.params.laboratoryId = laboratoryId;
  }
  const response = await axiosInstance.post(url, roomData, config);
  return response.data;
};

const updateRoom = async (roomId, roomData, laboratoryId) => {
  let url = `/rooms/${roomId}`;
  const config = { params: {} };
  if (laboratoryId !== undefined) { // Allow sending null or an ID
    config.params.laboratoryId = laboratoryId;
  }
  const response = await axiosInstance.put(url, roomData, config);
  return response.data;
};

const deleteRoom = async (roomId) => {
  const response = await axiosInstance.delete(`/rooms/${roomId}`);
  return response.data; // Or status
};

const roomService = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
export default roomService;