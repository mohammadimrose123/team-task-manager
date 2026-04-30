const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/tasks/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'Admin') {
      // Member only sees tasks assigned to them
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      task.status !== 'Completed' && task.dueDate && new Date(task.dueDate) < now
    ).length;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all tasks (with filters)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    let filter = {};
    
    // Filters from query params
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Role based filtering
    if (req.user.role !== 'Admin') {
      filter.assignedTo = req.user._id;
    }

    // Sorting
    let sort = {};
    if (req.query.sortBy === 'dueDate') {
      sort.dueDate = 1;
    }

    const tasks = await Task.find(filter)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .sort(sort);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, status, dueDate, priority } = req.body;

  try {
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      status: status || 'Pending',
      dueDate,
      priority: priority || 'Medium'
    });

    const createdTask = await task.save();
    
    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('task_created', createdTask);
    }

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, assignedTo, status, dueDate, priority } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      // Members can only update status
      if (req.user.role === 'Member') {
        if (!task.assignedTo || !task.assignedTo.equals(req.user._id)) {
          return res.status(403).json({ message: 'Not authorized to update this task' });
        }
        if (title || description || assignedTo || dueDate || priority) {
          return res.status(403).json({ message: 'Members can only update task status' });
        }
        task.status = status || task.status;
      } else {
        // Admin can update all fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
      }

      const updatedTask = await task.save();

      // Emit socket event for real-time update
      if (req.io) {
        req.io.emit('task_updated', updatedTask);
      }

      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      
      if (req.io) {
        req.io.emit('task_deleted', req.params.id);
      }

      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
