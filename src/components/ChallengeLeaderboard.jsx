import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChallengeLeaderboard = ({ challengeId, onReplay }) => {
  const [leaders, setLeaders] = useState([]);

  const fetchLeaderboard = async () => {
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

    socket.emit('join-room', `leaderboard-${challengeId}`);

    socket.on('leaderboard-update', (updatedChallengeId) => {
      if (updatedChallengeId === challengeId) fetchLeaderboard();
    });

    return () => {
      socket.emit('leave-room', `leaderboard-${challengeId}`);
      socket.off('leaderboard-update');
    };
  }, [challengeId]);

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
              <span className="text-indigo-600 font-semibold">Score: {entry.score}</span>
              {onReplay && (
                <button
                  onClick={() => onReplay(entry)}
                  className="text-blue-500 underline hover:text-blue-700 transition text-xs"
                >
                  ▶ View
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ChallengeLeaderboard;