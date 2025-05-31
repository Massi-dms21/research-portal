import axiosInstance from './axiosInstance';

const getAllLaboratories = async () => {
  const response = await axiosInstance.get('/laboratories');
  return response.data;
};

const getLaboratoryById = async (labId) => {
  const response = await axiosInstance.get(`/laboratories/${labId}`);
  return response.data;
};

const createLaboratory = async (labData) => {
  // labData = { name, location, description }
  const response = await axiosInstance.post('/laboratories', labData);
  return response.data;
};

const updateLaboratory = async (labId, labData) => {
  const response = await axiosInstance.put(`/laboratories/${labId}`, labData);
  return response.data;
};

const deleteLaboratory = async (labId) => {
  const response = await axiosInstance.delete(`/laboratories/${labId}`);
  return response.data; // Or status
};

const laboratoryService = {
  getAllLaboratories,
  getLaboratoryById,
  createLaboratory,
  updateLaboratory,
  deleteLaboratory,
};
export default laboratoryService;