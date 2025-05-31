// src/pages/AdminUsersPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
    Container, Typography, Paper, Box, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Grid, Select, MenuItem, FormControl, InputLabel, Snackbar // Added Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import userService from '../api/userService';
import teamService from '../api/teamService'; // For team dropdown in modal
import { AuthContext } from '../App';

const ALL_ROLES_AVAILABLE = ["USER", "RESEARCHER", "TEAM_LEAD", "DIRECTOR", "ADMINISTRATOR", "VICE_RECTOR"]; // Renamed for clarity

// --- UserEditModal Component (same as before, ensure it's defined or imported) ---
const UserEditModal = ({ open, onClose, user, onSave, teams, allRoles }) => {
    const [editData, setEditData] = useState({
        username: '', password: '', firstName: '', lastName: '', email: '', role: 'USER', teamId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState('');

    useEffect(() => {
        if (user) { // Editing
            setEditData({
                username: user.username || '',
                password: user.password || '', // Clear password for edit, only set if changing
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                role: user.role || 'USER',
                teamId: user.team?.id?.toString() || '',
            });
        } else { // Creating
             setEditData({ username: '', password: '', firstName: '', lastName: '', email: '', role: 'USER', teamId: '' });
        }
        setModalError('');
    }, [user, open]);

    const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    const handleModalSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setModalError('');
        setIsSubmitting(true);
        try {
            const payload = { ...editData };
            if (!user) { // Creating new user
                if (!payload.username || !payload.password || !payload.email || !payload.role) {
                    setModalError("Username, password, email and role are required for new users.");
                    setIsSubmitting(false); return;
                }
            } else { // Editing existing user
                delete payload.username; // Username should not be part of update payload
                if (!payload.password) delete payload.password; // Don't send empty password for update
            }

            const teamIdToSubmit = payload.teamId ? parseInt(payload.teamId, 10) : null;
            const roleToSubmit = payload.role; // The role from the form

            // Remove teamId and role from main payload as they are handled separately by onSave
            delete payload.teamId;
            // delete payload.role; // Role is part of the main user object in backend, so keep it for create

            await onSave(payload, user?.id, teamIdToSubmit, roleToSubmit);
        } catch (err) {
            setModalError(err.message || 'Failed to save user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{user ? `Edit User: ${user.username}` : 'Create New User'}</DialogTitle>
            <Box component="form" onSubmit={handleModalSubmit}> {/* Use onSubmit here */}
                <DialogContent>
                    {modalError && <Alert severity="error" sx={{ mb: 2 }}>{modalError}</Alert>}
                    <Grid container spacing={2} sx={{mt:0.5}}>
                        {!user && (
                            <>
                            <Grid item xs={12} sm={6}>
                                <TextField name="username" label="Username" value={editData.username} onChange={handleChange} fullWidth required disabled={isSubmitting} autoFocus/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="password" label="Password" type="password" value={editData.password} onChange={handleChange} fullWidth required disabled={isSubmitting} />
                            </Grid>
                            </>
                        )}
                         {user && ( // Display username for editing user but disable it
                            <Grid item xs={12}>
                                <TextField name="username" label="Username" value={editData.username} fullWidth disabled margin="dense"/>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <TextField name="firstName" label="First Name" value={editData.firstName} onChange={handleChange} fullWidth disabled={isSubmitting} margin="dense"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="lastName" label="Last Name" value={editData.lastName} onChange={handleChange} fullWidth disabled={isSubmitting} margin="dense"/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="email" label="Email" type="email" value={editData.email} onChange={handleChange} fullWidth required disabled={isSubmitting} margin="dense"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required disabled={isSubmitting} margin="dense">
                                <InputLabel>Role</InputLabel>
                                <Select name="role" value={editData.role} label="Role" onChange={handleChange}>
                                    {allRoles.map(r => <MenuItem key={r} value={r}>{r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth disabled={isSubmitting} margin="dense">
                                <InputLabel>Team</InputLabel>
                                <Select name="teamId" value={editData.teamId} label="Team" onChange={handleChange}>
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {teams.map(t => <MenuItem key={t.id} value={t.id.toString()}>{t.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{p:'16px 24px'}}>
                    <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24}/> : 'Save'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};
// --- End UserEditModal ---


const AdminUsersPage = () => {
    const { currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]); // Initialize as an empty array
    const [allTeams, setAllTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsersAndTeams = async () => {
        console.log("AdminUsersPage: fetchUsersAndTeams CALLED");
        setIsLoading(true);
        setError('');
        // setSuccessMessage(''); // Don't clear on initial fetch, only on action success
        try {
            const usersData = await userService.getAllUsers(); // Service now ensures array
            const teamsData = await teamService.getAllTeams(); // Service should also ensure array

            console.log("AdminUsersPage: Users data from service:", usersData);
            console.log("AdminUsersPage: Teams data from service:", teamsData);

            setUsers(usersData); // Directly set, as service ensures it's an array
            setAllTeams(teamsData);

        } catch (err) {
            setError('Failed to fetch initial user or team data.');
            console.error("AdminUsersPage: Fetch data ERROR:", err.response?.data || err.message, err);
            setUsers([]); // Ensure it's an empty array on error
            setAllTeams([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersAndTeams();
    }, []);

    const handleOpenEditModal = (userToEdit) => {
        setEditingUser(userToEdit);
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (modalFormData, existingUserId, teamIdForAssignment, roleForAssignment) => {
            setError('');
            setSuccessMessage('');

            try {
                let userAfterMainSave;

                if (existingUserId) {
                    // ----- EDITING AN EXISTING USER -----
                    const originalUser = users.find(u => u.id === existingUserId); // Get the full original user object from your state
                    if (!originalUser) {
                        throw new Error("Original user data not found for update. Please refresh.");
                    }

                    // Construct the payload to send to the backend
                    const updatePayload = {
                        id: originalUser.id, // Send the ID
                        username: originalUser.username, // <<< SEND EXISTING USERNAME (from originalUser)

                        // Only send password if it was changed in the modal.
                        // If modalFormData.password is empty, send the originalUser.password
                        // CAUTION: This means you are re-sending the (potentially plain-text) password.
                        // This is okay for your simplified backend but NOT for a real app with hashed passwords.
                        password: originalUser.password, // <<< SEND EXISTING PASSWORD if not changed

                        firstName: modalFormData.firstName,
                        lastName: modalFormData.lastName,
                        email: modalFormData.email,
                        role: roleForAssignment, // Send the new role directly, backend User object will take it.
                                                // Backend updateUser might need to be adjusted if it doesn't expect role.
                        // team: originalUser.team // You might send team like this if backend expects it,
                                                  // but separate team assignment calls are often cleaner.
                    };

                    console.log("Frontend: Update payload being sent:", updatePayload);
                    userAfterMainSave = await userService.updateUser(existingUserId, updatePayload);

                    // Role change is now part of the main updateUser payload if backend User object can take it.
                    // If backend updateUser method specifically ignores 'role', then the separate changeUserRole call is still needed.
                    // Let's assume for now backend updateUser will take the role from the payload.
                    // If not:
                    // if (userAfterMainSave.role !== roleForAssignment) {
                    //     userAfterMainSave = await userService.changeUserRole(existingUserId, roleForAssignment);
                    // }

                } else {
                    // ----- CREATING A NEW USER -----
                    const createPayload = {
                        username: modalFormData.username,
                        password: modalFormData.password,
                        email: modalFormData.email,
                        firstName: modalFormData.firstName,
                        lastName: modalFormData.lastName,
                        role: roleForAssignment,
                    };
                    userAfterMainSave = await userService.createUser(createPayload);
                }

                // ----- HANDLE TEAM ASSIGNMENT (for both create and edit) -----
                const currentTeamIdInDb = userAfterMainSave.team?.id || null;
                const desiredTeamId = teamIdForAssignment ? parseInt(teamIdForAssignment, 10) : null;

                if (currentTeamIdInDb !== desiredTeamId) {
                    if (desiredTeamId) {
                        await userService.assignUserToTeam(userAfterMainSave.id, desiredTeamId);
                    } else if (currentTeamIdInDb) {
                        await userService.removeUserFromTeam(userAfterMainSave.id);
                    }
                }

                setSuccessMessage(`User ${existingUserId ? 'updated' : 'created'} successfully!`);
                fetchUsersAndTeams();
                handleCloseModal();

            } catch (err) {
                console.error("AdminUsersPage - handleSaveUser error:", err.response?.data || err.message, err);
                throw new Error(err.response?.data?.message || err.message || `Failed to save user.`);
            }
        };

    const handleDeleteUser = async (userIdToDelete, username) => {
        if (currentUser && currentUser.id === userIdToDelete) {
            setError("You cannot delete your own account from this panel.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete user '${username}' (ID: ${userIdToDelete})? This action cannot be undone.`)) {
            setError('');
            setSuccessMessage('');
            try {
                await userService.deleteUser(userIdToDelete);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToDelete)); // Optimistic UI update
                setSuccessMessage(`User '${username}' deleted successfully.`);
            } catch (err) {
                setError(`Failed to delete user ${username}. ${err.response?.data?.message || err.message}`);
                console.error(err);
            }
        }
    };

    console.log("AdminUsersPage RENDERING with users.length:", users.length, "isLoading:", isLoading, "error:", error);

    if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 80px)"><CircularProgress /></Box>;

    return (
        <Container maxWidth="xl">
            <Paper sx={{ p: {xs:1, md:2}, mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
                    <Typography variant="h4" component="h1" gutterBottom sx={{mr:1}}>Manage Users</Typography>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
                        Create User
                    </Button>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={()=>setError('')}>{error}</Alert>}
                <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
                </Snackbar>

                <TableContainer>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Username</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Email</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Name</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Role</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Team</TableCell>
                                <TableCell sx={{textAlign: 'right', fontWeight: 'bold'}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => ( // This line will error if users is not an array
                                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.firstName || ''} {user.lastName || ''}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.team?.name || 'N/A'}</TableCell>
                                    <TableCell sx={{textAlign: 'right', whiteSpace: 'nowrap'}}>
                                        <Tooltip title="Edit User">
                                            <IconButton color="primary" size="small" onClick={() => handleOpenEditModal(user)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete User">
                                            <span> {/* Span for Tooltip when button is disabled */}
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteUser(user.id, user.username)}
                                                disabled={currentUser?.id === user.id} // Prevent self-delete
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {users.length === 0 && !isLoading && !error && (
                    <Typography sx={{mt:2, textAlign:'center', p:2}}>No users found. Click "Create User" to add one.</Typography>
                )}
            </Paper>
            {isModalOpen && ( // Conditionally render modal to ensure it picks up latest editingUser
                <UserEditModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    user={editingUser}
                    onSave={handleSaveUser}
                    teams={allTeams}
                    allRoles={ALL_ROLES_AVAILABLE}
                />
            )}
        </Container>
    );
};
export default AdminUsersPage;