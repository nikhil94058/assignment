const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },  // Optional: Add validation if needed
  handle: { type: String, required: true },  // Codeforces handle
  currentRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },

  //  fields for inactivity reminder feature
  lastSubmissionDate: Date,
  remindersSent: { type: Number, default: 0 },
  allowReminder: { type: Boolean, default: true },
  lastReminderSentAt: Date
});

module.exports = mongoose.model('Student', StudentSchema);
