import axiosInstance from './axiosInstance';

const getAllProjects = async () => {
  const response = await axiosInstance.get('/projects');
  return response.data;
};

const getProjectById = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}`);
  return response.data;
};

const createProject = async (projectData) => {
  // projectData = { title, description, startDate, endDate }
  const response = await axiosInstance.post('/projects', projectData);
  return response.data;
};

const updateProject = async (projectId, projectData) => {
  const response = await axiosInstance.put(`/projects/${projectId}`, projectData);
  return response.data;
};

const deleteProject = async (projectId) => {
  const response = await axiosInstance.delete(`/projects/${projectId}`);
  return response.data; // Or status
};

const projectService = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
export default projectService;