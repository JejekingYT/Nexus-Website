import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(session.user.id),
    },
  });

  if (!user) {
    redirect("/login");
  }

  const createdDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.createdAt);

  return (
    <main className="min-h-screen text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Back */}

          <Link
            href="/profile/settings"
            className="
              inline-flex
              items-center
              gap-2
              text-gray-400
              hover:text-white
              transition
              mb-8
            "
          >
            ← Back to Settings
          </Link>

          {/* Header */}

          <div className="text-center mb-12">

            <div
              className="
                mx-auto
                w-16
                h-16
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
              👤
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-6">
              Account
            </h1>

            <p className="text-gray-400 text-lg mt-4">
              Manage your Nexus account and connected accounts.
            </p>

          </div>

          {/* Account Information */}

          <div
            className="
              glass
              rounded-3xl
              border
              border-white/10
              overflow-hidden
            "
          >

            <div className="p-6 md:p-8 border-b border-white/10">

              <h2 className="text-2xl font-bold">
                Account Information
              </h2>

              <p className="text-gray-400 mt-1">
                Basic information associated with your Nexus account.
              </p>

            </div>

            {/* Username */}

            <div className="p-6 md:p-7 border-b border-white/10">

              <div className="flex items-center justify-between gap-6">

                <div>

                  <p className="text-sm text-gray-400">
                    Username
                  </p>

                  <p className="text-lg font-semibold mt-1">
                    {user.username}
                  </p>

                </div>

                <Link
                  href="/profile/edit"
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    bg-white/5
                    border
                    border-white/10
                    hover:bg-white/10
                    transition
                    font-semibold
                  "
                >
                  Edit Profile
                </Link>

              </div>

            </div>

            {/* Email */}

            <div className="p-6 md:p-7 border-b border-white/10">

              <p className="text-sm text-gray-400">
                Email Address
              </p>

              <div className="flex items-center gap-3 mt-2">

                <p className="text-lg font-semibold">
                  {user.email || "No email connected"}
                </p>

                {user.email && user.emailVerified && (
                  <span
                    className="
                      text-xs
                      px-2.5
                      py-1
                      rounded-full
                      bg-green-500/10
                      border
                      border-green-500/20
                      text-green-400
                    "
                  >
                    Verified
                  </span>
                )}

              </div>

            </div>

            {/* Member Since */}

            <div className="p-6 md:p-7">

              <p className="text-sm text-gray-400">
                Member Since
              </p>

              <p className="text-lg font-semibold mt-1">
                {createdDate}
              </p>

            </div>

          </div>

          {/* Connected Accounts */}

          <div
            className="
              glass
              rounded-3xl
              border
              border-white/10
              overflow-hidden
              mt-6
            "
          >

            <div className="p-6 md:p-8 border-b border-white/10">

              <h2 className="text-2xl font-bold">
                Connected Accounts
              </h2>

              <p className="text-gray-400 mt-1">
                Manage accounts connected to your Nexus profile.
              </p>

            </div>

            {/* Discord */}

            <div
              className="
                p-6
                md:p-7
                border-b
                border-white/10
                flex
                items-center
                justify-between
                gap-6
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-[#5865F2]/20
                    border
                    border-[#5865F2]/20
                    flex
                    items-center
                    justify-center
                    text-2xl
                  "
                >
                  💬
                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    Discord
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {user.discordId
                      ? "Connected to your Nexus account"
                      : "Not connected"}
                  </p>

                </div>

              </div>

              {user.discordId ? (
                <span
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-green-500/10
                    border
                    border-green-500/20
                    text-green-400
                    text-sm
                    font-semibold
                  "
                >
                  ✓ Connected
                </span>
              ) : (
                <span
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-gray-500/10
                    border
                    border-white/10
                    text-gray-400
                    text-sm
                    font-semibold
                  "
                >
                  Not Connected
                </span>
              )}

            </div>

            {/* Roblox */}

            <div
              className="
                p-6
                md:p-7
                flex
                items-center
                justify-between
                gap-6
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-white/5
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    text-2xl
                  "
                >
                  🎮
                </div>

                <div>

                  <div className="flex items-center gap-3">

                    <h3 className="font-bold text-lg">
                      Roblox
                    </h3>

                    <span
                      className="
                        text-xs
                        px-2.5
                        py-1
                        rounded-full
                        bg-yellow-500/10
                        border
                        border-yellow-500/20
                        text-yellow-400
                        font-semibold
                      "
                    >
                      SOON
                    </span>

                  </div>

                  <p className="text-sm text-gray-400 mt-1">
                    Connect your Roblox account to Nexus.
                  </p>

                </div>

              </div>

              <button
                disabled
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-gray-500
                  cursor-not-allowed
                  font-semibold
                  whitespace-nowrap
                "
              >
                Coming Soon
              </button>

            </div>

          </div>

          {/* Security */}

          <div
            className="
              glass
              rounded-3xl
              border
              border-white/10
              overflow-hidden
              mt-6
            "
          >

            <div className="p-6 md:p-8 border-b border-white/10">

              <h2 className="text-2xl font-bold">
                Security
              </h2>

              <p className="text-gray-400 mt-1">
                Keep your Nexus account secure.
              </p>

            </div>

            {/* Password */}

            <div
              className="
                p-6
                md:p-7
                border-b
                border-white/10
                flex
                items-center
                justify-between
                gap-6
              "
            >

              <div>

                <div className="flex items-center gap-3">

                  <h3 className="font-bold text-lg">
                    Password
                  </h3>

                  <span
                    className="
                      text-xs
                      px-2.5
                      py-1
                      rounded-full
                      bg-yellow-500/10
                      border
                      border-yellow-500/20
                      text-yellow-400
                      font-semibold
                    "
                  >
                    SOON
                  </span>

                </div>

                <p className="text-sm text-gray-400 mt-1">
                  Change your Nexus account password.
                </p>

              </div>

              <button
                disabled
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-gray-500
                  cursor-not-allowed
                  font-semibold
                  whitespace-nowrap
                "
              >
                Coming Soon
              </button>

            </div>

            {/* Active Sessions */}

            <div
              className="
                p-6
                md:p-7
                flex
                items-center
                justify-between
                gap-6
              "
            >

              <div>

                <div className="flex items-center gap-3">

                  <h3 className="font-bold text-lg">
                    Active Sessions
                  </h3>

                  <span
                    className="
                      text-xs
                      px-2.5
                      py-1
                      rounded-full
                      bg-yellow-500/10
                      border
                      border-yellow-500/20
                      text-yellow-400
                      font-semibold
                    "
                  >
                    SOON
                  </span>

                </div>

                <p className="text-sm text-gray-400 mt-1">
                  Review devices currently signed in to your account.
                </p>

              </div>

              <button
                disabled
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-gray-500
                  cursor-not-allowed
                  font-semibold
                  whitespace-nowrap
                "
              >
                Coming Soon
              </button>

            </div>

          </div>

          {/* Danger Zone */}

          <div
            className="
              rounded-3xl
              border
              border-red-500/20
              bg-red-500/5
              overflow-hidden
              mt-6
            "
          >

            <div className="p-6 md:p-8 border-b border-red-500/10">

              <h2 className="text-2xl font-bold text-red-400">
                Danger Zone
              </h2>

              <p className="text-gray-400 mt-1">
                These actions can permanently affect your account.
              </p>

            </div>

            <div
              className="
                p-6
                md:p-7
                flex
                items-center
                justify-between
                gap-6
              "
            >

              <div>

                <h3 className="font-bold text-lg">
                  Delete Account
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Permanently delete your Nexus account and associated data.
                </p>

              </div>

              <button
                disabled
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-400/50
                  cursor-not-allowed
                  font-semibold
                  whitespace-nowrap
                "
              >
                Coming Soon
              </button>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}