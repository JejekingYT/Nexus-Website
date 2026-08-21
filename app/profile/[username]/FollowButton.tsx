"use client";

import { useState } from "react";

export default function FollowButton({
  userId,
  initialFollowing,
}: {
  userId: number;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/users/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setFollowing(data.following);
    } catch (error) {
      console.error("Follow error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleFollow}
      disabled={loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-6
        py-3
        font-bold
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${
          following
            ? "border border-white/10 bg-white/10 text-gray-200 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
            : "bg-linear-to-r from-purple-600 to-blue-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
        }
      `}
    >
      {loading ? (
        <>
          <span className="animate-spin">◌</span>
          Loading...
        </>
      ) : following ? (
        <>
          ✓ Following
        </>
      ) : (
        <>
          + Follow
        </>
      )}
    </button>
  );
}