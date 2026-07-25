import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      discordId: session.user.id,
    },
    include: {
      badges: {
        include: {
          badge: true,
          awardedBy: true,
        },
        orderBy: {
          awardedAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-5xl font-extrabold">
            Your{" "}
            <span className="text-purple-500">
              Profile
            </span>
          </h1>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

            {/* Profile Banner */}
            <div className="h-32 bg-linear-to-r from-purple-900/60 to-purple-500/20" />

            <div className="px-8 pb-10 text-center">

              {/* Avatar */}
              <div className="-mt-16">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="
                      w-32
                      h-32
                      rounded-full
                      mx-auto
                      border-4
                      border-[#09090B]
                      ring-2
                      ring-purple-500
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      w-32
                      h-32
                      rounded-full
                      mx-auto
                      border-4
                      border-[#09090B]
                      ring-2
                      ring-purple-500
                      bg-purple-600
                      flex
                      items-center
                      justify-center
                      text-4xl
                      font-bold
                    "
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Username */}
              <h2 className="text-3xl font-bold mt-5">
                {user.username}
              </h2>

              {/* Role */}
              <p className="text-purple-400 mt-2 font-semibold">
                {user.role}
              </p>

              {/* Bio */}
              <p className="text-gray-400 mt-5 max-w-xl mx-auto">
                {user.bio || "No bio set yet."}
              </p>

              {/* Badges */}
              <div className="mt-10">

                <h3 className="text-2xl font-bold">
                  🏆 Badges
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Badges awarded by the Nexus team.
                </p>

                {user.badges.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mt-6 text-left">

                    {user.badges.map((userBadge) => {
                      const badge = userBadge.badge;

                      return (
                        <div
                          key={userBadge.id}
                          className="
                            group
                            bg-white/5
                            border
                            border-white/10
                            rounded-2xl
                            p-5
                            transition
                            hover:border-purple-500/60
                            hover:bg-white/[0.07]
                          "
                        >

                          <div className="flex items-start gap-4">

                            {/* Badge Icon */}
                            <div
                              className="
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
                                text-3xl
                                group-hover:scale-105
                                transition
                              "
                            >
                              {badge.icon}
                            </div>

                            {/* Badge Info */}
                            <div className="min-w-0">

                              <h4 className="font-bold text-lg">
                                {badge.name}
                              </h4>

                              <p className="text-gray-400 text-sm mt-1">
                                {badge.description ||
                                  "No description available."}
                              </p>

                              <p className="text-gray-500 text-xs mt-3">
                                Awarded{" "}
                                {userBadge.awardedAt.toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>

                              {userBadge.awardedBy && (
                                <p className="text-gray-600 text-xs mt-1">
                                  By {userBadge.awardedBy.username}
                                </p>
                              )}

                            </div>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                ) : (
                  <div
                    className="
                      mt-6
                      bg-black/20
                      border
                      border-white/10
                      rounded-2xl
                      p-6
                    "
                  >
                    <p className="text-gray-500">
                      You haven't received any badges yet.
                    </p>
                  </div>
                )}

              </div>

              {/* Member Since */}
              <div className="mt-10 text-sm text-gray-500">
                Member since{" "}
                {user.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">

                <Link
                  href="/profile/edit"
                  className="
                    bg-purple-600
                    hover:bg-purple-700
                    px-8
                    py-3
                    rounded-xl
                    font-bold
                    transition
                  "
                >
                  Edit Profile
                </Link>

                <Link
                  href={`/profile/${user.username}`}
                  className="
                    bg-white/10
                    hover:bg-white/20
                    px-8
                    py-3
                    rounded-xl
                    font-bold
                    transition
                  "
                >
                  View Public Profile
                </Link>

              </div>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}