import axiosInstance from './axiosInstance';

const getAllMaterialResources = async () => {
  const response = await axiosInstance.get('/resources');
  return response.data;
};

const getMaterialResourceById = async (resourceId) => {
  const response = await axiosInstance.get(`/resources/${resourceId}`);
  return response.data;
};

const createMaterialResource = async (resourceData, roomId) => {
  // resourceData = { name, description, quantity }
  // roomId is passed as a @RequestParam
  let url = '/resources';
  const config = { params: {} };
  if (roomId) {
    config.params.roomId = roomId;
  }
  const response = await axiosInstance.post(url, resourceData, config);
  return response.data;
};

const updateMaterialResource = async (resourceId, resourceData, roomId) => {
  let url = `/resources/${resourceId}`;
  const config = { params: {} };
  if (roomId !== undefined) { // Allow sending null or an ID
    config.params.roomId = roomId;
  }
  const response = await axiosInstance.put(url, resourceData, config);
  return response.data;
};

const deleteMaterialResource = async (resourceId) => {
  const response = await axiosInstance.delete(`/resources/${resourceId}`);
  return response.data; // Or status
};

const resourceService = {
  getAllMaterialResources,
  getMaterialResourceById,
  createMaterialResource,
  updateMaterialResource,
  deleteMaterialResource,
};
export default resourceService;