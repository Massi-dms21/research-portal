// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Container, CircularProgress, Paper } from '@mui/material'; // Removed Select, MenuItem, InputLabel, FormControl for Role
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';

// const roles = [...] // This is no longer needed here

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER', // No longer sending role from frontend
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    // Basic frontend validation
    if (!formData.username || !formData.password || !formData.email) {
        setError("Username, password, and email are required.");
        setIsLoading(false);
        return;
    }
    // The role will be set by the backend now
    const payload = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
    };

    try {
      await authService.register(payload); // Pass payload without role
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed.');
      console.error("Registration error:", err.response?.data || err.message, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="section" maxWidth="sm" sx={{mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Register New Account</Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} disabled={isLoading}/>
          <TextField margin="normal" required fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} disabled={isLoading}/>
          <TextField margin="normal" required fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={isLoading}/>
          <TextField margin="normal" fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} disabled={isLoading}/>
          <TextField margin="normal" fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} disabled={isLoading}/>
          {/* Role Select FormControl is REMOVED */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit"/> : 'Register'}
          </Button>
           <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Already have an account? Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
export default RegisterPage;