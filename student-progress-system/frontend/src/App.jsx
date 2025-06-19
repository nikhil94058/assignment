// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import StudentTable from './components/StudentTable';
import StudentProfile from './components/StudentProfile';

function App() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      <Header />
      <main className="p-4">
        {!selectedStudent ? (
          <StudentTable onSelect={setSelectedStudent} />
        ) : (
          <StudentProfile student={selectedStudent} goBack={() => setSelectedStudent(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
