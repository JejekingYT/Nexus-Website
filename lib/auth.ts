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

  // ==========================================
  // AUTH DEBUG
  // ==========================================

  console.log("========================================");
  console.log("========== AUTH DEBUG ==========");
  console.log("SESSION EXISTS:", !!session);
  console.log("SESSION USER:", session?.user);
  console.log("SESSION USER ID:", session?.user?.id);
  console.log("SESSION USER ROLE:", session?.user?.role);
  console.log("SESSION DISCORD ID:", session?.user?.discordId);
  console.log("========================================");

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  if (!session?.user?.id) {
    console.error(
      "AUTH: No session user ID found."
    );

    redirect("/api/auth/signin");
  }

  // ==========================================
  // PARSE USER ID
  // ==========================================

  const userId = Number(session.user.id);

  console.log(
    "AUTH DEBUG: Parsed user ID:",
    userId
  );

  if (!Number.isInteger(userId) || userId <= 0) {
    console.error(
      "AUTH: Invalid session user ID:",
      session.user.id
    );

    redirect("/");
  }

  // ==========================================
  // FIND USER
  // ==========================================

  console.log(
    "AUTH DEBUG: Looking up Prisma user:",
    userId
  );

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  // ==========================================
  // USER NOT FOUND
  // ==========================================

  if (!user) {
    console.error(
      "AUTH: User not found in database:",
      userId
    );

    redirect("/");
  }

  // ==========================================
  // DATABASE USER DEBUG
  // ==========================================

  console.log("========== DATABASE USER ==========");
  console.log("DATABASE USER ID:", user.id);
  console.log("DATABASE USERNAME:", user.username);
  console.log("DATABASE ROLE:", user.role);
  console.log("DATABASE DISCORD ID:", user.discordId);
  console.log("DATABASE EMAIL:", user.email);
  console.log("===================================");

  return user;
}

export async function requireRole(
  roles: UserRole[]
) {
  console.log("========================================");
  console.log("========== ROLE CHECK DEBUG ==========");

  console.log(
    "REQUIRED ROLES:",
    roles
  );

  const user = await getCurrentUser();

  console.log(
    "CURRENT USER:",
    user.username
  );

  console.log(
    "CURRENT USER ROLE:",
    user.role
  );

  console.log(
    "ROLE MATCH:",
    roles.includes(user.role as UserRole)
  );

  console.log("========================================");

  // ==========================================
  // CHECK ROLE
  // ==========================================

  if (!roles.includes(user.role as UserRole)) {
    console.error(
      "AUTH: Permission denied.",
      {
        username: user.username,
        currentRole: user.role,
        requiredRoles: roles,
      }
    );

    redirect("/admin/denied");
  }

  console.log(
    "AUTH: Permission granted."
  );

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