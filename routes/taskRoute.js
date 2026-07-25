const express = require('express');
const {
  createTaskValidator,
  getTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} = require('../utils/validators/taskValidator');

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../services/taskService');

const { protect } = require('../services/authService');

const router = express.Router();

router.use(protect);

router.route('/').get(getTasks).post(createTaskValidator, createTask);

router
  .route('/:id')
  .get(getTaskValidator, getTask)
  .put(updateTaskValidator, updateTask)
  .delete(deleteTaskValidator, deleteTask);

module.exports = router;
