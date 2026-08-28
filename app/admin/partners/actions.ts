"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";


export async function createPartner(formData: FormData) {

  await requireRole(["OWNER"]);


  await prisma.partner.create({

    data: {

      name:
        formData.get("name") as string,


      slug:
        formData.get("slug") as string,


      ownerName:
        formData.get("ownerName") as string,


      email:
        "staff@nexus.com",


      logo:
        formData.get("logo") as string,


      banner:
        (formData.get("banner") as string) || null,


      description:
        formData.get("description") as string,


      reason:
        formData.get("reason") as string,


      members:
        0,


      discord:
        (formData.get("discord") as string) || null,


      roblox:
        (formData.get("roblox") as string) || null,


      website:
        null,


      discordId:
        null,


      socials:
        null,


      featured:
        formData.get("featured") === "on",


      verified:
        formData.get("verified") === "on",


      // Manual OWNER partners are instantly approved
      status:
        "APPROVED",

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

      status:
        "APPROVED",

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

      status:
        "REJECTED",

    },

  });


  redirect("/admin/partners");

}









export async function updatePartner(
  formData: FormData
) {

  await requireRole(["OWNER"]);


  const id = Number(
    formData.get("id")
  );


  /*
   * Get the existing partner first.
   *
   * Email, members, website and socials are no longer
   * part of the edit form, so we preserve their existing
   * database values instead of trying to read them from
   * the form.
   */

  const existingPartner =
    await prisma.partner.findUnique({

      where: {
        id,
      },

      select: {
        email: true,
        members: true,
        website: true,
        socials: true,
      },

    });


  if (!existingPartner) {

    throw new Error(
      "Partner not found."
    );

  }



  await prisma.partner.update({

    where:{
      id,
    },


    data:{


      name:
        formData.get("name") as string,


      slug:
        formData.get("slug") as string,


      ownerName:
        formData.get("ownerName") as string,


      email:
        existingPartner.email,


      logo:
        formData.get("logo") as string,


      banner:
        (formData.get("banner") as string) || null,


      description:
        formData.get("description") as string,


      reason:
        formData.get("reason") as string,


      members:
        existingPartner.members,


      discord:
        (formData.get("discord") as string) || null,


      website:
        existingPartner.website,


      roblox:
        (formData.get("roblox") as string) || null,


      socials:
        existingPartner.socials,


      tier:
        (formData.get("tier") as string) || "Official",


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