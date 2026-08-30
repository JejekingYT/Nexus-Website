import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FollowButton from "./FollowButton";
import SocialLink from "./SocialLink";
import { getUserStatus } from "@/lib/userStatus";

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

function getThemeStyles(theme: string) {
  switch (theme) {
    case "purple":
      return {
        card: "border-purple-500/30",
        banner:
          "from-purple-950 via-purple-800/60 to-indigo-950",
        ring: "ring-purple-500",
        accent: "text-purple-400",
        button:
          "from-purple-600 to-fuchsia-600",
      };

    case "blue":
      return {
        card: "border-blue-500/30",
        banner:
          "from-blue-950 via-blue-800/60 to-cyan-950",
        ring: "ring-blue-500",
        accent: "text-blue-400",
        button:
          "from-blue-600 to-cyan-600",
      };

    case "dark":
      return {
        card: "border-white/10",
        banner:
          "from-black via-zinc-900 to-black",
        ring: "ring-white/30",
        accent: "text-gray-300",
        button:
          "from-zinc-700 to-zinc-900",
      };

    default:
      return {
        card: "border-white/10",
        banner:
          "from-purple-700/50 via-purple-500/20 to-blue-500/20",
        ring: "ring-purple-500",
        accent: "text-purple-400",
        button:
          "from-purple-600 to-blue-600",
      };
  }
}

