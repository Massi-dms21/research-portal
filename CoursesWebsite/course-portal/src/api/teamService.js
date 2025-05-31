import axiosInstance from './axiosInstance';

const getAllTeams = async () => {
  const response = await axiosInstance.get('/teams');
  return response.data;
};

const getTeamById = async (teamId) => {
  const response = await axiosInstance.get(`/teams/${teamId}`);
  return response.data;
};

const createTeam = async (teamData) => {
  // teamData = { name: "Team Name" }
  // if teamLeadId is to be set on creation, backend controller needs to support it
  // or use assignTeamLead separately.
  const response = await axiosInstance.post('/teams', teamData);
  return response.data;
};

const updateTeam = async (teamId, teamData) => {
  const response = await axiosInstance.put(`/teams/${teamId}`, teamData);
  return response.data;
};

const deleteTeam = async (teamId) => {
  const response = await axiosInstance.delete(`/teams/${teamId}`);
  return response.data; // Or status
};

const assignTeamLead = async (teamId, userId) => {
  const response = await axiosInstance.put(`/teams/${teamId}/lead/${userId}`);
  return response.data;
};

// Managing members is mostly done via userService.assignUserToTeam/removeUserFromTeam
// but if you have direct endpoints on TeamController for members:
// const addMemberToTeam = async (teamId, userId) => { ... }
// const removeMemberFromTeam = async (teamId, userId) => { ... }

const teamService = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignTeamLead,
};
export default teamService;