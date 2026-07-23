import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {

  let settings = await prisma.siteSettings.findUnique({
    where: {
      id: 1,
    },
  });


  if (!settings) {

    settings = await prisma.siteSettings.create({
      data: {
        id: 1,
        siteName: "Nexus",
        description: "Nexus Community",
      },
    });

  }


  return settings;

}