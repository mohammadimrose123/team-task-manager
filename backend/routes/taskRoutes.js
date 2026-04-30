const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.get('/dashboard', protect, getDashboardStats);

router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, admin, deleteTask);

module.exports = router;
