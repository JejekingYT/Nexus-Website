import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BadgeBrowser from "./BadgeBrowser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BadgesPage() {
  const badges = await prisma.badge.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      description: true,
      category: true,
      isSecret: true,
      requirement: true,
      target: true,
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

  // Convert Prisma data into simple data for the client component
  const browserBadges = badges.map((badge) => ({
    id: badge.id,
    name: badge.name,
    slug: badge.slug,
    icon: badge.icon,
    description: badge.description,
    category: badge.category,
    isSecret: badge.isSecret,
    recipientCount: badge.users.length,
  }));

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-7xl">

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-linear-to-br from-purple-500/10 via-[#111116] to-blue-500/10 p-8 md:p-12">
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
                <span>🏆</span>
                Nexus Achievements
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
                Badges
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
                Discover the achievements members can earn throughout
                the Nexus community. Participate, contribute, and
                unlock your collection.
              </p>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-xl">🏅</span>

                  <div>
                    <p className="text-lg font-extrabold">
                      {badges.length}
                    </p>

                    <p className="text-xs text-gray-500">
                      Total Badges
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-xl">🎖️</span>

                  <div>
                    <p className="text-lg font-extrabold">
                      {totalAwards}
                    </p>

                    <p className="text-xs text-gray-500">
                      Awards Given
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-xl">🌐</span>

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

              <h2 className="mt-5 text-2xl font-bold">
                No badges yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-gray-500">
                Nexus badges haven't been created yet. Once achievements
                are added, they will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* SEARCH + CATEGORY FILTER + BADGES */}
              <BadgeBrowser
                badges={browserBadges}
                categories={categories}
              />

              {/* Achievement Info */}
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-xl">
                    🎯
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    Earn Achievements
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Take part in the Nexus community and complete
                    activities to unlock special badges.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xl">
                    🤝
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    Contribute
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Help the community, participate in projects,
                    and make Nexus a better place.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-xl">
                    ✨
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    Build Your Collection
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Collect different achievements and showcase
                    your progress on your Nexus profile.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="relative mt-12 overflow-hidden rounded-3xl border border-purple-500/10 bg-linear-to-r from-purple-500/5 to-blue-500/5 p-8 text-center md:p-10">
                <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/10 blur-3xl" />

                <div className="relative">
                  <div className="text-4xl">
                    🚀
                  </div>

                  <h2 className="mt-4 text-2xl font-bold md:text-3xl">
                    Ready to earn your first badge?
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-gray-400">
                    Join events, contribute to the community, and
                    stay active to unlock achievements.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-7 py-3 font-bold transition hover:scale-105"
                    >
                      Explore Events
                      <span>→</span>
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3 font-semibold text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
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