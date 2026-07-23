import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";

export async function POST(req: Request) {

  const body = await req.json();

  const { ticketId, username, role } = body;


  await pusher.trigger(
    `ticket-${ticketId}`,
    "typing",
    {
      username,
      role,
    }
  );


  return NextResponse.json({
    success: true,
  });

}