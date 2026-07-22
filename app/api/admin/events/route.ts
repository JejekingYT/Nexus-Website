import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(
  request: Request
) {

  try {

    const session = await getServerSession(authOptions);


    if (!session?.user?.id) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }



    const currentUser = await prisma.user.findUnique({

      where: {
        discordId: session.user.id,
      },

    });



    if (
      !currentUser ||
      (
        currentUser.role !== "OWNER" &&
        currentUser.role !== "ADMIN"
      )
    ) {

      return NextResponse.json(
        {
          error: "No permission",
        },
        {
          status: 403,
        }
      );

    }



    const body = await request.json();



    const event = await prisma.event.create({

      data: {

        title: body.title,

        slug: body.slug,

        description: body.description,

        image: body.image || null,

        date: body.date,

        time: body.time,

        discord: body.discord || null,

        published: body.published,

      },

    });



    // Create Audit Log
    await prisma.auditLog.create({

      data: {

        action: "CREATE_EVENT",

        target: event.title,

        details: `Created event "${event.title}"`,

        userId: currentUser.id,

      },

    });



    return NextResponse.json({

      success: true,

      event,

    });



  } catch (error) {

    console.error(error);


    return NextResponse.json(
      {
        error: "Failed to create event",
      },
      {
        status: 500,
      }
    );

  }

}