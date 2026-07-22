import Navbar from "@/components/layout/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function LoginPage() {

  const session = await getServerSession(authOptions);


  if (session?.user) {
    redirect("/");
  }


  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 px-6">

        <div className="max-w-xl mx-auto text-center">


          <h1 className="text-5xl font-extrabold">
            Login to <span className="text-purple-500">Nexus</span>
          </h1>


          <p className="text-gray-400 mt-4">
            Sign in with Discord to access your profile.
          </p>


          <a
            href="/api/auth/signin/discord"
            className="inline-block mt-10 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold transition"
          >
            Login with Discord
          </a>


        </div>

      </section>

    </main>
  );
}