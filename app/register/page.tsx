import Navbar from "@/components/layout/NavbarWrapper";
import { registerUser } from "./actions";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 pb-24 px-6">

        <div className="max-w-xl mx-auto">

          <div className="text-center">

            <h1 className="text-5xl font-extrabold">
              Create your{" "}
              <span className="text-purple-500">
                Nexus
              </span>{" "}
              account
            </h1>

            <p className="text-gray-400 mt-4">
              Create an account to access your Nexus profile.
            </p>

          </div>

          <form
            action={registerUser}
            className="
              mt-10
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-8
              space-y-5
            "
          >

            {/* Username */}

            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>

              <input
                name="username"
                type="text"
                required
                minLength={3}
                placeholder="Your Nexus username"
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

            </div>

            {/* Email */}

            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>

              <input
                name="email"
                type="email"
                required
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

            </div>

            {/* Password */}

            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
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

            </div>

            {/* Confirm Password */}

            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>

              <input
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                placeholder="Repeat your password"
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

            </div>

            {/* Create Account */}

            <button
              type="submit"
              className="
                w-full
                bg-purple-600
                hover:bg-purple-700
                px-8
                py-4
                rounded-xl
                font-bold
                transition
              "
            >
              Create Account
            </button>

          </form>

          {/* Login */}

          <p className="text-center text-gray-400 mt-6">

            Already have an account?{" "}

            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Login
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
}