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

// Profile picture
const [image, setImage] = useState(user.image || "");
const [imagePreview, setImagePreview] = useState(user.image || "");
const [uploadingImage, setUploadingImage] = useState(false);

// Social links
const [discord, setDiscord] = useState(user.discord || "");
const [youtube, setYoutube] = useState(user.youtube || "");
const [github, setGithub] = useState(user.github || "");
const [twitter, setTwitter] = useState(user.twitter || "");
const [roblox, setRoblox] = useState(user.roblox || "");

const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

async function handleImageUpload(
event: React.ChangeEvent<HTMLInputElement>
) {
const file = event.target.files?.[0];

if (!file) {
  return;
}

setError("");

// Check file type
if (!file.type.startsWith("image/")) {
  setError("Please select an image file.");
  return;
}

// Check file size - 5 MB maximum
if (file.size > 5 * 1024 * 1024) {
  setError("Profile pictures must be smaller than 5 MB.");
  return;
}

// Local preview
const previewUrl = URL.createObjectURL(file);
setImagePreview(previewUrl);

setUploadingImage(true);

try {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch("/api/profile/upload-image", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.error || "Failed to upload profile picture.");
    setImagePreview(image || user.image || "");
    setUploadingImage(false);
    return;
  }

  setImage(data.image);
  setImagePreview(data.image);

} catch (error) {
  console.error("PROFILE IMAGE UPLOAD ERROR:", error);

  setError(
    "Something went wrong while uploading your profile picture."
  );

  setImagePreview(image || user.image || "");
}

setUploadingImage(false);

}

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

      image,

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

return ( <div className="mt-10 space-y-8">

  {/* PROFILE PICTURE */}

  <div className="space-y-4">

    <div>
      <h2 className="text-xl font-bold">
        Profile Picture
      </h2>

      <p className="text-sm text-gray-400 mt-1">
        Upload an image from your computer to use as your profile picture.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-6">

      {/* Preview */}

      <div className="relative shrink-0">

        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile preview"
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
              flex
              items-center
              justify-center
              text-5xl
              font-bold
              border-4
              border-[#09090B]
              ring-2
              ring-purple-500
            "
          >
            {username.charAt(0).toUpperCase()}
          </div>
        )}

        {uploadingImage && (
          <div
            className="
              absolute
              inset-0
              rounded-full
              bg-black/70
              flex
              items-center
              justify-center
              text-sm
              font-bold
            "
          >
            Uploading...
          </div>
        )}

      </div>

      {/* Upload */}

      <div className="flex-1 w-full">

        <label
          className="
            inline-flex
            items-center
            justify-center
            cursor-pointer
            bg-purple-600
            hover:bg-purple-700
            px-6
            py-3
            rounded-xl
            font-bold
            transition
            disabled:opacity-50
          "
        >
          📷 Choose Profile Picture

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            className="hidden"
          />
        </label>

        <p className="text-xs text-gray-500 mt-3">
          PNG, JPG, WEBP or GIF • Maximum 5 MB
        </p>

      </div>

    </div>

  </div>


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
      placeholder="Discord Server Link"
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
    disabled={saving || uploadingImage}
    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-bold transition"
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>

</div>

);
}
