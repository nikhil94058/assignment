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

const getTotalProblems = async (contestId) => {
  // Try full data first (recommended)
  const url1 = `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1`;
  const url2 = `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`;

  try {
    // First try the full response
    let res = await fetch(url1);
    let data = await res.json();
    if (data.status === 'OK' && data.result.problems.length > 0) {
      return data.result.problems.length;
    }

    // If the above failed to return problems, try the limited one
    res = await fetch(url2);
    data = await res.json();
    if (data.status === 'OK' && data.result.problems.length > 0) {
      return data.result.problems.length;
    }

    console.error(`❌ API error for contest ${contestId}: no problems found`);
    return 0;

  } catch (err) {
    console.error(`❌ Fetch error for contest ${contestId}:`, err);
    return 0;
  }
};


const ContestHistory = ({ data, submissions }) => {
  const [filterDays, setFilterDays] = useState(90);
  const [processed, setProcessed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      const cutoff = subDays(new Date(), filterDays);

      const contests = data.filter(
        (entry) => new Date(entry.ratingUpdateTimeSeconds * 1000) >= cutoff
      );

      const enriched = await Promise.all(
        contests.map(async (entry) => {
          const contestId = entry.contestId;

          const submissionsForContest = submissions.filter(
            (sub) => sub.contestId === contestId && sub.problem
          );

          const solvedProblems = new Set();
          submissionsForContest.forEach((sub) => {
            if (sub.verdict === 'OK') {
              const key = `${sub.problem.contestId}-${sub.problem.index}`;
              solvedProblems.add(key);
            }
          });

          const solved = solvedProblems.size;
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

      setProcessed(enriched);
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
            className={`px-3 py-1.5 rounded text-sm font-medium ${filterDays === day
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
            <LineChart data={processed}>
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
                {processed.map((entry, idx) => (
                  <tr key={idx} className="border-t dark:border-gray-700">
                    <td className="px-3 py-2">{entry.contestName}</td>
                    <td className="px-3 py-2">{entry.rank}</td>
                    <td className="px-3 py-2">
                      {entry.oldRating} → {entry.newRating}{' '}
                      <span
                        className={`ml-1 ${entry.ratingChange >= 0 ? 'text-green-600' : 'text-red-500'
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
            {processed.length === 0 && (
              <p className="text-gray-500 mt-3">No contests found for the selected range.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestHistory;
