import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert, Container, CircularProgress, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import { AuthContext } from '../App'; // Import the context

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: contextLogin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const registrationMessage = location.state?.message;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { userDetails, token } = await authService.login(username, password);
      contextLogin(userDetails, token); // This will also navigate via App.js context
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
      console.error("Login error:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="section" maxWidth="xs" sx={{mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign In</Typography>
        {registrationMessage && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{registrationMessage}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit"/> : 'Sign In'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
            disabled={isLoading}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
export default LoginPage;