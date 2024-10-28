// client/src/pages/Projects.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const Projects = () => {
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'Website Redesign', 
      client: 'ABC Corp', 
      status: 'In Progress',
      deadline: '2023-07-30',
      budget: 15000 
    },
    { 
      id: 2, 
      name: 'Mobile App Development', 
      client: 'XYZ Ltd', 
      status: 'Planning',
      deadline: '2023-08-15',
      budget: 25000 
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAddClick = () => {
    setSelectedProject(null);
    setOpenDialog(true);
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleDeleteClick = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'info';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          New Project
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>
                  <Chip 
                    label={project.status} 
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{project.deadline}</TableCell>
                <TableCell>${project.budget.toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick(project)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedProject ? 'Edit Project' : 'New Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Project Name"
              fullWidth
              defaultValue={selectedProject?.name}
            />
            <TextField
              label="Client"
              fullWidth
              defaultValue={selectedProject?.client}
            />
            <TextField
              label="Status"
              fullWidth
              defaultValue={selectedProject?.status}
            />
            <TextField
              label="Deadline"
              type="date"
              fullWidth
              defaultValue={selectedProject?.deadline}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Budget"
              type="number"
              fullWidth
              defaultValue={selectedProject?.budget}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            {selectedProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;