"use client";

import { signIn } from "next-auth/react";

export default function DiscordLogin() {
  return (
    <button
      type="button"
      onClick={() =>
        signIn("discord", {
          callbackUrl: "/",
        })
      }
      className="
        block
        w-full
        bg-purple-600
        hover:bg-purple-500
        px-8
        py-4
        rounded-xl
        font-bold
        text-center
        transition
        hover:scale-[1.02]
      "
    >
      🟣 Login with Discord
    </button>
  );
}