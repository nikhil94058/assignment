require('dotenv').config();
const mongoose = require('mongoose');
const checkInactivityAndSendEmails = require('../cron/syncCodeforces');

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('📡 Connected to MongoDB. Running test...');
  await checkInactivityAndSendEmails();

  mongoose.disconnect();
};

start();
