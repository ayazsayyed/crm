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
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    FormControl,
    InputLabel,
    InputAdornment,
} from '@mui/material';
import { 
    Close as CloseIcon,
    Upload as UploadIcon 
} from '@mui/icons-material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    AttachFile as AttachFileIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Event as EventIcon,
    Edit as EditIcon,
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
    const [projectDialog, setProjectDialog] = useState(false);
    const [documentDialog, setDocumentDialog] = useState(false);
    const [noteDialog, setNoteDialog] = useState(false);
    
    // Selected item states for editing
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);

    // Contact handlers
    const handleContactDialogOpen = (contact = null) => {
        setSelectedContact(contact);
        setContactDialog(true);
    };

    const handleContactSubmit = async (formData) => {
        try {
            if (selectedContact) {
                // Update existing contact
                await axios.put(`/clients/${id}/contacts/${selectedContact.id}`, formData);
            } else {
                // Create new contact
                await axios.post(`/clients/${id}/contacts`, formData);
            }
            fetchClientData(); // Refresh data
            setContactDialog(false);
            setSelectedContact(null);
        } catch (error) {
            setError('Failed to save contact');
            console.error('Contact save error:', error);
        }
    };

    // Project handlers
    const handleProjectDialogOpen = (project = null) => {
        setSelectedProject(project);
        setProjectDialog(true);
    };

    const handleProjectSubmit = async (formData) => {
        try {
            if (selectedProject) {
                // Update existing project
                await axios.put(`/clients/${id}/projects/${selectedProject.id}`, formData);
            } else {
                // Create new project
                await axios.post(`/clients/${id}/projects`, formData);
            }
            fetchClientData();
            setProjectDialog(false);
            setSelectedProject(null);
        } catch (error) {
            setError('Failed to save project');
            console.error('Project save error:', error);
        }
    };

    const handleDownload = async (doc) => {
        try {
            await axios.get(`/clients/${id}/documents/${doc.id}/download`);
        } catch (error) {
            setError('Failed to download document');
            console.error('Document download error:', error);
        }
    }
    // Document handlers
    const handleDocumentDialogOpen = () => {
        setDocumentDialog(true);
    };

    const handleDocumentSubmit = async (formData) => {
        try {
            await axios.post(`/clients/${id}/documents`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchClientData();
            setDocumentDialog(false);
        } catch (error) {
            setError('Failed to upload document');
            console.error('Document upload error:', error);
        }
    };

    // Note handlers
    const handleNoteDialogOpen = (note = null) => {
        setSelectedNote(note);
        setNoteDialog(true);
    };

    const handleNoteSubmit = async (formData) => {
        try {
            if (selectedNote) {
                // Update existing note
                await axios.put(`/clients/${id}/notes/${selectedNote.id}`, formData);
            } else {
                // Create new note
                await axios.post(`/clients/${id}/notes`, formData);
            }
            fetchClientData();
            setNoteDialog(false);
            setSelectedNote(null);
        } catch (error) {
            setError('Failed to save note');
            console.error('Note save error:', error);
        }
    };

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
                    onClick={() => handleContactDialogOpen()}
                >
                    Add Contact
                </Button>
            </Box>
            <List>
                {contacts.map((contact) => (
                    <ListItem 
                        key={contact.id}
                        secondaryAction={
                            <IconButton 
                                edge="end" 
                                onClick={() => handleContactDialogOpen(contact)}
                            >
                                <EditIcon />
                            </IconButton>
                        }
                    >
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

            {/* Contact Dialog */}
            <ContactDialog
                open={contactDialog}
                handleClose={() => {
                    setContactDialog(false);
                    setSelectedContact(null);
                }}
                handleSubmit={handleContactSubmit}
                selectedContact={selectedContact}
            />
        </Box>
    );
    // Projects Section
    const ProjectHistory = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Projects
            </Typography>
            <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleProjectDialogOpen()}
                >
                    Add Contact
                </Button>
                </Box>
            <Grid container spacing={2}>
                {projects.map((project) => (
                    <Grid item xs={12} md={6} key={project.id}>
                        <Card>
                            <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">{project.name}</Typography>
                                    <IconButton 
                                        size="small"
                                        onClick={() => handleProjectDialogOpen(project)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Box>
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
            <ProjectDialog
                open={projectDialog}
                handleClose={() => {
                    setProjectDialog(false);
                    setSelectedProject(null);
                }}
                handleSubmit={handleProjectSubmit}
                selectedProject={selectedProject}
            />
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
                    onClick={handleDocumentDialogOpen}
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
                            <IconButton edge="end" onClick={() => handleDownload(doc)}>
                                <DescriptionIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <DocumentDialog
                open={documentDialog}
                handleClose={() => setDocumentDialog(false)}
                handleSubmit={handleDocumentSubmit}
            />
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
                    onClick={() => handleNoteDialogOpen()}
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
            <NoteDialog
                open={noteDialog}
                handleClose={() => {
                    setNoteDialog(false);
                    setSelectedNote(null);
                }}
                handleSubmit={handleNoteSubmit}
                selectedNote={selectedNote}
            />
        </Box>
    );



// Contact Dialog
const ContactDialog = ({ open, handleClose, handleSubmit, selectedContact }) => {
    const [formData, setFormData] = useState({
        contact_type: selectedContact?.contact_type || 'email',
        subject: selectedContact?.subject || '',
        description: selectedContact?.description || '',
        contact_date: selectedContact?.contact_date?.split('T')[0] || new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {selectedContact ? 'Edit Contact' : 'Add Contact'}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Contact Type</InputLabel>
                        <Select
                            name="contact_type"
                            value={formData.contact_type}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="call">Call</MenuItem>
                            <MenuItem value="meeting">Meeting</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Contact Date"
                        name="contact_date"
                        value={formData.contact_date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {selectedContact ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// Document Upload Dialog
const DocumentDialog = ({ open, handleClose, handleSubmit }) => {
    const [file, setFile] = useState(null);
    const [comments, setComments] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('comments', comments);
        handleSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Upload Document
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <input
                            accept="*/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="raised-button-file">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<UploadIcon />}
                            >
                                Choose File
                            </Button>
                        </label>
                        {file && <Box sx={{ mt: 1 }}>{file.name}</Box>}
                    </Box>
                    <TextField
                        fullWidth
                        label="Comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        multiline
                        rows={2}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={!file}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// Note Dialog
const NoteDialog = ({ open, handleClose, handleSubmit, selectedNote }) => {
    const [note, setNote] = useState(selectedNote?.note || '');

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit({ note });
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {selectedNote ? 'Edit Note' : 'Add Note'}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        multiline
                        rows={4}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {selectedNote ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// Project Dialog
const ProjectDialog = ({ open, handleClose, handleSubmit, selectedProject }) => {
    const [formData, setFormData] = useState({
        name: selectedProject?.name || '',
        description: selectedProject?.description || '',
        status: selectedProject?.status || 'planned',
        start_date: selectedProject?.start_date || '',
        end_date: selectedProject?.end_date || '',
        budget: selectedProject?.budget || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {selectedProject ? 'Edit Project' : 'Add Project'}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Project Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="planned">Planned</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="on_hold">On Hold</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        type="date"
                        label="Start Date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {selectedProject ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
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