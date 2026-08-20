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

  const badge = await prisma.badge.findUnique({
    where: {
      slug,
    },
    include: {
      users: {
        select: {
          id: true,
          awardedAt: true,
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              role: true,
            },
          },
          awardedBy: {
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

  const categoryIcon = categoryIcons[badge.category] || "🏅";

  const recentBadges = await prisma.badge.findMany({
    where: {
      category: badge.category,
      NOT: {
        id: badge.id,
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      description: true,
      users: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 3,
  });

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <Link
            href="/badges"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-gray-500
              hover:text-white
              transition
              mb-8
            "
          >
            <span>←</span>
            Back to Badges
          </Link>

          {/* Hero */}
          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-purple-500/20
              bg-linear-to-br
              from-purple-500/10
              via-[#111116]
              to-blue-500/10
              p-8
              md:p-12
            "
          >
            {/* Glow */}
            <div className="
              absolute
              -top-32
              -right-32
              w-72
              h-72
              rounded-full
              bg-purple-600/10
              blur-3xl
              pointer-events-none
            " />

            <div className="
              absolute
              -bottom-32
              -left-32
              w-72
              h-72
              rounded-full
              bg-blue-600/10
              blur-3xl
              pointer-events-none
            " />

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">

              {/* Badge Icon */}
              <div
                className="
                  w-32
                  h-32
                  shrink-0
                  rounded-3xl
                  bg-purple-500/10
                  border
                  border-purple-500/30
                  flex
                  items-center
                  justify-center
                  text-6xl
                  shadow-2xl
                  shadow-purple-500/10
                "
              >
                {badge.icon}
              </div>

              {/* Badge Info */}
              <div className="flex-1 text-center md:text-left">

                <div className="
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
                ">
                  <span>{categoryIcon}</span>
                  {badge.category}
                </div>

                <h1 className="
                  text-4xl
                  md:text-5xl
                  font-extrabold
                  mt-4
                ">
                  {badge.name}
                </h1>

                <p className="
                  text-gray-400
                  text-base
                  md:text-lg
                  leading-relaxed
                  mt-4
                  max-w-2xl
                ">
                  {badge.description}
                </p>

                <div className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  md:justify-start
                  gap-3
                  mt-6
                ">

                  <div className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    bg-white/[0.04]
                    border
                    border-white/10
                  ">
                    <span className="text-lg">
                      🏆
                    </span>

                    <div>
                      <p className="text-sm font-bold">
                        {badge.users.length}
                      </p>

                      <p className="text-xs text-gray-500">
                        {badge.users.length === 1
                          ? "Recipient"
                          : "Recipients"}
                      </p>
                    </div>
                  </div>

                  <div className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    bg-white/[0.04]
                    border
                    border-white/10
                  ">
                    <span className="text-lg">
                      {categoryIcon}
                    </span>

                    <div>
                      <p className="text-sm font-bold">
                        {badge.category}
                      </p>

                      <p className="text-xs text-gray-500">
                        Category
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-8">

            {/* Recipients */}
            <div className="
              glass
              rounded-3xl
              border
              border-white/10
              p-6
              md:p-8
            ">

              <div className="flex items-center justify-between gap-4 mb-6">

                <div>
                  <h2 className="text-2xl font-bold">
                    Badge Recipients
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Everyone who has earned this badge.
                  </p>
                </div>

                <div className="
                  px-3
                  py-1.5
                  rounded-lg
                  bg-purple-500/10
                  border
                  border-purple-500/20
                  text-purple-400
                  text-sm
                  font-bold
                ">
                  {badge.users.length}
                </div>

              </div>

              {badge.users.length > 0 ? (
                <div className="space-y-3">

                  {badge.users.map((award) => (
                    <div
                      key={award.id}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.02]
                        p-4
                        hover:bg-white/[0.05]
                        hover:border-purple-500/20
                        transition
                      "
                    >

                      {/* User */}
                      <Link
                        href={`/profile/${award.user.username}`}
                        className="
                          flex
                          items-center
                          gap-4
                          min-w-0
                        "
                      >

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
                              group-hover:border-purple-500/40
                              transition
                            "
                          />
                        ) : (
                          <div className="
                            w-12
                            h-12
                            shrink-0
                            rounded-full
                            bg-purple-600
                            border-2
                            border-white/10
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-lg
                          ">
                            {award.user.username
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">

                          <div className="
                            flex
                            items-center
                            gap-2
                          ">
                            <p className="
                              font-bold
                              truncate
                            ">
                              {award.user.username}
                            </p>

                            {award.user.role !== "USER" && (
                              <span className="
                                px-2
                                py-0.5
                                rounded-full
                                bg-purple-500/10
                                text-purple-400
                                text-[10px]
                                font-bold
                                uppercase
                              ">
                                {award.user.role}
                              </span>
                            )}

                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            View profile →
                          </p>

                        </div>

                      </Link>

                      {/* Award Info */}
                      <div className="text-right shrink-0">

                        <p className="text-sm font-semibold text-gray-300">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(award.awardedAt)}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          Awarded
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="
                  rounded-2xl
                  border
                  border-dashed
                  border-white/10
                  p-10
                  text-center
                ">
                  <div className="text-5xl">
                    🔒
                  </div>

                  <h3 className="text-lg font-bold mt-4">
                    Not awarded yet
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    Nobody has earned this badge yet.
                  </p>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Badge Details */}
              <div className="
                glass
                rounded-3xl
                border
                border-white/10
                p-6
              ">

                <h3 className="text-lg font-bold">
                  Badge Details
                </h3>

                <div className="space-y-4 mt-5">

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  ">
                    <span className="text-sm text-gray-500">
                      Category
                    </span>

                    <span className="
                      text-sm
                      text-purple-400
                      font-semibold
                      flex
                      items-center
                      gap-1.5
                    ">
                      {categoryIcon}
                      {badge.category}
                    </span>
                  </div>

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  ">
                    <span className="text-sm text-gray-500">
                      Recipients
                    </span>

                    <span className="text-sm font-bold">
                      {badge.users.length}
                    </span>
                  </div>

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  ">
                    <span className="text-sm text-gray-500">
                      Badge ID
                    </span>

                    <span className="
                      text-sm
                      font-mono
                      text-gray-400
                    ">
                      #{badge.id}
                    </span>
                  </div>

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  ">
                    <span className="text-sm text-gray-500">
                      Created
                    </span>

                    <span className="text-sm text-gray-400">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(badge.createdAt)}
                    </span>
                  </div>

                </div>

              </div>

              {/* Awarded By */}
              {badge.users.length > 0 && (
                <div className="
                  glass
                  rounded-3xl
                  border
                  border-white/10
                  p-6
                ">

                  <h3 className="text-lg font-bold">
                    Awarded By
                  </h3>

                  <div className="space-y-3 mt-5">

                    {Array.from(
                      new Map(
                        badge.users
                          .filter((award) => award.awardedBy)
                          .map((award) => [
                            award.awardedBy?.username,
                            award.awardedBy,
                          ])
                      ).values()
                    )
                      .slice(0, 5)
                      .map((admin) => (
                        <div
                          key={admin?.username}
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          {admin?.image ? (
                            <img
                              src={admin.image}
                              alt={admin.username}
                              className="
                                w-9
                                h-9
                                rounded-full
                                object-cover
                              "
                            />
                          ) : (
                            <div className="
                              w-9
                              h-9
                              rounded-full
                              bg-purple-600
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-bold
                            ">
                              {admin?.username
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-semibold">
                              {admin?.username}
                            </p>

                            <p className="text-xs text-gray-600">
                              Nexus Staff
                            </p>
                          </div>

                        </div>
                      ))}

                    {badge.users.every(
                      (award) => !award.awardedBy
                    ) && (
                      <p className="text-sm text-gray-600">
                        Award information unavailable.
                      </p>
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* Related Badges */}
          {recentBadges.length > 0 && (
            <section className="mt-12">

              <div className="flex items-end justify-between gap-4 mb-6">

                <div>
                  <p className="text-sm text-purple-400 font-semibold">
                    More achievements
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold mt-1">
                    More {badge.category} Badges
                  </h2>
                </div>

                <Link
                  href="/badges"
                  className="
                    hidden
                    sm:inline-flex
                    text-sm
                    text-gray-500
                    hover:text-purple-400
                    transition
                  "
                >
                  View all →
                </Link>

              </div>

              <div className="
                grid
                md:grid-cols-3
                gap-5
              ">

                {recentBadges.map((relatedBadge) => (
                  <Link
                    key={relatedBadge.id}
                    href={`/badges/${relatedBadge.slug}`}
                    className="
                      group
                      glass
                      rounded-2xl
                      border
                      border-white/10
                      p-5
                      hover:border-purple-500/30
                      hover:-translate-y-1
                      transition-all
                    "
                  >

                    <div className="
                      flex
                      items-center
                      gap-4
                    ">

                      <div className="
                        w-14
                        h-14
                        shrink-0
                        rounded-xl
                        bg-purple-500/10
                        border
                        border-purple-500/20
                        flex
                        items-center
                        justify-center
                        text-2xl
                        group-hover:scale-110
                        transition
                      ">
                        {relatedBadge.icon}
                      </div>

                      <div className="min-w-0">

                        <h3 className="
                          font-bold
                          truncate
                        ">
                          {relatedBadge.name}
                        </h3>

                        <p className="
                          text-xs
                          text-gray-500
                          mt-1
                        ">
                          {relatedBadge.users.length}{" "}
                          {relatedBadge.users.length === 1
                            ? "award"
                            : "awards"}
                        </p>

                      </div>

                    </div>

                    <p className="
                      text-sm
                      text-gray-500
                      mt-4
                      line-clamp-2
                    ">
                      {relatedBadge.description}
                    </p>

                    <div className="
                      mt-4
                      text-sm
                      text-purple-400
                      font-semibold
                    ">
                      View badge →
                    </div>

                  </Link>
                ))}

              </div>

            </section>
          )}

          {/* CTA */}
          <div className="
            mt-12
            rounded-3xl
            border
            border-purple-500/10
            bg-linear-to-r
            from-purple-500/5
            to-blue-500/5
            p-8
            md:p-10
            text-center
          ">

            <div className="text-4xl">
              🎯
            </div>

            <h2 className="
              text-2xl
              md:text-3xl
              font-bold
              mt-4
            ">
              Want to earn this badge?
            </h2>

            <p className="
              text-gray-400
              max-w-xl
              mx-auto
              mt-3
            ">
              Participate in Nexus events, contribute to the
              community, and stay active to unlock achievements.
            </p>

            <Link
              href="/events"
              className="
                inline-flex
                items-center
                gap-2
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
              <span>→</span>
            </Link>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}