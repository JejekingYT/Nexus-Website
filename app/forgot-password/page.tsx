"use client";

import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 pb-24 px-6">

        <div className="max-w-xl mx-auto">

          <div className="text-center">

            <h1 className="text-5xl font-extrabold">
              Forgot your{" "}
              <span className="text-purple-500">
                password?
              </span>
            </h1>

            <p className="text-gray-400 mt-4">
              Enter your email and we'll send you a
              password reset link.
            </p>

          </div>

          <div className="
            mt-10
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-8
          ">

            {sent ? (

              <div className="text-center">

                <div className="text-5xl">
                  📧
                </div>

                <h2 className="text-2xl font-bold mt-5">
                  Check your email
                </h2>

                <p className="text-gray-400 mt-3">
                  If an account exists with that email,
                  we've sent a password reset link.
                </p>

                <Link
                  href="/login"
                  className="
                    inline-block
                    mt-6
                    text-purple-400
                    hover:text-purple-300
                  "
                >
                  ← Back to Login
                </Link>

              </div>

            ) : (

              <form onSubmit={handleSubmit}>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-300
                  mb-2
                ">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="
                    w-full
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

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    mt-5
                    bg-purple-600
                    hover:bg-purple-700
                    disabled:opacity-50
                    px-8
                    py-4
                    rounded-xl
                    font-bold
                    transition
                  "
                >
                  {loading
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>

              </form>

            )}

          </div>

          {!sent && (
            <p className="
              text-center
              text-gray-500
              mt-6
            ">
              Remember your password?{" "}

              <Link
                href="/login"
                className="
                  text-purple-400
                  hover:text-purple-300
                "
              >
                Login
              </Link>
            </p>
          )}

        </div>

      </section>

    </main>
  );
}