import { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading leaderboard...</div>;

  const getBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">🏆 Leaderboard</h1>
      {leaders.length === 0 ? (
        <p className="text-center text-gray-500">No submissions yet.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase tracking-wider">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Best Score</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((entry, idx) => (
                <tr key={entry.userId} className="border-t text-sm hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{getBadge(idx + 1)}</td>
                  <td className="px-4 py-2">{entry.username || entry.userId}</td>
                  <td className="px-4 py-2">{entry.bestScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;