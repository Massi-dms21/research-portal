import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MyProductionsPage from './pages/MyProductionsPage';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProductionsListPage from './pages/ProductionsListPage';
import CreateProductionPage from './pages/CreateProductionPage';
import AdminUsersPage from './pages/AdminUsersPage';
// --- Placeholder Pages for Admin/Role-Specific actions (you'll create these) ---

import AdminProjectsPage from './pages/AdminProjectsPage';
import AdminResourcesPage from './pages/AdminResourcesPage';
import AdminTeamsPage from './pages/AdminTeamsPage';
import AdminLabsPage from './pages/AdminLabsPage';
import AdminRoomsPage from './pages/AdminRoomsPage';
import ManageTeamLeadsPage from './pages/ManageTeamLeadsPage';
import ManageMyTeamPage from './pages/ManageMyTeamPage';
// ---------------------------------------------------------------------------------
import NotFoundPage from './pages/NotFoundPage';

// Create a simple Auth Context
export const AuthContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setCurrentUser(userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  // This function can be passed via context to update currentUser after profile edit
  const updateAuthContextUser = (updatedUserData) => {
    setCurrentUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Simple Protected Route Component (can be inlined or made separate)
  const ProtectedElement = ({ element, allowedRoles }) => {
    const location = useLocation();
    if (!currentUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/dashboard" state={{ message: "You are not authorized to view this page." }} replace />;
    }
    return element;
  };


  return (
    <AuthContext.Provider value={{ currentUser, login: handleLogin, logout: handleLogout, updateAuthContextUser }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            Research Portal
          </Typography>
          {currentUser ? (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={RouterLink} to="/profile">
                {currentUser.username} ({currentUser.role})
              </Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ pt: { xs: '70px', sm: '80px' }, pb: '20px', minHeight: 'calc(100vh - 64px)' }}> {/* Adjusted padding */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/dashboard" />} />

          {/* Publicly accessible productions list */}
          <Route path="/productions" element={<ProductionsListPage />} />

          {/* Authenticated Routes */}
          <Route path="/dashboard" element={<ProtectedElement element={<DashboardPage />} />} />
          <Route path="/profile" element={<ProtectedElement element={<ProfilePage />} />} />



 <Route
   path="/teams/:teamId/manage" // Or just /my-team/manage if lead only has one team
   element={<ProtectedElement element={<ManageMyTeamPage />} allowedRoles={['TEAM_LEAD', 'VICE_RECTOR']} />}
 />
 <Route
   path="/admin/team-leads" // Or /manage/team-leads
   element={<ProtectedElement element={<ManageTeamLeadsPage />} allowedRoles={['DIRECTOR', 'VICE_RECTOR']} />}
 />
 <Route
   path="/admin/teams"
   element={<ProtectedElement element={<AdminTeamsPage />} allowedRoles={['VICE_RECTOR']} />} // Or include 'ADMINISTRATOR'
 />
  import MyProductionsPage from './pages/MyProductionsPage';

  <Route
    path="/my-productions"
    element={<ProtectedElement element={<MyProductionsPage />} allowedRoles={['RESEARCHER', 'ADMINISTRATOR', 'VICE_RECTOR']} />}
  />



 <Route
    path='/admin/labs'
    element={<ProtectedElement element={<AdminLabsPage />} allowedRoles={['VICE_RECTOR']} />}
    />
          <Route
            path="/productions/new"
            element={<ProtectedElement element={<CreateProductionPage />} allowedRoles={['RESEARCHER', 'ADMINISTRATOR', 'VICE_RECTOR']} />}
          />


 <Route
   path="/admin/resources"
   element={<ProtectedElement element={<AdminResourcesPage />} allowedRoles={['ADMINISTRATOR', 'VICE_RECTOR']} />}
 />



  <Route
    path="/admin/rooms"
    element={<ProtectedElement element={<AdminRoomsPage />} allowedRoles={['VICE_RECTOR']} />}
  />

          {/* Define other role-specific routes here using ProtectedElement */}

          <Route
            path="/admin/users"
            element={<ProtectedElement element={<AdminUsersPage />} allowedRoles={['ADMINISTRATOR', 'VICE_RECTOR']} />}
          />
           <Route
            path="/admin/projects"
            element={<ProtectedElement element={<AdminProjectsPage />} allowedRoles={['ADMINISTRATOR', 'VICE_RECTOR']} />}
          />
          // etc. for all admin/role specific pages


          <Route path="*" element={<NotFoundPage />} />


        <Route
          path="/admin/users"
          element={<ProtectedElement element={<AdminUsersPage />} allowedRoles={['ADMINISTRATOR', 'VICE_RECTOR']} />}
        />
        </Routes>
      </Container>
    </AuthContext.Provider>

  );
}

export default App;