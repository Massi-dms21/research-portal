// src/pages/AdminProjectsPage.js
import React, { useState, useEffect } from 'react'; // Removed useContext as currentUser not directly used here
import {
    Container, Typography, Paper, Box, Button, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip,
    Snackbar // For success messages
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import projectService from '../api/projectService';
import ProjectFormModal from '../components/admin/ProjectFormModal'; // Import the modal

const AdminProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null); // null for new, project object for edit

    const fetchProjects = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await projectService.getAllProjects();
            setProjects(data || []);
        } catch (err) {
            setError('Failed to fetch research projects.');
            console.error("Fetch projects error:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleOpenCreateModal = () => {
        setEditingProject(null); // Indicate a new project
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProject(null); // Clear editing state
    };

    const handleSaveProject = async (projectData, projectId) => {
        // projectData comes from the modal form
        // projectId is present if editing, undefined/null if creating
        try {
            if (projectId) { // Editing existing project
                await projectService.updateProject(projectId, projectData);
                setSuccessMessage('Project updated successfully!');
            } else { // Creating new project
                await projectService.createProject(projectData);
                setSuccessMessage('Project created successfully!');
            }
            fetchProjects(); // Re-fetch the list to show changes
            handleCloseModal();
        } catch (err) {
            console.error("Save project error:", err.response?.data || err.message);
            // Error will be thrown from modal so modal can display it.
            // If modal doesn't handle error display, set error state here.
            // setError(err.response?.data?.message || err.message || 'Failed to save project.');
            throw err; // Re-throw to let modal know save failed
        }
    };

    const handleDeleteProject = async (projectId, projectTitle) => {
        if (window.confirm(`Are you sure you want to delete project "${projectTitle}"? This will also set its linked productions' project ID to null.`)) {
            setError('');
            setSuccessMessage('');
            try {
                await projectService.deleteProject(projectId);
                setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
                setSuccessMessage(`Project "${projectTitle}" deleted successfully.`);
            } catch (err) {
                setError(`Failed to delete project "${projectTitle}". ${err.response?.data?.message || err.message}`);
                console.error("Delete project error:", err);
            }
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 80px)">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: {xs:1, md:2}, mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
                    <Typography variant="h4" component="h1" gutterBottom sx={{mr:1}}>Manage Research Projects</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateModal}
                    >
                        Create Project
                    </Button>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                {/* Success Snackbar */}
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={6000}
                    onClose={() => setSuccessMessage('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>

                <TableContainer>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Title</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Description</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Start Date</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>End Date</TableCell>
                                <TableCell sx={{textAlign: 'right', fontWeight: 'bold'}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id} hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{project.id}</TableCell>
                                    <TableCell sx={{minWidth: 200}}>{project.title}</TableCell>
                                    <TableCell sx={{minWidth: 250, maxWidth: 350}}>
                                        <Tooltip title={project.description || ''} placement="bottom-start">
                                            <Typography noWrap variant="body2">
                                                {project.description || '-'}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>{project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell sx={{textAlign: 'right', whiteSpace: 'nowrap'}}>
                                        <Tooltip title="Edit Project">
                                            <IconButton color="primary" size="small" onClick={() => handleOpenEditModal(project)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Project">
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteProject(project.id, project.title)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {projects.length === 0 && !isLoading && !error && (
                    <Typography sx={{mt:2, textAlign:'center', p:2}}>No research projects found. Click "Create Project" to add one.</Typography>
                )}
            </Paper>

            <ProjectFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                project={editingProject}
                onSave={handleSaveProject}
            />
        </Container>
    );
};

export default AdminProjectsPage;