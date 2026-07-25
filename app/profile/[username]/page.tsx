import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicProfilePage({
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
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Profile Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

            {/* Header */}
            <div className="h-40 bg-linear-to-r from-purple-900/40 via-purple-600/20 to-black/20" />

            <div className="px-8 pb-10">

              {/* Avatar */}
              <div className="-mt-16 flex justify-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="
                      w-32
                      h-32
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
                    w-32
                    h-32
                    rounded-full
                    bg-purple-600
                    border-4
                    border-[#09090B]
                    ring-2
                    ring-purple-500
                    flex
                    items-center
                    justify-center
                    text-5xl
                    font-bold
                    "
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="text-center mt-6">

                <h1 className="text-4xl font-extrabold">
                  {user.username}
                </h1>

                {/* Role */}
                <div className="flex justify-center mt-3">
                  <span
                    className="
                    px-4
                    py-1.5
                    rounded-full
                    bg-purple-500/20
                    border
                    border-purple-500/30
                    text-purple-400
                    text-sm
                    font-semibold
                    "
                  >
                    {user.role}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
                  {user.bio || "This user hasn't added a bio yet."}
                </p>

              </div>

              {/* Badges */}
              <div className="mt-10">

                <h2 className="text-2xl font-bold text-center">
                  🏅 Badges
                </h2>

                <div className="mt-5 flex justify-center">

                  <div
                    className="
                    bg-white/5
                    border
                    border-white/10
                    rounded-2xl
                    px-6
                    py-5
                    text-center
                    "
                  >
                    <div className="text-3xl">
                      👤
                    </div>

                    <p className="text-purple-400 mt-2 font-semibold">
                    {user.role === "OWNER"
                        ? "👑 Founder"
                    : user.role === "ADMIN"
                        ? "🛡️ Administrator"
                    : user.role === "MODERATOR"
                        ? "🛡️ Moderator"
                    : user.role === "SUPPORT"
                        ? "🛡️ Support"
                    : "✅ Nexus Member"}
                    </p>
                  </div>

                </div>

              </div>

              {/* Account Information */}
              <div className="mt-10 grid md:grid-cols-2 gap-4">

                <div className="bg-black/20 border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">
                    Role
                  </p>

                  <p className="font-bold text-lg mt-1">
                    {user.role}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">
                    Member Since
                  </p>

                  <p className="font-bold text-lg mt-1">
                    {user.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

              </div>

              {/* Back Button */}
              <div className="text-center mt-10">

                <Link
                  href="/profile"
                  className="
                  inline-block
                  px-6
                  py-3
                  rounded-xl
                  bg-white/10
                  hover:bg-white/20
                  border
                  border-white/10
                  font-bold
                  transition
                  "
                >
                  ← Back to Profile
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