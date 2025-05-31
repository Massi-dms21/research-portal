import React, { useContext, useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import { AuthContext } from '../App';
import productionService from '../api/productionService'; // Assuming this service exists

const MyProductionsPage = () => {
    const { currentUser } = useContext(AuthContext);
    const [productions, setProductions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser?.id) {
            const fetchMyProductions = async () => {
                setIsLoading(true);
                setError('');
                try {
                    // Assuming productionService has a method like getProductionsByAuthorId
                    const data = await productionService.getProductionsByAuthorId(currentUser.id);
                    setProductions(data);
                } catch (err) {
                    setError('Failed to fetch your scientific productions.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchMyProductions();
        } else {
            setIsLoading(false); // Not logged in, nothing to fetch
        }
    }, [currentUser?.id]);

    if (isLoading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (!currentUser) return <Container><Typography sx={{mt:3}}>Please log in to view your productions.</Typography></Container>;
    if (error) return <Container><Alert severity="error" sx={{mt:3}}>{error}</Alert></Container>;

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h4" gutterBottom>My Scientific Productions</Typography>
                {productions.length === 0 ? (
                    <Typography>You have not added any scientific productions yet.</Typography>
                ) : (
                    <List>
                        {productions.map((prod) => (
                            <React.Fragment key={prod.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={prod.title}
                                        secondary={`Type: ${prod.type} - Published: ${new Date(prod.publicationDate).toLocaleDateString()}`}
                                    />
                                    {/* Add Link to view/edit production */}
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
};
export default MyProductionsPage;