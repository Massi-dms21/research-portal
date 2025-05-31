import axiosInstance from './axiosInstance';

const getAllProductions = async () => {
  const response = await axiosInstance.get('/productions');
  return response.data;
};

const getProductionById = async (id) => {
  const response = await axiosInstance.get(`/productions/${id}`);
  return response.data;
};

const getProductionsByAuthorId = async (authorId) => {
    const response = await axiosInstance.get(`/productions/author/${authorId}`);
    return response.data;
};

const createProduction = async (formData) => {
  // formData is a FormData object (for multipart file upload)
  // It should contain a part 'production' (JSON string) and optionally 'file', 'authorId', 'researchProjectId'
  const response = await axiosInstance.post('/productions', formData, {
     headers: {
         // Axios might set this automatically with FormData, but can be explicit
         // 'Content-Type': 'multipart/form-data',
     },
  });
  return response.data;
};

const updateProduction = async (id, formData) => {
    // formData is a FormData object
    const response = await axiosInstance.put(`/productions/${id}`, formData, {
        headers: {
            // 'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const deleteProduction = async (id) => {
    const response = await axiosInstance.delete(`/productions/${id}`);
    return response.data; // Or just status
};

const getDownloadLink = (productionId) => {
    // This constructs the direct URL, actual download is handled by browser <a href="...">
    return `${axiosInstance.defaults.baseURL}/productions/${productionId}/file`;
};

const productionService = {
  getAllProductions,
  getProductionById,
  getProductionsByAuthorId,
  createProduction,
  updateProduction,
  deleteProduction,
  getDownloadLink,
};
export default productionService;