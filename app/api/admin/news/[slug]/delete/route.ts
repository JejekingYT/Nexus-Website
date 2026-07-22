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



    // Find news before deleting it
    const news = await prisma.news.findUnique({

      where: {
        slug,
      },

    });



    if (!news) {

      return NextResponse.json(
        {
          error: "News not found",
        },
        {
          status: 404,
        }
      );

    }



    // Delete news
    await prisma.news.delete({

      where: {
        slug,
      },

    });



    // Create audit log
    await prisma.auditLog.create({

      data: {

        action: "DELETE_NEWS",

        target: news.title,

        details: `Deleted news article "${news.title}"`,

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
        error: "Failed to delete news",
      },
      {
        status: 500,
      }
    );

  }

}