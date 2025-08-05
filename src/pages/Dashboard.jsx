import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ViewReplayModal from '../components/ViewReplayModal';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplay, setShowReplay] = useState(false);
  const [replayData, setReplayData] = useState(null);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = await getToken();
        const res = await axios.get('http://localhost:5000/api/submissions/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [getToken]);

  const getBadge = (score) => {
    if (score >= 100) return '🥇';
    if (score >= 80) return '🥈';
    if (score >= 60) return '🥉';
    return '';
  };

  const openReplay = (submission) => {
    setReplayData(submission);
    setShowReplay(true);
  };

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Challenge Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-500">No submissions yet. Start a challenge!</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div
              key={s._id}
              className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{s.challengeTitle}</h2>
                <p className="text-sm text-gray-500">{new Date(s.submittedAt).toLocaleString()}</p>
                <p className="mt-1 text-sm">
                  Score: <span className="font-medium">{s.score}</span>{' '}
                  {s.passed ? (
                    <span className="text-green-600 ml-2">✅ Passed</span>
                  ) : (
                    <span className="text-red-600 ml-2">❌ Try Again</span>
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">Feedback: {s.feedback}</p>
              </div>

              <div className="mt-3 md:mt-0 flex items-center space-x-3">
                <button
                  onClick={() => openReplay(s)}
                  className="text-blue-600 underline text-sm hover:text-blue-800 transition"
                >
                  ▶ View
                </button>

                <span className="text-2xl">{getBadge(s.score)}</span>

                <Link
                  to={`/challenges/${s.challengeId}`}
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Retry
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <ViewReplayModal
        isOpen={showReplay}
        onClose={() => setShowReplay(false)}
        submission={replayData}
      />
    </div>
  );
};

export default Dashboard;