import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const categoryIcons: Record<string, string> = {
  "Special/Role": "👑",
  Events: "🎉",
  Contribution: "🛠️",
  Membership: "🕰️",
  Community: "🌐",
  Secret: "🔮",
};

const categoryColors: Record<string, string> = {
  "Special/Role":
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  Events:
    "border-pink-500/20 bg-pink-500/10 text-pink-400",
  Contribution:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
  Membership:
    "border-green-500/20 bg-green-500/10 text-green-400",
  Community:
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  Secret:
    "border-purple-500/20 bg-purple-500/10 text-purple-400",
};

export default async function BadgesPage() {
  const badges = await prisma.badge.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      description: true,
      category: true,
      createdAt: true,
      users: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalAwards = badges.reduce(
    (total, badge) => total + badge.users.length,
    0
  );

  const categories = Array.from(
    new Set(badges.map((badge) => badge.category))
  );

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-linear-to-br from-purple-500/10 via-[#111116] to-blue-500/10 p-8 md:p-12">

            {/* Glow */}
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

            <div className="relative">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                <span>🏆</span>
                Nexus Achievements
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-5">
                Badges
              </h1>

              <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mt-4">
                Discover the achievements members can earn throughout
                the Nexus community. Participate, contribute, and
                unlock your collection.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mt-8">

                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-xl">
                    🏅
                  </span>

                  <div>
                    <p className="text-lg font-extrabold">
                      {badges.length}
                    </p>

                    <p className="text-xs text-gray-500">
                      Total Badges
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-xl">
                    🎖️
                  </span>

                  <div>
                    <p className="text-lg font-extrabold">
                      {totalAwards}
                    </p>

                    <p className="text-xs text-gray-500">
                      Awards Given
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-xl">
                    🌐
                  </span>

                  <div>
                    <p className="text-lg font-extrabold">
                      {categories.length}
                    </p>

                    <p className="text-xs text-gray-500">
                      Categories
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Empty State */}
          {badges.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">

              <div className="text-6xl">
                🏆
              </div>

              <h2 className="text-2xl font-bold mt-5">
                No badges yet
              </h2>

              <p className="text-gray-500 max-w-md mx-auto mt-3">
                Nexus badges haven't been created yet. Once achievements
                are added, they will appear here.
              </p>

            </div>
          ) : (
            <>
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-12 mb-6">

                <div>
                  <p className="text-sm text-purple-400 font-semibold">
                    Achievement collection
                  </p>

                  <h2 className="text-3xl md:text-4xl font-bold mt-1">
                    Explore Badges
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Browse every achievement available in Nexus.
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  {badges.length}{" "}
                  {badges.length === 1 ? "badge" : "badges"}
                </div>

              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mb-8">

                <div className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-300 text-xs font-semibold">
                  All
                </div>

                {categories.map((category) => (
                  <div
                    key={category}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                      categoryColors[category] ??
                      "border-white/10 bg-white/[0.04] text-gray-400"
                    }`}
                  >
                    {categoryIcons[category] ?? "🏅"}{" "}
                    {category}
                  </div>
                ))}

              </div>

              {/* Badge Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {badges.map((badge) => {
                  const categoryIcon =
                    categoryIcons[badge.category] ?? "🏅";

                  const categoryStyle =
                    categoryColors[badge.category] ??
                    "border-white/10 bg-white/[0.04] text-gray-400";

                  const recipientCount = badge.users.length;

                  return (
                    <Link
                      key={badge.id}
                      href={`/badges/${badge.slug}`}
                      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 hover:border-purple-500/30 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300"
                    >

                      {/* Card Glow */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="relative">

                        {/* Top Row */}
                        <div className="flex items-start justify-between gap-4">

                          {/* Icon */}
                          <div className="w-16 h-16 shrink-0 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-300">
                            {badge.icon}
                          </div>

                          {/* Category */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${categoryStyle}`}
                          >
                            <span>
                              {categoryIcon}
                            </span>

                            {badge.category}
                          </span>

                        </div>

                        {/* Name */}
                        <h3 className="text-xl font-bold mt-6 group-hover:text-purple-400 transition-colors">
                          {badge.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 leading-relaxed mt-2 line-clamp-3 min-h-[60px]">
                          {badge.description}
                        </p>

                        {/* Bottom */}
                        <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-white/10">

                          <div className="flex items-center gap-2">

                            <span className="text-sm">
                              🏆
                            </span>

                            <span className="text-xs text-gray-500">
                              {recipientCount}{" "}
                              {recipientCount === 1
                                ? "award"
                                : "awards"}
                            </span>

                          </div>

                          <span className="text-sm font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                            View badge →
                          </span>

                        </div>

                      </div>

                    </Link>
                  );
                })}

              </div>

              {/* Achievement Info */}
              <div className="mt-12 grid md:grid-cols-3 gap-5">

                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                    🎯
                  </div>

                  <h3 className="text-lg font-bold mt-4">
                    Earn Achievements
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mt-2">
                    Take part in the Nexus community and complete
                    activities to unlock special badges.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
                    🤝
                  </div>

                  <h3 className="text-lg font-bold mt-4">
                    Contribute
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mt-2">
                    Help the community, participate in projects,
                    and make Nexus a better place.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl">
                    ✨
                  </div>

                  <h3 className="text-lg font-bold mt-4">
                    Build Your Collection
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mt-2">
                    Collect different achievements and showcase
                    your progress on your Nexus profile.
                  </p>
                </div>

              </div>

              {/* CTA */}
              <div className="relative overflow-hidden mt-12 rounded-3xl border border-purple-500/10 bg-linear-to-r from-purple-500/5 to-blue-500/5 p-8 md:p-10 text-center">

                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

                <div className="relative">

                  <div className="text-4xl">
                    🚀
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mt-4">
                    Ready to earn your first badge?
                  </h2>

                  <p className="text-gray-400 max-w-xl mx-auto mt-3">
                    Join events, contribute to the community, and
                    stay active to unlock achievements.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">

                    <Link
                      href="/events"
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 font-bold hover:scale-105 transition"
                    >
                      Explore Events
                      <span>→</span>
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 font-semibold hover:bg-white/[0.08] hover:text-white transition"
                    >
                      Back Home
                    </Link>

                  </div>

                </div>

              </div>
            </>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}