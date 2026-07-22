const projects = [
  {
    name: "Roblox Projects",
    description:
      "Explore the Roblox games and experiences created by the Nexus team.",
    type: "Game Development",
    icon: "🎮",
  },
  {
    name: "PC Games",
    description:
      "Upcoming PC games including horror and multiplayer experiences.",
    type: "Game Development",
    icon: "🖥️",
  },
  {
    name: "Minecraft Mods",
    description:
      "Custom Minecraft mods, items, bosses, and new experiences.",
    type: "Modding",
    icon: "⛏️",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-24 px-6">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-white text-center">
          Featured <span className="text-purple-500">Projects</span>
        </h2>

        <p className="text-gray-400 text-center mt-4">
          Discover what we are building.
        </p>


        <div className="grid md:grid-cols-3 gap-8 mt-12">

          {projects.map((project) => (
            <div
              key={project.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500 hover:-translate-y-2 transition duration-300"
            >

              <div className="text-5xl">
                {project.icon}
              </div>

              <p className="text-purple-400 text-sm mt-6">
                {project.type}
              </p>

              <h3 className="text-2xl font-bold text-white mt-3">
                {project.name}
              </h3>

              <p className="text-gray-400 mt-4">
                {project.description}
              </p>

              <button className="mt-6 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-bold">
                Learn More
              </button>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}