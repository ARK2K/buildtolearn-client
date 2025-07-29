import { useEffect, useState } from 'react';
import axios from 'axios';
import ChallengeCard from '../components/ChallengeCard';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/challenges');
        setChallenges(res.data);
      } catch (err) {
        console.error('Failed to fetch challenges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading challenges...</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Challenges</h2>

      {challenges.length === 0 ? (
        <p className="text-center text-gray-500">No challenges found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge._id} challenge={challenge} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ChallengeList;