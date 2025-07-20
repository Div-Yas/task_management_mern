const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

const router = express.Router();

// All routes protected
router.use(auth);

// Create task
router.post(
  '/',
  [
    body('taskName').notEmpty().withMessage('Task name is required'),
    body('dueDate').notEmpty().withMessage('Due date is required'),
  ],
  taskController.createTask
);

// Get all tasks for user
router.get('/', taskController.getTasks);

// Update task
router.put(
  '/:id',
  [
    body('taskName').notEmpty().withMessage('Task name is required'),
    body('dueDate').notEmpty().withMessage('Due date is required'),
  ],
  taskController.updateTask
);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router; 