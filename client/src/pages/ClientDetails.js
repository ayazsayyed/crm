// src/pages/ClientDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Tab,
    Tabs,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Divider,
    Grid,
    Chip,
    MenuItem,
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    AttachFile as AttachFileIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import axios from '../utils/axios';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>{children}</Box>
            )}
        </div>
    );
}

const ClientDetails = () => {
    const { id } = useParams();
    const [value, setValue] = useState(0);
    const [client, setClient] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Dialog states
    const [contactDialog, setContactDialog] = useState(false);
    const [noteDialog, setNoteDialog] = useState(false);
    const [documentDialog, setDocumentDialog] = useState(false);

    useEffect(() => {
        fetchClientData();
    }, [id]);

    const fetchClientData = async () => {
        try {
            const [
                clientResponse,
                contactsResponse,
                projectsResponse,
                documentsResponse,
                notesResponse
            ] = await Promise.all([
                axios.get(`/clients/${id}`),
                axios.get(`/clients/${id}/contacts`),
                axios.get(`/clients/${id}/projects`),
                axios.get(`/clients/${id}/documents`),
                axios.get(`/clients/${id}/notes`)
            ]);

            setClient(clientResponse.data);
            setContacts(contactsResponse.data);
            setProjects(projectsResponse.data);
            setDocuments(documentsResponse.data);
            setNotes(notesResponse.data);
        } catch (error) {
            setError('Error fetching client data');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    // Client Overview Section
    const ClientOverview = () => (
        <Card>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Company Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BusinessIcon color="action" />
                                <Typography>{client?.company_name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon color="action" />
                                <Typography>{client?.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon color="action" />
                                <Typography>{client?.phone}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Quick Stats
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Card sx={{ flex: 1 }}>
                                <CardContent>
                                    <Typography color="textSecondary">
                                        Active Projects
                                    </Typography>
                                    <Typography variant="h4">
                                        {projects.filter(p => p.status === 'in_progress').length}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ flex: 1 }}>
                                <CardContent>
                                    <Typography color="textSecondary">
                                        Total Contacts
                                    </Typography>
                                    <Typography variant="h4">
                                        {contacts.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    // Contact History Section
    const ContactHistory = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Contact History</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setContactDialog(true)}
                >
                    Add Contact
                </Button>
            </Box>
            <List>
                {contacts.map((contact) => (
                    <ListItem key={contact.id}>
                        <ListItemIcon>
                            <EventIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={contact.subject}
                            secondary={
                                <>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(contact.contact_date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        {contact.description}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // Projects Section
    const ProjectHistory = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Projects
            </Typography>
            <Grid container spacing={2}>
                {projects.map((project) => (
                    <Grid item xs={12} md={6} key={project.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{project.name}</Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {project.description}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chip
                                        label={project.status}
                                        color={
                                            project.status === 'completed' ? 'success' :
                                            project.status === 'in_progress' ? 'primary' :
                                            'default'
                                        }
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        Start Date: {new Date(project.start_date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        End Date: {new Date(project.end_date).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    // Documents Section
    const Documents = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Documents</Typography>
                <Button
                    variant="contained"
                    startIcon={<AttachFileIcon />}
                    onClick={() => setDocumentDialog(true)}
                >
                    Upload Document
                </Button>
            </Box>
            <List>
                {documents.map((doc) => (
                    <ListItem key={doc.id}>
                        <ListItemIcon>
                            <AttachFileIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={doc.file_name}
                            secondary={new Date(doc.uploaded_at).toLocaleDateString()}
                        />
                        <ListItemSecondaryAction>
                            {/* <IconButton edge="end" onClick={() => handleDownload(doc)}> */}
                            <IconButton edge="end">
                                <DescriptionIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // Notes Section
    const Notes = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Notes</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setNoteDialog(true)}
                >
                    Add Note
                </Button>
            </Box>
            <List>
                {notes.map((note) => (
                    <ListItem key={note.id}>
                        <ListItemText
                            primary={note.note}
                            secondary={new Date(note.created_at).toLocaleDateString()}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Client Details
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Overview" />
                    <Tab label="Contact History" />
                    <Tab label="Projects" />
                    <Tab label="Documents" />
                    <Tab label="Notes" />
                </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
                <ClientOverview />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ContactHistory />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ProjectHistory />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Documents />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <Notes />
            </TabPanel>

            {/* Add your dialog components here */}
        </Box>
    );
};

export default ClientDetails;