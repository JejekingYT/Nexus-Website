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
        orderBy: {
          awardedAt: "desc",
        },
        select: {
          id: true,
          userId: true,
          awardedAt: true,
          user: {
            select: {
              username: true,
              image: true,
              role: true,
            },
          },
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

          {/* Hero Card */}
          <div
            className="
              relative
              overflow-hidden
              glass
              rounded-3xl
              border
              border-white/10
              p-8
              md:p-12
            "
          >

            {/* Background Glow */}
            <div
              className="
                absolute
                -top-32
                -right-32
                w-80
                h-80
                rounded-full
                bg-purple-600/10
                blur-3xl
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                -bottom-32
                -left-32
                w-80
                h-80
                rounded-full
                bg-blue-600/10
                blur-3xl
                pointer-events-none
              "
            />

            <div className="relative">

              {/* Badge Icon + Info */}
              <div className="flex flex-col md:flex-row md:items-center gap-7">

                {/* Icon */}
                <div
                  className="
                    w-28
                    h-28
                    shrink-0
                    rounded-3xl
                    bg-purple-500/10
                    border
                    border-purple-500/20
                    flex
                    items-center
                    justify-center
                    text-6xl
                    shadow-lg
                    shadow-purple-500/10
                  "
                >
                  {badge.icon}
                </div>

                {/* Text */}
                <div>

                  {/* Category */}
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-1.5
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

                  <h1 className="text-4xl md:text-5xl font-extrabold mt-4">
                    {badge.name}
                  </h1>

                  <p className="text-gray-400 text-lg mt-4 max-w-2xl">
                    {badge.description}
                  </p>

                </div>

              </div>

              {/* Stats */}
              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-3
                  gap-4
                  mt-10
                "
              >

                <div
                  className="
                    rounded-2xl
                    bg-white/[0.03]
                    border
                    border-white/10
                    p-5
                  "
                >
                  <p className="text-2xl font-extrabold">
                    {badge.users.length}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {badge.users.length === 1
                      ? "Recipient"
                      : "Recipients"}
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    bg-white/[0.03]
                    border
                    border-white/10
                    p-5
                  "
                >
                  <p className="text-2xl font-extrabold">
                    {badge.category}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Category
                  </p>
                </div>

                <div
                  className="
                    col-span-2
                    md:col-span-1
                    rounded-2xl
                    bg-white/[0.03]
                    border
                    border-white/10
                    p-5
                  "
                >
                  <p className="text-2xl font-extrabold">
                    #{badge.id}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Badge ID
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Recipients */}
          <div className="mt-10">

            <div className="flex items-end justify-between gap-4 mb-6">

              <div>
                <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                  Badge Holders
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  Recipients
                </h2>

                <p className="text-gray-500 mt-2">
                  Members who have earned the {badge.name} badge.
                </p>
              </div>

              <div className="hidden sm:block text-gray-500 text-sm">
                {badge.users.length}{" "}
                {badge.users.length === 1
                  ? "member"
                  : "members"}
              </div>

            </div>

            {badge.users.length > 0 ? (

              <div className="grid sm:grid-cols-2 gap-4">

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
                      hover:-translate-y-0.5
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
                            border-white/10
                            group-hover:border-purple-500/50
                            transition
                          "
                        />

                      ) : (

                        <div
                          className="
                            w-12
                            h-12
                            rounded-full
                            bg-purple-600/80
                            border-2
                            border-white/10
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-lg
                            group-hover:border-purple-500/50
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

                        <div className="flex items-center gap-2">

                          <p className="font-bold truncate group-hover:text-purple-400 transition">
                            {award.user.username}
                          </p>

                          {award.user.role !== "USER" && (
                            <span
                              className="
                                text-[10px]
                                px-2
                                py-0.5
                                rounded-full
                                bg-purple-500/10
                                text-purple-400
                                border
                                border-purple-500/20
                              "
                            >
                              {award.user.role}
                            </span>
                          )}

                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          Awarded{" "}
                          {award.awardedAt.toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>

                      </div>

                      <span
                        className="
                          text-gray-600
                          group-hover:text-purple-400
                          group-hover:translate-x-1
                          transition-all
                          text-xl
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
                  rounded-3xl
                  border
                  border-white/10
                  p-12
                  text-center
                "
              >

                <div className="text-5xl">
                  🏆
                </div>

                <h3 className="text-xl font-bold mt-5">
                  Nobody has earned this badge yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Be the first Nexus member to earn it.
                </p>

              </div>

            )}

          </div>

          {/* Badge Information */}
          <div
            className="
              mt-10
              glass
              rounded-3xl
              border
              border-white/10
              p-7
              md:p-9
            "
          >

            <h2 className="text-2xl font-bold">
              About this badge
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              <div>

                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Badge Name
                </p>

                <p className="text-gray-200 font-semibold mt-2">
                  {badge.name}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Category
                </p>

                <p className="text-gray-200 font-semibold mt-2">
                  {categoryIcon} {badge.category}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Created
                </p>

                <p className="text-gray-200 font-semibold mt-2">
                  {badge.createdAt.toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Total Awards
                </p>

                <p className="text-gray-200 font-semibold mt-2">
                  {badge.users.length}
                </p>

              </div>

            </div>

          </div>

          {/* Requirements */}
<div
  className="
    mt-10
    glass
    rounded-3xl
    border
    border-white/10
    p-7
    md:p-9
  "
>
  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

    <div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
        🎯
        How to earn
      </div>

      <h2 className="text-2xl font-bold mt-4">
        Badge Requirements
      </h2>

      <p className="text-gray-500 mt-2 max-w-2xl">
        Complete the requirement below to unlock this
        achievement.
      </p>

    </div>

    {badge.isSecret && (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
        🔒 Secret Badge
      </div>
    )}

  </div>

  <div className="mt-7 rounded-2xl bg-white/[0.03] border border-white/10 p-6">

    {badge.requirement ? (

      <div className="flex items-start gap-4">

        <div className="w-12 h-12 shrink-0 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
          🎯
        </div>

        <div>

          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Requirement
          </p>

          <p className="text-gray-200 text-lg font-semibold mt-2">
            {badge.requirement}
          </p>

          {badge.target !== null && (
            <p className="text-sm text-gray-500 mt-2">
              Target:{" "}
              <span className="text-purple-400 font-semibold">
                {badge.target}
              </span>
            </p>
          )}

        </div>

      </div>

    ) : (

      <div className="flex items-start gap-4">

        <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-xl">
          🏆
        </div>

        <div>

          <p className="font-semibold text-gray-200">
            Special achievement
          </p>

          <p className="text-sm text-gray-500 mt-1">
            This badge is awarded by the Nexus team for
            special contributions, achievements, or roles.
          </p>

        </div>

      </div>

    )}

  </div>

</div>

          {/* CTA */}
          <div
            className="
              mt-10
              glass
              rounded-3xl
              p-8
              md:p-12
              text-center
              border
              border-purple-500/10
            "
          >

            <div className="text-4xl">
              🎯
            </div>

            <h2 className="text-3xl font-bold mt-4">
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
                mt-7
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