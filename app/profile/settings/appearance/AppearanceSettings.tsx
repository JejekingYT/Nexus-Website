"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export default function AppearanceSettings() {
const [theme, setTheme] = useState<Theme>("dark");
const [saved, setSaved] = useState(false);
const [saving, setSaving] = useState(false);

const [showBanner, setShowBanner] = useState(true);
const [showBadges, setShowBadges] = useState(true);
const [showSocialLinks, setShowSocialLinks] = useState(true);

const applyTheme = (selectedTheme: Theme) => {
const root = document.documentElement;

root.classList.remove("dark", "light");

if (selectedTheme === "dark") {
  root.classList.add("dark");
}

if (selectedTheme === "light") {
  root.classList.add("light");
}

if (selectedTheme === "system") {
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  root.classList.add(prefersDark ? "dark" : "light");
}

};

useEffect(() => {
const savedTheme = localStorage.getItem("nexus-theme");

let selectedTheme: Theme = "dark";

if (
  savedTheme === "dark" ||
  savedTheme === "light" ||
  savedTheme === "system"
) {
  selectedTheme = savedTheme;
}

setTheme(selectedTheme);
applyTheme(selectedTheme);

if (selectedTheme === "system") {
  const mediaQuery = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  const handleChange = () => {
    applyTheme("system");
  };

  mediaQuery.addEventListener(
    "change",
    handleChange
  );

  return () => {
    mediaQuery.removeEventListener(
      "change",
      handleChange
    );
  };
}

}, []);

useEffect(() => {
const loadAppearanceSettings = async () => {
  try {
    const response = await fetch("/api/profile/update");

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    if (data.user) {
      setShowBanner(
        typeof data.user.showBanner === "boolean"
          ? data.user.showBanner
          : true
      );

      setShowBadges(
        typeof data.user.showBadges === "boolean"
          ? data.user.showBadges
          : true
      );

      setShowSocialLinks(
        typeof data.user.showSocialLinks === "boolean"
          ? data.user.showSocialLinks
          : true
      );
    }
  } catch (error) {
    console.error(
      "APPEARANCE_LOAD_ERROR:",
      error
    );
  }
};

loadAppearanceSettings();

}, []);

const selectTheme = (selectedTheme: Theme) => {
setTheme(selectedTheme);
setSaved(false);

applyTheme(selectedTheme);

localStorage.setItem("nexus-theme", selectedTheme);

};

const saveChanges = async () => {
try {
setSaving(true);
setSaved(false);

  const response = await fetch("/api/profile/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      theme,
      showBanner,
      showBadges,
      showSocialLinks,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to save settings."
    );
  }

  localStorage.setItem(
    "nexus-theme",
    theme
  );

  setSaved(true);
} catch (error) {
  console.error(
    "APPEARANCE_SAVE_ERROR:",
    error
  );

  alert(
    "Failed to save appearance settings."
  );
} finally {
  setSaving(false);
}

};

const themes = [
{
id: "dark" as Theme,
name: "Dark",
description: "A dark interface that's easy on the eyes.",
icon: "🌙",
},
{
id: "light" as Theme,
name: "Light",
description: "A bright and clean interface.",
icon: "☀️",
},
{
id: "system" as Theme,
name: "System",
description: "Automatically match your device theme.",
icon: "💻",
},
];

const accentColors = [
{
id: "purple",
name: "Purple",
className: "bg-purple-500",
},
{
id: "blue",
name: "Blue",
className: "bg-blue-500",
},
{
id: "red",
name: "Red",
className: "bg-red-500",
},
{
id: "green",
name: "Green",
className: "bg-green-500",
},
];

