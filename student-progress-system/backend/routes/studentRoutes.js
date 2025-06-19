const express = require('express');

const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

const router = express.Router();



// GET all students
router.get('/', getAllStudents);

// GET one student by ID
router.get('/:id', getStudentById);

// POST new student
router.post('/', addStudent);

// PUT update student
router.put('/:id', updateStudent);

// DELETE student
router.delete('/:id', deleteStudent);

// Toggle email reminder on/off
router.put('/:id/reminder-toggle', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.allowReminder = !student.allowReminder;
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
