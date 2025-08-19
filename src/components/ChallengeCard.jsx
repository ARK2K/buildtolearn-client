import { Link } from 'react-router-dom';

const ChallengeCard = ({ challenge }) => {
  const fallbackImage =
    'https://res.cloudinary.com/dwfkxyeti/image/upload/v1755087763/fallback_m9xsvu.png' || '/public/fallback.png';
  const imageUrl = challenge.image || fallbackImage;

  // Badge colors based on difficulty
  const getBadgeClasses = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
          className={`text-xs px-2 py-1 rounded-full ${getBadgeClasses(
            challenge.difficulty
          )}`}
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