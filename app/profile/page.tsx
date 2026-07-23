import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {

  const session = await getServerSession(authOptions);


  if (!session?.user?.id) {
    redirect("/login");
  }


  const user = await prisma.user.findUnique({
    where: {
      discordId: session.user.id,
    },
  });


  if (!user) {
    redirect("/login");
  }



  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-3xl mx-auto">


          <h1 className="text-5xl font-extrabold">
            Your <span className="text-purple-500">Profile</span>
          </h1>


          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8 text-center">


            {user.image && (

              <img
                src={user.image}
                alt={user.username}
                className="w-32 h-32 rounded-full mx-auto border-4 border-purple-500"
              />

            )}



            <h2 className="text-3xl font-bold mt-6">
              {user.username}
            </h2>



            <p className="text-gray-400 mt-4">
              {user.bio || "No bio set yet."}
            </p>



            <div className="mt-8">

              <a
                href="/profile/edit"
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-bold transition inline-block"
>
                Edit Profile
            </a>

            </div>


          </div>


        </div>

      </section>


      <Footer />

    </main>
  );
}