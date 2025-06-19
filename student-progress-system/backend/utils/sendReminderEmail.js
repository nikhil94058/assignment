const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendReminderEmail = async (to, name) => {
  const mailOptions = {
    from: `"Student Progress" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Codeforces Activity Reminder',
    html: `<p>Hello ${name},</p>
           <p>We noticed that you haven’t made any Codeforces submissions in the last 7 days.</p>
           <p>Keep practicing to stay on track!</p>
           <p>– Student Progress Management System</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendReminderEmail;
