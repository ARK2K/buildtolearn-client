import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import ViewReplayModal from './ViewReplayModal'; // ✅ renamed

const ChallengeLeaderboard = ({ challengeId }) => {
  const [leaders, setLeaders] = useState([]);
  const [selectedReplay, setSelectedReplay] = useState(null); // for modal

  // memoize socket so it isn’t recreated on every render
  const socket = useMemo(() => io('http://localhost:5000'), []);

  const fetchLeaderboard = async () => {
    if (!challengeId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/leaderboard/challenge/${challengeId}`
      );
      setLeaders(res.data);
    } catch (err) {
      console.error('Failed to load challenge leaderboard', err);
    }
  };

  useEffect(() => {
    if (!challengeId) return;

    fetchLeaderboard();

    // join challenge-specific room
    socket.emit('join-room', `leaderboard-${challengeId}`);

    // listen for updates
    const handleUpdate = (updatedChallengeId) => {
      if (updatedChallengeId === challengeId) {
        fetchLeaderboard();
      }
    };
    socket.on('leaderboard-update', handleUpdate);

    return () => {
      socket.emit('leave-room', `leaderboard-${challengeId}`);
      socket.off('leaderboard-update', handleUpdate);
    };
  }, [challengeId, socket]);

  if (!challengeId) return null;

  const getBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-lg font-bold mb-4">🏆 Challenge Leaderboard</h2>
      {leaders.length === 0 ? (
        <p className="text-gray-500 text-sm">No submissions yet for this challenge.</p>
      ) : (
        <ol className="space-y-2">
          {leaders.map((entry, idx) => (
            <li
              key={entry._id}
              className="flex justify-between items-center text-sm border-b pb-1"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getBadge(idx)}</span>
                <span className="font-medium">
                  {idx + 1}. {entry.username || 'Anonymous'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-indigo-600 font-semibold">
                  Score: {entry.score}
                </span>
                <button
                  onClick={() => setSelectedReplay(entry)}
                  className="text-blue-500 underline hover:text-blue-700 transition text-xs"
                >
                  ▶ View
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* Replay Modal */}
      {selectedReplay && (
        <ViewReplayModal
          isOpen={!!selectedReplay}
          onClose={() => setSelectedReplay(null)}
          replayData={selectedReplay}
        />
      )}
    </div>
  );
};

export default ChallengeLeaderboard;