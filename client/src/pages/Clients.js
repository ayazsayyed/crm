// client/src/pages/Clients.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    MenuItem,
    Alert,
    InputAdornment,
    Card,
    CardContent,
    Grid,
    Tooltip,
    Fade,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Business as BusinessIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    
    const handleRowClick = (clientId) => {
        navigate(`/clients/${clientId}`);
    };
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/clients');
            setClients(response.data);
        } catch (error) {
            setError('Failed to fetch clients');
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleOpen = (client = null) => {
        setSelectedClient(client);
        if (client) {
            setFormData({
                company_name: client.company_name,
                contact_person: client.contact_person,
                email: client.email,
                phone: client.phone,
                address: client.address,
                status: client.status
            });
        } else {
            setFormData({
                company_name: '',
                contact_person: '',
                email: '',
                phone: '',
                address: '',
                status: 'active'
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedClient(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedClient) {
                await axios.put(`/clients/${selectedClient.id}`, formData);
            } else {
                await axios.post('/clients', formData);
            }
            fetchClients();
            handleClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Error saving client');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await axios.delete(`/clients/${id}`);
                fetchClients();
            } catch (error) {
                setError('Error deleting client');
            }
        }
    };

    // const filteredClients = clients.filter(client =>
    //     client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     client.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredClients = clients.filter(client => {
        const matchesSearch = (
            client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4 
                }}
            >
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 600,
                        color: 'primary.main' 
                    }}
                >
                    Clients
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    sx={{
                        px: 3,
                        py: 1,
                        backgroundColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    }}
                >
                    Add Client
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Clients
                            </Typography>
                            <Typography variant="h4">
                                {clients.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Active Clients
                            </Typography>
                            <Typography variant="h4">
                                {clients.filter(c => c.status === 'active').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Inactive Clients
                            </Typography>
                            <Typography variant="h4">
                                {clients.filter(c => c.status === 'inactive').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Filter Section */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            select
                            variant="outlined"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </TextField>
                    </Box>
                </CardContent>
            </Card>

            {/* Clients Table */}
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Company</TableCell>
                            <TableCell>Contact Person</TableCell>
                            <TableCell>Contact Info</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredClients.map((client) => (
                            <TableRow 
                                key={client.id}
                                onClick={() => handleRowClick(client.id)}
                                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon color="action" />
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {client.company_name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{client.contact_person}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{client.email}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{client.phone}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={client.status}
                                        color={client.status === 'active' ? 'success' : 'default'}
                                        size="small"
                                        sx={{ 
                                            borderRadius: 1,
                                            textTransform: 'capitalize'
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleOpen(client)}
                                            sx={{ mr: 1 }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleDelete(client.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedClient ? 'Edit Client' : 'Add New Client'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Company Name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Contact Person"
                            name="contact_person"
                            value={formData.contact_person}
                            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            margin="normal"
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedClient ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Clients;