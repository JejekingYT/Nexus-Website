import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

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

type BadgePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BadgePage({
  params,
}: BadgePageProps) {
  // Next.js 16: params must be awaited
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const badge = await prisma.badge.findUnique({
    where: {
      slug,
    },
    include: {
      users: {
        select: {
          id: true,
          userId: true,
          awardedAt: true,
          user: {
            select: {
              username: true,
              image: true,
            },
          },
        },
        orderBy: {
          awardedAt: "desc",
        },
      },
    },
  });

  if (!badge) {
    notFound();
  }

  const categoryIcon =
    categoryIcons[badge.category] || "🏅";

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <Link
            href="/badges"
            className="
              inline-flex
              items-center
              gap-2
              text-gray-400
              hover:text-purple-400
              transition
              mb-10
            "
          >
            ← Back to Badges
          </Link>

          {/* Hero */}
          <div
            className="
              glass
              rounded-3xl
              border
              border-white/10
              overflow-hidden
            "
          >
            {/* Header Glow */}
            <div
              className="
                relative
                px-6
                md:px-12
                py-12
                md:py-16
                text-center
                bg-linear-to-br
                from-purple-500/10
                via-transparent
                to-blue-500/10
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_55%)]
                  pointer-events-none
                "
              />

              {/* Badge Icon */}
              <div
                className="
                  relative
                  mx-auto
                  w-28
                  h-28
                  md:w-32
                  md:h-32
                  rounded-3xl
                  bg-purple-500/10
                  border
                  border-purple-500/30
                  flex
                  items-center
                  justify-center
                  text-6xl
                  md:text-7xl
                  shadow-2xl
                  shadow-purple-500/10
                "
              >
                {badge.icon}
              </div>

              {/* Category */}
              <div className="relative mt-7">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-full
                    bg-purple-500/10
                    border
                    border-purple-500/20
                    text-purple-400
                    text-sm
                    font-semibold
                  "
                >
                  {categoryIcon}
                  {badge.category}
                </span>
              </div>

              {/* Name */}
              <h1 className="relative text-4xl md:text-6xl font-extrabold mt-6">
                {badge.name}
              </h1>

              {/* Description */}
              <p className="relative max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed mt-5">
                {badge.description}
              </p>
            </div>

            {/* Stats */}
            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                border-t
                border-white/10
              "
            >
              <div className="p-6 text-center border-r border-white/10">
                <p className="text-3xl font-extrabold">
                  {badge.users.length}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {badge.users.length === 1
                    ? "Recipient"
                    : "Recipients"}
                </p>
              </div>

              <div className="p-6 text-center md:border-r border-white/10">
                <p className="text-3xl font-extrabold">
                  {badge.category}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Category
                </p>
              </div>

              <div className="p-6 text-center col-span-2 md:col-span-1 border-t md:border-t-0 border-white/10">
                <p className="text-3xl font-extrabold">
                  🏆
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Nexus Badge
                </p>
              </div>
            </div>
          </div>

          {/* Recipients */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Badge Recipients
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Members who have earned this badge.
                </p>
              </div>

              <div className="text-sm text-gray-500">
                {badge.users.length}{" "}
                {badge.users.length === 1
                  ? "member"
                  : "members"}
              </div>
            </div>

            {badge.users.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badge.users.map((award) => (
                  <Link
                    key={award.id}
                    href={`/profile/${award.user.username}`}
                    className="
                      group
                      glass
                      rounded-2xl
                      p-5
                      border
                      border-white/10
                      hover:border-purple-500/40
                      hover:bg-white/[0.05]
                      hover:-translate-y-1
                      transition-all
                    "
                  >
                    <div className="flex items-center gap-4">

                      {/* Avatar */}
                      {award.user.image ? (
                        <img
                          src={award.user.image}
                          alt={award.user.username}
                          className="
                            w-12
                            h-12
                            rounded-full
                            object-cover
                            border-2
                            border-purple-500/20
                            group-hover:border-purple-500/60
                            transition
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-12
                            h-12
                            rounded-full
                            bg-purple-600
                            border-2
                            border-purple-500/20
                            flex
                            items-center
                            justify-center
                            font-bold
                            group-hover:border-purple-500/60
                            transition
                          "
                        >
                          {award.user.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      {/* User */}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate group-hover:text-purple-400 transition">
                          {award.user.username}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Awarded{" "}
                          {new Date(
                            award.awardedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                className="
                  glass
                  rounded-2xl
                  border
                  border-white/10
                  p-12
                  text-center
                "
              >
                <div className="text-5xl">
                  🏆
                </div>

                <h3 className="text-xl font-bold mt-4">
                  Nobody has earned this badge yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Be the first Nexus member to earn it.
                </p>
              </div>
            )}
          </div>

          {/* Badge Information */}
          <div className="mt-10 grid md:grid-cols-2 gap-5">

            <div className="glass rounded-2xl border border-white/10 p-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Badge
              </p>

              <h3 className="text-xl font-bold mt-2">
                {badge.name}
              </h3>

              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {badge.description}
              </p>
            </div>

            <div className="glass rounded-2xl border border-white/10 p-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Category
              </p>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-3xl">
                  {categoryIcon}
                </span>

                <div>
                  <p className="font-bold">
                    {badge.category}
                  </p>

                  <p className="text-gray-500 text-sm">
                    Nexus achievement category
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div
            className="
              mt-10
              glass
              rounded-3xl
              border
              border-purple-500/10
              p-8
              md:p-12
              text-center
            "
          >
            <div className="text-4xl">
              🎯
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mt-4">
              Want to earn this badge?
            </h2>

            <p className="text-gray-400 max-w-xl mx-auto mt-3">
              Stay active in the Nexus community,
              participate in events, contribute to
              projects, and look for opportunities to
              unlock achievements.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">

              <Link
                href="/events"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-7
                  py-3
                  rounded-xl
                  bg-linear-to-r
                  from-purple-600
                  to-blue-600
                  font-bold
                  hover:scale-105
                  transition
                "
              >
                Explore Events
              </Link>

              <Link
                href="/badges"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-7
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-gray-300
                  font-semibold
                  hover:bg-white/10
                  transition
                "
              >
                View All Badges
              </Link>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}