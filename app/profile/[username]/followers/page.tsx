import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getRoleStyle(role: string) {
  switch (role) {
    case "OWNER":
      return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";

    case "CO-OWNER":
      return "bg-orange-500/20 border-orange-500/30 text-orange-400";

    case "MANAGER":
      return "bg-blue-500/20 border-blue-500/30 text-blue-400";

    case "ADMIN":
      return "bg-red-500/20 border-red-500/30 text-red-400";

    case "MODERATOR":
      return "bg-green-500/20 border-green-500/30 text-green-400";

    case "SUPPORT":
      return "bg-cyan-500/20 border-cyan-500/30 text-cyan-400";

    default:
      return "bg-purple-500/20 border-purple-500/30 text-purple-400";
  }
}

function getRoleBadge(role: string) {
  switch (role) {
    case "OWNER":
      return "👑 Founder";

    case "CO-OWNER":
      return "👑 Co-Owner";

    case "MANAGER":
      return "⚙️ Manager";

    case "ADMIN":
      return "🛡️ Administrator";

    case "MODERATOR":
      return "🛡️ Moderator";

    case "SUPPORT":
      return "💬 Support";

    default:
      return "✅ Nexus Member";
  }
}

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const decodedUsername = decodeURIComponent(username);

  const user = await prisma.user.findFirst({
    where: {
      username: decodedUsername,
    },

    include: {
      followers: {
        include: {
          follower: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },

      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen text-white">
      <Navbar />

      <section
        className="
          pt-32
          pb-24
          px-6
        "
      >
        <div
          className="
            max-w-5xl
            mx-auto
          "
        >
          {/* Header */}

          <div className="text-center mb-12">
            <p
              className="
                text-purple-400
                font-semibold
                mb-3
              "
            >
              Nexus Community
            </p>

            <h1
              className="
                text-5xl
                md:text-6xl
                font-extrabold
              "
            >
              {user.username}'s{" "}

              <span
                className="
                  bg-linear-to-r
                  from-purple-400
                  to-blue-400
                  bg-clip-text
                  text-transparent
                "
              >
                Followers
              </span>
            </h1>

            <p
              className="
                text-gray-400
                mt-5
                text-lg
              "
            >
              {user._count.followers}{" "}
              {user._count.followers === 1
                ? "person follows"
                : "people follow"}{" "}
              {user.username}.
            </p>
          </div>

          {/* Followers Card */}

          <div
            className="
              glass
              rounded-3xl
              p-8
            "
          >
            {user.followers.length > 0 ? (
              <div
                className="
                  grid
                  md:grid-cols-2
                  gap-5
                "
              >
                {user.followers.map((follow) => {
                  const follower = follow.follower;

                  return (
                    <Link
                      key={follow.id}
                      href={`/profile/${encodeURIComponent(
                        follower.username
                      )}`}
                      className="
                        glass
                        rounded-2xl
                        p-5
                        border
                        border-white/10
                        transition-all
                        duration-200
                        hover:border-purple-500/40
                        hover:bg-white/[0.06]
                        hover:-translate-y-1
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-4
                        "
                      >
                        {/* Avatar */}

                        {follower.image ? (
                          <Image
                            src={follower.image}
                            alt={follower.username}
                            width={64}
                            height={64}
                            className="
                              w-16
                              h-16
                              rounded-full
                              object-cover
                              border-2
                              border-purple-500/40
                            "
                          />
                        ) : (
                          <div
                            className="
                              w-16
                              h-16
                              rounded-full
                              bg-purple-600
                              flex
                              items-center
                              justify-center
                              text-2xl
                              font-bold
                              border-2
                              border-purple-500/40
                            "
                          >
                            {follower.username
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        {/* User Information */}

                        <div className="flex-1 min-w-0">
                          <h2
                            className="
                              text-xl
                              font-bold
                              truncate
                            "
                          >
                            {follower.username}
                          </h2>

                          <span
                            className={`
                              inline-flex
                              mt-2
                              px-3
                              py-1
                              rounded-full
                              border
                              text-xs
                              font-bold
                              ${getRoleStyle(follower.role)}
                            `}
                          >
                            {getRoleBadge(follower.role)}
                          </span>
                        </div>

                        {/* Arrow */}

                        <div
                          className="
                            text-gray-500
                            text-xl
                            transition
                            group-hover:text-purple-400
                          "
                        >
                          →
                        </div>
                      </div>

                      {/* Bio */}

                      {follower.bio && (
                        <p
                          className="
                            text-gray-500
                            text-sm
                            mt-4
                            line-clamp-2
                          "
                        >
                          {follower.bio}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div
                className="
                  text-center
                  py-20
                "
              >
                <div className="text-6xl mb-5">
                  👥
                </div>

                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  No Followers Yet
                </h2>

                <p
                  className="
                    text-gray-500
                    mt-3
                  "
                >
                  {user.username} doesn't have any followers yet.
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}

          <div className="text-center mt-10">
            <Link
              href={`/profile/${encodeURIComponent(
                user.username
              )}`}
              className="
                inline-flex
                items-center
                gap-2
                px-8
                py-3
                rounded-xl
                bg-white/10
                hover:bg-white/20
                font-bold
                transition
              "
            >
              ← Back to Profile
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}