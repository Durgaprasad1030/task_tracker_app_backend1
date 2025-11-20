const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Clear existing data
    await Task.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed...');

    // 2. Define Sample Users (Defined INLINE now)
    const usersList = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
    ];

    // 3. Create Users
    const createdUsers = [];
    for (const u of usersList) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    
    const adminUser = createdUsers[0]._id;
    const user1 = createdUsers[1]._id;
    const user2 = createdUsers[2]._id;

    console.log('Users Imported...');

    // 4. Define Sample Tasks linked to Users
    const tasksList = [
      {
        title: 'Review Project Proposal',
        description: 'Check the budget and timeline for the new Q4 project.',
        status: 'pending',
        createdBy: adminUser,
      },
      {
        title: 'Fix Login Bug',
        description: 'Users are getting 404 on logout.',
        status: 'in-progress',
        createdBy: user1,
      },
      {
        title: 'Design Homepage',
        description: 'Create wireframes for the new landing page.',
        status: 'completed',
        createdBy: user1,
      },
      {
        title: 'Write API Documentation',
        description: 'Document the /api/tasks endpoints using Swagger.',
        status: 'pending',
        createdBy: user2,
      },
      {
        title: 'Database Backup',
        description: 'Ensure weekly backup cron job is running.',
        status: 'completed',
        createdBy: adminUser,
      },
    ];

    // 5. Insert Tasks
    await Task.insertMany(tasksList);
    console.log('Tasks Imported!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Task.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}