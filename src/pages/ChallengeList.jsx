import ChallengeCard from '../components/ChallengeCard';

const sampleChallenges = [
  {
    _id: '1',
    title: 'Netflix Navbar',
    description: 'Recreate the responsive navbar from Netflix.',
    image: 'https://source.unsplash.com/featured/400x225?ui,netflix',
    difficulty: 'Easy',
  },
  {
    _id: '2',
    title: 'Trello Board',
    description: 'Build a drag-and-drop Trello-style board.',
    image: 'https://source.unsplash.com/featured/400x225?ui,kanban',
    difficulty: 'Medium',
  },
  {
    _id: '3',
    title: 'Discord Chat UI',
    description: 'Clone the message interface of Discord.',
    image: 'https://source.unsplash.com/featured/400x225?ui,chat',
    difficulty: 'Hard',
  },
];

const ChallengeList = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Challenges</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sampleChallenges.map((challenge) => (
          <ChallengeCard key={challenge._id} challenge={challenge} />
        ))}
      </div>
    </section>
  );
};

export default ChallengeList;