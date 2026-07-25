import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type MembersPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function MembersPage({
  searchParams,
}: MembersPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";

  const users = await prisma.user.findMany({
    where: query
      ? {
          username: {
            contains: query,
            mode: "insensitive",
          },
        }
      : undefined,

    select: {
      id: true,
      username: true,
      image: true,
      bio: true,
      role: true,
      createdAt: true,

      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          awardedAt: "desc",
        },
        take: 3,
      },
    },

    orderBy: {
      username: "asc",
    },

    take: 30,
  });

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-extrabold">
              Find{" "}
              <span className="text-purple-500">
                Members
              </span>
            </h1>

            <p className="text-gray-400 mt-4">
              Search for Nexus members and view their public profiles.
            </p>
          </div>

          {/* Search */}
          <form
            method="GET"
            className="max-w-2xl mx-auto mt-10"
          >
            <div className="flex gap-3">

              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by username..."
                className="
                  flex-1
                  bg-white/5
                  border
                  border-white/10
                  rounded-xl
                  px-5
                  py-4
                  text-white
                  outline-none
                  focus:border-purple-500
                  transition
                "
              />

              <button
                type="submit"
                className="
                  bg-purple-600
                  hover:bg-purple-700
                  px-7
                  py-4
                  rounded-xl
                  font-bold
                  transition
                "
              >
                Search
              </button>

            </div>
          </form>

          {/* Results */}
          <div className="mt-14">

            {query && (
              <p className="text-gray-400 mb-6">
                Search results for{" "}
                <span className="text-white font-semibold">
                  "{query}"
                </span>
              </p>
            )}

            {users.length === 0 ? (

              <div
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-10
                  text-center
                "
              >
                <div className="text-5xl">
                  🔍
                </div>

                <h2 className="text-2xl font-bold mt-4">
                  No members found
                </h2>

                <p className="text-gray-500 mt-2">
                  Try searching for a different username.
                </p>
              </div>

            ) : (

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {users.map((user) => (

                  <div
                    key={user.id}
                    className="
                      bg-white/5
                      border
                      border-white/10
                      rounded-2xl
                      p-6
                      hover:border-purple-500/60
                      hover:bg-white/[0.07]
                      transition
                    "
                  >

                    {/* User */}
                    <div className="flex items-center gap-4">

                      {user.image ? (

                        <img
                          src={user.image}
                          alt={user.username}
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
                          "
                        >
                          {user.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                      )}

                      <div className="min-w-0">

                        <h2 className="text-xl font-bold truncate">
                          {user.username}
                        </h2>

                        <p className="text-purple-400 text-sm mt-1">
                          {user.role}
                        </p>

                      </div>

                    </div>

                    {/* Bio */}
                    <p className="text-gray-400 text-sm mt-5 line-clamp-2 min-h-[40px]">
                      {user.bio || "No bio set yet."}
                    </p>

                    {/* Badges */}
                    {user.badges.length > 0 && (

                      <div className="flex flex-wrap gap-2 mt-5">

                        {user.badges.map((userBadge) => (

                          <div
                            key={userBadge.id}
                            title={userBadge.badge.description}
                            className="
                              flex
                              items-center
                              gap-1.5
                              bg-purple-500/10
                              border
                              border-purple-500/20
                              rounded-lg
                              px-2.5
                              py-1.5
                              text-xs
                            "
                          >
                            <span>
                              {userBadge.badge.icon}
                            </span>

                            <span className="text-gray-300">
                              {userBadge.badge.name}
                            </span>
                          </div>

                        ))}

                      </div>

                    )}

                    {/* View Profile */}
                    <Link
                      href={`/profile/${encodeURIComponent(user.username)}`}
                      className="
                        block
                        text-center
                        mt-6
                        bg-purple-600
                        hover:bg-purple-700
                        px-5
                        py-3
                        rounded-xl
                        font-bold
                        transition
                      "
                    >
                      View Profile →
                    </Link>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}