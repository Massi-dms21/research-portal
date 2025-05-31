import React from 'react';
import { Typography, Container, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'; // MUI Icon

const NotFoundPage = () => (
  <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
    <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80, color: 'action.disabled', mb: 2 }} />
    <Typography variant="h3" component="h1" gutterBottom>
      404 - Page Not Found
    </Typography>
    <Typography variant="h6" color="text.secondary" paragraph>
      Oops! The page you are looking for does not exist or has been moved.
    </Typography>
    <Box sx={{ mt: 4 }}>
      <Button component={RouterLink} to="/" variant="contained" color="primary" size="large">
        Go to Homepage
      </Button>
    </Box>
  </Container>
);
export default NotFoundPage;