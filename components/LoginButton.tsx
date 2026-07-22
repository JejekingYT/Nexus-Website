"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("discord")}
      className="bg-purple-600 px-6 py-3 rounded-xl font-bold"
    >
      Login with Discord
    </button>
  );
}