return (
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
        🎨
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold mt-6">
        Appearance
      </h1>

      <p className="text-gray-400 text-lg mt-4">
        Customize how Nexus looks and feels for you.
      </p>

    </div>

    {/* Theme */}

    <div className="glass rounded-3xl border border-white/10 p-6 md:p-8">

      <div className="mb-7">

        <h2 className="text-2xl font-bold">
          Theme
        </h2>

        <p className="text-gray-400 mt-1">
          Choose the appearance of the Nexus interface.
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-4">

        {themes.map((item) => {
          const selected = theme === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectTheme(item.id)}
              className={`
                group
                relative
                text-left
                rounded-2xl
                border
                p-5
                cursor-pointer
                transition
                ${
                  selected
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5"
                }
              `}
            >

              <div className="text-3xl mb-4">
                {item.icon}
              </div>

              <h3 className="font-bold text-lg">
                {item.name}
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                {item.description}
              </p>

              <div
                className={`
                  absolute
                  top-5
                  right-5
                  w-5
                  h-5
                  rounded-full
                  border
                  transition
                  ${
                    selected
                      ? "border-purple-400 bg-purple-500"
                      : "border-white/20 group-hover:border-purple-400"
                  }
                `}
              >
                {selected && (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </div>

            </button>
          );
        })}

      </div>

    </div>

    {/* Accent Color */}

    <div
      className="
        glass
        rounded-3xl
        border
        border-white/10
        p-6
        md:p-8
        mt-6
      "
    >

      <div className="mb-7">

        <h2 className="text-2xl font-bold">
          Accent Color
        </h2>

        <p className="text-gray-400 mt-1">
          Accent colors will be customizable soon.
        </p>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {accentColors.map((color) => (

          <div
            key={color.id}
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-5
              opacity-60
              cursor-not-allowed
            "
          >

            <div className="flex items-center gap-4">

              <div
                className={`
                  w-10
                  h-10
                  rounded-xl
                  ${color.className}
                  shadow-lg
                `}
              />

              <span className="font-semibold">
                {color.name}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* Profile Appearance */}

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
          Profile Appearance
        </h2>

        <p className="text-gray-400 mt-1">
          Choose which profile elements are visible on your public profile.
        </p>

      </div>

      {/* Banner */}

      <ToggleRow
        title="Show Profile Banner"
        description="Display your profile banner at the top of your profile."
        enabled={showBanner}
        onClick={() => {
          setShowBanner(!showBanner);
          setSaved(false);
        }}
        border
      />

      {/* Badges */}

      <ToggleRow
        title="Show Badges"
        description="Display your earned badges on your public profile."
        enabled={showBadges}
        onClick={() => {
          setShowBadges(!showBadges);
          setSaved(false);
        }}
        border
      />

      {/* Social Links */}

      <ToggleRow
        title="Show Social Links"
        description="Display your connected social accounts on your profile."
        enabled={showSocialLinks}
        onClick={() => {
          setShowSocialLinks(!showSocialLinks);
          setSaved(false);
        }}
      />

    </div>

    {/* Save */}

    <div className="flex items-center justify-end gap-4 mt-6">

      {saved && (
        <span className="text-green-400 font-semibold">
          ✓ Changes saved
        </span>
      )}

      <button
        type="button"
        onClick={saveChanges}
        disabled={saving}
        className="
          px-7
          py-3
          rounded-xl
          bg-purple-600
          hover:bg-purple-500
          disabled:opacity-50
          disabled:cursor-not-allowed
          font-bold
          transition
          shadow-lg
          shadow-purple-500/10
        "
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>

    {/* Info */}

    <div
      className="
        mt-8
        rounded-2xl
        border
        border-purple-500/20
        bg-purple-500/5
        p-5
      "
    >

      <div className="flex gap-3">

        <span className="text-xl">
          ✨
        </span>

        <p className="text-sm text-gray-400">
          Theme and profile appearance preferences are saved to your Nexus account.
          Accent colors will be available in a future update.
        </p>

      </div>

    </div>

  </div>
</section>

);
}

function ToggleRow({
title,
description,
enabled,
onClick,
border = false,
}: {
title: string;
description: string;
enabled: boolean;
onClick: () => void;
border?: boolean;
}) {
return (
<div
className={`
        p-6
        md:p-7
        flex
        items-center
        justify-between
        gap-6
        ${border ? "border-b border-white/10" : ""}
      `}
>

  <div>

    <h3 className="font-bold text-lg">
      {title}
    </h3>

    <p className="text-sm text-gray-400 mt-1">
      {description}
    </p>

  </div>

  <button
    type="button"
    onClick={onClick}
    aria-label={`Toggle ${title}`}
    className={`
      w-14
      h-8
      rounded-full
      relative
      shrink-0
      cursor-pointer
      transition
      ${
        enabled
          ? "bg-purple-600"
          : "bg-white/10"
      }
    `}
  >

    <div
      className={`
        absolute
        top-1
        w-6
        h-6
        rounded-full
        bg-white
        shadow
        transition
        ${
          enabled
            ? "left-7"
            : "left-1"
        }
      `}
    />

  </button>

</div>

);
}