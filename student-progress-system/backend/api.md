Here's a clean and developer-friendly **API Documentation** for your Student Progress Management System backend:

---

## 📘 Student API Documentation

**Base URL:**
`http://localhost:5000/api/students`

---

### 📍 `GET /api/students`

**Description:** Get all students

**Response:** `200 OK`

```json
[
  {
    "_id": "665f321c04ab349af1b12345",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "handle": "john_cf",
    "currentRating": 1400,
    "maxRating": 1600,
    "lastSubmissionDate": "2024-06-10T00:00:00.000Z",
    "remindersSent": 1,
    "allowReminder": true,
    "lastReminderSentAt": "2024-06-13T10:00:00.000Z"
  }
]
```

---

### 📍 `GET /api/students/:id`

**Description:** Get a single student by ID

**Response:** `200 OK`

```json
{
  "_id": "665f321c04ab349af1b12345",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "handle": "john_cf",
  "currentRating": 1400,
  "maxRating": 1600,
  "lastSubmissionDate": "2024-06-10T00:00:00.000Z",
  "remindersSent": 1,
  "allowReminder": true,
  "lastReminderSentAt": "2024-06-13T10:00:00.000Z"
}
```

---

### 📝 `POST /api/students`

**Description:** Add a new student

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "handle": "john_cf",
  "currentRating": 1400,
  "maxRating": 1600,
  "lastSubmissionDate": "2024-06-10T00:00:00.000Z",
  "remindersSent": 0,
  "allowReminder": true,
  "lastReminderSentAt": null
}
```

**Response:** `201 Created`

```json
{
  "_id": "665f321c04ab349af1b12345",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "handle": "john_cf",
  "currentRating": 1400,
  "maxRating": 1600,
  "lastSubmissionDate": "2024-06-10T00:00:00.000Z",
  "remindersSent": 0,
  "allowReminder": true,
  "lastReminderSentAt": null
}
```

---

### ✏️ `PUT /api/students/:id`

**Description:** Update a student by ID

**Request Body:** (any updatable fields)

```json
{
  "currentRating": 1450,
  "remindersSent": 1
}
```

**Response:** `200 OK`

```json
{
  "message": "Student updated successfully"
}
```

---

### ❌ `DELETE /api/students/:id`

**Description:** Delete a student by ID

**Response:** `200 OK`

```json
{
  "message": "Student deleted successfully"
}
```

---

### 🧪 Test with `curl`

```bash
curl http://localhost:5000/api/students

curl -X POST http://localhost:5000/api/students \
-H "Content-Type: application/json" \
-d '{"name":"Nikhil", "email":"nikhil@example.com", "phone":"9999999999", "handle":"nikhil_cf"}'
```

---

Let me know if you want Swagger/OpenAPI format or a downloadable Markdown file.
