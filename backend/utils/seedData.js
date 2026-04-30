const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (adminExists) return;

    console.log('Seeding initial data...');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'Admin'
    });

    // Create Member
    const memberPassword = await bcrypt.hash('member123', 10);
    const member = await User.create({
      name: 'Team Member',
      email: 'member@test.com',
      password: memberPassword,
      role: 'Member'
    });

    // Create Project
    const project = await Project.create({
      name: 'Website Redesign',
      description: 'Overhauling the company website with modern UI',
      owner: admin._id,
      members: [admin._id, member._id]
    });

    const project2 = await Project.create({
      name: 'Mobile App Launch',
      description: 'Building the new iOS and Android mobile app',
      owner: admin._id,
      members: [admin._id, member._id]
    });

    // Create Tasks
    await Task.create([
      {
        title: 'Design Mockups',
        description: 'Create Figma mockups for the homepage',
        projectId: project._id,
        assignedTo: member._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 2) // 2 days from now
      },
      {
        title: 'Setup Frontend Framework',
        description: 'Initialize React + Vite + Tailwind',
        projectId: project._id,
        assignedTo: admin._id,
        status: 'Completed',
        priority: 'Medium',
        dueDate: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        title: 'Implement Auth API',
        description: 'Add JWT based authentication to the backend',
        projectId: project._id,
        assignedTo: member._id,
        status: 'Pending',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 5) // 5 days from now
      },
      {
        title: 'Setup Push Notifications',
        description: 'Integrate Firebase for mobile notifications',
        projectId: project2._id,
        assignedTo: member._id,
        status: 'Pending',
        priority: 'Low',
        dueDate: new Date(Date.now() + 86400000 * 7) // 7 days from now
      }
    ]);

    console.log('Database seeded successfully!');
    console.log('=============================================');
    console.log('🧪 DEMO ACCOUNTS READY:');
    console.log('👨‍💼 Admin Login: admin@test.com   | Pass: admin123');
    console.log('👨‍💻 Member Login: member@test.com | Pass: member123');
    console.log('=============================================');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
