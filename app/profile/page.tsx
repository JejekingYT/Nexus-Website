import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

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

function getRoleName(role: string) {
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
        <div className="max-w-5xl mx-auto">

          <h1 className="text-5xl md:text-6xl font-extrabold">
            Your{" "}
            <span
              className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              "
            >
              Profile
            </span>
          </h1>

          <div
            className="
              glass
              mt-12
              rounded-3xl
              overflow-hidden
            "
          >

            {/* Banner */}

            <div
              className="
                h-44
                bg-linear-to-r
                from-purple-900/60
                via-purple-600/30
                to-black
              "
            />

            <div className="px-8 pb-12 text-center">

              {/* Avatar */}

              <div className="-mt-20">

                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.username}
                    width={144}
                    height={144}
                    className="
                      w-36
                      h-36
                      mx-auto
                      rounded-full
                      object-cover
                      border-4
                      border-[#09090B]
                      ring-2
                      ring-purple-500
                    "
                  />
                ) : (
                  <div
                    className="
                      w-36
                      h-36
                      mx-auto
                      rounded-full
                      bg-purple-600
                      flex
                      items-center
                      justify-center
                      text-5xl
                      font-bold
                      border-4
                      border-[#09090B]
                      ring-2
                      ring-purple-500
                    "
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}

              </div>

              <h2 className="text-4xl font-bold mt-6">
                {user.username}
              </h2>

              <div className="flex justify-center mt-4">
                <span
                  className={`
                    px-5
                    py-2
                    rounded-full
                    border
                    text-sm
                    font-bold
                    ${getRoleStyle(user.role)}
                  `}
                >
                  {getRoleName(user.role)}
                </span>
              </div>

              <p
                className="
                  text-gray-400
                  mt-6
                  max-w-xl
                  mx-auto
                "
              >
                {user.bio || "No bio set yet."}
              </p>

              {/* Stats */}

              <div className="grid md:grid-cols-3 gap-5 mt-12">

                <div className="glass p-6 rounded-2xl">
                  <p className="text-gray-500 text-sm">
                    Role
                  </p>

                  <p className="font-bold text-xl mt-2">
                    {user.role}
                  </p>
                </div>

                <div className="glass p-6 rounded-2xl">
                  <p className="text-gray-500 text-sm">
                    Badges
                  </p>

                  <p className="font-bold text-xl mt-2">
                    {user.badges.length}
                  </p>
                </div>

                <div className="glass p-6 rounded-2xl">
                  <p className="text-gray-500 text-sm">
                    Joined
                  </p>

                  <p className="font-bold text-xl mt-2">
                    {user.createdAt.toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                      }
                    )}
                  </p>
                </div>

              </div>

              {/* Badges */}

              <div className="mt-14">

                <h3 className="text-3xl font-bold">
                  🏆 Badges
                </h3>

                {user.badges.length > 0 ? (

                  <div className="grid md:grid-cols-2 gap-5 mt-8 text-left">

                    {user.badges.map((item) => (

                      <div
                        key={item.id}
                        className="
                          glass
                          p-5
                          rounded-2xl
                          hover:border-purple-500/50
                          transition
                        "
                      >

                        <div className="flex gap-4">

                          {/* Badge Icon */}

                          <div
                            className="
                              w-16
                              h-16
                              shrink-0
                              rounded-2xl
                              bg-purple-500/20
                              border
                              border-purple-500/30
                              flex
                              items-center
                              justify-center
                              text-3xl
                            "
                          >
                            {item.badge.icon}
                          </div>

                          {/* Badge Information */}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-3">

                              <h4 className="font-bold text-lg">
                                {item.badge.name}
                              </h4>

                              {/* Category */}

                              <span
                                className="
                                  shrink-0
                                  rounded-full
                                  border
                                  border-purple-500/20
                                  bg-purple-500/10
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold
                                  text-purple-400
                                "
                              >
                                {item.badge.category}
                              </span>

                            </div>

                            <p className="text-gray-400 text-sm mt-2">
                              {item.badge.description ||
                                "No description available."}
                            </p>

                            {/* Awarded Date */}

                            <p className="text-gray-500 text-xs mt-3">
                              Awarded{" "}
                              {item.awardedAt.toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="text-gray-500 mt-8">
                    You haven't received any badges yet.
                  </p>

                )}

              </div>

              <div className="flex justify-center gap-4 flex-wrap mt-12">

                <Link
                  href="/profile/edit"
                  className="
                    px-8
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
                  Edit Profile
                </Link>

                <Link
                  href={`/profile/${user.username}`}
                  className="
                    px-8
                    py-3
                    rounded-xl
                    bg-white/10
                    hover:bg-white/20
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