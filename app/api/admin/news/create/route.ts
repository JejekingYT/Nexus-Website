import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {

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



    const news = await prisma.news.create({

      data: {

        title: body.title,

        slug: body.slug,

        content: body.content,

        image: body.image || null,

        published: true,


        // Saves the Discord user who created it
        authorId: currentUser.id,

      },

    });



    // Create Audit Log
    await prisma.auditLog.create({

      data: {

        action: "CREATE_NEWS",

        target: news.title,

        details: `Created news article "${news.title}"`,

        userId: currentUser.id,

      },

    });



    return NextResponse.json({

      success: true,

      news,

    });



  } catch (error) {

    console.error(error);


    return NextResponse.json(

      {
        error: "Failed to create news",
      },

      {
        status: 500,
      }

    );

  }

}