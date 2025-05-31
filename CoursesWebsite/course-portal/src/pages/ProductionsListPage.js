// src/pages/ProductionsListPage.js
import React, { useState, useEffect, useContext } from 'react';
import { List, ListItem, ListItemText, Typography, CircularProgress, Alert, Paper, Button, Box, Link as MuiLink, Divider, Container, IconButton, Tooltip } from '@mui/material'; // Removed unused Grid
import productionService from '../api/productionService';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../App';
// import EditIcon from '@mui/icons-material/Edit'; // Removed if not using edit modal yet
import DeleteIcon from '@mui/icons-material/Delete';

const ProductionsListPage = () => {
  const [productions, setProductions] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { currentUser } = useContext(AuthContext);

  const fetchProductions = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const data = await productionService.getAllProductions();
      setProductions(Array.isArray(data) ? data : []); // Ensure data is an array or default to empty array
    } catch (err) {
      setError('Failed to fetch scientific productions.');
      console.error("Fetch productions error:", err.response?.data || err.message, err);
      setProductions([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleDeleteProduction = async (productionId, productionTitle) => {
    if (window.confirm(`Are you sure you want to delete the production "${productionTitle}"?`)) {
        setError('');
        setSuccessMessage('');
        try {
            await productionService.deleteProduction(productionId);
            // Re-fetch productions to get the updated list from the server
            // This is often more reliable than just filtering the local state,
            // especially if other users could be making changes.
            fetchProductions();
            setSuccessMessage(`Production "${productionTitle}" deleted successfully.`);
        } catch (err) {
            setError(`Failed to delete production "${productionTitle}". ${err.response?.data?.message || err.message}`);
            console.error("Delete production error:", err);
        }
    }
  };

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 80px)"><CircularProgress /></Box>;

  const canCreateProduction = currentUser && ['RESEARCHER', 'ADMINISTRATOR', 'VICE_RECTOR'].includes(currentUser.role);

  return (
    <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: {xs: 2, md: 3}, mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
            <Typography variant="h4" component="h1" gutterBottom sx={{mr: 2}}>Scientific Productions</Typography>
            {canCreateProduction && (
            <Button component={RouterLink} to="/productions/new" variant="contained" color="primary">
                Add New Production
            </Button>
            )}
        </Box>
        <Divider sx={{mb: 2}}/>
        {error && <Alert severity="error" sx={{mb:2}} onClose={() => setError('')}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{mb:2}} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

        {/* Conditional rendering for the list */}
        {!isLoading && !error && productions.length === 0 && (
            <Typography sx={{textAlign: 'center', p:3}}>No scientific productions found.</Typography>
        )}

        {!isLoading && !error && productions.length > 0 && (
            <List>
            {productions.map((prod) => { // This line causes error if productions is not an array
                if (!prod || typeof prod.id === 'undefined') { // Basic check for valid production object
                    console.warn("Invalid production object found:", prod);
                    return null; // Skip rendering this item
                }

                const isAuthor = currentUser && currentUser.id === prod.author?.id;
                const isAdminOrVR = currentUser && ['ADMINISTRATOR', 'VICE_RECTOR'].includes(currentUser.role);
                const isTeamLeadOfAuthor = currentUser && currentUser.role === 'TEAM_LEAD' &&
                                           prod.author?.team?.id === currentUser.team?.id;
                const canEditOrDelete = isAuthor || isAdminOrVR || isTeamLeadOfAuthor;

                return (
                <React.Fragment key={prod.id}>
                <ListItem
                    alignItems="flex-start"
                    secondaryAction={ canEditOrDelete && (
                        <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm:'row'}}}>
                            {/* <Tooltip title="Edit Production">
                                <IconButton edge="end" aria-label="edit" size="small" sx={{mb: {xs:1, sm:0}, mr: {sm:1}}} onClick={() => {}}>
                                    <EditIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip> */}
                            <Tooltip title="Delete Production">
                                <IconButton edge="end" aria-label="delete" size="small" color="error" onClick={() => handleDeleteProduction(prod.id, prod.title)}>
                                    <DeleteIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                >
                <ListItemText
                    primary={<Typography variant="h6" component="div">{prod.title || "Untitled Production"}</Typography>}
                    secondary={
                    <>
                        <Typography component="p" variant="body2" color="text.secondary">
                        Type: {prod.type || 'N/A'}
                        </Typography>
                        <Typography component="p" variant="body2" color="text.secondary">
                        Author: {prod.author?.username || 'N/A'}
                        {prod.researchProject && ` | Project: ${prod.researchProject.title || 'N/A'}`}
                        </Typography>
                        <Typography component="p" variant="body2" color="text.secondary">
                        Published: {prod.publicationDate ? new Date(prod.publicationDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        {prod.abstractText && (
                            <Typography variant="body2" sx={{mt:1, fontStyle: 'italic',
                                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"
                            }}>
                                {prod.abstractText}
                            </Typography>
                        )}
                        {prod.filePath && (
                        <MuiLink
                            href={productionService.getDownloadLink(prod.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{display: 'inline-block', mt:1}}
                            variant="button"
                        >
                            Download ({prod.originalFileName || 'File'})
                        </MuiLink>
                        )}
                    </>
                    }
                />
                </ListItem>
                <Divider component="li" variant="inset" />
                </React.Fragment>
            )})}
            </List>
        )}
        </Paper>
    </Container>
  );
};

export default ProductionsListPage;