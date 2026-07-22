import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {

  const session = await getServerSession(authOptions);


  if (!session?.user?.id) {
    return NextResponse.json(
      {error:"Unauthorized"},
      {status:401}
    );
  }



  const body = await request.json();



  await prisma.user.update({

    where:{
      discordId: session.user.id,
    },

    data:{
      username: body.username,
      bio: body.bio,
    },

  });



  return NextResponse.json({
    success:true,
  });

}