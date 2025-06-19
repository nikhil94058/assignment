require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

const insertMockInactiveStudent = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const mockStudent = new Student({
    name: 'Test Inactive User',
    email: 'neha78k78@gmail.com',
    phone: '1234567890',
    handle: 'inactive_user_123', // ✅ Correct field name
    currentRating: 1450,
    maxRating: 1650,
    lastSubmissionDate: new Date('2024-12-01'), // Inactive
    allowReminder: true,
    remindersSent: 0
  });

  await mockStudent.save();
  console.log('✅ Inactive mock student added');

  mongoose.disconnect();
};

insertMockInactiveStudent();
