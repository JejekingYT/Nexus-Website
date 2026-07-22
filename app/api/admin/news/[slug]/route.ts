import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params;

  const news = await prisma.news.findUnique({
    where: {
      slug,
    },
  });


  return NextResponse.json({
    news,
  });
}



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



    const oldNews = await prisma.news.findUnique({

      where: {
        slug,
      },

    });



    if (!oldNews) {

      return NextResponse.json(
        {
          error: "News not found",
        },
        {
          status: 404,
        }
      );

    }



    const news = await prisma.news.update({

      where: {
        slug,
      },


      data: {

        title: body.title,

        slug: body.slug,

        content: body.content,

        image: body.image || null,

        published: body.published,

      },

    });



    await prisma.auditLog.create({

      data: {

        action: "EDIT_NEWS",

        target: news.title,

        details: `Edited news article "${oldNews.title}"`,

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
        error: "Update failed",
      },
      {
        status: 500,
      }
    );

  }

}