import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
try {
const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  return NextResponse.json(
    { error: "Unauthorized." },
    { status: 401 }
  );
}

const ownerId = Number(session.user.id);

if (!Number.isInteger(ownerId) || ownerId <= 0) {
  return NextResponse.json(
    { error: "Invalid user." },
    { status: 400 }
  );
}

// Make absolutely sure the requester is an OWNER.
const owner = await prisma.user.findUnique({
  where: {
    id: ownerId,
  },
  select: {
    id: true,
    role: true,
  },
});

if (!owner || owner.role !== "OWNER") {
  return NextResponse.json(
    { error: "Only the owner can delete users." },
    { status: 403 }
  );
}

const body = await request.json();
const targetUserId = Number(body.userId);

if (
  !Number.isInteger(targetUserId) ||
  targetUserId <= 0
) {
  return NextResponse.json(
    { error: "Invalid target user." },
    { status: 400 }
  );
}

// Prevent the OWNER from deleting themselves.
if (targetUserId === owner.id) {
  return NextResponse.json(
    { error: "You cannot delete your own account." },
    { status: 400 }
  );
}

const targetUser = await prisma.user.findUnique({
  where: {
    id: targetUserId,
  },
  select: {
    id: true,
    username: true,
    role: true,
  },
});

if (!targetUser) {
  return NextResponse.json(
    { error: "User not found." },
    { status: 404 }
  );
}

// Prevent deleting another OWNER.
if (targetUser.role === "OWNER") {
  return NextResponse.json(
    { error: "An OWNER cannot be deleted." },
    { status: 403 }
  );
}

// Delete the user.
// Related records configured with onDelete: Cascade
// will be removed automatically.
await prisma.user.delete({
  where: {
    id: targetUserId,
  },
});

return NextResponse.json({
  success: true,
  deletedUser: targetUser.username,
});

} catch (error) {
console.error("DELETE USER ERROR:", error);

return NextResponse.json(
  {
    error: "Something went wrong while deleting the user.",
  },
  {
    status: 500,
  }
);

}
}
