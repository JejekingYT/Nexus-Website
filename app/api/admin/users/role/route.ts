import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req: Request) {

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




    if (!currentUser || currentUser.role !== "OWNER") {

      return NextResponse.json(
        {
          error: "Only owners can change roles.",
        },
        {
          status: 403,
        }
      );

    }




    const {
      userId,
      role,
    } = await req.json();




    const allowedRoles = [
      "USER",
      "MODERATOR",
      "ADMIN",
      "OWNER",
    ];




    if (!allowedRoles.includes(role)) {

      return NextResponse.json(
        {
          error: "Invalid role.",
        },
        {
          status: 400,
        }
      );

    }





    const targetUser = await prisma.user.findUnique({

      where: {
        id: userId,
      },

    });





    if (!targetUser) {

      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );

    }





    // Prevent removing your own OWNER role

    if (

      currentUser.id === targetUser.id &&
      role !== "OWNER"

    ) {

      return NextResponse.json(
        {
          error: "You cannot remove your own OWNER role.",
        },
        {
          status: 403,
        }
      );

    }





    // Prevent creating another OWNER

    if (

      role === "OWNER" &&
      targetUser.role !== "OWNER"

    ) {

      return NextResponse.json(
        {
          error: "You cannot assign OWNER role.",
        },
        {
          status: 403,
        }
      );

    }





    await prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        role,
      },

    });






    await prisma.auditLog.create({

      data: {

        action: "ROLE_CHANGE",

        target: targetUser.username,

        details:
          `${targetUser.role} → ${role}`,

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
        error: "Server error.",
      },

      {
        status: 500,
      }

    );

  }

}