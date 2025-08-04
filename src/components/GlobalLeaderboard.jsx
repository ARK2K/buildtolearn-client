import { useEffect, useState } from 'react';
import axios from 'axios';

const GlobalLeaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leaderboard/global');
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center p-4">Loading leaderboard...</div>;
  if (!entries.length) return <div className="text-center p-4">No submissions yet.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 border border-gray-300 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">🌍 Global Leaderboard</h2>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-2 border">#</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Challenge</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry._id} className="hover:bg-gray-50">
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{entry.username || 'Anonymous'}</td>
              <td className="p-2 border">{entry.challengeTitle}</td>
              <td className="p-2 border">{entry.score}</td>
              <td className="p-2 border">{new Date(entry.submittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalLeaderboard;