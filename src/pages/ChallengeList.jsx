import { useEffect, useState } from 'react';
import axios from 'axios';
import ChallengeCard from '../components/ChallengeCard';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/challenges');
        setChallenges(res.data);
      } catch (err) {
        console.error('Failed to fetch challenges:', err);
        setError('Could not load challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading challenges...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // 🔍 Filter + search logic
  const filteredChallenges = challenges.filter((c) => {
    const matchesDifficulty =
      difficultyFilter === 'All' || c.difficulty === difficultyFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Challenges</h2>

      {/* 🔍 Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
        />
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
        >
          <option value="All">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {filteredChallenges.length === 0 ? (
        <p className="text-center text-gray-500">No challenges found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge._id} challenge={challenge} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ChallengeList;