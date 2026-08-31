"use client";

import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
const searchParams = useSearchParams();
const token = searchParams.get("token");

const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);
const [loading, setLoading] = useState(false);

async function handleSubmit(
event: React.FormEvent<HTMLFormElement>
) {
event.preventDefault();

setError("");

if (!token) {
  setError("Invalid or missing reset link.");
  return;
}

if (password.length < 8) {
  setError(
    "Password must be at least 8 characters."
  );
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

setLoading(true);

try {
  const response = await fetch(
    "/api/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.error ||
        "Something went wrong."
    );
    return;
  }

  setSuccess(true);
  setPassword("");
  setConfirmPassword("");

} catch (error) {
  console.error(
    "RESET PASSWORD ERROR:",
    error
  );

  setError(
    "Something went wrong while resetting your password."
  );
} finally {
  setLoading(false);
}

}

return ( <main className="min-h-screen bg-[#09090B] text-white">

  <Navbar />

  <section className="pt-32 pb-24 px-6">

    <div className="max-w-xl mx-auto">

      {/* Header */}

      <div className="text-center">

        <h1 className="text-5xl font-extrabold">

          Reset your{" "}

          <span className="text-purple-500">
            password
          </span>

        </h1>

        <p className="text-gray-400 mt-4">
          Create a new password for your Nexus account.
        </p>

      </div>


      {/* Card */}

      <div
        className="
          mt-10
          bg-white/5
          border
          border-white/10
          rounded-2xl
          p-8
        "
      >

        {success ? (

          /* SUCCESS */

          <div className="text-center">

            <div className="text-5xl">
              ✅
            </div>

            <h2 className="text-2xl font-bold mt-5">
              Password reset successfully
            </h2>

            <p className="text-gray-400 mt-3">
              Your password has been changed.
              You can now log in with your new password.
            </p>

            <Link
              href="/login"
              className="
                inline-block
                mt-6
                bg-purple-600
                hover:bg-purple-700
                px-8
                py-3
                rounded-xl
                font-bold
                transition
              "
            >
              Go to Login
            </Link>

          </div>

        ) : !token ? (

          /* INVALID TOKEN */

          <div className="text-center">

            <div className="text-5xl">
              ❌
            </div>

            <h2 className="text-2xl font-bold mt-5">
              Invalid reset link
            </h2>

            <p className="text-gray-400 mt-3">
              This password reset link is missing
              or invalid.
            </p>

            <Link
              href="/forgot-password"
              className="
                inline-block
                mt-6
                text-purple-400
                hover:text-purple-300
              "
            >
              Request a new link
            </Link>

          </div>

        ) : (

          /* RESET FORM */

          <form onSubmit={handleSubmit}>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-300
                mb-2
              "
            >
              New Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="At least 8 characters"
              autoComplete="new-password"
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


            <label
              className="
                block
                text-sm
                font-medium
                text-gray-300
                mt-5
                mb-2
              "
            >
              Confirm New Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Repeat your new password"
              autoComplete="new-password"
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


            {error && (
              <div
                className="
                  mt-5
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
                ? "Resetting..."
                : "Reset Password"}
            </button>

          </form>

        )}

      </div>


      {/* Back to login */}

      {!success && token && (
        <p
          className="
            text-center
            text-gray-500
            mt-6
          "
        >

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

function ResetPasswordLoading() {
return ( <main className="min-h-screen bg-[#09090B] text-white">

  <Navbar />

  <section className="pt-32 pb-24 px-6">

    <div className="max-w-xl mx-auto">

      <div className="text-center">

        <h1 className="text-5xl font-extrabold">
          Reset your{" "}
          <span className="text-purple-500">
            password
          </span>
        </h1>

        <p className="text-gray-400 mt-4">
          Loading reset link...
        </p>

      </div>

    </div>

  </section>

</main>

);
}

export default function ResetPasswordPage() {
return (
<Suspense fallback={<ResetPasswordLoading />}> <ResetPasswordForm /> </Suspense>
);
}
