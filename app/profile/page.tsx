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

function getTheme(theme: string | null) {
  switch (theme) {
    case "purple":
      return {
        banner:
          "from-purple-950 via-purple-700/60 to-indigo-950",
        accent: "ring-purple-500",
        button:
          "from-purple-600 to-fuchsia-600",
      };

    case "blue":
      return {
        banner:
          "from-blue-950 via-blue-700/60 to-cyan-950",
        accent: "ring-blue-500",
        button:
          "from-blue-600 to-cyan-600",
      };

    case "dark":
      return {
        banner:
          "from-black via-zinc-800 to-black",
        accent: "ring-zinc-500",
        button:
          "from-zinc-700 to-zinc-900",
      };

    default:
      return {
        banner:
          "from-purple-900/60 via-purple-600/30 to-black",
        accent: "ring-purple-500",
        button:
          "from-purple-600 to-blue-600",
      };
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(session.user.id),
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

      followers: true,

      following: true,

      logs: {
        orderBy: {
          createdAt: "desc",
        },

        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const theme = getTheme(user.theme);

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
              border
              border-white/10
            "
          >

            {/* Banner */}

            {user.showBanner && (
              <div
                className={`
                  relative
                  h-52
                  bg-linear-to-r
                  ${theme.banner}
                  overflow-hidden
                `}
              >

                {user.banner && (
                  <img
                    src={user.banner}
                    alt="Profile banner"
                    className="
                      absolute
                      inset-0
                      w-full
                      h-full
                      object-cover
                    "
                  />
                )}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/20
                  "
                />

              </div>
            )}


            <div className="px-8 pb-12 text-center">

              {/* Avatar */}

              <div
                className={
                  user.showBanner
                    ? "-mt-20 relative z-10"
                    : "pt-8 relative z-10"
                }
              >

                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.username}
                    width={144}
                    height={144}
                    className={`
                      w-36
                      h-36
                      mx-auto
                      rounded-full
                      object-cover
                      border-4
                      border-[#09090B]
                      ring-2
                      ${theme.accent}
                    `}
                  />
                ) : (
                  <div
                    className={`
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
                      ${theme.accent}
                    `}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}

              </div>


              {/* Username */}

              <h2 className="text-4xl font-bold mt-6">
                {user.username}
              </h2>


              {/* Role */}

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


              {/* Bio */}

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


              {/* Followers / Following */}

              <div className="flex justify-center gap-10 mt-8">

                <Link
                  href={`/profile/${user.username}/followers`}
                  className="group"
                >
                  <p className="text-2xl font-bold group-hover:text-purple-400 transition">
                    {user.followers.length}
                  </p>

                  <p className="text-gray-500 text-sm">
                    Followers
                  </p>
                </Link>


                <Link
                  href={`/profile/${user.username}/following`}
                  className="group"
                >
                  <p className="text-2xl font-bold group-hover:text-purple-400 transition">
                    {user.following.length}
                  </p>

                  <p className="text-gray-500 text-sm">
                    Following
                  </p>
                </Link>

              </div>


              {/* Social Links */}

              {user.showSocialLinks &&
                (user.discord ||
                  user.youtube ||
                  user.github ||
                  user.twitter ||
                  user.roblox) && (

                <div className="flex justify-center flex-wrap gap-3 mt-8">

                  {user.discord && (
                    <a
                      href={
                        user.discord.startsWith("http")
                          ? user.discord
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-indigo-500/10
                        border
                        border-indigo-500/20
                        text-indigo-400
                        hover:bg-indigo-500/20
                        transition
                      "
                    >
                      💬 Discord
                    </a>
                  )}

                  {user.youtube && (
                    <a
                      href={user.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-red-500/10
                        border
                        border-red-500/20
                        text-red-400
                        hover:bg-red-500/20
                        transition
                      "
                    >
                      ▶️ YouTube
                    </a>
                  )}

                  {user.github && (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-white/5
                        border
                        border-white/10
                        text-gray-300
                        hover:bg-white/10
                        transition
                      "
                    >
                      💻 GitHub
                    </a>
                  )}

                  {user.twitter && (
                    <a
                      href={user.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-sky-500/10
                        border
                        border-sky-500/20
                        text-sky-400
                        hover:bg-sky-500/20
                        transition
                      "
                    >
                      𝕏 Twitter
                    </a>
                  )}

                  {user.roblox && (
                    <a
                      href={user.roblox}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-green-500/10
                        border
                        border-green-500/20
                        text-green-400
                        hover:bg-green-500/20
                        transition
                      "
                    >
                      🎮 Roblox
                    </a>
                  )}

                </div>

              )}


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


              {/* Recent Activity */}

              <div className="mt-14 text-left">

                <h3 className="text-3xl font-bold text-center">
                  ⚡ Recent Activity
                </h3>

                {user.logs.length > 0 ? (

                  <div className="mt-8 space-y-4">

                    {user.logs.map((log) => (

                      <div
                        key={log.id}
                        className="
                          glass
                          rounded-2xl
                          p-5
                          border
                          border-white/5
                        "
                      >

                        <div className="flex justify-between gap-4">

                          <div>

                            <p className="font-bold">
                              {log.action}
                            </p>

                            <p className="text-gray-400 text-sm mt-1">
                              {log.details}
                            </p>

                          </div>

                          <p className="text-gray-500 text-xs whitespace-nowrap">
                            {log.createdAt.toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="text-gray-500 text-center mt-8">
                    No recent activity yet.
                  </p>

                )}

              </div>


              {/* Badges */}

              {user.showBadges && (
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


                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-3">

                                <h4 className="font-bold text-lg">
                                  {item.badge.name}
                                </h4>

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
              )}


              {/* Buttons */}

              <div className="flex justify-center gap-4 flex-wrap mt-12">

                <Link
                  href="/profile/edit"
                  className={`
                    px-8
                    py-3
                    rounded-xl
                    bg-linear-to-r
                    ${theme.button}
                    font-bold
                    hover:scale-105
                    transition
                  `}
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