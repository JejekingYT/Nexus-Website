type CommunityCardProps = {
  name: string;
  description: string;
  type: string;
  members: string;
};

export default function CommunityCard({
  name,
  description,
  type,
  members,
}: CommunityCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500 hover:-translate-y-2 transition">

      <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center text-3xl">
        🌐
      </div>

      <h3 className="text-2xl font-bold text-white mt-6">
        {name}
      </h3>

      <p className="text-purple-400 mt-2">
        {type}
      </p>

      <p className="text-gray-400 mt-4">
        {description}
      </p>

      <p className="text-gray-300 mt-4">
        Members: {members}
      </p>

      <button className="mt-6 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-bold">
        Join Discord
      </button>

    </div>
  );
}