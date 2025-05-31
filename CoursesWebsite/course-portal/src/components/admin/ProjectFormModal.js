// src/components/admin/ProjectFormModal.js
import React, { useState, useEffect } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Grid, CircularProgress, Alert, Box // <--- Added Box here
} from '@mui/material';

const ProjectFormModal = ({ open, onClose, project, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState('');

    useEffect(() => {
        if (project) { // Editing existing project
            setFormData({
                title: project.title || '',
                description: project.description || '',
                startDate: project.startDate ? project.startDate.toString().split('T')[0] : '',
                endDate: project.endDate ? project.endDate.toString().split('T')[0] : '',
            });
        } else { // Creating new project
            setFormData({
                title: '',
                description: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
            });
        }
        setModalError('');
    }, [project, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setModalError('');
        setIsSubmitting(true);
        if (!formData.title) {
            setModalError("Title is required.");
            setIsSubmitting(false);
            return;
        }
        try {
            await onSave(formData, project?.id);
        } catch (err) {
            setModalError(err.message || "An error occurred while saving the project.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{project ? 'Edit Research Project' : 'Create New Research Project'}</DialogTitle>
            {/* The form is now the Dialog's direct child for submission handling if needed,
                or wrap DialogContent and DialogActions in a form tag */}
            <Box component="form" onSubmit={handleSubmit}> {/* Form wraps content and actions */}
                <DialogContent>
                    {modalError && <Alert severity="error" sx={{ mb: 2 }}>{modalError}</Alert>}
                    <Grid container spacing={2} sx={{mt:0.5}}> {/* Added small top margin for aesthetics */}
                        <Grid item xs={12}>
                            <TextField
                                name="title"
                                label="Project Title"
                                value={formData.title}
                                onChange={handleChange}
                                fullWidth
                                required
                                margin="dense"
                                disabled={isSubmitting}
                                autoFocus // Focus on title field when modal opens
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                margin="dense"
                                disabled={isSubmitting}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="startDate"
                                label="Start Date"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                margin="dense"
                                disabled={isSubmitting}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="endDate"
                                label="End Date"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                margin="dense"
                                disabled={isSubmitting}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{p: '16px 24px'}}>
                    <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (project ? 'Save Changes' : 'Create Project')}
                    </Button>
                </DialogActions>
            </Box> {/* Closing form Box */}
        </Dialog>
    );
};

export default ProjectFormModal;