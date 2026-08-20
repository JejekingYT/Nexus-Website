"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BadgeUser = {
  id: number;
};

type BadgeProgress = {
  progress: number;
};

type Badge = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  category: string;
  isSecret: boolean;
  requirement: string | null;
  target: number | null;
  users: BadgeUser[];
  progress: BadgeProgress | null;
};

type BadgeGridProps = {
  badges: Badge[];
  categories: string[];
};

const categoryIcons: Record<string, string> = {
  "Special/Role": "👑",
  Events: "🎉",
  Contribution: "🛠️",
  Membership: "🕰️",
  Community: "🌐",
  Secret: "🔮",
};

const categoryColors: Record<string, string> = {
  "Special/Role":
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  Events:
    "border-pink-500/20 bg-pink-500/10 text-pink-400",
  Contribution:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
  Membership:
    "border-green-500/20 bg-green-500/10 text-green-400",
  Community:
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  Secret:
    "border-purple-500/20 bg-purple-500/10 text-purple-400",
};

export default function BadgeGrid({
  badges,
  categories,
}: BadgeGridProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [selectedStatus, setSelectedStatus] =
    useState("All");

  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      const matchesSearch =
        badge.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        badge.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        badge.category === selectedCategory;

      const hasProgress =
        badge.progress &&
        badge.target &&
        badge.progress.progress > 0 &&
        badge.progress.progress < badge.target;

      const isLocked =
        badge.target &&
        (!badge.progress ||
          badge.progress.progress < badge.target);

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Locked" && isLocked) ||
        (selectedStatus === "Progress" && hasProgress) ||
        (selectedStatus === "Secret" && badge.isSecret);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    badges,
    search,
    selectedCategory,
    selectedStatus,
  ]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-5">

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          🔎
        </span>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search badges..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/40 focus:bg-white/[0.05] transition"
        />

      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">

        {/* Categories */}
        <div className="flex flex-wrap gap-2">

          <button
            onClick={() =>
              setSelectedCategory("All")
            }
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
              selectedCategory === "All"
                ? "bg-white/[0.10] border-white/20 text-white"
                : "bg-white/[0.03] border-white/10 text-gray-500 hover:text-white"
            }`}
          >
            All
          </button>

          {categories.map((category) => {
            const active =
              selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                  active
                    ? categoryColors[category] ??
                      "border-white/20 bg-white/[0.08] text-white"
                    : "border-white/10 bg-white/[0.03] text-gray-500 hover:text-white"
                }`}
              >
                {categoryIcons[category] ?? "🏅"}{" "}
                {category}
              </button>
            );
          })}

        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">

          {[
            {
              label: "All",
              value: "All",
              icon: "🏆",
            },
            {
              label: "Locked",
              value: "Locked",
              icon: "🔒",
            },
            {
              label: "In Progress",
              value: "Progress",
              icon: "📈",
            },
            {
              label: "Secret",
              value: "Secret",
              icon: "🔮",
            },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() =>
                setSelectedStatus(status.value)
              }
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                selectedStatus === status.value
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                  : "border-white/10 bg-white/[0.03] text-gray-500 hover:text-white"
              }`}
            >
              {status.icon} {status.label}
            </button>
          ))}

        </div>

      </div>

      {/* Results */}
      <div className="flex items-center justify-between gap-4 mb-5">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="text-gray-300 font-semibold">
            {filteredBadges.length}
          </span>{" "}
          {filteredBadges.length === 1
            ? "badge"
            : "badges"}
        </p>

      </div>

      {/* Badge Grid */}
      {filteredBadges.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredBadges.map((badge) => {
            const categoryIcon =
              categoryIcons[badge.category] ?? "🏅";

            const categoryStyle =
              categoryColors[badge.category] ??
              "border-white/10 bg-white/[0.04] text-gray-400";

            const recipientCount =
              badge.users.length;

            const currentProgress =
              badge.progress?.progress ?? 0;

            const target =
              badge.target ?? 0;

            const progressPercent =
              target > 0
                ? Math.min(
                    Math.round(
                      (currentProgress / target) * 100
                    ),
                    100
                  )
                : 0;

            const isCompleted =
              target > 0 &&
              currentProgress >= target;

            const isLocked =
              target > 0 && !isCompleted;

            const showSecret =
              badge.isSecret && isLocked;

            return (
              <Link
                key={badge.id}
                href={`/badges/${badge.slug}`}
                className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${
                  showSecret
                    ? "border-purple-500/10 bg-purple-500/[0.02]"
                    : "border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.04] hover:-translate-y-1"
                }`}
              >

                {/* Card Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative">

                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-4">

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 shrink-0 rounded-2xl border flex items-center justify-center text-3xl transition-all duration-300 ${
                        showSecret
                          ? "bg-purple-500/5 border-purple-500/10"
                          : "bg-purple-500/10 border-purple-500/20 group-hover:scale-110 group-hover:rotate-2"
                      }`}
                    >
                      {showSecret
                        ? "🔒"
                        : badge.icon}
                    </div>

                    <div className="flex flex-col items-end gap-2">

                      {/* Locked */}
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                          🔒 LOCKED
                        </span>
                      )}

                      {/* Secret */}
                      {showSecret ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                          🔮 SECRET
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${categoryStyle}`}
                        >
                          {categoryIcon}
                          {badge.category}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* Name */}
                  <h3
                    className={`text-xl font-bold mt-6 transition-colors ${
                      showSecret
                        ? "text-gray-400"
                        : "group-hover:text-purple-400"
                    }`}
                  >
                    {showSecret
                      ? "Secret Badge"
                      : badge.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mt-2 line-clamp-3 min-h-[60px]">
                    {showSecret
                      ? "This achievement is hidden. Unlock it to discover what it is."
                      : badge.description}
                  </p>

                  {/* Requirement */}
                  {!showSecret &&
                    badge.requirement && (
                      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">

                        <p className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">
                          Requirement
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {badge.requirement}
                        </p>

                      </div>
                    )}

                  {/* Progress */}
                  {!showSecret &&
                    target > 0 && (
                      <div className="mt-5">

                        <div className="flex items-center justify-between gap-3 mb-2">

                          <span className="text-xs font-semibold text-gray-400">
                            Progress
                          </span>

                          <span className="text-xs text-purple-400 font-bold">
                            {currentProgress} / {target}
                          </span>

                        </div>

                        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">

                          <div
                            className="h-full rounded-full bg-linear-to-r from-purple-600 to-blue-500 transition-all duration-500"
                            style={{
                              width: `${progressPercent}%`,
                            }}
                          />

                        </div>

                        <p className="text-[10px] text-gray-600 mt-2">
                          {progressPercent}% complete
                        </p>

                      </div>
                    )}

                  {/* Bottom */}
                  <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-white/10">

                    <div className="flex items-center gap-2">

                      <span className="text-sm">
                        🏆
                      </span>

                      <span className="text-xs text-gray-500">
                        {recipientCount}{" "}
                        {recipientCount === 1
                          ? "award"
                          : "awards"}
                      </span>

                    </div>

                    <span className="text-sm font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                      {showSecret
                        ? "Discover →"
                        : "View badge →"}
                    </span>

                  </div>

                </div>

              </Link>
            );
          })}

        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

          <div className="text-5xl">
            🔎
          </div>

          <h3 className="text-xl font-bold mt-4">
            No badges found
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Try changing your search or filters.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
              setSelectedStatus("All");
            }}
            className="mt-5 px-5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 text-sm font-semibold hover:bg-purple-500/20 transition"
          >
            Clear filters
          </button>

        </div>
      )}
    </>
  );
}