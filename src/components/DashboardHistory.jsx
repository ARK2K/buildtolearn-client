import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

const DashboardHistory = () => {
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        const res = await axios.get("/api/user-stats/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure response is always an array
        const safeData = Array.isArray(res.data) ? res.data : [];
        setHistory(safeData);
      } catch (err) {
        console.error("Error fetching history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [getToken]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading history...</p>;
  }

  if (!Array.isArray(history) || history.length === 0) {
    return <p className="text-center text-gray-500">No history available</p>;
  }

  // Use backend-provided label + score
  const labels = history.map((h) => h.label);
  const scores = history.map((h) => h.score);

  const data = {
    labels,
    datasets: [
      {
        label: "Weekly Score",
        data: scores,
        borderColor: "rgb(59, 130, 246)", // Tailwind blue-500
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "My Weekly History",
        font: { size: 18 },
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">📊 My Weekly History</h2>

      {/* Chart */}
      <div className="mb-6">
        <Line data={data} options={options} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border">Week</th>
              <th className="p-3 border">Score</th>
              <th className="p-3 border">Submissions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-3 border">{h.label}</td>
                <td className="p-3 border font-semibold">{h.score}</td>
                <td className="p-3 border">{h.submissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHistory;