import Navbar from "@/components/layout/NavbarWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import EmailLogin from "./EmailLogin";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    registered?: string;
    verified?: string;
    error?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);

  // Already logged in
  if (session?.user) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 pb-24 px-6">

        <div className="max-w-xl mx-auto">

          {/* Header */}

          <div className="text-center">

            <h1 className="text-5xl md:text-6xl font-extrabold">

              Login to{" "}

              <span
                className="
                  bg-linear-to-r
                  from-purple-400
                  to-blue-400
                  bg-clip-text
                  text-transparent
                "
              >
                Nexus
              </span>

            </h1>

            <p className="text-gray-400 mt-5 text-lg">
              Sign in to your Nexus account.
            </p>

          </div>


          {/* SUCCESS MESSAGE */}

          {params.registered === "true" && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-green-500/20
                bg-green-500/10
                px-5
                py-4
                text-center
                text-green-400
              "
            >
              <p className="font-bold">
                Account created successfully!
              </p>

              <p className="text-sm mt-1 text-green-400/80">
                Check your email and click the verification
                link before logging in.
              </p>
            </div>

          )}


          {params.verified === "true" && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-green-500/20
                bg-green-500/10
                px-5
                py-4
                text-center
                text-green-400
              "
            >
              <p className="font-bold">
                Email verified successfully!
              </p>

              <p className="text-sm mt-1 text-green-400/80">
                You can now log in to your Nexus account.
              </p>
            </div>

          )}


          {/* VERIFICATION ERRORS */}

          {params.error === "missing-token" && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                px-5
                py-4
                text-center
                text-red-400
              "
            >
              Verification token is missing.
            </div>

          )}


          {params.error === "invalid-token" && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                px-5
                py-4
                text-center
                text-red-400
              "
            >
              This verification link is invalid or has
              already been used.
            </div>

          )}


          {params.error === "expired-token" && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-yellow-500/20
                bg-yellow-500/10
                px-5
                py-4
                text-center
                text-yellow-400
              "
            >
              This verification link has expired.
              Please register again.
            </div>

          )}


          {params.error === "verification-failed" && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                px-5
                py-4
                text-center
                text-red-400
              "
            >
              Something went wrong while verifying your
              email. Please try again.
            </div>

          )}


          {/* LOGIN CARD */}

          <div
            className="
              mt-12
              glass
              rounded-3xl
              border
              border-white/10
              p-8
              md:p-10
            "
          >

            {/* Discord */}

            <a
              href="/api/auth/signin/discord"
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
            </a>


            {/* Divider */}

            <div className="flex items-center gap-4 my-8">

              <div className="h-px bg-white/10 flex-1" />

              <span className="text-gray-500 text-sm">
                OR
              </span>

              <div className="h-px bg-white/10 flex-1" />

            </div>


            {/* Email Login */}

            <EmailLogin />

          </div>


          {/* Register */}

          <p className="text-center text-gray-500 mt-8">

            Don't have a Nexus account?{" "}

            <Link
              href="/register"
              className="
                text-purple-400
                hover:text-purple-300
                font-semibold
                transition
              "
            >
              Create one
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
}