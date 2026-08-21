import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/auth";


export async function POST(request: Request) {

  const session = await getServerSession(authOptions);


  if (!session?.user?.id) {
    return NextResponse.json(
      {error:"Unauthorized"},
      {status:401}
    );
  }



  const body = await request.json();



  const user = await prisma.user.findUnique({
  where: {
    discordId: session.user.id,
  },
});

if (!user) {
  return NextResponse.json(
    { error: "User not found." },
    { status: 404 }
  );
}

await prisma.user.update({
  where: {
    discordId: session.user.id,
  },

  data: {
    username: body.username,
    bio: body.bio,
  },
});

await createActivityLog({
  action: "UPDATE_PROFILE",
  target: user.username,
  details: `Updated profile information`,
  userId: user.id,
});



  return NextResponse.json({
    success:true,
  });

}