import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


// GET EVENT

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params;


  const event = await prisma.event.findUnique({
    where: {
      slug,
    },
  });


  if (!event) {

    return NextResponse.json(
      {
        error: "Event not found",
      },
      {
        status: 404,
      }
    );

  }


  return NextResponse.json({
    event,
  });

}



// UPDATE EVENT

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

  try {

    const { slug } = await params;


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



    const oldEvent = await prisma.event.findUnique({

      where: {
        slug,
      },

    });



    if (!oldEvent) {

      return NextResponse.json(
        {
          error: "Event not found",
        },
        {
          status: 404,
        }
      );

    }



    const event = await prisma.event.update({

      where: {
        slug,
      },


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



    // Audit Log
    await prisma.auditLog.create({

      data: {

        action: "EDIT_EVENT",

        target: oldEvent.title,

        details: `Edited event "${oldEvent.title}"`,

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
        error: "Update failed",
      },
      {
        status: 500,
      }
    );

  }

}




// DELETE EVENT

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

  try {

    const { slug } = await params;


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



    const event = await prisma.event.findUnique({

      where: {
        slug,
      },

    });



    if (!event) {

      return NextResponse.json(
        {
          error: "Event not found",
        },
        {
          status: 404,
        }
      );

    }



    await prisma.event.delete({

      where: {
        slug,
      },

    });



    // Audit Log
    await prisma.auditLog.create({

      data: {

        action: "DELETE_EVENT",

        target: event.title,

        details: `Deleted event "${event.title}"`,

        userId: currentUser.id,

      },

    });



    return NextResponse.json({
      success: true,
    });



  } catch (error) {

    console.error(error);


    return NextResponse.json(
      {
        error: "Delete failed",
      },
      {
        status: 500,
      }
    );

  }

}