const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // If admin, can see all projects or we can restrict. Let's say Admin sees all, Member sees only where they are a member or owner.
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find({}).populate('owner', 'name email').populate('members', 'name email');
    } else {
      projects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }]
      }).populate('owner', 'name email').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (project) {
      // Check if user is authorized to view
      if (
        req.user.role === 'Admin' ||
        project.owner._id.equals(req.user._id) ||
        project.members.some(member => member._id.equals(req.user._id))
      ) {
        res.json(project);
      } else {
        res.status(403).json({ message: 'Not authorized to view this project' });
      }
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { name, description, members } = req.body;

  try {
    const project = new Project({
      name,
      description,
      owner: req.user._id,
      members: members || []
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  const { name, description, members } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.name = name || project.name;
      project.description = description || project.description;
      project.members = members || project.members;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      // Cascade delete tasks
      await Task.deleteMany({ projectId: req.params.id });
      await project.deleteOne();
      res.json({ message: 'Project and associated tasks removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
