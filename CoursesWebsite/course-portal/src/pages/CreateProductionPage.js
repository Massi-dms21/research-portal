import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, Container, CircularProgress, Paper, Select, MenuItem, InputLabel, FormControl, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import productionService from '../api/productionService';
import { AuthContext } from '../App';
import projectService from '../api/projectService'; // To fetch projects for dropdown

const productionTypes = ["ARTICLE", "CONFERENCE_PAPER", "BOOK", "BOOK_CHAPTER", "THESIS", "REPORT", "PATENT", "OTHER"];

const CreateProductionPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [type, setType] = useState(productionTypes[0]);
  const [publicationDate, setPublicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projects, setProjects] = useState([]);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);


  useEffect(() => {
    const fetchProjects = async () => {
      setIsProjectsLoading(true);
      try {
        const data = await projectService.getAllProjects();
        setProjects(data || []);
      } catch (err) {
        console.error("Failed to fetch projects", err);
        setError("Could not load projects for selection. You can still create a production without linking it to a project.");
      } finally {
        setIsProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);


  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
    } else {
        setFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser || !currentUser.id) {
        setError("User not authenticated. Please log in again.");
        return;
    }
    if (!title || !type || !publicationDate) {
        setError("Title, Type, and Publication Date are required.");
        return;
    }
    setError('');
    setIsLoading(true);

    const formData = new FormData();
    // The 'production' part needs to be a JSON string as per backend ScientificProductionController
    const productionData = {
        title,
        abstractText: abstractText || "",
        type,
        publicationDate
    };
    formData.append('production', new Blob([JSON.stringify(productionData)], { type: 'application/json' }));

    // authorId and researchProjectId are sent as separate form parts
    formData.append('authorId', currentUser.id.toString());
    if (selectedProjectId) {
        formData.append('researchProjectId', selectedProjectId);
    }
    if (file) {
        formData.append('file', file);
    }

    try {
      await productionService.createProduction(formData);
      navigate('/productions', { state: { message: 'Scientific Production created successfully!' } });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create production.';
      setError(errorMsg);
      console.error("Create Production Error:", errorMsg, err.response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ p: {xs:2, md:4}, mt: 3 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Add New Scientific Production
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField fullWidth required label="Title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Abstract" multiline minRows={3} maxRows={10} value={abstractText} onChange={(e) => setAbstractText(e.target.value)} disabled={isLoading} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={isLoading}>
                    <InputLabel id="type-select-label">Type</InputLabel>
                    <Select labelId="type-select-label" value={type} label="Type" onChange={(e) => setType(e.target.value)}>
                    {productionTypes.map(pt => <MenuItem key={pt} value={pt}>{pt}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    required
                    label="Publication Date"
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={isLoading}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth disabled={isLoading || isProjectsLoading}>
                    <InputLabel id="project-select-label">Research Project (Optional)</InputLabel>
                    <Select
                        labelId="project-select-label"
                        value={selectedProjectId}
                        label="Research Project (Optional)"
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {projects.map(p => <MenuItem key={p.id} value={p.id.toString()}>{p.title} (ID: {p.id})</MenuItem>)}
                    </Select>
                    {isProjectsLoading && <Typography variant="caption" sx={{mt:0.5}}>Loading projects...</Typography>}
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{mt:1}}>
                <Typography variant="subtitle1" component="div" sx={{mb:0.5}}>Upload File (Optional):</Typography>
                <Button variant="outlined" component="label" disabled={isLoading} sx={{ textTransform: 'none'}}>
                    Choose File
                    <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {file && <Typography sx={{ml: 2, display: 'inline-block', verticalAlign: 'middle', fontStyle: 'italic'}}>{file.name}</Typography>}
            </Grid>
          </Grid>

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit"/> : 'Create Production'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
export default CreateProductionPage;