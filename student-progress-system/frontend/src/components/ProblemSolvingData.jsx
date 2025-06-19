import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { format, subDays } from 'date-fns';

const ProblemSolvingData = ({ data }) => {
  const [filter, setFilter] = useState(30);

  const filtered = useMemo(() => {
    const fromDate = subDays(new Date(), filter);
    return data
      .filter((d) => d.verdict === 'OK' && new Date(d.creationTimeSeconds * 1000) >= fromDate)
      .map((d) => ({
        ...d,
        date: format(new Date(d.creationTimeSeconds * 1000), 'yyyy-MM-dd'),
        rating: d.problem.rating || 800,
      }));
  }, [data, filter]);

  const mostDifficult = filtered.reduce((acc, curr) =>
    curr.rating > acc.rating ? curr : acc,
    { rating: 0 }
  );

  const totalSolved = filtered.length;
  const avgRating = Math.round(filtered.reduce((a, b) => a + b.rating, 0) / totalSolved || 0);
  const avgPerDay = Math.round(totalSolved / filter);

  // Replace old useMemo
  const ratingBuckets = useMemo(() => {
    const buckets = {};
    filtered.forEach(({ rating }) => {
      const key = Math.floor(rating / 100) * 100;
      buckets[key] = (buckets[key] || 0) + 1;
    });

    return Object.entries(buckets)
      .map(([rating, count]) => ({ rating: Number(rating), count }))
      .sort((a, b) => a.rating - b.rating);
  }, [filtered]);


  const heatmapData = useMemo(() => {
    const counts = {};
    filtered.forEach((item) => {
      counts[item.date] = (counts[item.date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [filtered]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-black dark:text-white w-full">
      <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
        Problem Solving Data
      </h3>

      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[7, 30, 90].map((day) => (
          <button
            key={day}
            onClick={() => setFilter(day)}
            className={`px-3 py-1.5 rounded text-sm font-medium ${filter === day
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
          >
            Last {day} days
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
        <div>
          ✅ Most Difficult: <strong>{mostDifficult.problem?.name || 'N/A'}</strong> ({mostDifficult.rating})
        </div>
        <div>
          📈 Total Solved: <strong>{totalSolved}</strong>
        </div>
        <div>
          📊 Average Rating: <strong>{avgRating}</strong>
        </div>
        <div>
          📅 Avg/Day: <strong>{avgPerDay}</strong>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 text-gray-800 dark:text-white">
          Problems Solved per Rating
        </h4>
        <div className="w-full h-[250px] min-w-[300px] bg-white dark:bg-gray-800 rounded shadow transition-colors">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingBuckets}>
              <XAxis
                dataKey="rating"
                tick={{ fill: '#1A202C' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E0' }}
                className="dark:text-white"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#1A202C' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E0' }}
                className="dark:text-white"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2D3748',
                  border: 'none',
                  color: 'white'
                }}
                labelStyle={{ color: '#E2E8F0' }}
                itemStyle={{ color: '#EDF2F7' }}
              />
              <Bar dataKey="count" fill="#3182ce" isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Heatmap */}
      <div>
        <h4 className="font-medium mb-2">Submission Heatmap</h4>
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-[350px]">
            <CalendarHeatmap
              startDate={subDays(new Date(), filter)}
              endDate={new Date()}
              values={heatmapData}
              classForValue={(value) => {
                if (!value) return 'color-empty';
                return `color-github-${Math.min(value.count, 4)}`;
              }}
              tooltipDataAttrs={(value) => ({
                'data-tip': `${value.date} - ${value.count || 0} submissions`,
              })}
              showWeekdayLabels
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingData;
