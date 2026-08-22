"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfileForm({ user }: any) {
  const router = useRouter();

  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");

  // Profile customization
  const [banner, setBanner] = useState(user.banner || "");
  const [theme, setTheme] = useState(user.theme || "default");

  // Social links
  const [discord, setDiscord] = useState(user.discord || "");
  const [youtube, setYoutube] = useState(user.youtube || "");
  const [github, setGithub] = useState(user.github || "");
  const [twitter, setTwitter] = useState(user.twitter || "");
  const [roblox, setRoblox] = useState(user.roblox || "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveProfile() {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          bio,

          banner,
          theme,

          discord,
          youtube,
          github,
          twitter,
          roblox,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile.");
        setSaving(false);
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError("Something went wrong while saving your profile.");
      setSaving(false);
    }
  }

  return (
    <div className="mt-10 space-y-8">

      {/* PROFILE INFORMATION */}

      <div className="space-y-4">

        <h2 className="text-xl font-bold">
          Profile Information
        </h2>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 resize-none outline-none focus:border-purple-500 transition"
        />

      </div>


      {/* PROFILE BANNER */}

      <div className="space-y-4">

        <div>
          <h2 className="text-xl font-bold">
            Profile Banner
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Enter an image URL to use as your profile banner.
          </p>
        </div>

        <input
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          placeholder="https://example.com/banner.png"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
        />

        {banner && (
          <div
            className="w-full h-40 rounded-xl overflow-hidden border border-white/10 bg-cover bg-center"
            style={{
              backgroundImage: `url(${banner})`,
            }}
          />
        )}

      </div>


      {/* SOCIAL LINKS */}

      <div className="space-y-4">

        <div>
          <h2 className="text-xl font-bold">
            Social Links
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Add your social media and gaming profiles.
          </p>
        </div>


        <input
          value={discord}
          onChange={(e) => setDiscord(e.target.value)}
          placeholder="Discord username or profile"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
        />


        <input
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          placeholder="YouTube URL"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
        />


        <input
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          placeholder="GitHub URL"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
        />


        <input
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          placeholder="Twitter / X URL"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
        />


        <input
          value={roblox}
          onChange={(e) => setRoblox(e.target.value)}
          placeholder="Roblox profile URL"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition"
        />

      </div>


      {/* PROFILE THEME */}

      <div className="space-y-4">

        <div>
          <h2 className="text-xl font-bold">
            Profile Theme
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Choose how your profile should look.
          </p>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <button
            type="button"
            onClick={() => setTheme("default")}
            className={`p-4 rounded-xl border transition ${
              theme === "default"
                ? "border-purple-500 bg-purple-500/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="font-bold">
              Default
            </div>

            <div className="text-xs text-gray-400 mt-1">
              Nexus
            </div>
          </button>


          <button
            type="button"
            onClick={() => setTheme("purple")}
            className={`p-4 rounded-xl border transition ${
              theme === "purple"
                ? "border-purple-500 bg-purple-500/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="font-bold">
              Purple
            </div>

            <div className="text-xs text-purple-400 mt-1">
              Nexus Purple
            </div>
          </button>


          <button
            type="button"
            onClick={() => setTheme("blue")}
            className={`p-4 rounded-xl border transition ${
              theme === "blue"
                ? "border-blue-500 bg-blue-500/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="font-bold">
              Blue
            </div>

            <div className="text-xs text-blue-400 mt-1">
              Nexus Blue
            </div>
          </button>


          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`p-4 rounded-xl border transition ${
              theme === "dark"
                ? "border-gray-400 bg-white/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="font-bold">
              Dark
            </div>

            <div className="text-xs text-gray-400 mt-1">
              Minimal
            </div>
          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}


      {/* SAVE */}

      <button
        onClick={saveProfile}
        disabled={saving}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-bold transition"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}