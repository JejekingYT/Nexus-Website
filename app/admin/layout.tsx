import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";


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


      {/* Desktop + Mobile Sidebar */}
      <AdminSidebar role={user.role} />



      {/* Top Navigation */}
      <AdminTopbar />



      {/* Content */}
      <main className="md:ml-72 pt-20">

        {children}

      </main>



    </div>

  );

}