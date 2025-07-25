import { Link } from 'react-router-dom';

const ChallengeCard = ({ challenge }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
      <img
        src={challenge.image}
        alt={challenge.title}
        className="rounded-lg mb-3 aspect-video object-cover"
      />
      <h3 className="text-lg font-semibold mb-1">{challenge.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
          {challenge.difficulty}
        </span>
        <Link
          to={`/challenges/${challenge._id}`}
          className="text-sm text-indigo-600 font-medium hover:underline"
        >
          Start →
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;