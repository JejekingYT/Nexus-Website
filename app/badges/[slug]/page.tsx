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
              mb-8
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

            {/* Header */}
            <div
              className="
                relative
                px-6
                py-12
                md:px-12
                md:py-16
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
                  bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_60%)]
                  pointer-events-none
                "
              />

              <div
                className="
                  relative
                  flex
                  flex-col
                  md:flex-row
                  items-center
                  gap-8
                "
              >

                {/* Badge Icon */}
                <div
                  className="
                    w-32
                    h-32
                    md:w-40
                    md:h-40
                    shrink-0
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

                {/* Badge Info */}
                <div className="text-center md:text-left">

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      bg-purple-500/10
                      border
                      border-purple-500/20
                      text-purple-400
                      text-xs
                      font-semibold
                    "
                  >
                    {categoryIcon}
                    {badge.category}
                  </div>

                  <h1
                    className="
                      text-4xl
                      md:text-5xl
                      font-extrabold
                      mt-4
                    "
                  >
                    {badge.name}
                  </h1>

                  <p
                    className="
                      text-gray-400
                      text-base
                      md:text-lg
                      mt-4
                      max-w-2xl
                      leading-relaxed
                    "
                  >
                    {badge.description}
                  </p>

                </div>

              </div>

            </div>

            {/* Stats */}
            <div
              className="
                grid
                grid-cols-2
                border-t
                border-white/10
              "
            >

              <div
                className="
                  p-6
                  text-center
                  border-r
                  border-white/10
                "
              >
                <p className="text-3xl font-extrabold">
                  {badge.users.length}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {badge.users.length === 1
                    ? "Person Awarded"
                    : "People Awarded"}
                </p>
              </div>

              <div className="p-6 text-center">
                <p className="text-3xl font-extrabold">
                  {badge.users.length > 0
                    ? new Date(
                        badge.users[0].awardedAt
                      ).toLocaleDateString()
                    : "—"}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Latest Award
                </p>
              </div>

            </div>

          </div>

          {/* Recipients */}
          <div className="mt-10">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Badge Holders
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Everyone who has earned this badge.
                </p>
              </div>

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-sm
                  text-gray-400
                "
              >
                {badge.users.length}{" "}
                {badge.users.length === 1
                  ? "holder"
                  : "holders"}
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
                      hover:bg-white/[0.06]
                      hover:-translate-y-1
                      transition-all
                      duration-300
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

                      <div className="min-w-0 flex-1">

                        <p className="font-bold truncate">
                          {award.user.username}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Awarded{" "}
                          {new Date(
                            award.awardedAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <span
                        className="
                          text-gray-600
                          group-hover:text-purple-400
                          group-hover:translate-x-1
                          transition
                        "
                      >
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
                  Be the first person to earn it.
                </p>

              </div>

            )}

          </div>

          {/* Badge Information */}
          <div
            className="
              mt-10
              glass
              rounded-2xl
              border
              border-white/10
              p-6
              md:p-8
            "
          >

            <h2 className="text-xl font-bold">
              About this badge
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">

              <div
                className="
                  rounded-xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-4
                "
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Category
                </p>

                <p className="font-semibold mt-1">
                  {categoryIcon} {badge.category}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-4
                "
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Total Awards
                </p>

                <p className="font-semibold mt-1">
                  {badge.users.length}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-4
                "
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Badge Slug
                </p>

                <p className="font-mono text-sm text-purple-400 mt-1">
                  {badge.slug}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-4
                "
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Created
                </p>

                <p className="font-semibold mt-1">
                  {new Date(
                    badge.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

          </div>

          {/* CTA */}
          <div
            className="
              mt-10
              rounded-3xl
              border
              border-purple-500/20
              bg-linear-to-r
              from-purple-500/10
              to-blue-500/10
              p-8
              md:p-10
              text-center
            "
          >

            <div className="text-4xl">
              🏆
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mt-4">
              Want to earn this badge?
            </h2>

            <p className="text-gray-400 max-w-xl mx-auto mt-3">
              Participate in Nexus events, contribute to projects,
              help the community, and stay active.
            </p>

            <Link
              href="/events"
              className="
                inline-flex
                mt-6
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

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}