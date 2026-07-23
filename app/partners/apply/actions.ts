"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export async function createPartnerApplication(
  formData: FormData
) {

  await prisma.partner.create({

    data: {

      name:
        formData.get("name") as string,


      slug:
        formData.get("slug") as string,


      ownerName:
        formData.get("ownerName") as string,


      email:
        formData.get("email") as string,


      logo:
        formData.get("logo") as string,


      banner:
        formData.get("banner") as string || null,


      description:
        formData.get("description") as string,


      reason:
        formData.get("reason") as string,


      members:
        Number(formData.get("members") || 0),


      discord:
        formData.get("discord") as string || null,


      website:
        formData.get("website") as string || null,


      roblox:
        formData.get("roblox") as string || null,


      socials:
        formData.get("socials") as string || null,


      status:
        "PENDING",

    },

  });


  redirect("/partners/apply/success");

}