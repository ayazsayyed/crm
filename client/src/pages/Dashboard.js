// client/src/pages/Dashboard.js
import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as ProjectIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  // In a real app, these would come from an API
  const stats = {
    totalClients: 45,
    activeProjects: 12,
    totalRevenue: 150000,
  };

  const recentActivities = [
    { id: 1, type: 'New Client', description: 'ABC Corp joined', date: '2023-06-15' },
    { id: 2, type: 'Project Update', description: 'Website redesign completed', date: '2023-06-14' },
    { id: 3, type: 'Payment Received', description: '$5,000 from XYZ Ltd', date: '2023-06-13' },
  ];

  const StatCard = ({ title, value, icon }) => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Total Clients" 
            value={stats.totalClients}
            icon={<PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Active Projects" 
            value={stats.activeProjects}
            icon={<ProjectIcon sx={{ fontSize: 40, color: 'secondary.main' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Total Revenue" 
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<MoneyIcon sx={{ fontSize: 40, color: 'success.main' }} />}
          />
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        <List>
          {recentActivities.map((activity) => (
            <ListItem key={activity.id} divider>
              <ListItemText
                primary={activity.type}
                secondary={
                  <>
                    {activity.description}
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                      sx={{ float: 'right' }}
                    >
                      {activity.date}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard;