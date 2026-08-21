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
        currentUser.role !== "MANAGER" &&
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



    const staff =
  Array.isArray(body.staff)
    ? body.staff
        .filter(
          (member: {
            name?: string;
            role?: string;
            image?: string;
          }) =>
            member &&
            typeof member.name === "string" &&
            member.name.trim()
        )
        .map(
          (member: {
            name?: string;
            role?: string;
            image?: string;
          }) => ({
            name: member.name!.trim(),

            role:
              typeof member.role === "string"
                ? member.role.trim()
                : "",

            image:
              typeof member.image === "string"
                ? member.image.trim()
                : "",
          })
        )
    : [];



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

        staff,

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