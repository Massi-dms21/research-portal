import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper, Grid, Container } from '@mui/material';
import { AuthContext } from '../App';
import userService from '../api/userService';

const ProfilePage = () => {
  const { currentUser, updateAuthContextUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser?.id) {
      const fetchProfile = async () => {
        setIsLoading(true);
        setError('');
        setSuccess(''); // Clear success message on re-fetch
        try {
          const data = await userService.getUserById(currentUser.id);
          setProfileData(data);
          setEditData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
          });
        } catch (err) {
          setError('Failed to fetch profile data.');
          console.error("Fetch profile error:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else if (!localStorage.getItem('token')) {
        setIsLoading(false);
        // Not an error, just means user needs to log in.
    }
  }, [currentUser?.id]);

  const handleChange = (event) => {
    setEditData({ ...editData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    if (!currentUser?.id || !profileData) {
        setError("User data not available for update. Please try refreshing.");
        setIsSubmitting(false);
        return;
    }
    try {
      const payload = {
        // Fields that are generally not user-updatable through this form
        username: profileData.username,
        role: profileData.role,
        password: profileData.password,
        // Fields that are updatable
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email

        // IMPORTANT: Do not send 'password' field unless you are implementing password change
        // If password change is implemented, it needs current password and new password fields.
      };

      const updatedBackendUser = await userService.updateUser(currentUser.id, payload);

      const updatedContextUser = {
          ...currentUser, // Preserve any fields in context not returned by backend (like mocked token)
          id: updatedBackendUser.id, // from backend
          username: updatedBackendUser.username, // from backend
          email: updatedBackendUser.email, // from backend
          firstName: updatedBackendUser.firstName, // from backend
          lastName: updatedBackendUser.lastName, // from backend
          role: updatedBackendUser.role, // from backend
          team: updatedBackendUser.team, // from backend (if exists)

      };

      setProfileData(updatedContextUser); // Update display data on page
      updateAuthContextUser(updatedContextUser); // Update global context and localStorage
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update profile.');
      console.error("Update profile error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !profileData && localStorage.getItem('token')) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 80px)"><CircularProgress /></Box>;
  if (!currentUser) return <Container sx={{mt:3}}><Typography>Please log in to view your profile.</Typography></Container>;
  // If there was an initial fetch error but we have a currentUser (e.g. from localStorage), still show form
  // if (error && !profileData) return <Container sx={{mt:3}}><Alert severity="error">{error}</Alert></Container>;


  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mt: 3 }}>
        <Typography variant="h4" gutterBottom align="center">My Profile</Typography>
        {profileData ? ( // Only render form if profileData is loaded
          <Box>
            <Typography variant="h6" gutterBottom>Account: {profileData.username}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>Role: {profileData.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
               {error && <Alert severity="error" sx={{ mb: 2 }} onClose={()=>setError('')}>{error}</Alert>}
               {success && <Alert severity="success" sx={{ mb: 2 }} onClose={()=>setSuccess('')}>{success}</Alert>}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={editData.firstName}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={editData.lastName}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    required // Email is usually required
                    value={editData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
              <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        ) : (
          isLoading ? <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
                    : <Alert severity="warning">Could not load profile data. Please try refreshing or logging in again.</Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;