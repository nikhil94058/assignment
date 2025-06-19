import React, { useState, useEffect } from 'react';
import ContestHistory from './ContestHistory';
import ProblemSolvingData from './ProblemSolvingData';

const StudentProfile = ({ student, goBack }) => {
  const [ratingData, setRatingData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);

  useEffect(() => {
    const fetchRating = async () => {
      const res = await fetch(`https://codeforces.com/api/user.rating?handle=${student.handle}`);
      const data = await res.json();
      setRatingData(data.result || []);
    };

    const fetchSubmissions = async () => {
      const res = await fetch(`https://codeforces.com/api/user.status?handle=${student.handle}`);
      const data = await res.json();
      console.log('📦 Submission Data:', data.result); // <-- Console log here
      setSubmissionData(data.result || []);
    };


    fetchRating();
    fetchSubmissions();
  }, [student]);

  return (
    <div className="p-4 md:p-6 bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg shadow-lg border border-blue-500 dark:border-blue-400 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
          👤 Profile: {student.name}
        </h2>
        <button
          onClick={goBack}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          🔙 Go Back
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Contest History Section */}
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-400 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
            📈 Contest History
          </h3>
          <ContestHistory data={ratingData} submissions={submissionData} />

        </div>

        {/* Problem Solving Section */}
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-400 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
            ✅ Problem Solving
          </h3>

          <ProblemSolvingData data={submissionData} />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
