// server/src/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Project routes
router.get('/', auth, projectController.getProjects);
router.get('/:id', auth, projectController.getProjectById);
router.post('/', auth, projectController.createProject);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);
router.get('/:id/statistics', auth, projectController.getProjectStatistics);

// Task routes
router.get('/:projectId/tasks', auth, taskController.getProjectTasks);
router.get('/:projectId/tasks/:taskId', auth, taskController.getTaskById);
router.post('/:projectId/tasks', auth, taskController.createTask);
router.put('/:projectId/tasks/:taskId', auth, taskController.updateTask);
router.delete('/:projectId/tasks/:taskId', auth, taskController.deleteTask);

// Task comments
router.get('/:projectId/tasks/:taskId/comments', auth, taskController.getTaskComments);
router.post('/:projectId/tasks/:taskId/comments', auth, taskController.addTaskComment);
router.delete('/:projectId/tasks/:taskId/comments/:commentId', auth, taskController.deleteTaskComment);

module.exports = router;