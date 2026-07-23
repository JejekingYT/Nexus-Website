"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";


export async function createHallOfFame(
  formData: FormData
) {

  await requireRole(["OWNER"]);


  await prisma.hallOfFame.create({

    data: {

      name:
        formData.get("name") as string,

      title:
        formData.get("title") as string,

      category:
        formData.get("category") as string,

      description:
        formData.get("description") as string,

      image:
        (formData.get("image") as string) || null,

      year:
        (formData.get("year") as string) || null,

    },

  });


  redirect("/admin/hall-of-fame");

}





export async function deleteHallOfFame(
  id:number
){

  await requireRole(["OWNER"]);


  await prisma.hallOfFame.delete({

    where:{
      id,
    },

  });


  redirect("/admin/hall-of-fame");

}