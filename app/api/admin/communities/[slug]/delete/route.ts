import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


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



    const community = await prisma.community.findUnique({

      where: {
        slug,
      },

    });



    if (!community) {

      return NextResponse.json(
        {
          error: "Community not found",
        },
        {
          status: 404,
        }
      );

    }



    await prisma.community.delete({

      where: {
        slug,
      },

    });



    await prisma.auditLog.create({

      data: {

        action: "DELETE_COMMUNITY",

        target: community.name,

        details: `Deleted community "${community.name}"`,

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
        error: "Failed to delete community",
      },

      {
        status: 500,
      }

    );

  }

}