"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";


export async function createPartner(formData: FormData) {

  await requireRole(["OWNER"]);


  await prisma.partner.create({

    data: {

      name: formData.get("name") as string,

      slug: formData.get("slug") as string,

      logo: formData.get("logo") as string,

      banner:
        formData.get("banner") as string || null,


      description:
        formData.get("description") as string,


      discord:
        formData.get("discord") as string || null,


      roblox:
        formData.get("roblox") as string || null,


      website:
        formData.get("website") as string || null,


      featured:
        formData.get("featured") === "on",


      verified:
        formData.get("verified") === "on",


      // Manual OWNER created partners are instantly approved
      status: "APPROVED",

    },

  });


  redirect("/admin/partners");

}





export async function approvePartner(
  formData: FormData
) {

  await requireRole(["OWNER"]);


  const id = Number(
    formData.get("id")
  );


  await prisma.partner.update({

    where:{
      id,
    },

    data:{

      status:"APPROVED",

    },

  });


  redirect("/admin/partners");

}





export async function rejectPartner(
  formData: FormData
) {

  await requireRole(["OWNER"]);


  const id = Number(
    formData.get("id")
  );


  await prisma.partner.update({

    where:{
      id,
    },

    data:{

      status:"REJECTED",

    },

  });


  redirect("/admin/partners");

}




export async function updatePartner(formData: FormData) {

  await requireRole(["OWNER"]);


  const id = Number(
    formData.get("id")
  );


  await prisma.partner.update({

    where: {
      id,
    },


    data: {

      name:
        formData.get("name") as string,


      slug:
        formData.get("slug") as string,


      logo:
        formData.get("logo") as string,


      banner:
        (formData.get("banner") as string) || null,


      description:
        formData.get("description") as string,


      discord:
        (formData.get("discord") as string) || null,


      website:
        (formData.get("website") as string) || null,


      roblox:
        (formData.get("roblox") as string) || null,


      tier:
        formData.get("tier") as string,


      featured:
        formData.get("featured") === "on",


      verified:
        formData.get("verified") === "on",


      status:
        formData.get("status") as any,

    },

  });


  redirect("/admin/partners");

}





export async function deletePartner(
  id:number
) {

  await requireRole(["OWNER"]);


  await prisma.partner.delete({

    where:{
      id,
    },

  });


  redirect("/admin/partners");

}