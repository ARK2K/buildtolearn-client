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
  const [filter, setFilter] = useState("all"); // "4", "8", "all"
  const [showStreak, setShowStreak] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        const res = await axios.get("/api/user-stats/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const safeData = Array.isArray(res.data) ? res.data : [];
        setHistory(safeData.reverse()); 
        // reverse so newest is at index 0 for banner, table, chart filters
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

  if (!history.length) {
    return <p className="text-center text-gray-500">No history available</p>;
  }

  // Apply filter
  let filteredHistory = history;
  if (filter === "4") {
    filteredHistory = history.slice(0, 4);
  } else if (filter === "8") {
    filteredHistory = history.slice(0, 8);
  }

  const labels = filteredHistory.map((h) => h.label).reverse();
  const scores = filteredHistory.map((h) => h.score).reverse();
  const streaks = filteredHistory.map((h) => h.streak).reverse();

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
        yAxisID: "y",
      },
      ...(showStreak
        ? [
            {
              label: "Streak",
              data: streaks,
              borderColor: "rgb(234, 88, 12)", // Tailwind orange-600
              backgroundColor: "rgba(234, 88, 12, 0.2)",
              tension: 0.3,
              fill: false,
              yAxisID: "y1",
            },
          ]
        : []),
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
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Score" },
      },
      y1: {
        type: "linear",
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Streak" },
      },
    },
  };

  // current streak is newest (index 0 after reversing at fetch)
  const currentStreak = history[0]?.streak ?? 0;

  return (
    <div className="bg-white shadow rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">📊 My Weekly History</h2>

      {/* Streak Banner */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
        🔥 Current Streak: <span className="font-bold">{currentStreak}</span>{" "}
        week{currentStreak === 1 ? "" : "s"}
      </div>

      {/* Filters + Toggle */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("4")}
            className={`px-3 py-1 rounded ${
              filter === "4"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Last 4
          </button>
          <button
            onClick={() => setFilter("8")}
            className={`px-3 py-1 rounded ${
              filter === "8"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Last 8
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            All
          </button>
        </div>

        {/* Toggle Streak */}
        <label className="flex items-center gap-2 text-gray-700 text-sm">
          <input
            type="checkbox"
            checked={showStreak}
            onChange={() => setShowStreak(!showStreak)}
            className="w-4 h-4 text-blue-500 border-gray-300 rounded"
          />
          Show Streak
        </label>
      </div>

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
              {showStreak && <th className="p-3 border">Streak</th>}
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((h, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-3 border">{h.label}</td>
                <td className="p-3 border font-semibold">{h.score}</td>
                <td className="p-3 border">{h.submissions}</td>
                {showStreak && <td className="p-3 border">{h.streak}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHistory;