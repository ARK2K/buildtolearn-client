import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ViewReplayModal from '../components/ViewReplayModal';
import DashboardHistory from '../components/DashboardHistory';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = await getToken();
        // ✅ match backend route `/user` not `/me`
        const res = await axios.get('/api/submissions/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setSubmissions([]); // fallback
      }
    };

    fetchSubmissions();
  }, [getToken]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      {/* 🔹 Weekly History Chart + Table */}
      <DashboardHistory />

      {/* 🔹 Submissions Section */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-500">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Challenge</th>
                  <th className="p-2 border">Score</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id} className="border-t">
                    <td className="p-2 border">
                      <Link
                        to={`/challenges/${sub.challengeId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {sub.challengeTitle || sub.challengeId}
                      </Link>
                    </td>
                    <td className="p-2 border">{sub.score}</td>
                    <td className="p-2 border">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        View Replay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔹 Replay Modal */}
      {selectedSubmission && (
        <ViewReplayModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;