import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST() {
try {
const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  return NextResponse.json(
    {
      success: false,
      error: "Not authenticated.",
    },
    {
      status: 401,
    }
  );
}

const userId = Number(session.user.id);

if (!Number.isInteger(userId) || userId <= 0) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid user ID.",
    },
    {
      status: 400,
    }
  );
}

await prisma.user.update({
  where: {
    id: userId,
  },
  data: {
    lastSeen: new Date(),
  },
});

return NextResponse.json({
  success: true,
});

} catch (error) {
console.error(
"Failed to update user activity:",
error
);

return NextResponse.json(
  {
    success: false,
    error: "Failed to update activity.",
  },
  {
    status: 500,
  }
);

}
}
