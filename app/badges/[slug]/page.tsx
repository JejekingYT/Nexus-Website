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
        select: {
          id: true,
          awardedAt: true,
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              bio: true,
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
          <div className="glass rounded-3xl border border-white/10 overflow-hidden">

            <div className="
              relative
              p-8
              md:p-12
              bg-linear-to-br
              from-purple-500/10
              via-transparent
              to-blue-500/10
            ">

              <div className="
                flex
                flex-col
                md:flex-row
                items-center
                md:items-start
                gap-8
              ">

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
                <div className="text-center md:text-left flex-1">

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
                    {categoryIcon}
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
                    text-lg
                    leading-relaxed
                    mt-4
                    max-w-2xl
                  ">
                    {badge.description}
                  </p>

                </div>

              </div>

            </div>

            {/* Stats */}
            <div className="
              grid
              grid-cols-2
              border-t
              border-white/10
            ">

              <div className="
                p-6
                text-center
                border-r
                border-white/10
              ">
                <p className="text-3xl font-extrabold">
                  {badge.users.length}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {badge.users.length === 1
                    ? "Recipient"
                    : "Recipients"}
                </p>
              </div>

              <div className="p-6 text-center">
                <p className="text-3xl font-extrabold">
                  {new Date(
                    badge.createdAt
                  ).getFullYear()}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Created
                </p>
              </div>

            </div>

          </div>

          {/* Recipients */}
          <div className="mt-12">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Badge Holders
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Everyone who has earned this badge.
                </p>
              </div>

              <div className="
                px-4
                py-2
                rounded-xl
                bg-purple-500/10
                border
                border-purple-500/20
                text-purple-400
                text-sm
                font-semibold
              ">
                {badge.users.length}{" "}
                {badge.users.length === 1
                  ? "Holder"
                  : "Holders"}
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

                      {award.user.image ? (

                        <img
                          src={award.user.image}
                          alt={award.user.username}
                          className="
                            w-14
                            h-14
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
                            w-14
                            h-14
                            shrink-0
                            rounded-full
                            bg-purple-600
                            flex
                            items-center
                            justify-center
                            text-lg
                            font-bold
                            border-2
                            border-purple-500/20
                          "
                        >
                          {award.user.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                      )}

                      <div className="min-w-0">

                        <h3 className="
                          font-bold
                          truncate
                          group-hover:text-purple-400
                          transition
                        ">
                          {award.user.username}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          Awarded{" "}
                          {new Date(
                            award.awardedAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            ) : (

              <div className="
                glass
                rounded-2xl
                p-12
                text-center
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
                  Be the first person to earn it!
                </p>

              </div>

            )}

          </div>

          {/* Bottom */}
          <div className="
            mt-12
            glass
            rounded-3xl
            p-8
            text-center
            border
            border-purple-500/10
          ">

            <div className="text-4xl">
              🏆
            </div>

            <h2 className="text-2xl font-bold mt-4">
              Want to earn this badge?
            </h2>

            <p className="
              text-gray-400
              max-w-xl
              mx-auto
              mt-3
            ">
              Participate in Nexus events, contribute to
              projects, help the community, and stay active.
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