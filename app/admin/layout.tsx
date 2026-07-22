import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);


  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }



  const user = await prisma.user.findUnique({

    where: {
      discordId: session.user.id,
    },

  });



  if (
    !user ||
    ![
      "OWNER",
      "ADMIN",
      "MODERATOR",
    ].includes(user.role)
  ) {

    redirect("/");

  }



  return (

    <div className="min-h-screen bg-[#09090B] text-white">


      <AdminSidebar role={user.role} />



      <main className="ml-72">

        {children}

      </main>



    </div>

  );

}