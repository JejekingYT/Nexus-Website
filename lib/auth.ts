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

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    console.error(
      "AUTH: Invalid session user ID:",
      session.user.id
    );

    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    console.error(
      "AUTH: User not found:",
      userId
    );

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