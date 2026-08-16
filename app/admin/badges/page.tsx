import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  createBadge,
  awardBadge,
  removeBadge,
} from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BadgesAdminPage() {
  await requireRole(["OWNER"]);

  const [badges, users, awardedBadges] = await Promise.all([
    prisma.badge.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
      orderBy: {
        username: "asc",
      },
    }),

    prisma.userBadge.findMany({
      include: {
        user: true,
        badge: true,
        awardedBy: true,
      },
      orderBy: {
        awardedAt: "desc",
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div>
            <h1 className="text-5xl font-extrabold">
              Badge{" "}
              <span className="text-purple-500">
                Management
              </span>
            </h1>

            <p className="text-gray-400 mt-4">
              Create and manage badges for Nexus members.
            </p>
          </div>

          {/* Create Badge */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8">

            <div>
              <h2 className="text-3xl font-bold">
                Create Badge
              </h2>

              <p className="text-gray-400 mt-2">
                Create a badge that can be awarded to Nexus members.
              </p>
            </div>

            <form
              action={createBadge}
              className="mt-8 space-y-5"
            >

              <input
                name="name"
                required
                placeholder="Badge name"
                className="
                  w-full
                  bg-black/30
                  border
                  border-white/10
                  rounded-xl
                  px-5
                  py-4
                  outline-none
                  focus:border-purple-500
                  transition
                "
              />

              <input
                name="icon"
                required
                placeholder="Badge icon e.g. 🏆"
                maxLength={10}
                className="
                  w-full
                  bg-black/30
                  border
                  border-white/10
                  rounded-xl
                  px-5
                  py-4
                  outline-none
                  focus:border-purple-500
                  transition
                "
              />

              <textarea
                name="description"
                required
                placeholder="Describe what this badge represents..."
                className="
                  w-full
                  min-h-32
                  bg-black/30
                  border
                  border-white/10
                  rounded-xl
                  px-5
                  py-4
                  outline-none
                  focus:border-purple-500
                  transition
                  resize-y
                "
              />

              <button
                type="submit"
                className="
                  bg-purple-600
                  hover:bg-purple-700
                  px-6
                  py-3
                  rounded-xl
                  font-bold
                  transition
                "
              >
                Create Badge
              </button>

            </form>
          </div>

          {/* Available Badges */}
          <div className="mt-10">

            <h2 className="text-3xl font-bold">
              Available Badges
            </h2>

            <p className="text-gray-400 mt-2">
              Badges currently available to award.
            </p>

            {badges.length === 0 ? (

              <div className="
                mt-6
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-8
                text-center
                text-gray-400
              ">
                No badges have been created yet.
              </div>

            ) : (

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

                {badges.map((badge) => (

                  <div
                    key={badge.id}
                    className="
                      bg-white/5
                      border
                      border-white/10
                      rounded-2xl
                      p-6
                      hover:border-purple-500/50
                      transition
                    "
                  >

                    <div className="text-4xl">
                      {badge.icon}
                    </div>

                    <h3 className="text-xl font-bold mt-4">
                      {badge.name}
                    </h3>

                    <p className="text-gray-400 text-sm mt-2">
                      {badge.description}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Award Badge */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-3xl font-bold">
              Award Badge
            </h2>

            <p className="text-gray-400 mt-2">
              Only Owners can award badges to members.
            </p>

            {users.length === 0 ? (

              <div className="
                mt-8
                rounded-xl
                bg-black/20
                border
                border-white/10
                p-6
                text-gray-400
              ">
                No users are available yet.
              </div>

            ) : badges.length === 0 ? (

              <div className="
                mt-8
                rounded-xl
                bg-black/20
                border
                border-white/10
                p-6
                text-gray-400
              ">
                Create a badge first before awarding one.
              </div>

            ) : (

              <form
                action={awardBadge}
                className="mt-8 grid md:grid-cols-2 gap-5"
              >

                <select
                  name="userId"
                  required
                  defaultValue=""
                  className="
                    bg-black/30
                    border
                    border-white/10
                    rounded-xl
                    px-5
                    py-4
                    outline-none
                    focus:border-purple-500
                  "
                >

                  <option value="" disabled>
                    Select User
                  </option>

                  {users.map((user) => (

                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.username}
                    </option>

                  ))}

                </select>

                <select
                  name="badgeId"
                  required
                  defaultValue=""
                  className="
                    bg-black/30
                    border
                    border-white/10
                    rounded-xl
                    px-5
                    py-4
                    outline-none
                    focus:border-purple-500
                  "
                >

                  <option value="" disabled>
                    Select Badge
                  </option>

                  {badges.map((badge) => (

                    <option
                      key={badge.id}
                      value={badge.id}
                    >
                      {badge.icon} {badge.name}
                    </option>

                  ))}

                </select>

                <button
                  type="submit"
                  className="
                    md:col-span-2
                    bg-purple-600
                    hover:bg-purple-700
                    px-6
                    py-3
                    rounded-xl
                    font-bold
                    transition
                  "
                >
                  Award Badge
                </button>

              </form>

            )}

          </div>

          {/* Award History */}
          <div className="mt-12">

            <h2 className="text-3xl font-bold">
              Award History
            </h2>

            <p className="text-gray-400 mt-2">
              Recent badges awarded to Nexus members.
            </p>

            {awardedBadges.length === 0 ? (

              <div className="
                mt-6
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-10
                text-center
              ">

                <div className="text-5xl">
                  🏆
                </div>

                <h3 className="text-xl font-bold mt-4">
                  No badges awarded yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Award a badge to a member to see it here.
                </p>

              </div>

            ) : (

              <div className="mt-6 space-y-4">

                {awardedBadges.map((assignment) => (

                  <div
                    key={assignment.id}
                    className="
                      bg-white/5
                      border
                      border-white/10
                      rounded-2xl
                      p-5
                      flex
                      flex-col
                      md:flex-row
                      md:items-center
                      md:justify-between
                      gap-5
                    "
                  >

                    <div className="flex items-center gap-4">

                      <div className="
                        w-14
                        h-14
                        rounded-xl
                        bg-purple-500/10
                        border
                        border-purple-500/20
                        flex
                        items-center
                        justify-center
                        text-3xl
                      ">
                        {assignment.badge.icon}
                      </div>

                      <div>

                        <h3 className="text-xl font-bold">
                          {assignment.badge.name}
                        </h3>

                        <p className="text-gray-400 mt-1">
                          Awarded to{" "}
                          <span className="text-white font-semibold">
                            {assignment.user.username}
                          </span>
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          {assignment.awardedBy
                            ? `Awarded by ${assignment.awardedBy.username}`
                            : "Awarder unavailable"}
                          {" • "}
                          {assignment.awardedAt.toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>

                      </div>

                    </div>

                    <form action={removeBadge}>

                      <input
                        type="hidden"
                        name="userBadgeId"
                        value={assignment.id}
                      />

                      <button
                        type="submit"
                        className="
                          bg-red-500/10
                          text-red-400
                          hover:bg-red-500/20
                          border
                          border-red-500/10
                          px-5
                          py-2.5
                          rounded-xl
                          font-bold
                          transition
                        "
                      >
                        Remove Badge
                      </button>

                    </form>

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