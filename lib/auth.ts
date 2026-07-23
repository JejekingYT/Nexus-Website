import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export type UserRole =
  | "USER"
  | "SUPPORT"
  | "ADMIN"
  | "OWNER";



export async function getCurrentUser() {

  const session = await getServerSession(authOptions);


  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }


  const user = await prisma.user.findUnique({

    where: {
      discordId: session.user.id,
    },

  });



  if (!user) {
    redirect("/");
  }


  return user;

}




export async function requireRole(
  roles: UserRole[]
) {

  const user = await getCurrentUser();



  if (!roles.includes(user.role as UserRole)) {

    redirect("/admin/denied");

  }



  return user;

}