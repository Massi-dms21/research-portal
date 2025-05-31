import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
// TODO: Import userService and components for user list/table

const ManageTeamLeadsPage = () => {
    // TODO: Fetch users who are currently Team Leads and users who could become Team Leads (e.g., Researchers)
    // TODO: Display list of current Team Leads with an option to "demote" (change role)
    // TODO: Display list of potential Team Leads with an option to "promote" (change role to TEAM_LEAD)
    // TODO: This will heavily involve userService.changeUserRole and userService.getAllUsers (filtered by role)

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h4" gutterBottom>Manage Team Leads</Typography>
                <Typography>Functionality for Directors to assign/remove the Team Lead role from users will be here.</Typography>
                {/*
                Example:
                <Typography variant="h6">Current Team Leads</Typography>
                <UserList users={currentTeamLeads} onAction={handleDemote} actionLabel="Demote to Researcher" />
                <Typography variant="h6" sx={{mt:2}}>Potential Team Leads (Researchers)</Typography>
                <UserList users={potentialTeamLeads} onAction={handlePromote} actionLabel="Promote to Team Lead" />
                */}
            </Paper>
        </Container>
    );
};
export default ManageTeamLeadsPage;