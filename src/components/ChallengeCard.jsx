import { Link } from 'react-router-dom';

const ChallengeCard = ({ challenge }) => {
  const fallbackImage = '/fallback.jpg'; // Place this image in /public/fallback.jpg
  const imageUrl = challenge.image || fallbackImage;

  return (
    <div className="bg-white rounded-lg shadow p-4 transition hover:shadow-md">
      <img
        src={imageUrl}
        alt={challenge.title}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold mb-1">{challenge.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700`}
        >
          {challenge.difficulty}
        </span>
        <Link
          to={`/challenges/${challenge._id}`}
          className="text-sm text-indigo-600 font-semibold hover:underline"
        >
          Start →
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;