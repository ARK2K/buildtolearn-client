import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import ViewReplayModal from './ViewReplayModal';

const socket = io('http://localhost:5000');

const GlobalLeaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leaderboard/global');
      
      // ✅ sort by score first, then highestStreak
      const sorted = [...res.data].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.highestStreak ?? 0) - (a.highestStreak ?? 0);
      });

      setEntries(sorted);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // 🎧 Listen for real-time leaderboard updates
    socket.on('global-leaderboard-update', fetchLeaderboard);

    return () => {
      socket.off('global-leaderboard-update', fetchLeaderboard);
    };
  }, []);

  const getBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  const handleReplay = (entry) => {
    setSelectedSubmission(entry);
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center p-4">Loading leaderboard...</div>;
  if (!entries.length) return <div className="text-center p-4">No submissions yet.</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 border border-gray-300 rounded-lg shadow bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">🌍 Global Leaderboard</h2>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Badge</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Challenge</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">🔥 Highest Streak</th>
            <th className="p-2 border">Submitted</th>
            <th className="p-2 border">Replay</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry._id} className="hover:bg-gray-50">
              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border text-xl text-center">{getBadge(idx)}</td>
              <td className="p-2 border">{entry.username || 'Anonymous'}</td>
              <td className="p-2 border">{entry.challengeTitle}</td>
              <td className="p-2 border font-semibold text-indigo-600">{entry.score}</td>
              <td className="p-2 border text-orange-600 font-medium text-center">
                {entry.highestStreak ?? 0}
              </td>
              <td className="p-2 border">{new Date(entry.submittedAt).toLocaleString()}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleReplay(entry)}
                  className="text-blue-500 underline hover:text-blue-700 transition text-xs"
                >
                  ▶ View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Replay Modal */}
      <ViewReplayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSubmission}
      />
    </div>
  );
};

export default GlobalLeaderboard;