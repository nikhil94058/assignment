# 📊 Student Progress Management System

This MERN stack project tracks students’ competitive programming progress using the **Codeforces API** and stores it in **MongoDB**. Admins can view rankings, detect inactive users, and automatically sync ratings via a cron job.

---

## 🧠 Features

- 🚀 Fetches **live Codeforces ratings** via public API
- 📊 Tracks **current & max rating**, **problem count**, and **recent activity**
- 📧 Sends **inactivity alert emails**
- 🧩 Clean and responsive **UI dashboard** with dark/light toggle
- 🔁 Cron job to **auto-sync updates** daily
- 🛠️ Full **REST API for CRUD operations**

---

## ⚙️ Technology Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Scheduler**: node-cron
- **APIs Used**: Codeforces Public API

---

## 🧾 MongoDB Schema

```js
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  handle: { type: String, required: true },
  currentRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  lastOnlineTimeSeconds: { type: Number },
  problemSolved: { type: Number, default: 0 },
  lastSync: { type: Date },
});
```

---

## 🧪 API Endpoints

### 🔍 Students

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/students`     | Get all students       |
| GET    | `/api/students/:id` | Get student by ID      |
| POST   | `/api/students`     | Add a new student      |
| PUT    | `/api/students/:id` | Update student details |
| DELETE | `/api/students/:id` | Delete student         |

### 🔄 Sync

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| POST   | `/api/sync/:handle` | Manually sync a student |
| POST   | `/api/sync`         | Sync all students       |

Internally uses:

- `https://codeforces.com/api/user.info?handles={handle}`
- `https://codeforces.com/api/user.status?handle={handle}`

---

## 🔁 Cron Job (Scheduled Sync)

A cron job runs **daily at 02:00 AM** to sync all students' latest data from Codeforces and update the MongoDB collection.

### Example

```js
const cron = require("node-cron");

cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running daily sync...");
  const students = await Student.find({});
  for (const student of students) {
    await updateStudentFromCodeforces(student.handle);
  }
});
```

---

## 📧 Inactivity Email Alerts

Students who haven't submitted a problem in the last **X days** will automatically receive an inactivity alert email.

```js
const isInactive = (lastSubmissionTime) => {
  const now = Math.floor(Date.now() / 1000);
  return now - lastSubmissionTime > INACTIVITY_THRESHOLD;
};
```

---

## 🔒 Environment Variables

Create a `.env` file and add the following:

```ini
MONGO_URI=your_mongo_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## 🛠 Setup Instructions

```bash
# Clone repository
git clone https://github.com/yourusername/student-progress-tracker.git

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd frontend
npm install
npm start
```

---

## 📚 References

- [Codeforces API Docs](https://codeforces.com/apiHelp)
- [node-cron Documentation](https://www.npmjs.com/package/node-cron)
- [Mongoose Documentation](https://mongoosejs.com/)

```

```
