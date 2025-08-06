import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
  const { challengeId } = useParams(); // may be undefined for global
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Leaderboard');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        let res;
        if (challengeId) {
          res = await axios.get(`http://localhost:5000/api/leaderboard/challenge/${challengeId}`);
          setTitle('Challenge Leaderboard');
        } else {
          res = await axios.get(`http://localhost:5000/api/leaderboard/global`);
          setTitle('Global Leaderboard');
        }
        setLeaders(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [challengeId]);

  const getBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return <div className="p-6 text-center">Loading {title.toLowerCase()}...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">🏆 {title}</h1>
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
                <tr key={entry._id || idx} className="border-t text-sm hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{getBadge(idx + 1)}</td>
                  <td className="px-4 py-2">{entry.username || entry._id}</td>
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