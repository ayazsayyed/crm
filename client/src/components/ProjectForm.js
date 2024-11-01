// src/components/ProjectForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Divider,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    Alert,
    Autocomplete,
    CircularProgress,
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import axios from '../utils/axios';

const ProjectForm = () => {
    const { id: projectId } = useParams();
    console.log('id ', projectId);
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState({
        clients: false,
        users: false
    });
    const [dropdownOptions, setDropdownOptions] = useState({
        clients: [],
        developers: [],
        managers: [],
        allUsers: []
    });
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        client_id: '',
        status: 'planned',
        priority: 'medium',
        start_date: '',
        end_date: '',
        budget: '',
        estimated_hours: '',
        assigned_team: [],
        progress: 0
    });

    useEffect(() => {
        fetchInitialData();
    }, [projectId]);

    useEffect(() => {
        fetchDropdownOptions();
        if (projectId) {
            fetchInitialData();
        }
    }, [projectId]);
    const fetchDropdownOptions = async () => {
        try {
            setLoadingOptions({ clients: true, users: true });
            
            // Fetch clients and users in parallel
            const [clientsResponse, usersResponse] = await Promise.all([
                axios.get('/clients'),
                axios.get('/users')
            ]);

            // Filter users by role
            const allUsers = usersResponse.data;
            const developers = allUsers.filter(user => user.role === 'developer');
            const managers = allUsers.filter(user => user.role === 'manager');

            setDropdownOptions({
                clients: clientsResponse.data,
                developers,
                managers,
                allUsers
            });

        } catch (error) {
            console.error('Error fetching dropdown options:', error);
            setError('Failed to load form options');
        } finally {
            setLoadingOptions({ clients: false, users: false });
        }
    };
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            // Fetch clients and users for dropdowns
            const [clientsResponse, usersResponse] = await Promise.all([
                axios.get('/clients'),
                axios.get('/users')
            ]);

            setClients(clientsResponse.data);
            setUsers(usersResponse.data);

            // If editing existing project, fetch project data
            if (projectId) {
                const projectResponse = await axios.get(`/projects/${projectId}`);
                const projectData = projectResponse.data;
                setFormData({
                    name: projectData.name,
                    description: projectData.description,
                    client_id: projectData.client_id,
                    status: projectData.status,
                    priority: projectData.priority || 'medium',
                    start_date: projectData.start_date?.split('T')[0] || '',
                    end_date: projectData.end_date?.split('T')[0] || '',
                    budget: projectData.budget || '',
                    estimated_hours: projectData.estimated_hours || '',
                    progress: projectData.progress || 0,
                    assigned_team: projectData.team_members || []
                });
            }

            setError('');
        } catch (err) {
            setError('Failed to load required data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = {
                ...formData,
                assigned_team: formData.assigned_team.map(user => user.id) 
            };
            if (projectId) {
                await axios.put(`/projects/${projectId}`, formDataToSend);
            } else {
                await axios.post('/projects', formDataToSend);
            }
            navigate('/projects');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                {projectId ? 'Edit Project' : 'Create New Project'}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Basic Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Project Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Client</InputLabel>
                                            <Select
                                                name="client_id"
                                                value={formData.client_id}
                                                onChange={handleChange}
                                                label="Client"
                                                required
                                                disabled={loadingOptions.clients}
                                            >
                                                {dropdownOptions.clients.map(client => (
                                                    <MenuItem key={client.id} value={client.id}>
                                                        {client.company_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Project Manager</InputLabel>
                                        <Select
                                            name="manager_id"
                                            value={formData.manager_id}
                                            onChange={handleChange}
                                            label="Project Manager"
                                            disabled={loadingOptions.users}
                                        >
                                            {dropdownOptions.managers.map(manager => (
                                                <MenuItem key={manager.id} value={manager.id}>
                                                    {manager.username}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                    {/* <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            multiple
                                            options={users}
                                            getOptionLabel={(option) => option.username}
                                            value={formData.assigned_team}
                                            onChange={(event, newValue) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    assigned_team: newValue
                                                }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Assign Team Members"
                                                    placeholder="Select members"
                                                />
                                            )}
                                        />
                                    </Grid> */}
                                    <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        options={dropdownOptions.developers}
                                        getOptionLabel={(option) => option.username}
                                        value={formData.assigned_team || []}
                                        onChange={(event, newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                assigned_team: newValue
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Development Team"
                                                placeholder="Select developers"
                                            />
                                        )}
                                        disabled={loadingOptions.users}
                                    />
                                </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Project Details */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Project Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                label="Status"
                                            >
                                                <MenuItem value="planned">Planned</MenuItem>
                                                <MenuItem value="in_progress">In Progress</MenuItem>
                                                <MenuItem value="completed">Completed</MenuItem>
                                                <MenuItem value="on_hold">On Hold</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Priority</InputLabel>
                                            <Select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleChange}
                                                label="Priority"
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Start Date"
                                            name="start_date"
                                            type="date"
                                            value={formData.start_date}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="End Date"
                                            name="end_date"
                                            type="date"
                                            value={formData.end_date}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Budget and Hours */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Budget and Effort
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Budget"
                                            name="budget"
                                            type="number"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">$</InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Estimated Hours"
                                            name="estimated_hours"
                                            type="number"
                                            value={formData.estimated_hours}
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">hrs</InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    {projectId && (
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Progress"
                                                name="progress"
                                                type="number"
                                                value={formData.progress}
                                                onChange={handleChange}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">%</InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {(loadingOptions.clients || loadingOptions.users) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                )}

            {/* Error Display */}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

                {/* Form Actions */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => navigate('/projects')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={loading || loadingOptions.clients || loadingOptions.users}
                    >
                        {loading ? 'Saving...' : 'Save Project'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ProjectForm;