import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../App';
import teamService from '../api/teamService'; // To fetch team details including members
import userService from '../api/userService'; // To add/remove users from team

const ManageMyTeamPage = () => {
    // The teamId might come from currentUser if a lead manages only one team,
    // or from URL params if they could manage multiple or if an admin is viewing.
    const { teamId: paramTeamId } = useParams(); // Example: /teams/:teamId/manage
    const { currentUser } = useContext(AuthContext);

    const [teamDetails, setTeamDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Determine the actual team ID to manage
    const effectiveTeamId = paramTeamId || currentUser?.team?.id;

    useEffect(() => {
        if (effectiveTeamId) {
            const fetchTeamDetails = async () => {
                setIsLoading(true);
                try {
                    // Backend's getTeamById should ideally return members list or team lead should have this info
                    // If not, you might need another endpoint or to fetch users by teamId
                    const data = await teamService.getTeamById(effectiveTeamId);
                    // You may need to separately fetch users belonging to this team if not included.
                    // const members = await userService.getUsersByTeamId(effectiveTeamId);
                    // data.members = members; // Assuming data.members is populated by backend
                    setTeamDetails(data);
                } catch (err) {
                    setError("Failed to fetch team details.");
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTeamDetails();
        } else {
            setIsLoading(false);
            setError("No team specified or you are not assigned to lead a team.");
        }
    }, [effectiveTeamId]);


    // TODO: Implement functions to add existing users (Researchers) to this team
    //       - Fetch all users who are Researchers and not in any team / not in this team.
    //       - Use userService.assignUserToTeam(userId, effectiveTeamId)
    // TODO: Implement functions to remove members from this team
    //       - Use userService.removeUserFromTeam(userId)

    if (isLoading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (error) return <Container><Alert severity="error" sx={{mt:3}}>{error}</Alert></Container>;
    if (!teamDetails) return <Container><Typography sx={{mt:3}}>Team not found or not accessible.</Typography></Container>;

    // Authorization check: current user must be the lead of this team OR a VICE_RECTOR
    if (currentUser.role !== 'VICE_RECTOR' && teamDetails.teamLead?.id !== currentUser.id) {
        return <Navigate to="/dashboard" state={{ message: "You are not authorized to manage this team." }} />
    }

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h4" gutterBottom>Manage Team: {teamDetails.name}</Typography>
                <Typography variant="subtitle1" gutterBottom>Lead: {teamDetails.teamLead?.username || 'N/A'}</Typography>
                <Typography>Functionality to add/remove researchers from this team will be here.</Typography>

                <Typography variant="h6" sx={{mt:2}}>Members:</Typography>
                {teamDetails.members && teamDetails.members.length > 0 ? (
                    <ul>
                        {teamDetails.members.map(member => (
                            <li key={member.id}>{member.username} ({member.firstName} {member.lastName})
                                {/* Add remove button here if applicable */}
                            </li>
                        ))}
                    </ul>
                ) : <Typography>No members in this team yet.</Typography>}

                {/* Add a section/form to search and add new members */}

            </Paper>
        </Container>
    );
};
export default ManageMyTeamPage;