function getSocialIcon(name: string) {
  switch (name) {
    case "Discord":
      return "💬";
    case "YouTube":
      return "▶️";
    case "GitHub":
      return "💻";
    case "Twitter":
      return "𝕏";
    case "Roblox":
      return "🎮";
    default:
      return "🔗";
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const decodedUsername = decodeURIComponent(username);

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findFirst({
    where: {
      username: decodedUsername,
    },

    include: {
      badges: {
        include: {
          badge: true,
        },

        orderBy: {
          awardedAt: "desc",
        },
      },

      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  let isFollowing = false;
  let isOwnProfile = false;

  if (session?.user?.id) {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: Number(session.user.id),
      },

      select: {
        id: true,
      },
    });

    if (currentUser) {
      isOwnProfile = currentUser.id === user.id;

      if (!isOwnProfile) {
        const existingFollow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.id,
              followingId: user.id,
            },
          },
        });

        isFollowing = !!existingFollow;
      }
    }
  }

  const themeStyles = getThemeStyles(user.theme || "default");

  const userStatus = getUserStatus(user.lastSeen);

  const socialLinks = [
    {
      name: "Discord",
      value: user.discord,
    },
    {
      name: "YouTube",
      value: user.youtube,
    },
    {
      name: "GitHub",
      value: user.github,
    },
    {
      name: "Twitter",
      value: user.twitter,
    },
    {
      name: "Roblox",
      value: user.roblox,
    },
  ].filter((social) => social.value);

  return (
    <main className="min-h-screen text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}

          <div className="text-center mb-12">

            <h1 className="text-5xl md:text-6xl font-extrabold">
              Nexus{" "}
              <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Member
              </span>
            </h1>

            <p className="text-gray-400 mt-5 text-lg">
              Viewing the public profile of a Nexus member.
            </p>

          </div>

          {/* PROFILE CARD */}

          <div
            className={`
              glass
              rounded-3xl
              overflow-hidden
              border
              ${themeStyles.card}
            `}
          >

            {/* Banner */}

            {user.showBanner && (
              <div
                className={`
                  h-52
                  bg-linear-to-r
                  ${themeStyles.banner}
                  relative
                  overflow-hidden
                `}
                style={
                  user.banner
                    ? {
                        backgroundImage: `url(${user.banner})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >

                {user.banner && (
                  <div className="absolute inset-0 bg-black/25" />
                )}

              </div>
            )}

            <div className="px-8 pb-12">

              {/* Avatar */}

              <div
                className={`
                  flex
                  justify-center
                  relative
                  z-10
                  ${user.showBanner ? "-mt-20" : "mt-8"}
                `}
              >

                <div className="relative">

                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.username}
                      width={144}
                      height={144}
                      className={`
                        w-36
                        h-36
                        rounded-full
                        object-cover
                        border-4
                        border-[#09090B]
                        ring-2
                        ${themeStyles.ring}
                      `}
                    />
                  ) : (
                    <div
                      className={`
                        w-36
                        h-36
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
                        ${themeStyles.ring}
                      `}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Online / Idle / Offline Status Dot */}

                  <div
                    className={`
                      absolute
                      bottom-2
                      right-2
                      w-7
                      h-7
                      rounded-full
                      border-4
                      border-[#09090B]
                      ${userStatus.dot}
                    `}
                    title={userStatus.label}
                  />

                </div>

              </div>

              {/* User Info */}

              <div className="text-center mt-6">

                <h2 className="text-4xl font-bold">
                  {user.username}
                </h2>

                {/* Nexus Activity Status */}

                <div
                  className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    mt-3
                    text-sm
                    font-semibold
                    ${userStatus.color}
                  `}
                >
                  <span
                    className={`
                      w-2.5
                      h-2.5
                      rounded-full
                      ${userStatus.dot}
                    `}
                  />

                  <span>
                    {userStatus.label}
                  </span>
                </div>

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
                    {getRoleBadge(user.role)}
                  </span>

                </div>

                {/* Bio */}

                <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
                  {user.bio || "This user hasn't added a bio yet."}
                </p>

                {/* Social Links */}

                {user.showSocialLinks && socialLinks.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 mt-7">

                    {socialLinks.map((social) => (
                      <SocialLink
                        key={social.name}
                        name={social.name}
                        value={social.value!}
                        icon={getSocialIcon(social.name)}
                      />
                    ))}

                  </div>
                )}

                {/* Follow Stats */}

                <div className="mt-8 flex flex-wrap justify-center gap-3">

                  <Link
                    href={`/profile/${encodeURIComponent(
                      user.username
                    )}/followers`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-5
                      py-3
                      transition-all
                      hover:border-purple-500/30
                      hover:bg-purple-500/[0.08]
                      hover:-translate-y-0.5
                    "
                  >
                    <span className="text-lg">
                      👥
                    </span>

                    <div className="text-left">
                      <p className="text-lg font-bold">
                        {user._count.followers}
                      </p>

                      <p className="text-xs text-gray-500">
                        Followers
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/profile/${encodeURIComponent(
                      user.username
                    )}/following`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-5
                      py-3
                      transition-all
                      hover:border-blue-500/30
                      hover:bg-blue-500/[0.08]
                      hover:-translate-y-0.5
                    "
                  >
                    <span className="text-lg">
                      ➡️
                    </span>

                    <div className="text-left">
                      <p className="text-lg font-bold">
                        {user._count.following}
                      </p>

                      <p className="text-xs text-gray-500">
                        Following
                      </p>
                    </div>
                  </Link>

                </div>

                {/* Follow Button */}

                {!isOwnProfile && (
                  <div className="mt-6 flex justify-center">

                    {session?.user ? (
                      <FollowButton
                        userId={user.id}
                        initialFollowing={isFollowing}
                      />
                    ) : (
                      <Link
                        href="/login"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.05]
                          px-6
                          py-3
                          font-bold
                          text-gray-300
                          transition
                          hover:bg-white/[0.1]
                          hover:text-white
                        "
                      >
                        🔐 Login to Follow
                      </Link>
                    )}

                  </div>
                )}

              </div>

              {/* Stats */}

              <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-12">

                {[
                  {
                    title: "Role",
                    value: user.role,
                  },
                  {
                    title: "Badges",
                    value: user.badges.length,
                  },
                  {
                    title: "Followers",
                    value: user._count.followers,
                  },
                  {
                    title: "Following",
                    value: user._count.following,
                  },
                  {
                    title: "Joined",
                    value: user.createdAt.toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                      }
                    ),
                  },
                ].map((stat) => (

                  <div
                    key={stat.title}
                    className="
                      glass
                      p-6
                      text-center
                      rounded-2xl
                    "
                  >

                    <p className="text-gray-500 text-sm">
                      {stat.title}
                    </p>

                    <p className="font-bold text-xl mt-2">
                      {stat.value}
                    </p>

                  </div>

                ))}

              </div>

              {/* Badges */}

              {user.showBadges && (
                <div className="mt-14">

                  <h3 className="text-3xl font-bold text-center">
                    🏅 Badges
                  </h3>

                  {user.badges.length > 0 ? (

                    <div className="grid md:grid-cols-2 gap-5 mt-8">

                      {user.badges.map((item) => (

                        <div
                          key={item.id}
                          className="
                            glass
                            p-5
                            rounded-2xl
                            hover:border-purple-500
                            transition
                          "
                        >

                          <div className="flex gap-4 items-center">

                            <div
                              className="
                                w-14
                                h-14
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

                            <div>

                              <h4 className="font-bold text-lg">
                                {item.badge.name}
                              </h4>

                              <p className="text-gray-400 text-sm">
                                {item.badge.description ||
                                  "No description available."}
                              </p>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  ) : (

                    <p className="text-center text-gray-500 mt-6">
                      No badges earned yet.
                    </p>

                  )}

                </div>
              )}

              {/* Back Button */}

              <div className="text-center mt-12">

                <Link
                  href="/members"
                  className={`
                    inline-block
                    px-8
                    py-3
                    rounded-xl
                    bg-linear-to-r
                    ${themeStyles.button}
                    font-bold
                    transition
                    hover:scale-105
                  `}
                >
                  ← Back to Members
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