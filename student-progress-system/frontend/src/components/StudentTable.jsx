import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const StudentTable = ({ onSelect }) => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    handle: '',
    currentRating: '',
    maxRating: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/students`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error fetching students", err));
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStudent = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      handle: form.handle,
      currentRating: Number(form.currentRating),
      maxRating: Number(form.maxRating),
      lastSubmissionDate: new Date(),
      remindersSent: 0,
      allowReminder: true,
      lastReminderSentAt: null
    };

    try {
      if (editIndex !== null) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${students[editIndex]._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudent),
        });

        if (!response.ok) throw new Error('Failed to update student');

        const updatedStudent = await response.json();
        const updated = [...students];
        updated[editIndex] = updatedStudent;
        setStudents(updated);
        setEditIndex(null);
      } else {
        const response = await fetch('${import.meta.env.VITE_API_URL}/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudent),
        });

        if (!response.ok) throw new Error('Failed to add student');

        const savedStudent = await response.json();
        setStudents([...students, savedStudent]);
      }

      setForm({
        name: '',
        email: '',
        phone: '',
        handle: '',
        currentRating: '',
        maxRating: ''
      });
    } catch (err) {
      console.error('Error submitting student:', err);
      alert('Error: Unable to add/update student.');
    }
  };

  const handleEdit = async (id, index) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/students/${id}`);
      if (!response.ok) throw new Error('Failed to fetch student data');
      const data = await response.json();
      setForm(data);
      setEditIndex(index);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStudents(prev => prev.filter(student => student._id !== id));
      } else {
        const errorData = await res.json();
        alert(`Error deleting student: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while deleting the student.');
    }
  };

  return (
    <Card className="mt-6 bg-white dark:bg-gray-800 text-black dark:text-white border border-blue-600 shadow-lg">
      <CardContent className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Enrolled Students</h2>
          <CSVLink
            data={students}
            filename="students.csv"
            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            ⬇️ Download CSV
          </CSVLink>
        </div>

        {/* Responsive form */}
        <form
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          onSubmit={handleSubmit}
        >
          {['name', 'email', 'phone', 'handle', 'currentRating', 'maxRating'].map((field) => (
            <Input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleInput}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
              className="border border-blue-300 text-black placeholder:text-gray-500 dark:bg-gray-700 dark:text-white"
            />
          ))}
          <Button type="submit" className="sm:col-span-2 md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white w-full">
            {editIndex !== null ? 'Update Student' : 'Add Student'}
          </Button>
        </form>

        {/* Responsive scrollable table */}
        <div className="overflow-x-auto rounded border border-blue-600">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow className="bg-blue-100 dark:bg-blue-900">
                <TableHead className="text-blue-700 dark:text-blue-300 font-semibold">Name</TableHead>
                <TableHead className="text-blue-700 dark:text-blue-300">Email</TableHead>
                <TableHead className="text-blue-700 dark:text-blue-300">Phone</TableHead>
                <TableHead className="text-blue-700 dark:text-blue-300">Handle</TableHead>
                <TableHead className="text-blue-700 dark:text-blue-300">Current</TableHead>
                <TableHead className="text-blue-700 dark:text-blue-300">Max</TableHead>
                <TableHead className="text-blue-700 dark:text-blue-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, idx) => (
                <TableRow key={student._id} className="hover:bg-blue-50 dark:hover:bg-blue-800">
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.handle}</TableCell>
                  <TableCell>{student.currentRating}</TableCell>
                  <TableCell>{student.maxRating}</TableCell>
                  <TableCell className="space-y-1 space-x-0 sm:space-x-2 sm:space-y-0 flex flex-col sm:flex-row">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      onClick={() => onSelect(student)}
                    >
                      View More
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:hover:bg-blue-900"
                      onClick={() => handleEdit(student._id, idx)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="hover:bg-red-600 hover:text-white"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 dark:text-gray-400">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentTable;
