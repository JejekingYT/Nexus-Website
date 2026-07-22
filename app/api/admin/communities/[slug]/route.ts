import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


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



    const oldCommunity = await prisma.community.findUnique({

      where: {
        slug,
      },

    });



    if (!oldCommunity) {

      return NextResponse.json(
        {
          error: "Community not found",
        },
        {
          status: 404,
        }
      );

    }



    const community = await prisma.community.update({

      where: {

        slug,

      },


      data: {

        name: body.name,

        description: body.description,

        discord: body.discord,

        roblox: body.roblox || null,

      },

    });



    await prisma.auditLog.create({

      data: {

        action: "EDIT_COMMUNITY",

        target: community.name,

        details: `Edited community "${oldCommunity.name}"`,

        userId: currentUser.id,

      },

    });



    return NextResponse.json({

      success: true,

      community,

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