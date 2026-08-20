"use client";

import { useState } from "react";

export default function EditCommunityForm({
  community,
}: {
  community: any;
}) {
  const [name, setName] = useState(community.name ?? "");
  const [description, setDescription] = useState(
    community.description ?? ""
  );
  const [discord, setDiscord] = useState(community.discord ?? "");
  const [roblox, setRoblox] = useState(community.roblox ?? "");

  const [saving, setSaving] = useState(false);

  async function saveChanges() {
    setSaving(true);

    try {
      const res = await fetch(
        `/api/admin/communities/${community.slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            discord,
            roblox,
          }),
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Failed updating community"
        );
      }

      alert("Community updated!");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-5xl font-extrabold">
        Edit{" "}
        <span className="text-purple-500">
          {community.name}
        </span>
      </h1>

      <p className="text-gray-400 mt-4">
        Update the information for this community.
      </p>

      <div className="mt-10 space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-purple-500
              transition
            "
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
              w-full
              min-h-40
              bg-white/5
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-purple-500
              transition
              resize-y
            "
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Discord Invite
          </label>

          <input
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-purple-500
              transition
            "
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Roblox Group
          </label>

          <input
            value={roblox}
            onChange={(e) => setRoblox(e.target.value)}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-purple-500
              transition
            "
          />
        </div>

        <button
          disabled={saving}
          onClick={saveChanges}
          className="
            bg-purple-600
            hover:bg-purple-700
            px-8
            py-4
            rounded-xl
            font-bold
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
          "
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}