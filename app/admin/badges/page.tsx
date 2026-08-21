import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import Link from "next/link";
import {
  createBadge,
  awardBadge,
  awardBadgeToEveryone,
  removeBadge,
  deleteBadge,
} from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const badgeCategories = [
  {
    name: "Special/Role",
    icon: "👑",
    description: "Special awards and official Nexus roles.",
  },
  {
    name: "Events",
    icon: "🎉",
    description: "Badges earned through Nexus events and competitions.",
  },
  {
    name: "Contribution",
    icon: "🛠️",
    description: "Badges for helping improve and build Nexus.",
  },
  {
    name: "Membership",
    icon: "🕰️",
    description: "Badges celebrating long-term Nexus members.",
  },
  {
    name: "Community",
    icon: "🌐",
    description: "Badges related to communities and partnerships.",
  },
  {
    name: "Secret",
    icon: "🔮",
    description: "Hidden badges discovered through special achievements.",
  },
];

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

  const categorizedBadges = badgeCategories.map((category) => ({
    ...category,
    badges: badges.filter((badge) => badge.category === category.name),
  }));

  const uncategorizedBadges = badges.filter(
    (badge) =>
      !badgeCategories.some(
        (category) => category.name === badge.category
      )
  );

  const totalAwards = awardedBadges.length;
  const secretBadges = badges.filter((badge) => badge.isSecret).length;
  const configuredBadges = badges.filter(
    (badge) => badge.requirement
  ).length;

  return (
    <main className="min-h-screen bg-[#07070A] text-white">
      <Navbar />

      <section className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">

          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-white/[0.03] to-transparent p-8 md:p-10">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="relative">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
                <span>🏆</span>
                Nexus Administration
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                Badge{" "}
                <span className="text-purple-500">
                  Management
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-gray-400">
                Create, configure, award, and manage achievements
                for Nexus members.
              </p>

            </div>
          </div>

          {/* ===================================================== */}
          {/* STATS */}
          {/* ===================================================== */}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-gray-500">
                Total Badges
              </p>

              <p className="mt-2 text-3xl font-bold">
                {badges.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Available achievements
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-gray-500">
                Total Awards
              </p>

              <p className="mt-2 text-3xl font-bold text-green-400">
                {totalAwards}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Badges awarded to members
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-gray-500">
                Configured
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-400">
                {configuredBadges}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Badges with requirements
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-gray-500">
                Secret Badges
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-400">
                {secretBadges}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Hidden achievements
              </p>
            </div>

          </div>

          {/* ===================================================== */}
          {/* CREATE BADGE */}
          {/* ===================================================== */}

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">

            <div className="border-b border-white/10 bg-white/[0.02] px-8 py-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-2xl">
                  ✨
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Create Badge
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Create a new achievement for Nexus members.
                  </p>
                </div>

              </div>

            </div>

            <form
              action={createBadge}
              className="space-y-6 p-8"
            >

              <div className="grid gap-6 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Badge Name
                  </label>

                  <input
                    name="name"
                    required
                    placeholder="e.g. Event Champion"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Badge Icon
                  </label>

                  <input
                    name="icon"
                    required
                    maxLength={10}
                    placeholder="🏆"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Category
                  </label>

                  <select
                    name="category"
                    required
                    defaultValue="Special/Role"
                    className="w-full rounded-xl border border-white/10 bg-[#0D0D11] px-5 py-3.5 text-white outline-none transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                  >
                    {badgeCategories.map((category) => (
                      <option
                        key={category.name}
                        value={category.name}
                      >
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Target
                  </label>

                  <input
                    name="target"
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                  />

                  <p className="mt-2 text-xs text-gray-600">
                    Optional numeric goal such as events, messages,
                    or days.
                  </p>
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  Description
                </label>

                <textarea
                  name="description"
                  required
                  placeholder="Describe what this badge represents..."
                  className="min-h-32 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                />
              </div>

              {/* Requirement */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  Requirement Type
                </label>

                <select
                  name="requirement"
                  defaultValue=""
                  className="w-full rounded-xl border border-white/10 bg-[#0D0D11] px-5 py-3.5 text-white outline-none transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                >
                  <option value="">
                    No automatic requirement
                  </option>

                  <option value="EVENTS">
                    🎉 Events Joined
                  </option>

                  <option value="MEMBERSHIP_DAYS">
                    🕰️ Membership Days
                  </option>

                  </select>

                  <p className="mt-2 text-xs text-gray-600">
                    Select how progress for this badge should be tracked automatically.
                  </p>
                </div>

              {/* Secret */}
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-purple-500/30 hover:bg-purple-500/[0.03]">

                <input
                  type="checkbox"
                  name="isSecret"
                  className="h-5 w-5 accent-purple-600"
                />

                <div>
                  <p className="font-semibold">
                    Secret Badge
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Hide this achievement until a member discovers
                    or earns it.
                  </p>
                </div>

              </label>

              <div className="flex justify-end">

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-7 py-3.5 font-bold transition hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-600/20"
                >
                  + Create Badge
                </button>

              </div>

            </form>
          </div>

          {/* ===================================================== */}
          {/* AVAILABLE BADGES */}
          {/* ===================================================== */}

          <div className="mt-14">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

              <div>
                <h2 className="text-3xl font-bold">
                  Available Badges
                </h2>

                <p className="mt-2 text-gray-500">
                  Manage all achievements currently available
                  within Nexus.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-400">
                {badges.length}{" "}
                {badges.length === 1 ? "badge" : "badges"}
              </div>

            </div>

            {badges.length === 0 ? (

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center">

                <div className="text-5xl">
                  🏆
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  No badges yet
                </h3>

                <p className="mt-2 text-gray-500">
                  Create your first badge above.
                </p>

              </div>

            ) : (

              <div className="mt-10 space-y-12">

                {categorizedBadges.map((category) => {

                  if (category.badges.length === 0) {
                    return null;
                  }

                  return (
                    <div key={category.name}>

                      <div className="mb-5 flex items-start justify-between gap-4">

                        <div className="flex items-start gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-2xl">
                            {category.icon}
                          </div>

                          <div>
                            <h3 className="text-xl font-bold">
                              {category.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {category.description}
                            </p>
                          </div>

                        </div>

                        <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-500 sm:block">
                          {category.badges.length}
                        </span>

                      </div>

                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {category.badges.map((badge) => (

                          <div
                            key={badge.id}
                            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.06]"
                          >

                            {/* Badge Header */}
                            <div className="flex items-start justify-between gap-4">

                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-4xl transition group-hover:scale-105">
                                {badge.icon}
                              </div>

                              {badge.isSecret && (
                                <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                                  🔒 Secret
                                </span>
                              )}

                            </div>

                            <h3 className="mt-5 text-xl font-bold">
                              {badge.name}
                            </h3>

                            <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-400">
                              {badge.description}
                            </p>

                            {/* Requirement */}
                            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">

                              <div className="flex items-center justify-between gap-3">

                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                                  Requirement
                                </span>

                                {badge.requirement ? (
                                  <span className="text-xs font-semibold text-green-400">
                                    ✓ Configured
                                  </span>
                                ) : (
                                  <span className="text-xs font-semibold text-gray-600">
                                    Not set
                                  </span>
                                )}

                              </div>

                              {badge.requirement ? (

                                <>
                                  <p className="mt-2 text-sm text-gray-300">
                                    {badge.requirement}
                                  </p>

                                  {badge.target !== null && (
                                    <div className="mt-3 inline-flex rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400">
                                      Target: {badge.target}
                                    </div>
                                  )}
                                </>

                              ) : (

                                <p className="mt-2 text-sm text-gray-600">
                                  No requirement configured.
                                </p>

                              )}

                            </div>

                            {/* Actions */}
                            <div className="mt-5 space-y-2.5">

                              <div className="grid grid-cols-2 gap-2.5">

                                <Link
                                  href={`/admin/badges/${badge.id}/edit`}
                                  className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-center text-sm font-bold text-purple-400 transition hover:bg-purple-500/20"
                                >
                                  Edit
                                </Link>

                                <form action={deleteBadge}>
                                  <input
                                    type="hidden"
                                    name="badgeId"
                                    value={badge.id}
                                  />

                                  <button
                                    type="submit"
                                    className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/20"
                                  >
                                    Delete
                                  </button>
                                </form>

                              </div>

                              <form action={awardBadgeToEveryone}>

                                <input
                                  type="hidden"
                                  name="badgeId"
                                  value={badge.id}
                                />

                                <button
                                  type="submit"
                                  className="w-full rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm font-bold text-green-400 transition hover:bg-green-500/20"
                                >
                                  👥 Award to Everyone
                                </button>

                              </form>

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>
                  );
                })}

                {/* Other */}
                {uncategorizedBadges.length > 0 && (
                  <div>

                    <div className="mb-5 flex items-start gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-2xl">
                        📦
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">
                          Other
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Badges that do not currently belong to a
                          category.
                        </p>
                      </div>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                      {uncategorizedBadges.map((badge) => (

                        <div
                          key={badge.id}
                          className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-white/20"
                        >

                          <div className="flex items-start justify-between">

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-4xl">
                              {badge.icon}
                            </div>

                            {badge.isSecret && (
                              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                                🔒 Secret
                              </span>
                            )}

                          </div>

                          <h3 className="mt-5 text-xl font-bold">
                            {badge.name}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-gray-400">
                            {badge.description}
                          </p>

                          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">

                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                              Requirement
                            </span>

                            {badge.requirement ? (
                              <>
                                <p className="mt-2 text-sm text-gray-300">
                                  {badge.requirement}
                                </p>

                                {badge.target !== null && (
                                  <p className="mt-2 text-xs font-semibold text-purple-400">
                                    Target: {badge.target}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="mt-2 text-sm text-gray-600">
                                No requirement configured.
                              </p>
                            )}

                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-2.5">

                            <Link
                              href={`/admin/badges/${badge.id}/edit`}
                              className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-center text-sm font-bold text-purple-400 transition hover:bg-purple-500/20"
                            >
                              Edit
                            </Link>

                            <form action={deleteBadge}>

                              <input
                                type="hidden"
                                name="badgeId"
                                value={badge.id}
                              />

                              <button
                                type="submit"
                                className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/20"
                              >
                                Delete
                              </button>

                            </form>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* ===================================================== */}
          {/* AWARD BADGE */}
          {/* ===================================================== */}

          <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">

            <div className="border-b border-white/10 bg-white/[0.02] px-8 py-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-2xl">
                  🎁
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Award Badge
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manually award an achievement to a Nexus
                    member.
                  </p>
                </div>

              </div>

            </div>

            {users.length === 0 ? (

              <div className="p-8 text-gray-500">
                No users are available yet.
              </div>

            ) : badges.length === 0 ? (

              <div className="p-8 text-gray-500">
                Create a badge first before awarding one.
              </div>

            ) : (

              <form
                action={awardBadge}
                className="grid gap-5 p-8 md:grid-cols-2"
              >

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Member
                  </label>

                  <select
                    name="userId"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-white/10 bg-[#0D0D11] px-5 py-3.5 text-white outline-none transition focus:border-purple-500/60"
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
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Badge
                  </label>

                  <select
                    name="badgeId"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-white/10 bg-[#0D0D11] px-5 py-3.5 text-white outline-none transition focus:border-purple-500/60"
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
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-3.5 font-bold transition hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-600/20 md:col-span-2"
                >
                  🏆 Award Badge
                </button>

              </form>

            )}

          </div>

          {/* ===================================================== */}
          {/* AWARD HISTORY */}
          {/* ===================================================== */}

          <div className="mt-14">

            <div>
              <h2 className="text-3xl font-bold">
                Award History
              </h2>

              <p className="mt-2 text-gray-500">
                Recent achievements awarded to Nexus members.
              </p>
            </div>

            {awardedBadges.length === 0 ? (

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center">

                <div className="text-5xl">
                  🏆
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  No badges awarded yet
                </h3>

                <p className="mt-2 text-gray-500">
                  Award a badge to a member and the activity will
                  appear here.
                </p>

              </div>

            ) : (

              <div className="mt-6 space-y-3">

                {awardedBadges.map((assignment) => (

                  <div
                    key={assignment.id}
                    className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 md:flex-row md:items-center md:justify-between"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-3xl">
                        {assignment.badge.icon}
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-lg font-bold">
                            {assignment.badge.name}
                          </h3>

                          {assignment.badge.isSecret && (
                            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                              SECRET
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-sm text-gray-400">
                          Awarded to{" "}
                          <span className="font-semibold text-white">
                            {assignment.user.username}
                          </span>
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
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
                        className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/20 md:w-auto"
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