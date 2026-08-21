import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export type UserRole =
  | "USER"
  | "SUPPORT"
  | "ADMIN"
  | "MANAGER"
  | "CO-OWNER"
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

export async function createActivityLog({
  action,
  target,
  details,
  userId,
}: {
  action: string;
  target: string;
  details: string;
  userId?: number;
}) {
  let finalUserId = userId;

  if (!finalUserId) {
    const user = await getCurrentUser();
    finalUserId = user.id;
  }

  return prisma.auditLog.create({
    data: {
      action,
      target,
      details,
      userId: finalUserId,
    },
  });
}