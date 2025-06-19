const cron = require('node-cron');
const Student = require('../models/Student');
const sendReminderEmail = require('../utils/sendReminderEmail');

const checkInactivityAndSendEmails = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const inactiveStudents = await Student.find({
    allowReminder: true,
    $or: [
      { lastSubmissionDate: { $lt: sevenDaysAgo } },
      { lastSubmissionDate: { $exists: false } }
    ]
  });

  for (const student of inactiveStudents) {
    try {
      await sendReminderEmail(student.email, student.name);
      student.remindersSent += 1;
      student.lastReminderSentAt = new Date();
      await student.save();
      console.log(`📨 Email sent to ${student.email}`);
    } catch (err) {
      console.error(`❌ Failed to email ${student.email}`, err);
    }
  }

  console.log(`✅ Processed ${inactiveStudents.length} inactive students`);
};

// 🔁 Run daily at 2 AM
cron.schedule('0 2 * * *', checkInactivityAndSendEmails);

// ✅ Export the function so we can run it manually
module.exports = checkInactivityAndSendEmails;
