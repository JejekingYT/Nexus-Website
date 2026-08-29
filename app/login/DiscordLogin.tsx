"use client";

import { signIn } from "next-auth/react";

export default function DiscordLogin() {
  const handleDiscordLogin = () => {
    signIn("discord", {
      callbackUrl: "/",
    });
  };

  return (
    <button
      type="button"
      onClick={handleDiscordLogin}
      className="
        w-full
        bg-purple-600
        hover:bg-purple-500
        px-8
        py-4
        rounded-xl
        font-bold
        transition
        hover:scale-[1.02]
      "
    >
      🟣 Login with Discord
    </button>
  );
}