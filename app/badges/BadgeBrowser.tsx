"use client";

import Link from "next/link";
import { useState } from "react";

type Badge = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  category: string;
  isSecret: boolean;
  recipientCount: number;
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

export default function BadgeBrowser({
  badges,
  categories,
}: {
  badges: Badge[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredBadges = badges.filter((badge) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesCategory =
      selectedCategory === "All" ||
      badge.category === selectedCategory;

    const matchesSearch =
      searchTerm === "" ||
      badge.name.toLowerCase().includes(searchTerm) ||
      badge.description.toLowerCase().includes(searchTerm) ||
      badge.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-12 mb-6">
        <div>
          <p className="text-sm text-purple-400 font-semibold">
            Achievement collection
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-1">
            Explore Badges
          </h2>

          <p className="text-gray-500 mt-2">
            Search and browse every achievement available in Nexus.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {filteredBadges.length} of {badges.length}{" "}
          {badges.length === 1 ? "badge" : "badges"}
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-5">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
          🔍
        </span>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search badges..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-5 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-purple-500/10"
        />
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full border text-xs font-semibold transition ${
            selectedCategory === "All"
              ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
              : "border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.07] hover:text-white"
          }`}
        >
          🏆 All

          <span className="ml-1.5 opacity-60">
            {badges.length}
          </span>
        </button>

        {categories.map((category) => {
          const categoryCount = badges.filter(
            (badge) => badge.category === category
          ).length;

          const isSelected =
            selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`px-4 py-2 rounded-full border text-xs font-semibold transition ${
                isSelected
                  ? categoryColors[category] ??
                    "border-purple-500/40 bg-purple-500/15 text-purple-300"
                  : "border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              {categoryIcons[category] ?? "🏅"}{" "}
              {category}

              <span className="ml-1 opacity-60">
                {categoryCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* EMPTY SEARCH */}
      {filteredBadges.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
          <div className="text-5xl">
            🔍
          </div>

          <h3 className="mt-5 text-xl font-bold">
            No badges found
          </h3>

          <p className="mt-2 text-gray-500">
            Try searching for something else or choose
            a different category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="mt-6 rounded-xl border border-purple-500/20 bg-purple-500/10 px-5 py-2.5 text-sm font-semibold text-purple-400 transition hover:bg-purple-500/20"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBadges.map((badge) => {
            const categoryIcon =
              categoryIcons[badge.category] ?? "🏅";

            const categoryStyle =
              categoryColors[badge.category] ??
              "border-white/10 bg-white/[0.04] text-gray-400";

            return (
              <Link
                key={badge.id}
                href={`/badges/${badge.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.04]"
              >
                {/* Card Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-600/5 blur-3xl opacity-0 transition-opacity pointer-events-none group-hover:opacity-100" />

                <div className="relative">
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
                      {badge.icon}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${categoryStyle}`}
                    >
                      {categoryIcon}
                      {badge.category}
                    </span>
                  </div>

                  {/* NAME */}
                  <h3 className="mt-6 text-xl font-bold transition-colors group-hover:text-purple-400">
                    {badge.name}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-2 min-h-[60px] text-sm leading-relaxed text-gray-500 line-clamp-3">
                    {badge.description}
                  </p>

                  {/* BOTTOM */}
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        🏆
                      </span>

                      <span className="text-xs text-gray-500">
                        {badge.recipientCount}{" "}
                        {badge.recipientCount === 1
                          ? "award"
                          : "awards"}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-purple-400 transition-transform group-hover:translate-x-1">
                      View badge →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}