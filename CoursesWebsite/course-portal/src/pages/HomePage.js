import React from 'react';
import { Typography, Container, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ScienceIcon from '@mui/icons-material/Science'; // MUI Icon

const HomePage = () => (
  <Container maxWidth="md">
    <Paper elevation={3} sx={{ p: {xs: 2, sm: 4}, mt: {xs: 4, sm: 8}, textAlign: 'center' }}>
      <ScienceIcon color="primary" sx={{ fontSize: {xs: 50, sm: 60}, mb: 2 }} />
      <Typography variant="h2" component="h1" gutterBottom color="primary">
        Research Management Portal
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        Streamline your research activities, manage scientific productions, collaborate with teams, and oversee projects and resources effectively.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
            component={RouterLink}
            to="/productions"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: {xs: 0, sm:2}, mb: {xs:2, sm:0}, width: {xs: '100%', sm: 'auto'} }}
        >
          Browse Productions
        </Button>
        <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ width: {xs: '100%', sm: 'auto'} }}
        >
          Login / Register
        </Button>
      </Box>
    </Paper>
  </Container>
);
export default HomePage;