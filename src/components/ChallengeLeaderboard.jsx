import { useEffect, useState } from 'react';
import axios from 'axios';

const ChallengeLeaderboard = ({ challengeId }) => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
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

    if (challengeId) fetchLeaderboard();
  }, [challengeId]);

  if (!challengeId) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-lg font-bold mb-4">🥇 Challenge Leaderboard</h2>
      <ol className="space-y-2">
        {leaders.map((entry, idx) => (
          <li key={entry._id} className="flex justify-between text-sm">
            <span className="font-medium">{idx + 1}. {entry.username || 'Anonymous'}</span>
            <span className="text-indigo-600 font-semibold">Score: {entry.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ChallengeLeaderboard;