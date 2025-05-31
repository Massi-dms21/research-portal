import React, { useContext } from 'react';
import { Container, Typography, Grid, Paper, Button, Box, Divider, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../App';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import GroupIcon from '@mui/icons-material/Group';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BuildIcon from '@mui/icons-material/Build';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const DashboardPage = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 80px)">
            <CircularProgress />
            <Typography sx={{ml: 2}}>Loading user data...</Typography>
        </Box>
    );
  }

  const commonLinks = [
    { text: 'Browse All Productions', to: '/productions', icon: <ArticleIcon /> },
    { text: 'My Profile', to: '/profile', icon: <AccountCircleIcon /> },
  ];

  let roleSpecificSections = [];

  // Helper function to add or update sections
  const addOrUpdateSection = (title, newLink, newInfo) => {
    let section = roleSpecificSections.find(s => s.title === title);
    if (!section) {
      section = { title, links: [], info: newInfo || '' };
      roleSpecificSections.push(section);
    }
    if (newLink) section.links.push(newLink);
    if (newInfo && !section.info) section.info = newInfo; // Only set info if not already set or specifically updating
  };


  // Researcher actions
  if (['RESEARCHER', 'ADMINISTRATOR', 'VICE_RECTOR'].includes(currentUser.role)) {
    addOrUpdateSection('Research Activities',
      { text: 'Add New Production', to: '/productions/new', icon: <AddCircleOutlineIcon /> },
      currentUser.team ? `Current Team: ${currentUser.team.name}` : 'Not assigned to a team.'
    );
    // addOrUpdateSection('Research Activities', { text: 'View My Productions', to: `/my-productions`, icon: <ArticleIcon /> });
  }

  // Team Lead actions
  if (['TEAM_LEAD', 'VICE_RECTOR'].includes(currentUser.role)) {
     if (currentUser.team) {
        addOrUpdateSection('Team Leadership',
            { text: 'Manage My Team', to: `/teams/${currentUser.team.id}/manage`, icon: <GroupIcon /> },
            `Managing: ${currentUser.team.name}`
        );
     } else {
        addOrUpdateSection('Team Leadership', null, 'No team assigned to lead.');
     }
  }

  // Director actions
  if (['DIRECTOR', 'VICE_RECTOR'].includes(currentUser.role)) {
    addOrUpdateSection('Departmental Management', { text: 'Manage Team Leads', to: '/admin/team-leads', icon: <SupervisorAccountIcon />});
  }

  // Administrator actions
  if (['ADMINISTRATOR', 'VICE_RECTOR'].includes(currentUser.role)) {
    addOrUpdateSection('System Administration', { text: 'Manage Research Projects', to: '/admin/projects', icon: <ScienceIcon /> });
    addOrUpdateSection('System Administration', { text: 'Manage Material Resources', to: '/admin/resources', icon: <BuildIcon /> });
  }

  // Vice Rector actions
  if (currentUser.role === 'VICE_RECTOR') {
    addOrUpdateSection('Institutional Oversight', { text: 'Manage All Users', to: '/admin/users', icon: <GroupIcon /> });
    addOrUpdateSection('Institutional Oversight', { text: 'Manage All Teams', to: '/admin/teams', icon: <GroupIcon /> });
    addOrUpdateSection('Institutional Oversight', { text: 'Manage Directors & Admins', to: '/admin/personnel', icon: <SupervisorAccountIcon /> });
    addOrUpdateSection('Institutional Oversight', { text: 'Manage Laboratories', to: '/admin/labs', icon: <BusinessIcon /> });
    addOrUpdateSection('Institutional Oversight', { text: 'Manage Rooms', to: '/admin/rooms', icon: <MeetingRoomIcon /> });
  }


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={4}>
        <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {currentUser.firstName || currentUser.username}! (Role: {currentUser.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})
        </Typography>
      </Box>
      <Divider sx={{mb: 4}}/>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Quick Access</Typography>
            {commonLinks.map(link => (
              <Button
                key={link.to}
                component={RouterLink}
                to={link.to}
                startIcon={link.icon}
                variant="text"
                sx={{ justifyContent: 'flex-start', mt: 1, textTransform: 'none' }}
              >
                {link.text}
              </Button>
            ))}
          </Paper>
        </Grid>

        {roleSpecificSections.map((section, index) => (
            <Grid item xs={12} md={roleSpecificSections.length === 1 ? 8 : (roleSpecificSections.length === 2 ? 4 : (12-4)/roleSpecificSections.length) } key={section.title + index}> {/* Basic distribution */}
                 <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>{section.title}</Typography>
                    {section.info && <Typography variant="body2" color="text.secondary" sx={{mb:1}}>{section.info}</Typography>}
                    {section.links.map(link => (
                        <Button
                            key={link.to}
                            component={RouterLink}
                            to={link.to}
                            startIcon={link.icon}
                            variant="text"
                            sx={{ justifyContent: 'flex-start', mt: 1, textTransform: 'none' }}
                        >
                            {link.text}
                        </Button>
                    ))}
                    {section.links.length === 0 && !section.info && <Typography variant="body2" color="text.secondary">No specific actions listed for this section.</Typography>}
                </Paper>
            </Grid>
        ))}
        {roleSpecificSections.length === 0 && ( // Only if NO role-specific sections at all
            <Grid item xs={12} md={8}>
                 <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>User Actions</Typography>
                    <Typography variant="body2" color="text.secondary">Explore general site features or contact an administrator if you believe you should have more permissions.</Typography>
                </Paper>
            </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default DashboardPage;