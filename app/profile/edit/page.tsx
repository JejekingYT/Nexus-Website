import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProfileForm from "./EditProfileForm";


export default async function EditProfilePage() {

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
            Edit <span className="text-purple-500">Profile</span>
          </h1>


          <EditProfileForm user={user} />


        </div>

      </section>


      <Footer />

    </main>
  );
}