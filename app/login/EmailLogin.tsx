"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        if (
          result.error.includes("EMAIL_NOT_VERIFIED") ||
          result.error.includes("CredentialsSignin")
        ) {
          setError(
            "Please verify your email address before logging in."
          );
        } else {
          setError("Invalid email or password.");
        }

        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setLoading(false);

      setError(
        "Something went wrong while logging in."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        text-left
        bg-white/5
        border
        border-white/10
        rounded-2xl
        p-6
      "
    >
      <h2 className="text-2xl font-bold text-center">
        Login with Email
      </h2>

      <input
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        placeholder="Email"
        autoComplete="email"
        className="
          w-full
          mt-6
          bg-black/30
          border
          border-white/10
          rounded-xl
          px-5
          py-4
          outline-none
          focus:border-purple-500
        "
      />

      <input
        name="password"
        type="password"
        required
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        placeholder="Password"
        autoComplete="current-password"
        className="
          w-full
          mt-4
          bg-black/30
          border
          border-white/10
          rounded-xl
          px-5
          py-4
          outline-none
          focus:border-purple-500
        "
      />

      {error && (
        <div
          className="
            mt-4
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-400
            text-center
          "
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          mt-6
          bg-purple-600
          hover:bg-purple-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          px-8
          py-4
          rounded-xl
          font-bold
          transition
        "
      >
        {loading
          ? "Logging in..."
          : "Login with Email"}
      </button>
    </form>
  );
}