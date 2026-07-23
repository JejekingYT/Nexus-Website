import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";


export async function POST(req: Request) {

  const body = await req.json();


  const {
    ticketId,
    userId,
    username,
    role,
  } = body;



  await pusher.trigger(

    `ticket-${ticketId}`,

    "typing",

    {

      userId,

      name:
        role === "SUPPORT" ||
        role === "ADMIN" ||
        role === "OWNER"

          ? "🎫 Nexus Support"

          : username,

    }

  );



  return NextResponse.json({

    success: true,

  });

}