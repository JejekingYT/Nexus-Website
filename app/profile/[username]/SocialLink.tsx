"use client";

import { useState } from "react";

interface SocialLinkProps {
  name: string;
  value: string;
  icon: string;
}

export default function SocialLink({
  name,
  value,
  icon,
}: SocialLinkProps) {
  const [copied, setCopied] = useState(false);

  async function handleDiscordClick() {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy Discord username:", error);
    }
  }

  if (name === "Discord") {
    return (
      <button
        type="button"
        onClick={handleDiscordClick}
        title={`Copy ${value}`}
        className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-xl
          border
          border-white/10
          bg-white/[0.04]
          hover:bg-white/[0.1]
          hover:border-purple-500/30
          transition
          text-sm
          font-semibold
          cursor-pointer
        "
      >
        <span>{icon}</span>

        <span>
          {copied ? "Copied!" : "Discord"}
        </span>
      </button>
    );
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        border
        border-white/10
        bg-white/[0.04]
        hover:bg-white/[0.1]
        hover:border-purple-500/30
        transition
        text-sm
        font-semibold
      "
    >
      <span>{icon}</span>

      <span>{name}</span>
    </a>
  );
}