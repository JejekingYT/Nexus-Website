import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
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

const categoryStyles: Record<string, string> = {
  "Special/Role":
    "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",

  Events:
    "bg-pink-500/10 border-pink-500/20 text-pink-400",

  Contribution:
    "bg-blue-500/10 border-blue-500/20 text-blue-400",

  Membership:
    "bg-green-500/10 border-green-500/20 text-green-400",

  Community:
    "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",

  Secret:
    "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BadgePage({ params }: Props) {
  const { slug } = await params;

  const badge = await prisma.badge.findUnique({
    where: {
      slug,
    },

    include: {
      users: {
        include: {
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

  const categoryStyle =
    categoryStyles[badge.category] ||
    "bg-purple-500/10 border-purple-500/20 text-purple-400";

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <Link
            href="/badges"
            className="
              inline-flex
              items-center
              gap-2
              text-gray-400
              hover:text-white
              transition
            "
          >
            ← Back to Badge Showcase
          </Link>

          {/* Hero */}
          <div className="mt-10 text-center">

            {/* Badge Icon */}
            <div
              className="
                mx-auto
                w-32
                h-32
                rounded-[2rem]
                bg-purple-500/10
                border
                border-purple-500/20
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

            {/* Badge Name */}
            <h1 className="text-5xl md:text-6xl font-extrabold mt-8">
              {badge.name}
            </h1>

            {/* Category */}
            <div className="flex justify-center mt-5">
              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  border
                  text-sm
                  font-semibold
                  ${categoryStyle}
                `}
              >
                {categoryIcon}
                {badge.category}
              </span>
            </div>

            {/* Description */}
            <p className="
              text-gray-400
              text-lg
              leading-relaxed
              max-w-2xl
              mx-auto
              mt-7
            ">
              {badge.description}
            </p>

          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-5 mt-14">

            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-3xl font-extrabold">
                {badge.users.length}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Total Recipients
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-3xl font-extrabold">
                {badge.category}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Category
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-3xl font-extrabold">
                {new Date(badge.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Created
              </p>
            </div>

          </div>

          {/* Recipients */}
          <div className="mt-16">

            <div className="flex items-end justify-between gap-4">

              <div>
                <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                  Achievement Holders
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  Who earned this badge?
                </h2>
              </div>

              <div className="text-gray-500 text-sm">
                {badge.users.length}{" "}
                {badge.users.length === 1
                  ? "recipient"
                  : "recipients"}
              </div>

            </div>

            {badge.users.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5 mt-8">

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
                      hover:bg-white/[0.07]
                      transition-all
                      duration-300
                    "
                  >

                    <div className="flex items-center gap-4">

                      {/* Avatar */}
                      {award.user.image ? (
                        <Image
                          src={award.user.image}
                          alt={award.user.username}
                          width={64}
                          height={64}
                          className="
                            w-16
                            h-16
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
                            w-16
                            h-16
                            shrink-0
                            rounded-full
                            bg-purple-600
                            border-2
                            border-white/10
                            flex
                            items-center
                            justify-center
                            text-xl
                            font-bold
                          "
                        >
                          {award.user.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      {/* User Info */}
                      <div className="min-w-0 flex-1">

                        <h3 className="
                          font-bold
                          text-lg
                          truncate
                          group-hover:text-purple-400
                          transition
                        ">
                          {award.user.username}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          {award.user.role}
                        </p>

                        <p className="text-gray-600 text-xs mt-2">
                          Awarded{" "}
                          {new Date(
                            award.awardedAt
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>

                      </div>

                      {/* Arrow */}
                      <div className="
                        text-gray-600
                        group-hover:text-purple-400
                        group-hover:translate-x-1
                        transition
                      ">
                        →
                      </div>

                    </div>

                    {/* Awarded By */}
                    {award.awardedBy && (
                      <div className="
                        mt-4
                        pt-4
                        border-t
                        border-white/10
                        text-xs
                        text-gray-600
                      ">
                        Awarded by{" "}
                        <span className="text-gray-400">
                          {award.awardedBy.username}
                        </span>
                      </div>
                    )}

                  </Link>
                ))}

              </div>
            ) : (
              <div className="
                glass
                rounded-2xl
                p-12
                text-center
                mt-8
                border
                border-white/10
              ">

                <div className="text-5xl">
                  🏆
                </div>

                <h3 className="text-xl font-bold mt-5">
                  Nobody has earned this badge yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Be the first person to earn this achievement.
                </p>

              </div>
            )}

          </div>

          {/* How to Earn */}
          <div className="
            mt-16
            glass
            rounded-3xl
            p-8
            md:p-10
            border
            border-purple-500/10
          ">

            <div className="flex items-start gap-5">

              <div className="
                w-14
                h-14
                shrink-0
                rounded-2xl
                bg-purple-500/10
                border
                border-purple-500/20
                flex
                items-center
                justify-center
                text-2xl
              ">
                🎯
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  How to earn this badge
                </h2>

                <p className="text-gray-400 leading-relaxed mt-3">
                  This badge is awarded by the Nexus team to
                  members who meet the requirements for this
                  achievement.
                </p>

                <p className="text-gray-500 text-sm mt-3">
                  The exact requirements may vary depending on
                  the badge.
                </p>

              </div>

            </div>

          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">

            <Link
              href="/badges"
              className="
                inline-flex
                items-center
                gap-2
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
              🏆 View All Badges
            </Link>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}