export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full top-20"></div>

      <div className="relative text-center max-w-4xl">

        <h1 className="text-6xl md:text-8xl font-extrabold text-white">
          Welcome to{" "}
          <span className="text-purple-500">
            Nexus
          </span>
        </h1>

        <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
          One place for communities, projects, events, and everything we create.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">

          <button className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-bold">
            Explore Communities
          </button>

          <button className="px-8 py-4 rounded-xl border border-purple-500 hover:bg-purple-500/10 transition font-bold">
            Join Discord
          </button>

        </div>

      </div>

    </section>
  );
}