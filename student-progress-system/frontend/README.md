# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

///////////////////

import React, { useState, useEffect } from 'react';
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer,
} from 'recharts';
import { subDays, format } from 'date-fns';

// 🔹 Fetch total number of problems in a contest
const getTotalProblems = async (contestId) => {
const url = `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`;
try {
const res = await fetch(url);
const data = await res.json();
if (data.status === 'OK') {
return data.result.problems.length;
} else {
console.error('❌ Failed to fetch contest data');
return 0;
}
} catch (error) {
console.error('❌ Error fetching contest problems:', error);
return 0;
}
};

const ContestHistory = ({ data, submissions }) => {
const [filterDays, setFilterDays] = useState(90);
const [processedData, setProcessedData] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
const process = async () => {
setLoading(true);
const cutoff = subDays(new Date(), filterDays);
const contests = data.filter(
(entry) => new Date(entry.ratingUpdateTimeSeconds \* 1000) >= cutoff
);

      const enriched = await Promise.all(
        contests.map(async (entry) => {
          const contestId = entry.contestId;

          const submissionsForContest = submissions.filter(
            (sub) => sub?.contestId === contestId && sub?.problem
          );

          const solvedSet = new Set();

          submissionsForContest.forEach((sub) => {
            if (sub.verdict === 'OK') {
              const key = `${sub.problem.contestId}-${sub.problem.index}`;
              solvedSet.add(key);
            }
          });

          const solved = solvedSet.size;
          const total = await getTotalProblems(contestId);
          const unsolved = Math.max(0, total - solved);

          return {
            ...entry,
            date: format(new Date(entry.ratingUpdateTimeSeconds * 1000), 'dd MMM'),
            ratingChange: entry.newRating - entry.oldRating,
            solved,
            total,
            unsolved,
          };
        })
      );

      setProcessedData(enriched);
      setLoading(false);
    };

    process();

}, [data, submissions, filterDays]);

return (
<div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full text-black dark:text-white">
<h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
📊 Contest History
</h3>

      {/* Filter buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[30, 90, 365].map((day) => (
          <button
            key={day}
            onClick={() => setFilterDays(day)}
            className={`px-3 py-1.5 rounded text-sm font-medium ${
              filterDays === day
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Last {day} days
          </button>
        ))}
      </div>

      {/* Rating Chart */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">📈 Rating Over Time</h4>
        <div className="w-full h-[250px] min-w-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="newRating" stroke="#3182ce" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contest Table */}
      <div>
        <h4 className="font-medium mb-2">📋 Contest Table</h4>
        {loading ? (
          <p className="text-gray-500">⏳ Loading contest data...</p>
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="min-w-[500px] w-full border divide-y dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="text-left px-3 py-2">Contest</th>
                  <th className="text-left px-3 py-2">Rank</th>
                  <th className="text-left px-3 py-2">Rating Change</th>
                  <th className="text-left px-3 py-2">Solved</th>
                  <th className="text-left px-3 py-2">Total</th>
                  <th className="text-left px-3 py-2">Unsolved</th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((entry, idx) => (
                  <tr key={idx} className="border-t dark:border-gray-700">
                    <td className="px-3 py-2">{entry.contestName}</td>
                    <td className="px-3 py-2">{entry.rank}</td>
                    <td className="px-3 py-2">
                      {entry.oldRating} → {entry.newRating}{' '}
                      <span
                        className={`ml-1 ${
                          entry.ratingChange >= 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        ({entry.ratingChange >= 0 ? '+' : ''}
                        {entry.ratingChange})
                      </span>
                    </td>
                    <td className="px-3 py-2">{entry.solved}</td>
                    <td className="px-3 py-2">{entry.total}</td>
                    <td className="px-3 py-2">{entry.unsolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {processedData.length === 0 && (
              <p className="text-gray-500 mt-3">No contests found for the selected range.</p>
            )}
          </div>
        )}
      </div>
    </div>

);
};

export default ContestHistory;
