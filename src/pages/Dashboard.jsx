import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/submissions/user');
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

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

              <Link
                to={`/challenges/${s.challengeId}`}
                className="mt-3 md:mt-0 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Retry
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;