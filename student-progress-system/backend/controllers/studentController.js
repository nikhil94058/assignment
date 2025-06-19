const Student = require('../models/Student');

// GET all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      console.log(`Student with ID ${req.params.id} not found.`);
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log('Fetched Student Details:');
    console.log(JSON.stringify(student, null, 2)); // Pretty print

    res.json(student);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// POST - Add new student
const addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      handle,
      currentRating,
      maxRating,
      lastSubmissionDate,
      remindersSent,
      allowReminder,
      lastReminderSentAt
    } = req.body;

    const student = new Student({
      name,
      email,
      phone,
      handle,
      currentRating,
      maxRating,
      lastSubmissionDate,
      remindersSent,
      allowReminder,
      lastReminderSentAt
    });

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request' });
  }
};

// PUT - Update student by ID
const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student updated successfully', student: updated });
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
};

// DELETE - Remove student by ID
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Attempting to delete student with ID:", id); // ✅ after declaration
    const removed = await Student.findByIdAndDelete(id);

    if (!removed) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};
